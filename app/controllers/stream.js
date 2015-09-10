var args = arguments[0] || {};
var lastHeight = null;
var setHeight = false;

var measurement = require('alloy/measurement');
var loading = true;
var platformWidth = measurement.pxToDP(Ti.Platform.displayCaps.platformWidth);
var platformHeight = measurement.pxToDP(Ti.Platform.displayCaps.platformHeight);
var lastPlaybackTime = 0;

App.ActivityIndicator.showInView($.outerContainer, {
    backgroundColor: 'transparent',
    opacity: 1,
    touchEnabled: false
});

$.videoPlayer.addEventListener('load', onLoad);
$.videoPlayer.addEventListener('playbackstate', onPlaybackstate);

Ti.Gesture.addEventListener('orientationchange', function(e) {
    if(e.orientation !== Ti.UI.LANDSCAPE_LEFT && e.orientation !== Ti.UI.LANDSCAPE_RIGHT) {
        $.videoContainer.setHeight(Math.floor(platformWidth*0.95*0.95*0.5633802816901409));
        $.videoPlayer.setHeight(Math.floor(platformWidth*0.95*0.95*0.5633802816901409));
        $.videoPlayer.setWidth(Math.floor(platformWidth*0.95*0.95));
        $.outerContainer.setHeight(Ti.UI.SIZE);
    } else {
        $.videoContainer.setHeight(Math.floor(platformHeight*0.95*0.95*0.5633802816901409));
        $.videoPlayer.setHeight(Math.floor(platformHeight*0.95*0.95*0.5633802816901409));
        $.videoPlayer.setWidth(Math.floor(platformHeight*0.95*0.95));
        // $.outerContainer.setHeight(Math.floor(0.6*0.9*0.95*platformHeight));
    }
    
    $.videoPlayer.scalingMode = Titanium.Media.VIDEO_SCALING_ASPECT_FILL;
    // $.videoPlayer.setWidth(400);
});

function closeStream(e) {
    App.log('Clicked');
    if($.videoPlayer.playing) {
        $.videoPlayer.stop();
    }
    $.videoPlayer.removeEventListener('load', onLoad);
    $.videoPlayer.removeEventListener('playbackstate', onPlaybackstate);
    $.videoPlayer.release();
    $.getView().close();
}

function viewFullScreen(e) {
    /*var videoPlayer = Ti.Media.createVideoPlayer({
        autoplay: true,
        url: "rtsp://edge-cl.edge.mdstrm.com:80/tvn-live/285a5c6dade574d5f111419c85c6cf17_240p",
        fullscreen: true,
        scalingMode : Titanium.Media.VIDEO_SCALING_ASPECT_FIT,
        mediaControlStyle: Ti.Media.VIDEO_CONTROL_FULLSCREEN,
        backgroundColor: '#0c242f'
    });
    var view = Ti.UI.createView({
        backgroundColor: 'transparent',
        touchEnabled: false
    });
    App.ActivityIndicator.showInView(view, {
        backgroundColor: '#0c242f',
        touchEnabled: false
    });
    videoPlayer.add(view);
    videoPlayer.addEventListener('load', function() {
        App.ActivityIndicator.hideInView(view);
    });

    if($.videoPlayer.currentPlaybackTime > 0) {
        lastPlaybackTime = $.videoPlayer.currentPlaybackTime;    
    }
    */
    Alloy.createController('full_stream', {
        videoPlayer: $.videoPlayer
    }).getView().open({
        theme: "Theme.NoActionBar"
    });

    /*
    App.log(lastPlaybackTime);
    if(!loading) {
        $.yellowCircle.show();
        $.greenCircle.hide();
        App.ActivityIndicator.showInView($.outerContainer, {
            backgroundColor: 'transparent',
            opacity: 1,
            touchEnabled: false
        });
    }
    
    $.videoContainer.setOpacity(0);
    */
}

function onPostlayout(e) {
    if(this.size.height === lastHeight) {
        return;
    }
    lastHeight = this.size.height;
    var newHeight = $.videoPlayer.size.width*0.5633802816901409;
    var containerHeight = $.videoPlayer.size.width*0.8;
    $.outerContainer.setBackgroundColor('#0c242f');

    $.videoContainer.setHeight(Math.floor(newHeight));
    $.outerContainer.setOpacity(1);
    $.outerContainer.setHeight(this.size.height);   
    $.videoContainer.setHeight(Math.floor(newHeight));

}

function onLoad(e) {
    var interval;
    $.yellowCircle.hide();
    $.greenCircle.show();
    interval = setInterval(function() {
        App.log($.videoPlayer.currentPlaybackTime);
        App.log(lastPlaybackTime);

        if($.videoPlayer.currentPlaybackTime < lastPlaybackTime) {
            lastPlaybackTime = 0;
        }

        if($.videoPlayer.currentPlaybackTime - lastPlaybackTime > 2000) {
            clearInterval(interval);
            $.videoContainer.setOpacity(1);    
            loading = false;
            App.ActivityIndicator.hideInView($.outerContainer);    
        }
        if(!$.videoPlayer.playing) {
            $.videoPlayer.play();
        }
    }, 100);
}

function pause(e) {
    $.videoPlayer.pause();
    $.pauseImage.hide();
    $.playImage.show();
}

function play(e) {
    $.videoPlayer.play();
    $.playImage.hide();
    $.pauseImage.show();
}

function onPlaybackstate(e) {
    if(e.playbackState === Titanium.Media.VIDEO_PLAYBACK_STATE_INTERRUPTED) {
        App.log('VIDEO_PLAYBACK_STATE_INTERRUPTED');
    } else if(e.playbackState === Titanium.Media.VIDEO_PLAYBACK_STATE_PAUSED) {
        App.log('VIDEO_PLAYBACK_STATE_PAUSED');
    } else if(e.playbackState === Titanium.Media.VIDEO_PLAYBACK_STATE_PLAYING) {
        App.log('VIDEO_PLAYBACK_STATE_PLAYING');
    } else if(e.playbackState === Titanium.Media.VIDEO_PLAYBACK_STATE_SEEKING_BACKWARD) {
        App.log('VIDEO_PLAYBACK_STATE_SEEKING_BACKWARD');
    } else if(e.playbackState === Titanium.Media.VIDEO_PLAYBACK_STATE_SEEKING_FORWARD) {
        App.log('VIDEO_PLAYBACK_STATE_SEEKING_FORWARD');
    } else if(e.playbackState === Titanium.Media.VIDEO_PLAYBACK_STATE_STOPPED) {
        App.log('VIDEO_PLAYBACK_STATE_STOPPED');
    }
}

function onOpen(e) {
    if(OS_ANDROID) {
        var activity = this.activity;
        activity.addEventListener('stop', function() {
            App.log('Window stopped!!');
            if($.videoPlayer.currentPlaybackTime > 0) {
                lastPlaybackTime = $.videoPlayer.currentPlaybackTime;    
            }
            App.log(lastPlaybackTime);
            if(!loading) {
                $.yellowCircle.show();
                $.greenCircle.hide();
                App.ActivityIndicator.showInView($.outerContainer, {
                    backgroundColor: 'transparent',
                    opacity: 1,
                    touchEnabled: false
                });
            }
            $.videoContainer.setOpacity(0);     
        });
        activity.addEventListener('pause', function() {
            App.log('Window paused!!');
            if($.videoPlayer.currentPlaybackTime > 0) {
                lastPlaybackTime = $.videoPlayer.currentPlaybackTime;    
            }
            
            App.log(lastPlaybackTime);
            // $.videoContainer.setOpacity(0);     
        });

    }
}