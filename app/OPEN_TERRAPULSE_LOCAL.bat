@echo off
setlocal
cd /d "%~dp0"
title KUNTAU TERRAPULSE · KTP v0.7.0 - Local application
echo.
echo KUNTAU TERRAPULSE KTP v0.7.0
echo ============================
echo Starting the application with the packaged NISAR preview evidence.
echo Original GeoTIFF files are optional for browsing and comparison previews.
echo To recalculate from original rasters, use CONNECT_KURA_DATA_AND_START.bat.
echo.
call "%~dp0START_TERRAPULSE.bat"
endlocal
