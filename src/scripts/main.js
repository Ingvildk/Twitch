'use strict';

import ipc from 'ipc';
import remote from 'remote';

import React from 'react';
import Join from 'react/lib/joinClasses';
import Router from 'react-router';
import RouterContainer from './Router';
import Utils from './Utils';
import routes from './AppRoutes';
import fs from 'fs';
import _ from 'lodash';
import glob from 'glob';
import Home from './HomeDirectory';
import path from 'path';
import child_process from 'child_process';


let Menu = remote.require('menu');
let MenuTemplate = Utils.menu();
let AppMenuTemplate = Menu.buildFromTemplate(MenuTemplate);
Menu.setApplicationMenu(AppMenuTemplate);

function bootstrap(){

  Utils.inspect();
  Utils.addLiveReload();
  Utils.disableGlobalBackspace();
  Menu.setApplicationMenu(AppMenuTemplate);
  
  child_process.spawn('taskkill', ['/F', '/IM', 'ffmpeg.exe', '/T']);

  var downloads = JSON.parse(localStorage.getItem('downloads'))


  if (!_.isNull(downloads)) {

    var finished = _.filter(downloads.DownloadsStore, function(download) {
        return download.done;
    });

  
    localStorage.setItem('downloads', JSON.stringify({DownloadsStore: finished}));
  }

  var dir = path.join(Home.getHomeDirectory(), 'twitch_videos');

  glob('**.mp4.tmp*', {cwd: dir}, function (er, files) {

    _.each(files, function(file) {
        fs.unlinkSync(path.join(dir, file));
    });
  })

  

  let mountNode = document.body.children[0];
  let AppRouter = Router.create({
    routes: routes
  });

  ipc.on('twitch:quit', () => {


    console.log("SHOULD QUIT!");

    
    //localStorage.removeItem('channels')
     

  });

  ipc.on('twitch:focus', () => {
    mountNode.className = 'app-container';
  });

  ipc.on('twitch:blur', () => {
    mountNode.className += ' app-blur';
  });

  AppRouter.run((Root, state) => {
    var params = state.params;
    React.render(<Root params={params} />, mountNode);
  });
  RouterContainer.set(AppRouter);
}

Promise.all([
  new Promise((resolve) => {
    if (window.addEventListener) {
      window.addEventListener('DOMContentLoaded', resolve);
    } else {
      window.attachEvent('onload', resolve);
    }
  })
]).then(bootstrap);