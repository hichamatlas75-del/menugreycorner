@echo off
echo ========================================================
echo  Compilation et mise a jour de l'APK Grey Corner Serveurs
echo ========================================================
call gradlew.bat --no-daemon assembleDebug
if errorlevel 1 (
    echo [ERREUR] La compilation Gradle a echoue.
    pause
    exit /b 1
)
if not exist "release" mkdir "release"
copy /y "app\build\outputs\apk\debug\app-debug.apk" "release\GreyCorner-Serveurs-v3.0.apk" >nul
echo.
echo [SUCCES] L'APK v3.0 a ete genere avec succes dans :
echo release\GreyCorner-Serveurs-v3.0.apk
echo.
pause
