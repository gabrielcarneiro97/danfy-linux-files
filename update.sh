#!/bin/sh

./kill.sh

./git-check.sh
./yarn-check.sh
./ts-compile.sh

./serve.sh
