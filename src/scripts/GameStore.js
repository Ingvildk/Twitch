'use strict';

import {Record, List, Map} from 'immutable';
import {Alt} from './Core';
import Actions from './Actions';

const Search = new Record({
  etag: null,
  query: null,
  videos: [],
  next: null
});

class GameStore {
  constructor() {
    this.errMessage = null;
    this.results = List([]);

    this.bindListeners({
      handleReceiveGameResults: Actions.receiveGameResults,
      handleFetchGameResults: Actions.fetchGame
    });
  }

  handleFetchGameResults() {
    this.results = List([]);
  }

  handleReceiveGameResults(result){
    this.errMessage = null;
    this.results = this.results.push(new Search({
      query: result.query,
      videos: result.videos
    }));
  }
}

export default Alt.createStore(GameStore);
