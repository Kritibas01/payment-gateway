@echo off
echo Running Payment Automation Test...
set PATH=C:\Program Files\nodejs;%PATH%
"C:\Program Files\nodejs\node.exe" "C:\Program Files\nodejs\node_modules\npm\bin\npx-cli.js" playwright test tests/payment.spec.js --headed
pause 