//This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "//www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
//  


$("#searchbox .search").click(function(){

	var query = $(this).siblings(':text').attr('value');

	$("#results").empty();
	$("#search").addClass("open");
	$(".close").show();

	searchYT(query);
});

$("#searchbox .close").click(function(){

	$("#search").removeClass("open");
	$(this).hide();

});

$(".loadSong :button").live('click', function() {
	var ytURL = $(this).siblings(':text').attr('value');

	var videoID = getVideoID(ytURL);

	console.log(videoID);

	if(this.name === "1"){
		cueVideo(player1, videoID);
	} else {
		cueVideo(player2, videoID);
	}
	
});

$("#mixer .pause").click(function(){
	
	if(this.name === "1"){
		player1.pauseVideo();
	} else {
		player2.pauseVideo();
	}

});

$("#mixer .play").click(function(){

	if(this.name === "1"){
		player1.playVideo();
	} else {
		player2.playVideo();
	}
	
});


$("#fader").change(function() {

	var level = $("#fader").attr("value");

	if(level > 100){

		player1.setVolume(200 - level);
		player2.setVolume(100);

	}else if(level < 100){

		player1.setVolume(100);
		player2.setVolume(level);

	}else{

		player1.setVolume(100);
   		player2.setVolume(100);

	}

});

function onYouTubeIframeAPIReady() {

	//create youtube players
	player1 = new YT.Player('player1', {
		height: '390',
		width: '640',
		videoId: 'null',
		playerVars: {
			disablekb: 1,
			iv_load_policy: 3,
			modestbranding: 1,
			showinfo: 0,
			rel: 0
		}
 	});

	player2 = new YT.Player('player2', {
		height: '390',
		width: '640',
		videoId: 'null',
		playerVars: {
			disablekb: 1,
			iv_load_policy: 3,
			modestbranding: 1,
			showinfo: 0,	
			rel: 0
		}
	});
}

function cueVideo(player, videoID){

	player.cueVideoById({videoId:videoID});

}

function getVideoID(ytURL){

	var videoID = ytURL.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);

	if(videoID[1] != null) {
		return videoID[1];
	} else { 
		return "invalid url";
	}
}

function searchYT(query){
	var baseURL = "https://gdata.youtube.com/feeds/api/videos";
	var url = baseURL + "?q=" + query + "&alt=json";

	var results = [];

	$.getJSON(url, function(data){
		$(data.feed.entry).each(function(index){
			results[index] = {
				url: this.link[0].href,
				title: this.title.$t,
				thumb: this.media$group.media$thumbnail[0].url
			}
		});

		displayResults(results);
	});
}

function displayResults(results){
	$(results).each(function(index){

		$("#results").append("<li class = 'result'> " +
						 	  	"<img src = " + results[index].thumb + "> " + 
						 	  	results[index].title + 
						 	  	"<form class = 'loadSong'>" +
						 	  		"<input type = 'text' hidden = 'true' value = '" + results[index].url + "' >" +
						 	  		"<input type = 'button' value = 'load 1' name = '1'>" + 
						 	  	"</form>" + 
						 	  	"<form class = 'loadSong'>" + 
						 	  		"<input type = 'text' hidden = 'true' value = '" + results[index].url + "' >" + 
						 	  		"<input type = 'button' value = 'load 2' name = '2'>" + 
						 	  	"</form>" +
						 	 "</li>"
		);

	});
}
