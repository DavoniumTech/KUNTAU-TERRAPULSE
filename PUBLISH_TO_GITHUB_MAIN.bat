@echo off
setlocal EnableExtensions
set "RELEASE=%~dp0"
if "%RELEASE:~-1%"=="\" set "RELEASE=%RELEASE:~0,-1%"
set "REPO=%USERPROFILE%\Desktop\KUNTAU-TERRAPULSE"
if not exist "%REPO%\.git" (
  echo Existing clone not found at "%REPO%".
  set /p REPO=Enter your existing GitHub clone folder path: 
)
if not exist "%REPO%\.git" (
  echo ERROR: That folder does not contain a Git repository.
  pause
  exit /b 2
)
echo.
echo QUENTA TERAPOST v0.9.0 - SAFE PUBLISH TO main
echo Existing repository: "%REPO%"
echo No remote repository or history will be deleted.
echo.
pushd "%REPO%" || exit /b 3
git switch main || goto :fail
git pull --ff-only origin main || goto :fail
for /f %%A in ('git status --porcelain') do set "DIRTY=1"
if defined DIRTY (echo ERROR: Your local clone already has uncommitted changes. Commit or back them up before running this release helper.& goto :fail)
echo Copying release files while preserving .git and local science files...
robocopy "%RELEASE%" "%REPO%" /E /XD .git .venv __pycache__ node_modules /XF *.tif *.tiff *.TIF *.TIFF *.h5 *.hdf5 *.H5 *.HDF5 .netrc _netrc .dodsrc .env .env.* *.pem *.key *.p12 *.pfx
set "RC=%ERRORLEVEL%"
if %RC% GEQ 8 goto :fail
echo.
echo Review the proposed changes carefully:
git status --short
echo.
echo Files will be staged only after this prompt.
set /p CONFIRM=Type YES to stage, commit and push to origin/main: 
if /I not "%CONFIRM%"=="YES" (
  echo Cancelled. No commit or push was performed.
  popd
  pause
  exit /b 0
)
git add -A || goto :fail
git status
set "PROTECTED="
for /f "delims=" %%F in ('git diff --cached --name-only') do (
  echo %%F | findstr /I /E /C:.tif /C:.tiff /C:.h5 /C:.hdf5 /C:.env /C:.pem /C:.key /C:.p12 /C:.pfx >nul
  if not errorlevel 1 set "PROTECTED=1"
)
if defined PROTECTED (
  echo ERROR: A protected raster or credential-like file is staged. Nothing will be committed.
  goto :fail
)
git commit -m "Quenta TeraPost v0.9.0: premium mobile studio refresh" || goto :fail
git push origin main || goto :fail
echo.
echo SUCCESS: Git reports the update was pushed to origin/main.
popd
pause
exit /b 0
:fail
echo ERROR: Publishing stopped. No remote deletion was attempted.
popd
pause
exit /b 1
