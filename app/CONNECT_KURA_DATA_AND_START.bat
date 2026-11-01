@echo off
setlocal
cd /d "%~dp0"
title KUNTAU TERRAPULSE v0.8.0 - Connect Kura data
set "SOURCE=C:\KUNTAU_TERRAPULSE\data"
if not exist "%SOURCE%\Kura_Before_2026-10-08.tif" (
  echo Default folder was not found: %SOURCE%
  echo Enter the folder containing both original Float32 GeoTIFF files.
  set /p "SOURCE=Source folder path: "
)
if not exist "%SOURCE%\Kura_Before_2026-10-08.tif" (
  echo ERROR: October 8 original not found in: %SOURCE%
  pause
  exit /b 1
)
if not exist "%SOURCE%\Kura_After_2026-10-20.tif" (
  echo ERROR: Cannot find the October 20 original file:
  echo %SOURCE%\Kura_After_2026-10-20.tif
  pause
  exit /b 1
)
if not exist "%~dp0data" mkdir "%~dp0data"
echo.
echo Copying the two ORIGINAL NISAR GeoTIFFs into this app's data folder...
copy /Y "%SOURCE%\Kura_Before_2026-10-08.tif" "%~dp0data\Kura_Before_2026-10-08.tif" >nul
if errorlevel 1 goto copyerror
copy /Y "%SOURCE%\Kura_After_2026-10-20.tif" "%~dp0data\Kura_After_2026-10-20.tif" >nul
if errorlevel 1 goto copyerror
echo.
echo SUCCESS: Both original GeoTIFFs copied into:
echo %~dp0data
echo.
echo IMPORTANT: Keep the original source files backed up in a private research folder outside the public GitHub repository.
echo In the app, open Compare and click "Load copied Kura files". If that request fails, use the two Choose file buttons and select the originals from this folder.
echo.
echo Starting the local application server now...
call "%~dp0START_TERRAPULSE.bat"
goto end
:copyerror
echo ERROR: Windows could not copy the TIFF files. Check folder permissions and free space.
pause
:end
endlocal
