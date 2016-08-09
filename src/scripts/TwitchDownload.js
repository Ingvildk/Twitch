var _ = require('lodash');
var spawn = require("child_process").spawn;
var es = require('event-stream');
var inspect = require('util').inspect;
var fs = require('fs');


 function dateToSeconds(date) {
 	var hhmmss = date.split(":");

    var hh = parseInt(hhmmss[0]);
    var mm = parseInt(hhmmss[1]);
    var ss = parseInt(hhmmss[2].split('.')[0]);

    return (hh * 60 * 60) + (mm * 60) + ss;
 }


function download(url, filename) {

	//var testUrl = "http://www.twitch.tv/imaqtpie/v/6276928";
	//var testUrl = "http://www.twitch.tv/imaqtpie/v/4027295";

	//filename = "yo.mp4";

	//var url = "http://www.twitch.tv/kaceytron/v/6289650";

	var tempFile = filename + ".tmp";

	var child = spawn('.\\youtube-dl.exe', 
		[url,
		 '--output',
		 tempFile, 
		 '--external-downloader',
		 'aria2c']);


	var reTime = /^frame.*time=([0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{2}).*/;
	var reDuration = /.*([0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{2})\,\sstart\:.*bitrate\:.*/;
	var reDuration2 = /Duration\:.*([0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{2}).*/;
	var reFinished = /\[download\]\s100%\sof\s.*/;
	var reFinished2 = /.*video\:.*.*audio\:.*muxing\soverhead.*/

	var foundDuration = false;
	var finished = false;

	var currentTime = "00:00:00.00";
	var duration = "99:99:99.99";


	return child.stderr.pipe(es.map(function (chunk, cb) {
		var line = chunk.toString('utf8');

		if (!foundDuration) {
			var match = reDuration.exec(line);
			var match2 = reDuration2.exec(line);
			if (match != null) {
				foundDuration = true;
				duration = match[1];
			} else if (match2 != null) {
				foundDuration = true;
				duration = match2[1];
			}

			
		}
			
		var match = reTime.exec(line);
		if (match != null) {
			var time = match[1];
			currentTime = time;
		}

		if (currentTime == duration || reFinished.exec(line) != null 
			|| reFinished2.exec(line) != null) {
			finished = true;
		}

		var percentage = dateToSeconds(currentTime) / dateToSeconds(duration);

		var data = {currentTime: currentTime, 
					duration: duration,
					percentage: percentage}

		cb(null, JSON.stringify(data));
	}));

};

//download("", "yo.mp4").pipe(process.stdout);

module.exports = {download: download}