#!/bin/sh
tmux new-session -d -s serve ~/https-init.sh

echo "\n---SERVE---\n"
tmux ls
echo
