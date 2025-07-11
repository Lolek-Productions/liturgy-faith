#!/bin/bash

# watch-and-restart.sh
# A script that runs a command and restarts it if it fails or if specific error patterns are detected
#
# HOW TO USE:
# 1. Make the script executable:
#    chmod +x scripts/watch-and-restart.sh
#
# 2. Basic usage:
#    ./scripts/watch-and-restart.sh -- npm run dev
#
# 3. With custom error patterns:
#    ./scripts/watch-and-restart.sh -p "TypeError:" -p "ReferenceError:" -- npm run dev
#
# 4. With custom restart delay (in seconds):
#    ./scripts/watch-and-restart.sh -d 5 -- npm run dev
#
# 5. With maximum number of restarts (0 for unlimited):
#    ./scripts/watch-and-restart.sh -m 20 -- npm run dev
#
# 6. For more help:
#    ./scripts/watch-and-restart.sh --help

# Default values
COMMAND=""
ERROR_PATTERNS=("Error:" "error" "failed" "Failed" "ELIFECYCLE" "ENOENT" "Cannot find module")
RESTART_DELAY=2
MAX_RESTARTS=10
RESTART_COUNT=0

# Function to display usage information
function show_usage {
  echo "Usage: $0 [options] -- command"
  echo "Options:"
  echo "  -p, --pattern PATTERN   Add an error pattern to watch for (can be used multiple times)"
  echo "  -d, --delay SECONDS     Set delay between restarts (default: $RESTART_DELAY seconds)"
  echo "  -m, --max-restarts NUM  Set maximum number of restarts (default: $MAX_RESTARTS, 0 for unlimited)"
  echo "  -h, --help              Show this help message"
  echo ""
  echo "Example: $0 -p \"TypeError:\" -p \"ReferenceError:\" -d 5 -- npm run dev"
  exit 1
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    -p|--pattern)
      if [[ -z "$2" || "$2" == -* ]]; then
        echo "Error: Pattern option requires an argument"
        show_usage
      fi
      ERROR_PATTERNS+=("$2")
      shift 2
      ;;
    -d|--delay)
      if [[ -z "$2" || "$2" == -* || ! "$2" =~ ^[0-9]+$ ]]; then
        echo "Error: Delay option requires a numeric argument"
        show_usage
      fi
      RESTART_DELAY=$2
      shift 2
      ;;
    -m|--max-restarts)
      if [[ -z "$2" || "$2" == -* || ! "$2" =~ ^[0-9]+$ ]]; then
        echo "Error: Max restarts option requires a numeric argument"
        show_usage
      fi
      MAX_RESTARTS=$2
      shift 2
      ;;
    -h|--help)
      show_usage
      ;;
    --)
      shift
      COMMAND="$*"
      break
      ;;
    *)
      if [[ -z "$COMMAND" ]]; then
        COMMAND="$*"
        break
      else
        echo "Error: Unknown option $1"
        show_usage
      fi
      ;;
  esac
done

# Check if a command was provided
if [[ -z "$COMMAND" ]]; then
  echo "Error: No command specified"
  show_usage
fi

echo "Starting command: $COMMAND"
echo "Watching for error patterns: ${ERROR_PATTERNS[*]}"
echo "Will restart after $RESTART_DELAY seconds if errors are detected"
echo "Maximum restarts: $MAX_RESTARTS (0 means unlimited)"
echo "Press Ctrl+C to exit"
echo "----------------------------------------"

# Function to check if output contains any error patterns
function contains_error {
  local output="$1"
  for pattern in "${ERROR_PATTERNS[@]}"; do
    if echo "$output" | grep -q "$pattern"; then
      return 0  # Found an error
    fi
  done
  return 1  # No error found
}

# Main loop
while true; do
  # Run the command and capture both stdout and stderr
  OUTPUT=$(eval "$COMMAND" 2>&1)
  EXIT_CODE=$?
  
  # Display the output
  echo "$OUTPUT"
  
  # Check if the command failed or if the output contains error patterns
  if [[ $EXIT_CODE -ne 0 ]] || contains_error "$OUTPUT"; then
    RESTART_COUNT=$((RESTART_COUNT + 1))
    
    # Check if we've reached the maximum number of restarts
    if [[ $MAX_RESTARTS -gt 0 && $RESTART_COUNT -gt $MAX_RESTARTS ]]; then
      echo "----------------------------------------"
      echo "Reached maximum number of restarts ($MAX_RESTARTS). Exiting."
      exit 1
    fi
    
    echo "----------------------------------------"
    echo "Error detected (restart $RESTART_COUNT of $MAX_RESTARTS). Restarting in $RESTART_DELAY seconds..."
    sleep $RESTART_DELAY
    echo "----------------------------------------"
    echo "Restarting command: $COMMAND"
  else
    # Command completed successfully
    echo "----------------------------------------"
    echo "Command completed successfully. Exiting."
    exit 0
  fi
done
