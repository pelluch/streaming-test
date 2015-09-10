var args = arguments[0] || {};
App.ActivityIndicator.showInView($.getView(), {
    touchEnabled: false,
    opacity: 1,
    backgroundColor: '#0c242f'
});

$.videoPlayer.addEventListener('load', function() {
    App.ActivityIndicator.hideInView($.getView());
});
