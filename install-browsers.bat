@echo off
echo Installing Playwright browsers...
set PATH=C:\Program Files\nodejs;%PATH%
"C:\Program Files\nodejs\node.exe" "C:\Program Files\nodejs\node_modules\npm\bin\npx-cli.js" playwright install 