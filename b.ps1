taskkill /F /IM Twitch.exe /T

taskkill /F /IM ffmpeg.exe /T

rm -r ..\output

rm -r ..\out

rm -r dist

mkdir dist

cp package.json dist
cp -r build dist
cp -r node_modules dist

electron-packager dist Twitch --prune --asar --platform=win32 --arch=x64 --version=0.28.1 --out ..\out 

cp ffmpeg.exe ..\out\Twitch-win32
cp aria2c.exe ..\out\Twitch-win32
cp youtube-dl.exe ..\out\Twitch-win32

asar pack ..\out\Twitch-win32\resources\app ..\out\Twitch-win32\resources\app.asar

rm -r ..\out\Twitch-win32\resources\app

.\rcedit.exe ..\out\Twitch-win32\Twitch.exe --set-icon .\sleep.ico.ico