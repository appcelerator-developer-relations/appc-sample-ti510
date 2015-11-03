var dialogs = require('alloy/dialogs');

var log = require('log');

function calendar(e) {

	// This iOS-only property is available since Ti 3.1.0
	if (OS_IOS) {
		var eventsAuthorization = Ti.Calendar.eventsAuthorization;

		['AUTHORIZATION_AUTHORIZED', 'AUTHORIZATION_DENIED', 'AUTHORIZATION_RESTRICTED', 'AUTHORIZATION_UNKNOWN'].some(function(constant) {

			if (eventsAuthorization === Ti.Calendar[constant]) {
				log.args('Ti.Calendar.eventsAuthorization', 'Ti.Calendar.' + constant);
				return true;
			}

		});

		if (eventsAuthorization === Ti.Calendar.AUTHORIZATION_RESTRICTED) {
			return alert('Because permission are restricted and you cannot change this, we don\'t request as that might also cause issues.');

		} else if (eventsAuthorization === Ti.Calendar.AUTHORIZATION_DENIED) {
			return dialogs.confirm({
				title: 'You denied permission before',
				message: 'We don\'t request again as that won\'t show the dialog anyway. Instead, press Yes to open the Settings App to grant permission there.',
				callback: function() {
					Ti.Platform.openURL('app-settings:');
				}
			});
		}
	}

	// This is now the prefered cross-platform way to check permissions although
	// the above is still useful on iOS as you can see
	var hasCalendarPermissions = Ti.Calendar.hasCalendarPermissions();
	log.args('Ti.Calendar.hasCalendarPermissions', hasCalendarPermissions);

	if (hasCalendarPermissions) {
		return alert('You already have permission.');
	}

	Ti.Calendar.requestCalendarPermissions(function(e) {
		log.args('Ti.Calendar.requestCalendarPermissions', e);

		if (e.success) {
			alert('You granted permission.');

		} else if (OS_ANDROID) {
			alert('You don\'t have the required uses-permissions in tiapp.xml or you denied permission for now, forever or the dialog did not show at all because you denied forever before.');

		} else {

			// We already check AUTHORIZATION_DENIED earlier so we can be sure it was denied now and not before
			alert('You denied permission.');
		}
	});
}

function contacts(e) {

	// This property is available since Ti 2.1.3 and always returns AUTHORIZATION_AUTHORIZED on iOS<6 and Android
	var contactsAuthorization = Ti.Contacts.contactsAuthorization;

	['AUTHORIZATION_AUTHORIZED', 'AUTHORIZATION_DENIED', 'AUTHORIZATION_RESTRICTED', 'AUTHORIZATION_UNKNOWN'].some(function(constant) {

		if (contactsAuthorization === Ti.Contacts[constant]) {
			log.args('Ti.Contacts.contactsAuthorization', 'Ti.Contacts.' + constant);
			return true;
		}

	});

	if (contactsAuthorization === Ti.Contacts.AUTHORIZATION_RESTRICTED) {
		return alert('Because permission are restricted and you cannot change this, we don\'t request as that might also cause issues.');

	} else if (contactsAuthorization === Ti.Calendar.AUTHORIZATION_DENIED) {
		return dialogs.confirm({
			title: 'You denied permission before',
			message: 'We don\'t request again as that won\'t show the dialog anyway. Instead, press Yes to open the Settings App to grant permission there.',
			callback: function() {
				Ti.Platform.openURL('app-settings:');
			}
		});
	}

	// This is now the prefered cross-platform way to check permissions although
	// the above might still be useful on iOS as it provides the reason of denial
	var hasContactsPermissions = Ti.Contacts.hasContactsPermissions();
	log.args('Ti.Contacts.hasContactsPermissions', hasContactsPermissions);

	if (hasContactsPermissions) {
		return alert('You already have permission.');
	}

	Ti.Contacts.requestContactsPermissions(function(e) {
		log.args('Ti.Contacts.requestContactsPermissions', e);

		if (e.success) {
			alert('You granted permission.');

		} else if (OS_ANDROID) {
			alert('You don\'t have the required uses-permissions in tiapp.xml or you denied permission for now, forever or the dialog did not show at all because you denied forever before.');

		} else {

			// We already check AUTHORIZATION_DENIED earlier so we can be sure it was denied now and not before
			alert('You denied permission.');
		}
	});
}

function geolocation(e) {

	if (OS_IOS) {

		// This iOS-only property is available since Ti 5.0
		log.args('Ti.Geolocation.allowsBackgroundLocationUpdates', Ti.Geolocation.allowsBackgroundLocationUpdates);
	}

	// This iOS-only property is available forever and will always be true on Android>2.2
	log.args('Ti.Geolocation.locationServicesEnabled', Ti.Geolocation.locationServicesEnabled);

	// The first argument is required on iOS and ignored on other platforms
	var hasLocationPermissions = Ti.Geolocation.hasLocationPermissions(Ti.Geolocation.AUTHORIZATION_ALWAYS);
	log.args('Ti.Geolocation.hasLocationPermissions', hasLocationPermissions);

	if (hasLocationPermissions) {
		return alert('You already have permission.');
	}

	// This property is available since Ti 0.8 for iOS and Ti 4.1 for Windows
	// Always returns AUTHORIZATION_UNKNOWN on iOS<4.2
	if (OS_IOS || OS_WINDOWS) {
		var locationServicesAuthorization = Ti.Geolocation.locationServicesAuthorization;

		['AUTHORIZATION_ALWAYS', 'AUTHORIZATION_AUTHORIZED', 'AUTHORIZATION_DENIED', 'AUTHORIZATION_RESTRICTED', 'AUTHORIZATION_UNKNOWN', 'AUTHORIZATION_WHEN_IN_USE'].some(function(constant) {

			if (locationServicesAuthorization === Ti.Geolocation[constant]) {
				log.args('Ti.Geolocation.locationServicesAuthorization', 'Ti.Calendar.' + constant);
				return true;
			}

		});

		if (locationServicesAuthorization === Ti.Geolocation.AUTHORIZATION_RESTRICTED) {
			return alert('Because permission are restricted and you cannot change this, we don\'t request as that might also cause issues.');

		} else if (locationServicesAuthorization === Ti.Calendar.AUTHORIZATION_DENIED) {
			return dialogs.confirm({
				title: 'You denied permission before',
				message: 'We don\'t request again as that won\'t show the dialog anyway. Instead, press Yes to open the Settings App to grant permission there.',
				callback: function() {
					Ti.Platform.openURL('app-settings:');
				}
			});
		}
	}

	// The first argument is required on iOS and ignored on other platforms
	Ti.Geolocation.requestLocationPermissions(Ti.Geolocation.AUTHORIZATION_ALWAYS, function(e) {
		log.args('Ti.Geolocation.requestLocationPermissions', e);

		if (e.success) {
			alert('You granted permission.');

		} else if (OS_ANDROID) {
			alert('You denied permission for now, forever or the dialog did not show at all because it you denied forever before.');

			// FIXME: https://jira.appcelerator.org/browse/TIMOB-19850
			// If the required NSLocation*UsageDescription is missing in tiapp.xml this function will not be called back
		} else {

			// We already check AUTHORIZATION_DENIED earlier so we can be sure it was denied now and not before
			alert('You denied permission.');
		}
	});
}

function media(e) {

	// This iOS-only property is available since Ti 4.0
	if (OS_IOS) {
		var cameraAuthorizationStatus = Ti.Media.cameraAuthorizationStatus;

		['CAMERA_AUTHORIZATION_AUTHORIZED', 'CAMERA_AUTHORIZATION_DENIED', 'CAMERA_AUTHORIZATION_RESTRICTED', 'CAMERA_AUTHORIZATION_NOT_DETERMINED'].some(function(constant) {

			if (cameraAuthorizationStatus === Ti.Media[constant]) {
				log.args('Ti.Media.cameraAuthorizationStatus', 'Ti.Media.' + constant);
				return true;
			}

		});

		if (cameraAuthorizationStatus === Ti.Media.CAMERA_AUTHORIZATION_RESTRICTED) {
			return alert('Because permission are restricted and you cannot change this, we don\'t request as that might also cause issues.');

		} else if (cameraAuthorizationStatus === Ti.Media.CAMERA_AUTHORIZATION_DENIED) {
			return dialogs.confirm({
				title: 'You denied permission before',
				message: 'We don\'t request again as that won\'t show the dialog anyway. Instead, press Yes to open the Settings App to grant permission there.',
				callback: function() {
					Ti.Platform.openURL('app-settings:');
				}
			});
		}
	}

	// This is now the prefered cross-platform way to check permissions although
	// the above might still be useful on iOS as it provides the reason of denial
	var hasCameraPermissions = Ti.Media.hasCameraPermissions();
	log.args('Ti.Media.hasCameraPermissions', hasCameraPermissions);

	if (hasCameraPermissions) {
		return alert('You already have permission.');
	}

	// FIXME: https://jira.appcelerator.org/browse/TIMOB-19851
	// You will be prompted to grant to permissions. If you deny either one weird things happen
	Ti.Media.requestCameraPermissions(function(e) {
		log.args('Ti.Media.requestCameraPermissions', e);

		if (e.success) {
			alert('You granted permission.');

		} else if (OS_ANDROID) {
			alert('You don\'t have the required uses-permissions in tiapp.xml or you denied permission for now, forever or the dialog did not show at all because you denied forever before.');

		} else {

			// We already check AUTHORIZATION_DENIED earlier so we can be sure it was denied now and not before
			alert('You denied permission.');
		}
	});
}