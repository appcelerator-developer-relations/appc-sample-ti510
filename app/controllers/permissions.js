var dialogs = require('alloy/dialogs');
var log = require('log');

/**
 * Event listener added in the view.
 * Fired when user taps on edit-button to open the app settings.
 */
function editPermissions(e) {

	if (OS_IOS) {
		Ti.Platform.openURL(Ti.App.iOS.applicationOpenSettingsURL);
	}

	if (OS_ANDROID) {
		var intent = Ti.Android.createIntent({
			action: 'android.settings.APPLICATION_SETTINGS',
		});
		intent.addFlags(Ti.Android.FLAG_ACTIVITY_NEW_TASK);
		Ti.Android.currentActivity.startActivity(intent);
	}
}

/**
 * Event listener added in the view.
 * Fired when user taps on the Ti.Calendar button.
 */
function calendar(e) {

	// The new cross-platform way to check permissions
	var hasCalendarPermissions = Ti.Calendar.hasCalendarPermissions();
	log.args('Ti.Calendar.hasCalendarPermissions', hasCalendarPermissions);

	if (hasCalendarPermissions) {

		// We have to actually use a Ti.Calendar method for the permissions to be generated
		// FIXME: https://jira.appcelerator.org/browse/TIMOB-19933
		log.args('Ti.Calendar.getAllCalendars', Ti.Calendar.getAllCalendars());

		return alert('You already have permission.');
	}

	// On iOS we can get information on the reason why we might not have permission
	if (OS_IOS) {

		// Map constants to names
		var map = {};
		map[Ti.Calendar.AUTHORIZATION_AUTHORIZED] = 'AUTHORIZATION_AUTHORIZED';
		map[Ti.Calendar.AUTHORIZATION_DENIED] = 'AUTHORIZATION_DENIED';
		map[Ti.Calendar.AUTHORIZATION_RESTRICTED] = 'AUTHORIZATION_RESTRICTED';
		map[Ti.Calendar.AUTHORIZATION_UNKNOWN] = 'AUTHORIZATION_UNKNOWN';

		// Available since Ti 3.1.0
		var eventsAuthorization = Ti.Calendar.eventsAuthorization;
		log.args('Ti.Calendar.eventsAuthorization', 'Ti.Calendar.' + map[eventsAuthorization]);

		if (eventsAuthorization === Ti.Calendar.AUTHORIZATION_RESTRICTED) {
			return alert('Because permission are restricted by some policy which you as user cannot change, we don\'t request as that might also cause issues.');

		} else if (eventsAuthorization === Ti.Calendar.AUTHORIZATION_DENIED) {
			return dialogs.confirm({
				title: 'You denied permission before',
				message: 'We don\'t request again as that won\'t show the dialog anyway. Instead, press Yes to open the Settings App to grant permission there.',
				callback: editPermissions
			});
		}
	}

	// The new cross-platform way to request permissions
	Ti.Calendar.requestCalendarPermissions(function(e) {
		log.args('Ti.Calendar.requestCalendarPermissions', e);

		if (e.success) {

			// Instead, probably call the same method you call if hasCalendarPermissions() is true
			alert('You granted permission.');

		} else if (OS_ANDROID) {
			alert('You don\'t have the required uses-permissions in tiapp.xml or you denied permission for now, forever or the dialog did not show at all because you denied forever before.');

		} else {

			// We already check AUTHORIZATION_DENIED earlier so we can be sure it was denied now and not before
			alert('You denied permission.');
		}
	});
}

/**
 * Event listener added in the view.
 * Fired when user taps on the Ti.Contacts button.
 */
function contacts(e) {

	// The new cross-platform way to check permissions
	var hasContactsPermissions = Ti.Contacts.hasContactsPermissions();
	log.args('Ti.Contacts.hasContactsPermissions', hasContactsPermissions);

	if (hasContactsPermissions) {

		// We have to actually use a Ti.Contacts method for the permissions to be generated
		// FIXME: https://jira.appcelerator.org/browse/TIMOB-19933
		if (OS_IOS) {
			log.args('Ti.Contacts.getAllGroups', Ti.Contacts.getAllGroups());
		}

		return alert('You already have permission.');
	}

	// On iOS we can get information on the reason why we might not have permission
	if (OS_IOS) {

		// Map constants to names
		var map = {};
		map[Ti.Contacts.AUTHORIZATION_AUTHORIZED] = 'AUTHORIZATION_AUTHORIZED';
		map[Ti.Contacts.AUTHORIZATION_DENIED] = 'AUTHORIZATION_DENIED';
		map[Ti.Contacts.AUTHORIZATION_RESTRICTED] = 'AUTHORIZATION_RESTRICTED';
		map[Ti.Contacts.AUTHORIZATION_UNKNOWN] = 'AUTHORIZATION_UNKNOWN';

		// Available since Ti 2.1.3 and always returns AUTHORIZATION_AUTHORIZED on iOS<6 and Android
		var contactsAuthorization = Ti.Contacts.contactsAuthorization;
		log.args('Ti.Contacts.contactsAuthorization', 'Ti.Contacts.' + map[contactsAuthorization]);

		if (contactsAuthorization === Ti.Contacts.AUTHORIZATION_RESTRICTED) {
			return alert('Because permission are restricted by some policy which you as user cannot change, we don\'t request as that might also cause issues.');

		} else if (contactsAuthorization === Ti.Calendar.AUTHORIZATION_DENIED) {
			return dialogs.confirm({
				title: 'You denied permission before',
				message: 'We don\'t request again as that won\'t show the dialog anyway. Instead, press Yes to open the Settings App to grant permission there.',
				callback: editPermissions
			});
		}
	}

	// The new cross-platform way to request permissions
	Ti.Contacts.requestContactsPermissions(function(e) {
		log.args('Ti.Contacts.requestContactsPermissions', e);

		if (e.success) {

			// Instead, probably call the same method you call if hasContactsPermissions() is true
			alert('You granted permission.');

		} else if (OS_ANDROID) {
			alert('You don\'t have the required uses-permissions in tiapp.xml or you denied permission for now, forever or the dialog did not show at all because you denied forever before.');

		} else {

			// We already check AUTHORIZATION_DENIED earlier so we can be sure it was denied now and not before
			alert('You denied permission.');
		}
	});
}

/**
 * Event listener added in the view.
 * Fired when user taps on the Ti.Geolocation button.
 */
function geolocation(e) {

	// Let's include some related properties for iOS we already had
	if (OS_IOS) {

		// Available since Ti 5.0
		log.args('Ti.Geolocation.allowsBackgroundLocationUpdates', Ti.Geolocation.allowsBackgroundLocationUpdates);

		// Available since Ti 0.x,
		// Always returns true on Android>2.2
		log.args('Ti.Geolocation.locationServicesEnabled', Ti.Geolocation.locationServicesEnabled);
	}

	// The new cross-platform way to check permissions
	// The first argument is required on iOS and ignored on other platforms
	var hasLocationPermissions = Ti.Geolocation.hasLocationPermissions(Ti.Geolocation.AUTHORIZATION_ALWAYS);
	log.args('Ti.Geolocation.hasLocationPermissions', hasLocationPermissions);

	if (hasLocationPermissions) {
		return alert('You already have permission.');
	}

	// On iOS we can get information on the reason why we might not have permission
	if (OS_IOS) {

		// Map constants to names
		var map = {};
		map[Ti.Geolocation.AUTHORIZATION_ALWAYS] = 'AUTHORIZATION_ALWAYS';
		map[Ti.Geolocation.AUTHORIZATION_AUTHORIZED] = 'AUTHORIZATION_AUTHORIZED';
		map[Ti.Geolocation.AUTHORIZATION_DENIED] = 'AUTHORIZATION_DENIED';
		map[Ti.Geolocation.AUTHORIZATION_RESTRICTED] = 'AUTHORIZATION_RESTRICTED';
		map[Ti.Geolocation.AUTHORIZATION_UNKNOWN] = 'AUTHORIZATION_UNKNOWN';
		map[Ti.Geolocation.AUTHORIZATION_WHEN_IN_USE] = 'AUTHORIZATION_WHEN_IN_USE';

		// Available since Ti 0.8 for iOS and Ti 4.1 for Windows
		// Always returns AUTHORIZATION_UNKNOWN on iOS<4.2
		var locationServicesAuthorization = Ti.Geolocation.locationServicesAuthorization;
		log.args('Ti.Geolocation.locationServicesAuthorization', 'Ti.Geolocation.' + map[locationServicesAuthorization]);

		if (locationServicesAuthorization === Ti.Geolocation.AUTHORIZATION_RESTRICTED) {
			return alert('Because permission are restricted by some policy which you as user cannot change, we don\'t request as that might also cause issues.');

		} else if (locationServicesAuthorization === Ti.Calendar.AUTHORIZATION_DENIED) {
			return dialogs.confirm({
				title: 'You denied permission before',
				message: 'We don\'t request again as that won\'t show the dialog anyway. Instead, press Yes to open the Settings App to grant permission there.',
				callback: editPermissions
			});
		}
	}

	// The new cross-platform way to request permissions
	// The first argument is required on iOS and ignored on other platforms
	Ti.Geolocation.requestLocationPermissions(Ti.Geolocation.AUTHORIZATION_ALWAYS, function(e) {
		log.args('Ti.Geolocation.requestLocationPermissions', e);

		if (e.success) {

			// Instead, probably call the same method you call if hasLocationPermissions() is true
			alert('You granted permission.');

		} else if (OS_ANDROID) {
			alert('You denied permission for now, forever or the dialog did not show at all because it you denied forever before.');

		} else {

			// We already check AUTHORIZATION_DENIED earlier so we can be sure it was denied now and not before
			Ti.UI.createAlertDialog({
				title: 'You denied permission.',

				// We also end up here if the NSLocationAlwaysUsageDescription is missing from tiapp.xml in which case e.error will say so
				message: e.error
			}).show();
		}
	});
}

/**
 * Event listener added in the view.
 * Fired when user taps on the Ti.Media button.
 */
function media(e) {

	// This is now the cross-platform way to check permissions.
	// The above is still useful as it provides the reason of denial.
	var hasCameraPermissions = Ti.Media.hasCameraPermissions();
	log.args('Ti.Media.hasCameraPermissions', hasCameraPermissions);

	if (hasCameraPermissions) {

		// We have to actually use Ti.Media.showCamera for the permissions to be generated
		// FIXME: https://jira.appcelerator.org/browse/TIMOB-19933
		return Ti.Media.showCamera({
			success: function(e) {
				log.args('Ti.Media.showCamera:success', e);
			}
		});
	}

	// This iOS-only property is available since Ti 4.0
	if (OS_IOS) {

		// Map constants to names
		var map = {};
		map[Ti.Media.CAMERA_AUTHORIZATION_AUTHORIZED] = 'CAMERA_AUTHORIZATION_AUTHORIZED';
		map[Ti.Media.CAMERA_AUTHORIZATION_DENIED] = 'CAMERA_AUTHORIZATION_DENIED';
		map[Ti.Media.CAMERA_AUTHORIZATION_RESTRICTED] = 'CAMERA_AUTHORIZATION_RESTRICTED';
		map[Ti.Media.CAMERA_AUTHORIZATION_NOT_DETERMINED] = 'CAMERA_AUTHORIZATION_NOT_DETERMINED';

		var cameraAuthorizationStatus = Ti.Media.cameraAuthorizationStatus;
		log.args('Ti.Media.cameraAuthorizationStatus', 'Ti.Media.' + map[cameraAuthorizationStatus]);

		if (cameraAuthorizationStatus === Ti.Media.CAMERA_AUTHORIZATION_RESTRICTED) {
			return alert('Because permission are restricted by some policy which you as user cannot change, we don\'t request as that might also cause issues.');

		} else if (cameraAuthorizationStatus === Ti.Media.CAMERA_AUTHORIZATION_DENIED) {
			return dialogs.confirm({
				title: 'You denied permission before',
				message: 'We don\'t request again as that won\'t show the dialog anyway. Instead, press Yes to open the Settings App to grant permission there.',
				callback: editPermissions
			});
		}
	}

	// FIXME: https://jira.appcelerator.org/browse/TIMOB-19851
	// You will be prompted to grant to permissions. If you deny either one weird things happen
	Ti.Media.requestCameraPermissions(function(e) {
		log.args('Ti.Media.requestCameraPermissions', e);

		if (e.success) {

			// Instead, probably call the same method you call if hasCameraPermissions() is true
			alert('You granted permission.');

		} else if (OS_ANDROID) {
			alert('You don\'t have the required uses-permissions in tiapp.xml or you denied permission for now, forever or the dialog did not show at all because you denied forever before.');

		} else {

			// We already check AUTHORIZATION_DENIED earlier so we can be sure it was denied now and not before
			alert('You denied permission.');
		}
	});
}