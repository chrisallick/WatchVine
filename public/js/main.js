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

    set_random();
}

set_random = function() {
    clearTimeout( t );
    var vine_video = vine_urls[Math.floor(Math.random()*vine_urls.length)] + "/card";
    fetch_source_url( vine_video );
}

set_video = function(url) {
    var video = document.getElementsByTagName('video')[0];
    video.src = url;
    video.load();
    video.onerror = function() {
        set_random();
    }
}

fetch_source_url = function( url ) {
    $.ajax({
        type: "GET",
        url: "/get/video/url",
        dataType: "json",
        data: {
            "url": url
        }
    }).done(function(resp){
        if( resp && resp.result && resp.result == "success" ) {
            if( resp.url ) {
                set_video( resp.url );
            }
        }
    });
}

var vine_urls = new Array();
var t;
$(document).ready(function() {

    $("#loading").css({
        left: $(document).width() / 2 - 20,
        top: $(document).height() /2 - 20
    });

    fetch();
    setTimeout( fetch, 60000 );

    if( $(document).width() > $(document).height() ) {
        $("#video").width( $(document).width() ).css({
            'top': $(document).height() / 2 - $("#video").width() / 2
        });
    }

    $("#next").click(function(){
        set_random();
    });

    $("#pause").click(function(){
        clearTimeout( t );
    });
});
