

exports.showInView = function(view, opts) {

	opts = opts || {};
	
	if(!opts.opacity) {
		opts.opacity = 0.7;
	}
	if(!opts.backgroundColor) {
		opts.backgroundColor = '#000';
	}
	if(_.isUndefined(opts.touchEnabled)) {
		opts.touchEnabled = true;
	}

	var loadingView = Ti.UI.createView({
		width: '100%',
		height: '100%',
		top: '0',
		left: '0',
		backgroundColor: opts.backgroundColor,
		opacity: 0,
		zIndex: 2000,
		touchEnabled: opts.touchEnabled
	});

	var activityIndicator = Ti.UI.createActivityIndicator({
		width: Ti.UI.SIZE,
		height: Ti.UI.SIZE,
		color: 'white',
		zIndex: 2001,
		backgroundColor: 'transparent'
	});

	if(OS_IOS) {
		activityIndicator.style = Ti.UI.iPhone.ActivityIndicatorStyle.BIG;
	}
	else {
		activityIndicator.style = Ti.UI.ActivityIndicatorStyle.BIG;
	}

	loadingView._loading = true;
	loadingView.add(activityIndicator);
	view.add(loadingView);
	activityIndicator.show();
	loadingView.show();

	var animation = Ti.UI.createAnimation({
		opacity: opts.opacity,
		duration: 250
	});
	loadingView._animation = animation;
	loadingView._animating = true;
	loadingView._removed = false;
	loadingView.animate(animation, function(e) {
		loadingView._animating = false;
	});
};

exports.hideInView = function(view) {
	var children = view.getChildren();
	for(var i = 0; i < children.length; ++i) {
		if(children[i]._loading) {
			if(children[i]._animating) {
				// App.log('Animation not complete');
				children[i]._animation.addEventListener('complete', function(e) {
					// App.log('Animation completed event');
					animateIndicatorView(view, children[i]);
				});
				setTimeout(function() {
					if(!children[i]._animating && !children[i]._removed) {
						animateIndicatorView(view, children[i]);
					}
				}, 250);
			} else {
				// App.log('Animation complete');
				animateIndicatorView(view, children[i]);
			}		
			break;
		}
	}
};

function animateIndicatorView(parent, indicator) {
	indicator._removed = true;
	var animation = Ti.UI.createAnimation({
		opacity: 0,
		duration: 250
	});
	indicator.animate(animation, function(e) {
		parent.remove(indicator);		
	});
}

var _indicator = null;
var _opened = false;

exports.show = function() {
	if(!_indicator) {
		_indicator = Alloy.createController('activity_indicator');
		_indicator.getView().addEventListener('open', function(e) {
			_opened = true;
		});

		if(OS_ANDROID) {
			_indicator.getView().addEventListener('android:back', function(e) {
				_indicator.getView().close({
					animated: true,
					activityExitAnimation: Ti.Android.R.anim.fade_out
				});
			});
		}
	}
	// _indicator.getView().setExitOnClose(true);
	_.defer(function() {
		

		if(OS_IOS) {
			_indicator.getView().open();	
		} else {
			_indicator.getView().open({
				animated: true,
				activityEnterAnimation: Ti.Android.R.anim.fade_in 
			});
		}
		
	});	
};

exports.hide = function(callback) {
	if(_indicator) {

		function onClose() {
			_indicator.getView().removeEventListener('close', onClose);
			if(_.isFunction(callback)) {
				callback();
			}
		}

		if(!_opened) {
			setTimeout(function() {
				exports.hide();
			}, 100);
			return;
		}
		_.defer(function() {
			_opened = false;
			// _indicator.getView().setExitOnClose(false);
			_indicator.getView().addEventListener('close', onClose);

			if(OS_IOS) {
				_indicator.getView().close();
			} else {
				_indicator.getView().close({
					animated: true,
					activityExitAnimation: Ti.Android.R.anim.fade_out
				});
			}
		});		
	}
};


