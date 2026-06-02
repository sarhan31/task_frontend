@echo off
echo Creating Task Management System folder structure...
echo.

REM Create main directories
mkdir src\assets\images 2>nul
mkdir src\assets\icons 2>nul
mkdir src\assets\fonts 2>nul

mkdir src\components\ui 2>nul
mkdir src\components\layout 2>nul
mkdir src\components\cards 2>nul
mkdir src\components\charts 2>nul
mkdir src\components\forms 2>nul
mkdir src\components\tasks 2>nul
mkdir src\components\users 2>nul

mkdir src\pages\auth 2>nul
mkdir src\pages\admin 2>nul
mkdir src\pages\user 2>nul

mkdir src\layouts 2>nul
mkdir src\routes 2>nul
mkdir src\context 2>nul
mkdir src\hooks 2>nul
mkdir src\services 2>nul
mkdir src\utils 2>nul
mkdir src\data 2>nul

mkdir public 2>nul

echo ✓ Folder structure created successfully!
echo.
echo Next steps:
echo 1. Run: npm install
echo 2. Create .env file from .env.example
echo 3. Run: npm run dev
echo.
pause
