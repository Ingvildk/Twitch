var _ = require('lodash');
var spawn = require("child_process").spawn;


function download(url) {

	//var testUrl = "http://www.twitch.tv/imaqtpie/v/6276928";
	//var testUrl = "http://www.twitch.tv/imaqtpie/v/4027295";

	var child = spawn('youtube-dl.exe', 
		[url]);
		// '--external-downloader',
		// 'aria2c']);


	//var child = spawn('cat', ['sample_output.txt']);

	var reTime = /^frame.*time=([0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{2}).*/;
	var reDuration = /.*Duration:\s([0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{2})\,\sstart.*/;
	var reFinished = /\[download\]\s100%\sof\s.*/;

	var foundDuration = false;
	var finished = false;

	var currentTime;
	var duration;

	child.stderr.on('data',
		function (chunk) {

			var line = chunk.toString('utf8');

			if (!foundDuration) {
				var match = reDuration.exec(line);
				if (match != null) {
					foundDuration = true;
					duration = match[1];
				}
			}
			
			var match = reTime.exec(line);
			if (match != null) {
				var time = match[1];
				currentTime = time;
				console.log(currentTime + "/" + duration);
			}

			if (!_.isUndefined(currentTime) && currentTime == duration) {
				finished = true;
			}          
	 	}
	);
}

module.exports = download;