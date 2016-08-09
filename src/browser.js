'use strict';

var app = require('app');
var BrowserWindow = require('browser-window');
var fs = require('fs');
var ipc = require('ipc');
var path = require('path');
var spawn = require("child_process").spawn;

require('crash-reporter').start();

var handleStartupEvent = function() {
  if (process.platform !== 'win32') {
    return false;
  }

  var squirrelCommand = process.argv[1];
  switch (squirrelCommand) {
    case '--squirrel-install':
    case '--squirrel-updated':



      console.log("SNAP");

      // Optionally do things such as:
      //
      // - Install desktop and start menu shortcuts
      // - Add your .exe to the PATH
      // - Write to the registry for things like file associations and
      //   explorer context menus

      // Always quit when done
      app.quit();

      return true;
    case '--squirrel-uninstall':
      // Undo anything you did in the --squirrel-install and
      // --squirrel-updated handlers

      // Always quit when done
      app.quit();

      return true;
    case '--squirrel-obsolete':
      // This is called on the outgoing version of your app before 
      // we update to the new version - it's the opposite of
      // --squirrel-updated
      app.quit();
      return true;
  }
};

if (handleStartupEvent()) {
  return;
}


app.on('ready', function(){
  var mainWindow = new BrowserWindow({
    'width': 1000,
    'height': 600,
    'min-width': 1000,
    'min-height': 600,
    'resizable': false,
    'standard-window': false,
    'fullscreen': true,
    'frame': false,
    'show': false,
  });
  mainWindow.loadUrl(path.normalize('file://' + path.join(__dirname, 'index.html')));

  app.on('activate-with-no-open-windows', function () {
    if (mainWindow) {
      mainWindow.show();
    }
    return false;
  });

  app.on('before-quit', function() {
    //mainWindow.webContents.send('twitch:quit');
  });

  mainWindow.webContents.on('new-window', function (e) {
    e.preventDefault();
  });

  mainWindow.on('focus', function(){
    mainWindow.webContents.send('twitch:focus');
  });

  mainWindow.on('blur', function(){
    mainWindow.webContents.send('twitch:blur');
  });

  mainWindow.webContents.on('did-finish-load', function() {
    mainWindow.setTitle('Twitch');
    mainWindow.show();
    mainWindow.focus();
  });
});


app.on('window-all-closed', function() {
      app.quit();
 });
