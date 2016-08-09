'use strict';

import axios from 'axios';
import cheerio from 'cheerio';
import assign from 'object-assign';
import Constants from './Constants';
import Client from './Twitch';


export default {


  getSearchResultVideos(query, page) {

    let self = this;
    let pageToken = page || '';
    var client = new Client();

    return client.videos(query).then(res => {
        return JSON.parse(res);
    });
  },


   getGameSearchResultVideos(query, page) {

    let self = this;
    let pageToken = page || '';
    var client = new Client();

    return client.topGames(query).then(res => {
        return JSON.parse(res);
    });
  },

  paginateSearchResultVideos(query, next) {
    return this.getSearchResultVideos(query, next);
  }
};
