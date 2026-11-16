@echo off
echo Construction du bundle Grey Corner...
npx esbuild js/main.js --bundle --outfile=js/bundle.js --format=iife
echo Termine avec succes !
pause
