'use strict';

import {Alt, Api, Ydm} from './Core';
import TwitchDownload from './TwitchDownload';
import fs from 'fs';

var path = require('path');
import Home from './HomeDirectory';

function move(src, dst) {

  console.log("moving " + src + " " + dst);

  var source = fs.createReadStream(src);
  var dest = fs.createWriteStream(dst);

  source.pipe(dest);
  source.on('end', function() { /* copied */ });
  source.on('error', function(err) { /* error */ });
}

class Actions {

  loading(store) {
    this.dispatch(store);
  }

  more() {
    this.dispatch();
  }

  fetchGame(query) {

    this.dispatch();
    this.actions.loading('game');

    Api.getGameSearchResultVideos(query).then(data => {
      data.query = query;
      this.actions.receiveGameResults(data);
    }).catch(err => {
      this.actions.failSearchResults(err);
    });
  }

  receiveSearchResults(response) {
    this.dispatch(response);
    this.actions.loading('search');
  }

  receiveGameResults(response) {
    var that = this;
    this.dispatch(response);
    that.actions.loading('game');
  }

  updateSearchResults(response) {
    this.dispatch(response);
    this.actions.more();
  }

  failSearchResults(err){
    console.log(err);
    this.dispatch(err);
    this.actions.loading('search');
  }

  fetchSearchResults(query) {
    this.dispatch();
    this.actions.loading('search');
    Api.getSearchResultVideos(query).then(data => {
      data.query = query;
      this.actions.receiveSearchResults(data);
    }).catch(err => {
      this.actions.failSearchResults(err);
    });
  }

  paginateSearchResultVideos(query, next) {
    this.actions.more();
    Api.paginateSearchResultVideos(query, next).then(data => {
      this.actions.updateSearchResults(data);
    }).catch(err => {
      this.actions.failSearchResults(err);
    });
  }

  prompt(item, filename) {
    var dir = path.join(Home.getHomeDirectory(), 'twitch_videos');//, ID + '.mp4');
    var filename = path.join(Home.getHomeDirectory(), 'twitch_videos', item._id + '.mp4');
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }

    if (!fs.existsSync(filename)) {
      this.actions.download(item, filename);
    }
  }

  cancel(id) {
    this.dispatch(id);
  }

  verify(id) {
    return Ydm.verify(id);
  }

  duplicate(item) {
    return Ydm.duplicate(item);
  }

  live(id) {
    Ydm.live(id);
  }

  download(video, filename) {

    var stream = TwitchDownload.download(video.url, filename);
    var that = this;

    this.dispatch({
      id: video._id,
      title: video.title,
      path: filename
    });

    video.filename = filename;

    this.actions.status();
    this.actions.snapshot();
    this.actions.progress(video, stream);
  }

  progress(video, stream) {
    var that = this;

    
    stream.on('data', function(status) {
  
      var update = JSON.parse(status);
      that.dispatch({
          id: video._id,
          total: 0,
          progress: (update.percentage * 100).toFixed(2),
          start: false
      });


    });

    stream.on('end', () => {

      that.dispatch({
          id: video._id,
          total: 0,
          progress: 100,
          start: false
      });



      setTimeout(() => {
        that.actions.finish(video);
        var tempFile = video.filename + ".tmp";
        move(tempFile, video.filename);

      }, 600);
    });
  
  }

  status() {
    this.dispatch();
  }

  finish(video) {
    var id = video._id;
    this.dispatch(id);
    this.actions.status();
    this.actions.snapshot();
    this.actions.notify();
  }

  clear() {
    Ydm.clear().then(ids => {
      this.dispatch(ids);
      this.actions.snapshot();
    });
  }

  show(filepath) {
    Ydm.show(filepath);
  }

  notify() {
    Ydm.notify();
  }

  snapshot() {
    this.dispatch();
    let state = this.alt.takeSnapshot('DownloadsStore');
    localStorage.setItem('downloads', state);
  }

  boot() {
    this.dispatch();
    let state = Ydm.load('downloads');
    if(state !== null) {
      this.alt.bootstrap(state);
    }
  }
}

export default Alt.createActions(Actions);
