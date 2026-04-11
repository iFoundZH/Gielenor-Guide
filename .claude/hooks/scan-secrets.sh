#!/bin/bash
# Secrets Scanner Hook (adapted from github/awesome-copilot)
# Scans file content for accidentally leaked secrets before Claude writes them.
# Runs as a PreToolUse hook on Write/Edit operations.
# Exit 0 = allow, Exit 2 = block (reason on stderr)

set -euo pipefail

INPUT=$(cat)

# Extract file path and content using grep (no jq dependency)
FILE_PATH=$(printf '%s' "$INPUT" | grep -oP '"file_path"\s*:\s*"\K[^"]*' | head -1 || echo "")
CONTENT=$(printf '%s' "$INPUT" | grep -oP '"content"\s*:\s*"\K[^"]*' | head -1 || echo "")
# For Edit tool, check new_string instead
if [[ -z "$CONTENT" ]]; then
  CONTENT=$(printf '%s' "$INPUT" | grep -oP '"new_string"\s*:\s*"\K[^"]*' | head -1 || echo "")
fi

# Skip non-source files
case "$FILE_PATH" in
  *.lock|package-lock.json|yarn.lock|*.sum|*.png|*.jpg|*.ico|*.woff*|*.ttf)
    exit 0 ;;
esac

# If we can't extract content, allow it through
[[ -z "$CONTENT" ]] && exit 0

# Secret detection patterns: "NAME|REGEX"
PATTERNS=(
  "AWS_ACCESS_KEY|AKIA[0-9A-Z]{16}"
  "AWS_SECRET_KEY|aws_secret_access_key[[:space:]]*[:=][[:space:]]*[A-Za-z0-9/+=]{40}"
  "GCP_API_KEY|AIza[0-9A-Za-z_-]{35}"
  "GITHUB_PAT|ghp_[0-9A-Za-z]{36}"
  "GITHUB_OAUTH|gho_[0-9A-Za-z]{36}"
  "GITHUB_APP_TOKEN|ghs_[0-9A-Za-z]{36}"
  "GITHUB_FINE_GRAINED|github_pat_[0-9A-Za-z_]{82}"
  "PRIVATE_KEY|-----BEGIN (RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----"
  "CONNECTION_STRING|(mongodb(\+srv)?|postgres(ql)?|mysql|redis|amqp|mssql)://[^[:space:]]{10,}"
  "SLACK_TOKEN|xox[baprs]-[0-9]{10,}-[0-9A-Za-z-]+"
  "STRIPE_SECRET|sk_live_[0-9A-Za-z]{24,}"
  "NPM_TOKEN|npm_[0-9A-Za-z]{36}"
  "SENDGRID_KEY|SG\.[0-9A-Za-z_-]{22}\.[0-9A-Za-z_-]{43}"
)

FOUND=0
REPORT=""

for entry in "${PATTERNS[@]}"; do
  IFS='|' read -r pattern_name regex <<< "$entry"

  if printf '%s\n' "$CONTENT" | grep -qE "$regex" 2>/dev/null; then
    match=$(printf '%s\n' "$CONTENT" | grep -oE "$regex" 2>/dev/null | head -1)

    # Skip placeholders/examples
    if printf '%s\n' "$match" | grep -qiE '(example|placeholder|your[_-]|xxx|changeme|TODO|FIXME|replace|dummy|fake|test[_-]?key|sample)'; then
      continue
    fi

    FOUND=$((FOUND + 1))

    # Redact for display
    if [[ ${#match} -le 12 ]]; then
      redacted="[REDACTED]"
    else
      redacted="${match:0:4}...${match: -4}"
    fi
    REPORT+="  - $pattern_name: $redacted"$'\n'
  fi
done

if [[ $FOUND -gt 0 ]]; then
  echo "Potential secrets detected in file write to $FILE_PATH:" >&2
  echo "$REPORT" >&2
  echo "Remove secrets before writing. Use environment variables instead." >&2
  exit 2
fi

exit 0
