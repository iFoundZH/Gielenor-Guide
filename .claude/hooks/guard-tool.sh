#!/bin/bash
# Tool Guardian Hook (adapted from github/awesome-copilot)
# Blocks dangerous Bash operations before Claude executes them.
# Catches patterns that slip past the deny list in settings.json.
# Exit 0 = allow, Exit 2 = block (reason on stderr)

set -euo pipefail

INPUT=$(cat)

# Extract tool name and command using grep (no jq dependency)
TOOL_NAME=$(printf '%s' "$INPUT" | grep -oP '"tool_name"\s*:\s*"\K[^"]*' | head -1 || echo "")
COMMAND=$(printf '%s' "$INPUT" | grep -oP '"command"\s*:\s*"\K[^"]*' | head -1 || echo "")

# Only check Bash commands
[[ "$TOOL_NAME" != "Bash" ]] && exit 0
[[ -z "$COMMAND" ]] && exit 0

# Threat patterns using ::: delimiter (avoids conflict with regex | alternation)
# Format: "CATEGORY:::REGEX:::SUGGESTION"
PATTERNS=(
  "destructive:::rm -rf /:::Use targeted rm on specific paths"
  "destructive:::rm -rf ~:::Never rm home directory"
  "destructive:::rm -rf \.\.:::Never remove parent directories"
  "destructive:::(rm|unlink).*\.git[^i]:::Use git commands to manage repo state"
  "git-danger:::git push --force.*(main|master):::Use --force-with-lease or push to feature branch"
  "git-danger:::git push -f .*(main|master):::Use --force-with-lease or push to feature branch"
  "git-danger:::git reset --hard:::Use git stash to preserve changes"
  "git-danger:::git clean -fd:::Use git clean -n (dry run) first"
  "permissions:::chmod 777:::Use chmod 755 for dirs or 644 for files"
  "permissions:::chmod -R 777:::Use specific permissions and limit scope"
  "network:::curl.*\|.*bash:::Download script first, review, then execute"
  "network:::wget.*\|.*sh:::Download script first, review, then execute"
  "publish:::npm publish[^-]:::Use npm publish --dry-run first"
  "data-loss:::DROP TABLE:::Create a migration with rollback support"
  "data-loss:::DROP DATABASE:::Create a backup first"
  "data-loss:::TRUNCATE :::Use DELETE FROM with a WHERE clause"
)

for entry in "${PATTERNS[@]}"; do
  category="${entry%%:::*}"
  rest="${entry#*:::}"
  regex="${rest%%:::*}"
  suggestion="${rest#*:::}"

  if printf '%s\n' "$COMMAND" | grep -qiE "$regex" 2>/dev/null; then
    echo "Dangerous operation blocked [$category]: $suggestion" >&2
    exit 2
  fi
done

exit 0
