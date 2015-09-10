Alloy.Globals.VERBOSE = true;

module.exports = function() {

  if(Alloy.Globals.VERBOSE === true) {
    var args = arguments;
    var logLevel = args[0];
    var logLevels = [ 'trace', 'debug', 'info', 'warn', 'error' ];
    var startIndex = 1;

    if(logLevels.indexOf(logLevel) === -1) {
      logLevel = 'info';
      startIndex = 0;
    }


    var message = '';
    if(args) {
      for(var i = startIndex; i < args.length; ++i) {

        if(typeof args[i] === 'string') {
          message += args[i];
        }
        else {
          message += JSON.stringify(args[i]);
        }
      }
    }


    if(logLevel === 'trace') {
      Ti.API.trace(message);
    }
    else if(logLevel === 'debug') {
      Ti.API.debug(message);
    }
    else if(logLevel === 'info') {
      Ti.API.info(message);
    }
    else if(logLevel === 'warn') {
      Ti.API.warn(message);
    }
    else if(logLevel === 'error') {
      Ti.API.error(message);
    }
  }
};