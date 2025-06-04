#!/bin/bash
cd /home/kavia/workspace/code-generation/travelsmart-planner-21-87491b19/travelsmart_planner
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

