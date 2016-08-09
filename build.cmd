taskkill /F /IM Twitch.exe /T

taskkill /F /IM ffmpeg.exe /T

rm -r .\..\output\*
rm -r .\..\out\*

electron-packager . Twitch --prune --asar --platform=win32 --arch=x64 --version=0.28.1 --out ..\out --ignore cache/.* --ignore release --ignore videos


grunt create-windows-installer