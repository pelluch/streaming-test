var args = arguments[0] || {};
var setHeight = false;

function onPostlayout(e) {
    if(setHeight) return;
    setHeight = true;
    Ti.API.info(this.size.height);
    var newHeight = this.size.width*0.5633802816901409;
    var containerHeight = this.size.width*0.6;
    containerHeight.setBackgroundColor('blue');
    containerHeight.setOpacity(1);
    outerContainer
    if(OS_ANDROID) {
        $.videoContainer.setHeight(Math.floor(newHeight));
    } else {
        $.videoContainer.setHeight(Math.floor(newHeight));
    }
}

function onLoad(e) {
    $.videoContainer.setOpacity(1);
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

