#!/bin/sh
#!/bin/bash

SN="reactwork"

tmux has-session -t $SN &>/dev/null

if [ $? != 0 ] 
then
    tmux new -s $SN -n react -d
    tmux select-window -t $SN:0
    tmux send-keys "yarn start" C-m 
    tmux split-window -h -p 25 # split vertically by 50%
    tmux select-pane -t 1
    tmux send-keys "yarn android" C-m
    tmux select-pane -t 0
fi

tmux -2 attach -t $SN 