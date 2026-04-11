Perform a comprehensive security review of the codebase. Adapted from github/awesome-copilot security-review skill.

## Scope

$ARGUMENTS

If no path specified, scan the full `src/` directory.

## Step 1 - Dependency Audit

Check `package.json` and `package-lock.json` for:
- Known vulnerable packages (check with `npm audit --json` if available)
- Deprecated or unmaintained dependencies
- Suspiciously old pinned versions

## Step 2 - Secrets & Exposure Scan

Scan ALL files (including config, CI/CD, data files) for:
- Hardcoded API keys, tokens, passwords, private keys
- `.env` files or secrets in committed files
- Secrets in comments or debug output
- Cloud credentials, database connection strings
- Look for patterns: `AKIA`, `ghp_`, `sk_live_`, `xox[baprs]-`, `-----BEGIN.*PRIVATE KEY-----`

## Step 3 - Vulnerability Deep Scan

Reason about the code like a security researcher, not just pattern matching:

**Injection Flaws:**
- XSS: `dangerouslySetInnerHTML`, unescaped user input in JSX, innerHTML usage
- URL injection: user-controlled `href`, `src`, or `window.location` values
- This is a client-side app so SQL injection is N/A

**Data Handling:**
- localStorage security: are sensitive values stored? Can they be tampered with?
- URL sharing (`encodeBuild`/`decodeBuild`): can crafted URLs cause XSS or data corruption?
- Are there any `eval()`, `Function()`, or dynamic code execution patterns?

**Client-Side Security:**
- Prototype pollution in object merging/spreading
- ReDoS in any regex patterns (especially in DPS calc or data processing)
- Open redirects from URL parameters
- Missing CSP headers or security headers in Next.js config

**Dependencies:**
- Are any deps pulling in known vulnerable transitive dependencies?
- Any deps with excessive permissions or network access?

## Step 4 - Cross-File Data Flow

Trace data from user input through the app:
- Calculator inputs -> DPS engine -> display
- URL decode -> build state -> calculator
- localStorage read -> state hydration
- Identify any paths where user-controlled data reaches dangerous sinks

## Step 5 - Self-Verification

For each finding:
1. Re-read the code - is it actually exploitable?
2. Does the framework already handle this? (React auto-escapes JSX, Next.js has built-in protections)
3. Assign severity: CRITICAL / HIGH / MEDIUM / LOW / INFO
4. Discard false positives

## Step 6 - Report

Output a findings table:

| # | Severity | Category | File:Line | Description | Fix |
|---|----------|----------|-----------|-------------|-----|

Group by category. Include confidence rating (High/Medium/Low) per finding.

For CRITICAL and HIGH findings, show the vulnerable code and a concrete patch.

If the codebase is clean, say: "No vulnerabilities found" with summary of what was scanned.
