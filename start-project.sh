#!/bin/bash
SESH="my_tmux_session"

# Check if session exists
tmux has-session -t $SESH 2>/dev/null

if [ $? != 0 ]; then
    # Create new session with first window
    tmux new-session -d -s $SESH -n "work"
    
    # Send commands to first pane (top-left)
    tmux send-keys -t $SESH:work "cd ~/liturgy-faith" C-m
    tmux send-keys -t $SESH:work "claude" C-m
    
    # Split window horizontally first (creates bottom pane)
    tmux split-window -v -t $SESH:work
    
    # Send commands to bottom-left pane
    tmux send-keys -t $SESH:work.1 "cd ~/liturgy-faith" C-m
    tmux send-keys -t $SESH:work.1 "claude" C-m
    
    # Go back to top pane and split it vertically (creates top-right)
    tmux select-pane -t $SESH:work.0
    tmux split-window -h -t $SESH:work.0
    
    # Send commands to top-right pane
    tmux send-keys -t $SESH:work.1 "cd ~/liturgy-faith" C-m
    tmux send-keys -t $SESH:work.1 "npm run dev" C-m
    
    # Go to bottom-left and split it vertically (creates bottom-right)
    tmux select-pane -t $SESH:work.2
    tmux split-window -h -t $SESH:work.2
    
    # Send commands to bottom-right pane - just terminal
    tmux send-keys -t $SESH:work.3 "cd ~/liturgy-faith" C-m
    
    # Focus back on the top-left pane
    tmux select-pane -t $SESH:work.0
fi

# Attach to the session
tmux attach-session -t $SESH