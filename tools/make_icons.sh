#!/bin/bash

input=$1
if [ -z "$1" ]; then
	echo "Missing argument"
	exit
fi

for res in 192 168 144 96 72 48 32; do
	echo "Generating ${res}x${res}"
	convert -scale ${res}x${res} $input ../images/icon${res}.png
done
