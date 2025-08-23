#!/usr/bin/env bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

mkdir -p $SCRIPT_DIR/../local

$SCRIPT_DIR/../bin/rayjay.js > $SCRIPT_DIR/../local/image.ppm
