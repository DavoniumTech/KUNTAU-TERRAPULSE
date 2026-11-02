@echo off
setlocal EnableExtensions
set "RELEASE=%~dp0"
if "%RELEASE:~-1%"=="\" set "RELEASE=%RELEASE:~0,-1%"
set "REPO=%USERPROFILE%\Desktop\KUNTAU-TERRAPULSE"
echo.
echo KUNTAU TERRAPULSE v1.0.0 - SAFE UPDATE OF EXISTING GITHUB MAIN
echo Release folder: "%RELEASE%"
if not exist "%REPO%\.git" (
  echo Existing clone not found at "%REPO%".
  set /p REPO=Enter the path to your existing KUNTAU-TERRAPULSE Git clone: 
)
if not exist "%REPO%\.git" (echo ERROR: The selected folder does not contain a Git repository.& goto :fail_nopush)
pushd "%REPO%" || goto :fail_nopush
set "REMOTE="
for /f "delims=" %%R in ('git remote get-url origin 2^>nul') do set "REMOTE=%%R"
if /I not "%REMOTE%"=="https://github.com/DavoniumTech/KUNTAU-TERRAPULSE.git" if /I not "%REMOTE%"=="git@github.com:DavoniumTech/KUNTAU-TERRAPULSE.git" (
  echo ERROR: origin does not match the expected KUNTAU-TERRAPULSE repository.
  echo Found: %REMOTE%
  goto :fail
)
git switch main || goto :fail
git pull --ff-only origin main || goto :fail
for /f %%A in ('git status --porcelain') do set "DIRTY=1"
if defined DIRTY (echo ERROR: Your clone contains uncommitted changes. Commit or back them up first.& goto :fail)
echo.
echo Copying release files into the existing clone while preserving .git...
robocopy "%RELEASE%" "%REPO%" /E /XD .git .venv __pycache__ node_modules /XF *.zip *.tif *.tiff *.TIF *.TIFF *.h5 *.hdf5 *.H5 *.HDF5 .netrc _netrc .dodsrc .env .env.* *.pem *.key *.p12 *.pfx
set "RC=%ERRORLEVEL%"
if %RC% GEQ 8 goto :fail
echo.
echo Review the proposed changes below:
git status --short
echo.
set /p CONFIRM=Type YES to stage, commit and push to origin/main: 
if /I not "%CONFIRM%"=="YES" (echo Cancelled. No commit or push was performed.& popd & pause & exit /b 0)
git add -A || goto :fail
 git diff --cached --quiet
if not errorlevel 1 (echo No changes to publish.& popd & pause & exit /b 0)
set "PROTECTED="
for /f "delims=" %%F in ('git diff --cached --name-only') do (
  echo %%F | findstr /I /E /C:.tif /C:.tiff /C:.h5 /C:.hdf5 /C:.env /C:.pem /C:.key /C:.p12 /C:.pfx >nul
  if not errorlevel 1 set "PROTECTED=1"
)
if defined PROTECTED (echo ERROR: A protected raster or credential-like file is staged. Nothing will be committed.& goto :fail)
git commit -m "KUNTAU TERRAPULSE v1.0.0: fixed dock and restored KTP branding" || goto :fail
git push origin main || goto :fail
echo.
echo SUCCESS: Git reports that the update was pushed to origin/main.
echo Check Cloudflare Pages for a successful deployment before reinstalling the PWA.
popd
pause
exit /b 0
:fail
echo ERROR: Publishing stopped. The remote repository was not deleted or recreated.
popd
pause
exit /b 1
:fail_nopush
echo ERROR: Publishing stopped before any Git push.
pause
exit /b 2
