'use strict';

import React from 'react';
import {Route, DefaultRoute} from 'react-router';
import App from './AppContainer';
import Setup from './SetupContainer';
import Search from './SearchContainer';
import Detail from './DetailContainer';
import Downloads from './DownloadsContainer';
import Game from './Game';
import Watch from './Watch';

const AppRoutes = (
    <Route name="app" path="/" handler={App}>
        <Route ignoreScrollBehavior={true} name="detail" handler={Detail}>
        <Route name="games" path="/games/:game" handler={Game} />
        <Route name="search" path="/search/:query" handler={Search} />
        <Route name="downloads" path="/downloads/:group" handler={Downloads} />
        <Route name="watch" path="/watch/:videoId" handler={Watch} />
        </Route>
        <DefaultRoute name="setup" handler={Setup} />
    </Route>
);

export default AppRoutes;

