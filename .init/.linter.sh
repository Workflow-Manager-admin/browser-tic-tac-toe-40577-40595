#!/bin/bash
cd /home/kavia/workspace/code-generation/browser-tic-tac-toe-40577-40595/frontend_react
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

