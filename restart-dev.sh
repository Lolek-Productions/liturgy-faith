#!/bin/bash
while true; do
  echo "Starting Next.js dev server..."
  rm -rf .next
  npm run dev &
  DEV_PID=$!
  
  echo "Dev server running (PID: $DEV_PID). Press 'r' + Enter to restart, 'q' + Enter to quit."
  
  while true; do
    read -r input
    case $input in
      r|R)
        echo "Restarting..."
        kill $DEV_PID 2>/dev/null
        pkill -f "next dev" 2>/dev/null || true  # Add this line
        sleep 2
        rm -rf .next
        break
        ;;
      q|Q)
        echo "Stopping..."
        kill $DEV_PID 2>/dev/null
        exit 0
        ;;
    esac
  done
done