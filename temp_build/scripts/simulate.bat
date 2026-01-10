@echo off
echo Cleaning temp_build...
if exist temp_build rmdir /s /q temp_build
mkdir temp_build

echo Copying files...
robocopy . temp_build /E /XD node_modules .git .next dist .turbo temp_build /XF .env* /NFL /NDL /NJH /NJS /NC /NS /NP

echo Moving to temp_build...
cd temp_build

echo Installing dependencies...
call pnpm install --no-frozen-lockfile
if %errorlevel% neq 0 exit /b %errorlevel%

echo Building Server...
cd server
call pnpm run build
if %errorlevel% neq 0 exit /b %errorlevel%

echo Simulation Successful!
