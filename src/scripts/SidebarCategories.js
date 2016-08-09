'use strict';

import React from 'react';
import Join from 'react/lib/joinClasses';
import {Link} from 'react-router';
import Constants from './Constants';

export default React.createClass({


  render() {

    var games = Constants.api.top;

    var links = games.map(function(entry) {
        var game = entry.game;
        var url = "http://www.google.com";
        var id = game._id;

        var href = '/games/' + game.name;


        var name = game.name.substr(0, 23);

        if (game.name.length >= 23) {
            name += "...";
        }

        return (
            <Link className='link list-group-item' key={id} to={href}>
                <span className={Join('icon', 'icon-popular')}></span>
                <span className="title">{name}</span>
            </Link>
        )
    });

    return (
      <div className="sidebar-categories">
        <h4>Popular games</h4>
        <div className="sidebar-links list-group">
            {links}
        </div>
      </div>
    );
  }
});