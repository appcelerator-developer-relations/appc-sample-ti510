var log = require('log');

/**
 * I wrap code that executes on creation in a self-executing function just to
 * keep it organised, not to protect global scope like it would in alloy.js
 */
(function constructor(args) {

	if (OS_ANDROID) {

		// Apply a "hack" to have tab-specific menu items in a TabGroup
		if (Alloy.Globals.isSupported) {

			$.index.addEventListener('open', function(e) {

				// Will be called to (re)populate the menu
				$.index.activity.onCreateOptionsMenu = function(e) {

					// Pass it on to the activeTab's window
					if ($.index.activeTab.window.activity.onCreateOptionsMenu) {
						$.index.activeTab.window.activity.onCreateOptionsMenu(e);
					}
				};

				// Will call onCreateOptionsMenu
				$.index.activity.invalidateOptionsMenu();
			});

			// When the TabGroup or a Tab gains focus
			$.index.addEventListener('focus', function(e) {

				// Tab didn't change
				if (!e.previousTab || e.previousTab === e.tab) {
					return;
				}

				// Will call onCreateOptionsMenu
				$.index.activity.invalidateOptionsMenu();
			});

			// For Titanium < 5.1 open the Android window so demonstrate AppCompat updates
		} else {
			return Alloy.createController('android').getView().open();
		}
	}

	// Unless we're on Android, open either the TabGroup or "Not Supported" Window depending on
	// the Alloy.Globals.isSupported flag used in index.xml
	$.index.open();

})(arguments[0] || {});