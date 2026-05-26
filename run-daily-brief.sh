#!/bin/bash

# Load env vars
source .env
export SMTP_HOST SMTP_PORT SMTP_USER SMTP_PASS

# Today's date
DATE=$(date +%Y-%m-%d)
OUTPUT_FILE="/workspaces/daily-brief-hermes/briefings/$DATE.md"

echo "Generating newsletter for $DATE..."

# Step 1: Ask Hermes to generate the newsletter
hermes run "Read the skill at /workspaces/daily-brief-hermes/skills/daily_brief.md and generate today's newsletter. Save the output to $OUTPUT_FILE"

# Step 2: Send it
echo "Sending email..."
npx tsx /workspaces/daily-brief-hermes/send-newsletter.ts "$OUTPUT_FILE"

echo "Done!"
