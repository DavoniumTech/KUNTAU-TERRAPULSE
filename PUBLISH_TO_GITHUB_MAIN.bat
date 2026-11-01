@echo off
setlocal EnableExtensions
set "SOURCE=%~dp0"
set "DEFAULT_DEST=%USERPROFILE%\Desktop\KUNTAU-TERRAPULSE"
set "REMOTE=https://github.com/DavoniumTech/KUNTAU-TERRAPULSE.git"
echo Default local repository path: "%DEFAULT_DEST%"
set /p "DEST=Enter your existing local clone path (no quotes), or press Enter for the default: "
if not defined DEST set "DEST=%DEFAULT_DEST%"

echo KUNTAU TERRAPULSE v0.8.1 - safe GitHub publish helper
echo.
if not exist "%SOURCE%app\index.html" (
  echo ERROR: app\index.html not found. Run this from the extracted release folder.
  pause
  exit /b 1
)
where git >nul 2>&1
if errorlevel 1 (
  echo ERROR: Git was not found. Install Git for Windows and reopen CMD.
  pause
  exit /b 1
)
if not exist "%DEST%\.git" (
  if exist "%DEST%" (
    echo ERROR: %DEST% exists but is not a Git repository.
    echo Rename that folder or choose another destination before continuing.
    pause
    exit /b 1
  )
  echo Cloning the repository to Desktop...
  git clone "%REMOTE%" "%DEST%"
  if errorlevel 1 goto :fail
)

echo Fetching latest repository state...
git -C "%DEST%" fetch origin
if errorlevel 1 goto :fail

git -C "%DEST%" show-ref --verify --quiet refs/remotes/origin/main
if errorlevel 1 (
  git -C "%DEST%" show-ref --verify --quiet refs/heads/main
  if errorlevel 1 (
    echo Creating local main branch because origin/main is not present.
    git -C "%DEST%" switch --orphan main
  ) else (
    git -C "%DEST%" switch main
  )
) else (
  git -C "%DEST%" switch main
  if errorlevel 1 goto :fail
  git -C "%DEST%" pull --rebase origin main
  if errorlevel 1 goto :fail
)

 echo Copying release files into the repository (preserving .git)...
robocopy "%SOURCE%" "%DEST%" /E /XD .git .venv __pycache__ /XF *.tif *.tiff *.TIF *.TIFF *.h5 *.hdf5 *.H5 *.HDF5 .netrc _netrc .dodsrc .env .env.* *.env *.env.* *.pem *.key *.p12 *.pfx
set "ROBO=%ERRORLEVEL%"
if %ROBO% GEQ 8 (
  echo ERROR: Robocopy failed with code %ROBO%.
  goto :fail
)

echo.
echo Review the pending changes below. Raw HDF5 and GeoTIFF files are excluded.
git -C "%DEST%" status --short
echo.
choice /C YN /M "Stage, commit and push these changes to origin/main"
if errorlevel 2 (
  echo Stopped before staging. Your copied files remain in the local repository.
  pause
  exit /b 0
)

git -C "%DEST%" add -A
if errorlevel 1 goto :fail
echo.
echo Staged files:
git -C "%DEST%" diff --cached --name-only
echo.
git -C "%DEST%" diff --cached --name-only | findstr /I /E /C:".h5" /C:".hdf5" /C:".tif" /C:".tiff" /C:".netrc" /C:".dodsrc" /C:".env"
if not errorlevel 1 (
  echo ERROR: A protected source or credential-looking file is staged. Stop and inspect .gitignore.
  pause
  exit /b 1
)
git -C "%DEST%" commit -m "KTP v0.8.1: expand SAR evidence archive and source manifest"
if errorlevel 1 goto :fail
git -C "%DEST%" push origin main
if errorlevel 1 goto :fail
echo.
echo SUCCESS: Git reports the commit was pushed to origin/main.
echo Check GitHub Actions/Cloudflare Pages for the corresponding deployment.
pause
exit /b 0

:fail
echo.
echo The operation did not complete. Read the Git error above; no success is claimed.
pause
exit /b 1
