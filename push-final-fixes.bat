@echo off
cd /d "c:\Users\user\Downloads\Amanuel-Hospital-main\Amanuel-Hospital-main"

echo === STAGING ALL FILES ===
git add .

echo === COMMITTING ===
git commit -m "Complete telemedicine fixes: hamburger menu visibility, Oromia flag, video routing, mobile layout, call termination navigation"

echo === PUSHING TO GITHUB ===
git push origin main

echo PUSH_COMPLETE