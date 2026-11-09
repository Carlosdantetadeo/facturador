@echo off
REM Opens the bill template in Chrome (falls back to the default browser).
set "FILE=%~dp0index.html"
where chrome >nul 2>&1 && start chrome "%FILE%" && exit /b 0
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
  start "" "%ProgramFiles%\Google\Chrome\Application\chrome.exe" "%FILE%"
  exit /b 0
)
if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" (
  start "" "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" "%FILE%"
  exit /b 0
)
start "" "%FILE%"
