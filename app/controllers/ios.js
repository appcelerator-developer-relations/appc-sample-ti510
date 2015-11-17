// Require the module bundled with the Titanium SDK and added to tiapp.xml
var dialog = require('ti.safaridialog');

var log = require('log');
var async = require('async');

var URL = 'http://www.appcelerator.com/blog/2015/11/titanium-5-1-0-sample-app/';

var progressRunning = false;
var progressAsc = true;

/**
 * I wrap code that executes on creation in a self-executing function just to
 * keep it organised, not to protect global scope like it would in alloy.js
 */
(function constructor(args) {

	// Fired when the Safari Dialog opens
	dialog.addEventListener('open', function(e) {
		log.args('ti.safaridialog:open', e);
	});

	// Fired when the Safari Dialog closes
	dialog.addEventListener('close', function(e) {
		log.args('ti.safaridialog:close', e);
	});

	// Call our helper to set up interactive notifications
	registerUserNotificationSettings();

	// Fired when a user selects an interactive notification action
	Ti.App.iOS.addEventListener('localnotificationaction', function(e) {
		log.args('Ti.App.iOS.addEventListener:localnotificationaction', e);
	});

	// If app-thinning is enabled images will no longer be accessable as file
	var file = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'images/tabIcon.png');

	if (file.exists()) {
		$.thinningHelp.text = 'App Thinning is now disabled in tiapp.xml, as it was before Ti 5.1 and still is by default. You can get images via Ti.Filesystem.';
		$.file.text = 'file.exists() true';
	} else {
		$.thinningHelp.text = 'App Thinning is now enabled in tiapp.xml. Image paths are hased to match the generated aseet catalog name so that you can use them in ImageViews and backgrounds as normal. You can no longer get images via Ti.Filesystem:';
		$.file.text = 'file.exists() false';
	}

})(arguments[0] || {});

/**
 * Event listener added in the view.
 * Fired when user taps on the Ti.Platform.openURL() button.
 * Opens the blog post in the Safari App.
 */
function openSafari() {
	Ti.Platform.openURL(URL);
}

/**
 * Event listener added in the view.
 * Fired when user taps on the ti.safaridialog.open() button.
 * Opens the blog post in the new Safari Dialog.
 */
function openSafariDialog() {

	// Always check if the iOS version supports it
	var isSupported = dialog.isSupported();
	log.args('ti.safaridialog.isSupported()', isSupported);

	if (!isSupported) {
		return alert('Your iOS version does not support the Safari Dialog.');
	}

	dialog.open({
		url: URL,
		entersReaderIfAvailable: true,
		title: 'Appcelerator',

		// The color for the buttons
		tintColor: Alloy.CFG.brandPrimary
	});

	// After 10 seconds
	setTimeout(function() {

		// Check if the dialog is still open
		var opened = dialog.opened;
		log.args('ti.safaridialog.opened', opened);

		if (opened) {

			// Programmatically close it
			dialog.close();
		}

	}, 10000);
}

/**
 * Event listener added in the view.
 * Fired when user taps on one of the alertDialog buttons.
 * Shows an alert dialog with different options.
 */
function alertDialog(e) {

	// The style name is the title of the Button
	var styleName = e.source.title;

	var dialog = Ti.UI.createAlertDialog({
		title: 'Dialog Title',
		message: 'Dialog Message',

		// Map the style name to the actual constant
		style: Ti.UI.iPhone.AlertDialogStyle[styleName]
	});

	// The LOGIN_AND_PASSWORD_INPUT style has 2 inputs which need to be configured idependently
	if (styleName === 'LOGIN_AND_PASSWORD_INPUT') {
		dialog.loginPlaceholder = 'Tap to enter login';
		dialog.loginKeyboardType = Ti.UI.KEYBOARD_EMAIL;
		dialog.loginReturnKeyType = Ti.UI.RETURNKEY_NEXT;

		dialog.passwordPlaceholder = 'Tap to enter password';
		dialog.passwordKeyboardType = Ti.UI.KEYBOARD_DECIMAL_PAD;
		dialog.passwordReturnKeyType = Ti.UI.RETURNKEY_GO;

	} else {
		dialog.placeholder = 'Tap to enter something';
		dialog.keyboardType = Ti.UI.KEYBOARD_URL;
		dialog.returnKeyType = Ti.UI.RETURNKEY_SEND;
	}

	dialog.addEventListener('click', function(e) {
		log.args('Ti.UI.AlertDialog:click', e);
	});

	dialog.show();
}

/**
 * Event listener added in the view.
 * Fired when user taps on the TEXTINPUT button.
 * Schedules a local interactive notification with new TEXTINPUT behavior.
 * See registerUserNotificationSettings() where we configure the category.
 */
function notification() {

	Ti.App.iOS.scheduleLocalNotification({
		alertBody: 'Select the \'Input\' action.',

		// Notify in 5 seconds
		date: new Date(new Date().getTime() + 5000),

		// Select the sample category registered in registerUserNotificationSettings()
		category: 'sample'
	});

	alert('Now lock the phone or press Home to see the notification in 5s.');
}

/**
 * Helper method to register notification settings.
 */
function registerUserNotificationSettings() {

	// Register notification types and categories
	Ti.App.iOS.registerUserNotificationSettings({
		type: [Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT],
		categories: [

			// Create a category
			Ti.App.iOS.createUserNotificationCategory({
				identifier: 'sample',
				actionsForDefaultContext: [

					// Create an action
					Ti.App.iOS.createUserNotificationAction({
						identifier: 'input',
						title: 'Input',

						// Set the new behavior property to TEXT_INPUT
						behavior: Ti.App.iOS.USER_NOTIFICATION_BEHAVIOR_TEXTINPUT,

						// Set it to background so that it also works on Apple Watch
						activationMode: Ti.App.iOS.USER_NOTIFICATION_ACTIVATION_MODE_BACKGROUND
					}),

					// Create an action
					Ti.App.iOS.createUserNotificationAction({
						identifier: 'default',
						title: 'Default'
					})
				]
			})
		]
	});
}

/**
 * Event listener added in the view.
 * Fired when user taps on one of the ButtonBar labels.
 */
function testThread(e) {

	if (progressRunning) {
		return alert('Wait for the previous run to finish.');
	}

	progressRunning = true;

	// User Underscore to create an array of incremental numbers
	var collection = _.range(Alloy.CFG.threadOperations);

	// UN-OPTIMIZED CODE

	// With main thread DISABLED the calls to $.progress.value will be executed directly.
	// With main thread ENABLED it will wait till all of testThread() is finished,
	// and then execute all calls to $.progress.value which to the user looks like the
	// progressBar goes from start to end (or reverse) at once after the operations are finished.

	if (e.index === 0) {

		log.args('Starting unoptimized operations..');

		collection.forEach(function(model, n) {

			// do something heavy, like creating rows to add to a table
			Ti.Platform.createUUID();

			$.progressBar.value = progressAsc ? n : (Alloy.CFG.threadOperations - 1 - n);

		});

		progressAsc = !progressAsc;
		progressRunning = false;

		log.args('Finished operations..');
	}

	// OPTIMIZED CODE

	// If the switch is on use code optimized for single thread.
	// Result will be ~ same if main thread is DISABLED or ENABLED
	// because each call to $.progress.value will be either executed inmediately (DISABLED)
	// or before the next call to doSomething, which is stacked after it.

	// Use Underscore's _.defer()
	if (e.index === 1) {

		log.args('Starting operations optimized using _.defer() ..');

		function doSomething(n) {

			// We have processed them all.
			if (n >= collection.length) {
				progressAsc = !progressAsc;
				progressRunning = false;

				return log.args('Finished operations..');
			}

			// do something heavy, like creating rows to add to a table
			Ti.Platform.createUUID();

			$.progressBar.value = progressAsc ? n : (Alloy.CFG.threadOperations - 1 - n);

			// Stack a recursive call for the next item.
			// Underscore wrapper for: setTimeout(doSomething.bind(null, n + 1));
			_.defer(doSomething, n + 1);
		}

		// Stack the first call to doSomething for the first (0) item.
		// Underscore wrapper for: setTimeout(doSomething.bind(null, 0));
		_.defer(doSomething, 0);
	}

	// Use Caolan's async utility found in lib/async.js and
	// https://www.npmjs.com/package/async
	if (e.index === 2) {

		log.args('Starting operations optimized using async.eachSeries() ..');

		var n = 0;

		// We use eachSeries() instead of each() because the latter expects the
		// iterator to be async and doesn't stack each call for us.
		async.eachSeries(collection, function iterator(model, callback) {

			// do something heavy, like creating rows to add to a table
			Ti.Platform.createUUID();

			$.progressBar.value = progressAsc ? n : (Alloy.CFG.threadOperations - 1 - n);

			n++;

			callback();

			// Called once done
		}, function callback(err) {

			progressAsc = !progressAsc;
			progressRunning = false;

			log.args('Finished operations..');

		});
	}
}
