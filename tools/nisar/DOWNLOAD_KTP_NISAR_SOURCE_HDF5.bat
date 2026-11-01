@echo off
setlocal
cd /d "%~dp0"
where py >nul 2>&1
if errorlevel 1 (
  echo Python Launcher (py) was not found. Install Python 3 from python.org, then reopen CMD.
  pause
  exit /b 1
)
echo This downloads two original NISAR HDF5 source products from ASF.
echo Approximate combined download size: 3.16 GiB.
echo Files will be saved outside the Git repository in Documents\KTP_NISAR_SOURCE_DATA.
echo The script will prompt for Earthdata Login; the password entry is hidden.
echo Do not save credentials in the project folder or GitHub.
echo.
choice /C YN /M "Continue to install asf_search and start the download"
if errorlevel 2 exit /b 0
py -m pip install --user --upgrade asf_search
if errorlevel 1 (
  echo Could not install asf_search. Check internet connectivity and Python pip.
  pause
  exit /b 1
)
set "OUT=%USERPROFILE%\Documents\KTP_NISAR_SOURCE_DATA"
py "%~dp0GET_KTP_NISAR_METADATA.py" --download --out "%OUT%"
if errorlevel 1 (
  echo Download utility reported an error. Read the messages above; no credential is stored by this script.
  pause
  exit /b 1
)
echo.
echo Check the output folder: "%OUT%"
pause
