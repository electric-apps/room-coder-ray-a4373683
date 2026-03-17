#!/bin/bash
# Forward AskUserQuestion hook events to Electric Agent studio.
# Blocks until the user answers in the web UI.
BODY="$(cat)"
RESPONSE=$(curl -s -X POST "http://host.docker.internal:4400/api/sessions/a4373683-1c3c-4a43-90b0-7e535f223fe8/hook-event" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer 7699b7644ff32b3425c358b8c1e4e4573c38ecad65db2a3c82356b29e177174c" \
  -d "${BODY}" \
  --max-time 360 \
  --connect-timeout 5 \
  2>/dev/null)
if echo "${RESPONSE}" | grep -q '"hookSpecificOutput"'; then
  echo "${RESPONSE}"
fi
exit 0