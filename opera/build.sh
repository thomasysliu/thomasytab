#!/bin/bash
mkdir -p build/nctutab/
rm -rf build/nctutab/*
cd nctutab
zip -r ../build/nctutab/nctutab.oex *
#mv nctutab.zip build/nctutab/nctutab.oex


