fetch = function() {
	var query = "?q=vine.co%2Fv%2F&result_type=recent&include_entities=1&rpp=20";
	var script_tag = document.createElement("script");
	script_tag.id = "fetcher";
	script_tag.src = "https://search.twitter.com/search.json"+query+"&callback=parse";
	document.body.appendChild(script_tag);
}

parse = function(data) {
	document.body.removeChild(document.getElementById("fetcher"));
	if( data && data.results ) {
		for( var i = 0, len = data.results.length; i < len; i++ ) {
			var result = data.results[i];
			if( result.entities.urls[0].display_url ) {
				if( result.entities.urls[0].expanded_url.indexOf("http://vine.co/v/") != -1 ) {
					vine_urls.push( result.entities.urls[0].expanded_url );
				}
			}
		}
	}

	setRandom();
}

setRandom = function() {
	clearTimeout( t );
	var vine_video = vine_urls[Math.floor(Math.random()*vine_urls.length)] + "/card";
	setVideo( vine_video );
}

setVideo = function( url ) {
	$("#video").remove();
   	var ifrm = document.createElement("iframe"); 
   	ifrm.id = "video";
   	ifrm.setAttribute("src", url ); 
   	ifrm.style.width = "100%"; 
   	ifrm.style.height = "100%"; 
   	ifrm.onerror = function() {
   		setRandom();
   	}
   	ifrm.onload = function() {
   		clearTimeout( ce );
   		t = setTimeout( setRandom, 24000 );
   	}
   	document.body.appendChild(ifrm);
   	ce = setTimeout( checkLoaded, 10000 );
}

checkLoaded = function() {
	clearTimeout( ce );
	setRandom();
}

var vine_urls = new Array();
var t, ce;
$(document).ready(function() {
	fetch();
	setTimeout( fetch, 60000 );
});