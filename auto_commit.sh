#!/bin/bash
echo "Starting auto-commit script. Will commit every 20 minutes..."
while true; do
  if [[ -n $(git status --porcelain) ]]; then
    git add .
    git commit -m "chore: auto-commit backup $(date +'%Y-%m-%d %H:%M:%S')"
    echo "Committed changes at $(date)"
  else
    echo "No changes to commit at $(date)"
  fi
  sleep 1200
done
