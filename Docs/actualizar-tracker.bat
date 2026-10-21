@echo off
rem Actualiza tracker.html con el contenido de tracker.md y lo abre.
cd /d "%~dp0"
node actualizar-tracker.js
if errorlevel 1 (
  echo.
  echo No se pudo actualizar. Revisa que Node.js este instalado.
  pause
  exit /b 1
)
start "" "tracker.html"
