var _ = require('lodash');
var rs = require('request-promise');
var Promise = require('bluebird');
var Data = require('./Data');

var twitch_url = "https://api.twitch.tv/kraken";
var twitch_api_url = "http://api.twitch.tv/api";
var limit = 30;


function filter(response) {

    var resp = JSON.parse(response);
    var videos = resp.videos;

    resp.videos = _.filter(videos, function(video) {       
        if (video.status == 'recorded' && _.startsWith(video._id, 'v')) {
            return true;
        } else {
            return false;
        }
    });

    return JSON.stringify(resp);
}

function Client () {}

Client.prototype.videos = function(channel, broadcasts) {

    if (typeof(broadcasts) === 'undefined') broadcasts = true;

    var url = twitch_url + "/channels/" + channel + "/videos";
    var qs = {broadcasts: broadcasts, limit: limit}

    return rs.get({url:  url, qs: qs}).then(filter);
}

Client.prototype.topGames = function(game) {

    var url = twitch_url + "/videos/top";
    var qs = {game: game,
              period: 'month',
              limit: limit}

    return rs.get({url:  url, qs: qs}).then(filter);
}

Client.prototype.mvideos = function(channel, broadcasts) {

    return new Promise(function(resolve, reject) {
        resolve(JSON.stringify(Data.videos));
    });
}

//var client = new Client();
//
//client.videos("leahloveschief").then(function (r) {
//    console.log(r)
//});

//console.log("HOLA");


//var =lient = new Client()
//client.search("Destiny").then(function (response) {
//    console.log(response);
//})

module.exports = Client;
