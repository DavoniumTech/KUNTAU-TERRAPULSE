@echo off
setlocal
cd /d "%~dp0"
title KUNTAU TERRAPULSE · KTP v0.5.0 - Local demonstration
echo.
echo KUNTAU TERRAPULSE KTP - LOCAL DEMONSTRATION
echo ============================================
echo This will copy the original Kura GeoTIFFs and start the local app.
echo Your satellite files remain on this computer.
echo.
call "%~dp0CONNECT_KURA_DATA_AND_START.bat"
endlocal
