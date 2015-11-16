/**
 * Event listener added in the view.
 * Fired when user taps on the view.shlow/hide button.
 * Hides and shows a view using the new reveal effect.
 */
function reveal() {

	if ($.reveal.visible) {
		$.reveal.hide({
			animated: true
		});

	} else {
		$.reveal.show({
			animated: true
		});
	}
}

/**
 * Event listener added in the view.
 * Fired when user taps on the ProgressBar.
 * Fills up the bar to demonstrate the new color property.
 */
function progress(e) {

	var interval = setInterval(function() {

		e.source.value++;

		// Once we've reached the end, clear the interval
		if (e.source.value === e.source.max) {
			clearInterval(interval);
		}

	}, 25);

}

/**
 * Event listener added in the view.
 * Fired when user taps on the ProgressBar.
 * Fills up the bar to demonstrate the new color property.
 */
function openPreferences() {

	// The preferences themselves can be found in platform/android/res/xml/preferences.xml
	Ti.UI.Android.openPreferences();
}