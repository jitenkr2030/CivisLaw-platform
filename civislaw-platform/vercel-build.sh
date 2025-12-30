#!/bin/bash
# Vercel build script to ensure tmp directory exists

# Create tmp directory if it doesn't exist
mkdir -p tmp

# Run the actual build
npm run build
