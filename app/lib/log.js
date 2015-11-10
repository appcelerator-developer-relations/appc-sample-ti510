/* global ENV_PROD */

var moment = require('alloy/moment');

var Log = module.exports = _.extend({}, Backbone.Events);

Log.history = '';

Log.args = function() {
	_log(arguments);
}

Log.argsWithoutApis = function() {
	_log(arguments, {
		withoutApis: true
	});
}

function _log(args, opts) {
	args = Array.prototype.slice.call(args);
	opts = opts || {};

	// Stringify non-strings
	args = args.map(function(arg) {

		if (typeof arg !== 'string') {
			arg = JSON.stringify(arg, opts.withoutApis ? function(key, val) {

				if (typeof val === 'object' && val !== null && val.apiName) {
					return '[' + val.apiName + ']' + (val.id ? ' #' + val.id : '');
				} else {
					return val;
				}

			} : null, 2);
		}

		return arg;
	});

	var message = args.join(' ');

	// Use error-level for production or they will not show in Xcode console
	console[ENV_PROD ? 'error' : 'info'](message);

	// Add the message to a global variable for controllers/console.js to use
	Log.history = (Log.history || '') + '[' + moment().format('HH:mm:ss.SS') + '] ' + message + '\n\n';

	// Trigger an event for controllers/console.js to listen to and display the log
	Log.trigger('change');
}