@echo off
setlocal
cd /d "%~dp0"
title KUNTAU TERRAPULSE v0.5.0
echo.
echo Starting KUNTAU TERRAPULSE...
where python >nul 2>nul
if %errorlevel%==0 goto :usepython
where py >nul 2>nul
if %errorlevel%==0 goto :usepy
echo Python 3 was not found. Install Python 3, then run this file again.
echo Download: https://www.python.org/downloads/windows/
pause
exit /b 1
:usepython
python run_server.py
goto :end
:usepy
py -3 run_server.py
:end
endlocal
