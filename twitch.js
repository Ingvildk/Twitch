var _ = require('lodash');
var rs = require('request-promise');

var twitch_url = "https://api.twitch.tv/kraken";
var twitch_api_url = "http://api.twitch.tv/api";


function Client () {

}

Client.prototype.videos = function(channel, broadcasts) {

    if (typeof(broadcasts) === 'undefined') broadcasts = true;

    var url = twitch_url + "/channels/" + channel + "/videos";
    var qs = {broadcasts: broadcasts}

    return rs.get({url:  url, qs: qs});
}

Client.prototype.search = function(channel, broadcasts) {

    if (typeof(broadcasts) === 'undefined') broadcasts = true;

    var url = twitch_url + "/channels/" + channel + "/videos";
    var qs = {broadcasts: broadcasts}

    return rs.get({url:  url, qs: qs});
}



//var client = new Client();
//
//client.videos("leahloveschief")
//    .then(function(response) {
//        console.log(response);
//    });
