var args = arguments[0] || {};
var setHeight = false;

var measurement = require('alloy/measurement');

var platformWidth = measurement.pxToDP(Ti.Platform.displayCaps.platformWidth);
var platformHeight = measurement.pxToDP(Ti.Platform.displayCaps.platformHeight);
var lastPlaybackTime = 0;

Ti.Gesture.addEventListener('orientationchange', function(e) {
    if(e.orientation !== Ti.UI.LANDSCAPE_LEFT && e.orientation !== Ti.UI.LANDSCAPE_RIGHT) {
        $.videoContainer.setHeight(Math.floor(platformWidth*0.95*0.9*0.5633802816901409));
        $.videoPlayer.setHeight(Math.floor(platformWidth*0.95*0.9*0.5633802816901409));
        $.videoPlayer.setWidth(Math.floor(platformWidth*0.95*0.9));
        $.outerContainer.setHeight(Math.floor(0.8*0.9*0.95*platformWidth));
    } else {
        $.videoContainer.setHeight(Math.floor(platformHeight*0.95*0.9*0.5633802816901409));
        $.videoPlayer.setHeight(Math.floor(platformHeight*0.95*0.9*0.5633802816901409));
        $.videoPlayer.setWidth(Math.floor(platformHeight*0.95*0.9));
        $.outerContainer.setHeight(Math.floor(0.6*0.9*0.95*platformHeight));
    }
    
    $.videoPlayer.scalingMode = Titanium.Media.VIDEO_SCALING_ASPECT_FILL;
    // $.videoPlayer.setWidth(400);
});

function onPostlayout(e) {
    if(setHeight) return;
    setHeight = true;
    var newHeight = this.size.width*0.5633802816901409;
    var containerHeight = this.size.width*0.8;
    $.outerContainer.setBackgroundColor('#0c242f');
    $.outerContainer.setOpacity(1);
    // $.videoContainer.setOpacity(1);
    $.outerContainer.setHeight(containerHeight);
    if(OS_ANDROID) {
        $.videoContainer.setHeight(Math.floor(newHeight));
    } else {
        $.videoContainer.setHeight(Math.floor(newHeight));
    }
}

function onLoad(e) {
    var interval;
    interval = setInterval(function() {
        App.log($.videoPlayer.currentPlaybackTime);
        App.log(lastPlaybackTime);

        if($.videoPlayer.currentPlaybackTime < lastPlaybackTime) {
            lastPlaybackTime = 0;
        }

        if($.videoPlayer.currentPlaybackTime - lastPlaybackTime > 2000) {
            clearInterval(interval);
            $.videoContainer.setOpacity(1);        
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
            
            App.log(lastPlaybackTime);
            $.videoContainer.setOpacity(0);     
        });
        activity.addEventListener('pause', function() {
            App.log('Window paused!!');
            lastPlaybackTime = $.videoPlayer.currentPlaybackTime;
            App.log(lastPlaybackTime);
            // $.videoContainer.setOpacity(0);     
        });

    }
}