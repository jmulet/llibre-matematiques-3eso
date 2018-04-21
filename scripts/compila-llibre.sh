#!/bin/bash

pdflatex -draftmode  main.tex
node ./generate-student-keys.js
pdflatex -draftmode -interaction=batchmode main.tex
pdflatex main.tex
#mv main.pdf llibre-3ESO-color.pdf
