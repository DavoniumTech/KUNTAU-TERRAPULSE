@echo off
setlocal
set "ROOT=%~dp0"
for %%D in (app docs data\catalogue data\qa data\visualizations data\processed data\raw scripts) do (
  if not exist "%ROOT%%%D" mkdir "%ROOT%%%D"
)
echo KTP repository folders are ready at:
echo %ROOT%
pause
