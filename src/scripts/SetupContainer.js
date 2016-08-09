'use strict';

import React from 'react';
import {Navigation} from 'react-router';
import Actions from './Actions';
import {RenderMixin} from './Mixins';

export default React.createClass({
  mixins: [RenderMixin, Navigation],

  componentDidMount() {
    var game = "Destiny";
    this.transitionTo('games', {game: game});
  },

  render() {
    return (
      <div className="setup-container">
      </div>
    );
  }
});
