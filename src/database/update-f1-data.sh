#!/bin/bash

# Script to update the F1 database with latest standings from RapidAPI

# Change to the root directory of the project
cd "$(dirname "$0")"
cd ../..

# Check if RAPIDAPI_KEY is provided as an argument
if [ -z "$1" ]; then
  echo "No RapidAPI key provided."
  echo "Usage: ./update-f1-data.sh YOUR_RAPIDAPI_KEY"
  echo "Continuing with the key in the script (if any)..."
  node src/database/fetchAndUpdateF1Data.js
else
  echo "Using provided RapidAPI key..."
  RAPIDAPI_KEY="$1" node src/database/fetchAndUpdateF1Data.js
fi

# Make the script executable
chmod +x "$0"