// please set username of mqtt.beebotte.com and ip address of Google Home
// in config/default.json, like this
//{
//	"username": "token:token_XXXXXXXXXXXXXXXX",
//	"ip": "192.168.mm.nn"
//}

const googlehome = require('google-home-notifier');
const mqtt = require('mqtt');
const rp = require("request-promise");
var conf = require('config');
var to_json = require('xmljson').to_json;

const language = 'ja';
googlehome.device("Google-Home-mini", language);
googlehome.ip(conf.ip);


const client = mqtt.connect('mqtt://mqtt.beebotte.com',
  {username: conf.username, password: ''} 
);

client.on('connect', function() {
  client.subscribe('ifttt_nhk_news/voice');
});

client.on('message', function(topic, message) {
    console.log(message.toString());

    var title = "";
    var pubDate = "";
    var url = "";
    var length ="";

    var options = {
        method: 'GET',
	uri: "https://www.nhk.or.jp/r-news/podcast/nhkradionews.xml",
    };
    
    rp(options).then((response) => {
	to_json(response, function (error, data) {
	    for(let i in data.rss.channel.item) {
		var item = data.rss.channel.item[i]
		length = item.enclosure['$'].length;
		if (length > 6700000) {
		    title = item.title;
		    pubDate = item.pubDate;
		    url = item.enclosure['$'].url.replace("http:", "https:");
		    break
		}
	    };
	});
	console.log(message);
	console.log(url);
	googlehome.play(url, (notifyRes) => {
	  console.log(notifyRes);
	});
    }, (error) => {
	console.log("ERROR");
	callback(null, {
            "statusCode": 200, 
            "body": "ERROR"
	});
    });
});
