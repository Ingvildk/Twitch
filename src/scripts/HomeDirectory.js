'use strict';

var path = require('path');
var Home = {};

Home.getHomeDirectory = function () {
    if (process.platform === 'win32') {
        return process.env.USERPROFILE;
    } else {
        return process.env.HOME;
    }
};

Home.getDataPath = function () {
    var home = this.getHomeDirectory();
    return path.join(home, 'data.json');
};

module.exports = Home;