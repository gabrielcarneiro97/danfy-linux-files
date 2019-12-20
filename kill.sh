#!/bin/bash

echo
echo "---KILL---"
echo

echo "Before Kill:"
tmux ls

tmux kill-session -t serve
echo

echo "Now:"
tmux ls
