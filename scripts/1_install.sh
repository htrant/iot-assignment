#!/bin/bash
set -e

# Clean
rm -rf .serverless
rm -rf .webpack
rm -rf node_modules

# Install dependency
npm install
