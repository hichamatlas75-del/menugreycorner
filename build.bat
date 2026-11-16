@echo off
echo ============================================
echo   Construction du bundle Grey Corner
echo ============================================
npx esbuild js/main.js --bundle --outfile=js/bundle.js --format=iife
if %errorlevel% neq 0 (
    echo.
    echo [ERREUR] La compilation du bundle a echoue.
    pause
    exit /b %errorlevel%
)
echo.
echo [SUCCES] Bundle js/bundle.js genere avec succes !
pause

