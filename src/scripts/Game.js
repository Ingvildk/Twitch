'use strict';

import React from 'react/addons';
import Join from 'react/lib/joinClasses';
import {State} from 'react-router';
import Actions from './Actions';
import GameStore from './GameStore';
import {RenderMixin} from './Mixins';
import Search from './Search';
import Paginator from './Paginator';


const PureRenderMixin = React.addons.PureRenderMixin;

export default React.createClass({
  mixins: [PureRenderMixin, RenderMixin, State],


    getInitialState() {
        return GameStore.getState();
    },

    componentDidMount() {
        var { game } = this.props.params;

        GameStore.listen(this._search);
        Actions.fetchGame(game);
    },

    componentWillUnmount() {
        GameStore.unlisten(this._search);
    },


    _search() {
        this.setState(GameStore.getState());
    },


    handleLoadMore(results) {
        let query = this.getParams().query;
        let token = results[0].get('next');
        Actions.paginateSearchResultVideos(query, token);
    },
    

    renderResults(query, results) {
        return (
          <div className="search">
            <Search more={this.handleLoadMore} results={results}/>
          </div>
    );
  },

  render() {

        var fragment;
        var page = Join('search-container');
        var game = this.props.params.game;


        if(this.props.loading){
          fragment = this.renderLoader({message: 'Loading ' + game + ' videos...'});
        } else {
          fragment = this.renderResults(this.getParams().query, 
            this.state.results.toArray());
        }

        return this.renderFragment(page, fragment);
  }
});