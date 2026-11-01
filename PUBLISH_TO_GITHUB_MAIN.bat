@echo off
setlocal EnableExtensions
for %%I in ("%~dp0.") do set "SOURCE=%%~fI"
set "DEFAULT_DEST=%USERPROFILE%\Desktop\KUNTAU-TERRAPULSE"
set "REMOTE=https://github.com/DavoniumTech/KUNTAU-TERRAPULSE.git"
set "DEST="
echo KUNTAU TERRAPULSE v0.8.2 - safe GitHub publisher
echo Source release: "%SOURCE%"
echo Default local repository: "%DEFAULT_DEST%"
set /p "DEST=Enter your existing local clone path (no quotes), or press Enter for the default: "
if not defined DEST set "DEST=%DEFAULT_DEST%"
if not exist "%SOURCE%\app\index.html" goto :badsource
where git >nul 2>&1
if errorlevel 1 goto :nogit
if not exist "%DEST%\.git" (
  if exist "%DEST%" goto :notrepo
  echo Cloning the project repository...
  git clone "%REMOTE%" "%DEST%"
  if errorlevel 1 goto :fail
)
for /f "delims=" %%R in ('git -C "%DEST%" remote get-url origin 2^>nul') do set "ORIGIN=%%R"
if /I not "%ORIGIN%"=="%REMOTE%" (
  echo ERROR: This local clone does not point to the expected project repository.
  echo Current origin: %ORIGIN%
  goto :fail
)
for /f "delims=" %%A in ('git -C "%DEST%" status --porcelain') do set "DIRTY=1"
if defined DIRTY (
  echo ERROR: Your local repository has uncommitted changes. Back them up or commit them first.
  goto :fail
)
echo Fetching the latest main branch...
git -C "%DEST%" fetch origin
if errorlevel 1 goto :fail
git -C "%DEST%" show-ref --verify --quiet refs/heads/main
if errorlevel 1 (
  git -C "%DEST%" switch -c main --track origin/main
) else (
  git -C "%DEST%" switch main
)
if errorlevel 1 goto :fail
git -C "%DEST%" pull --rebase origin main
if errorlevel 1 goto :fail
echo.
echo Copying release files into the repository. Existing .git history is preserved.
robocopy "%SOURCE%" "%DEST%" /E /XD .git .venv __pycache__ /XF *.tif *.tiff *.TIF *.TIFF *.h5 *.hdf5 *.H5 *.HDF5 .netrc _netrc .dodsrc .env .env.* *.pem *.key *.p12 *.pfx
set "ROBO=%ERRORLEVEL%"
if %ROBO% GEQ 8 (
  echo ERROR: Robocopy failed with code %ROBO%.
  goto :fail
)
echo.
echo Review the pending changes:
git -C "%DEST%" status --short
git -C "%DEST%" add -A
if errorlevel 1 goto :fail
git -C "%DEST%" diff --cached --name-only | findstr /I /E /C:".tif" /C:".tiff" /C:".h5" /C:".hdf5" /C:".netrc" /C:"_netrc" /C:".dodsrc" /C:".env" /C:".pem" /C:".key" /C:".p12" /C:".pfx"
if not errorlevel 1 (
  echo ERROR: A protected raw-data or credential-looking file is staged. Stop and inspect the repository.
  goto :fail
)
git -C "%DEST%" diff --cached --quiet
if not errorlevel 1 (
  echo No new changes to commit. GitHub already has this release content.
  pause
  exit /b 0
)
echo.
echo Staged files:
git -C "%DEST%" diff --cached --name-only
echo.
choice /C YN /M "Commit v0.8.2 and push these files to origin/main"
if errorlevel 2 (
  echo Cancelled before commit. Copied files remain local only.
  pause
  exit /b 0
)
git -C "%DEST%" commit -m "TERRAPULSE v0.8.2: mobile studio and PWA launch repair"
if errorlevel 1 goto :fail
git -C "%DEST%" push origin main
if errorlevel 1 goto :fail
echo.
echo SUCCESS: Git reports the commit was pushed to origin/main.
echo Cloudflare Pages deploys automatically only if its GitHub integration is connected to this repository and main branch.
pause
exit /b 0
:badsource
echo ERROR: app\index.html was not found next to this script. Extract the full ZIP before running it.
goto :fail
:nogit
echo ERROR: Git for Windows was not found. Reopen CMD after installing Git.
goto :fail
:notrepo
echo ERROR: The destination exists but is not a Git repository: %DEST%
echo Enter the folder that contains the .git directory.
goto :fail
:fail
echo.
echo The publish operation did not complete. No success is claimed.
pause
exit /b 1
