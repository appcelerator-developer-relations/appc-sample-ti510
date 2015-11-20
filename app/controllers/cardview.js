/**
 * Event listener added in the view.
 * Fired when user taps on the cardUseCompatPadding Label.
 * Toggles cardUseCompatPadding and displays the value.
 */
function cardUseCompatPadding(e) {
	e.source.cardUseCompatPadding = !e.source.cardUseCompatPadding;

	$.cardUseCompatPadding.text = 'cardUseCompatPadding: ' + (e.source.cardUseCompatPadding ? 'true' : 'false');
}

/**
 * Event listener added in the view.
 * Fired when user taps on the cardPreventCornerOverlap Label.
 * Toggles cardPreventCornerOverlap and displays the value.
 */
function cardPreventCornerOverlap(e) {

	// Default (undefined) behaviour is true as well
	e.source.cardPreventCornerOverlap = !(e.source.cardPreventCornerOverlap === undefined || e.source.cardPreventCornerOverlap === true);

	$.cardPreventCornerOverlap.text = 'cardPreventCornerOverlap: ' + (e.source.cardPreventCornerOverlap ? 'true' : 'false');
}

/**
 * Event listener added in the view.
 * Fired when user changes the first Slider.
 * Changes the cardElevation and displays the value.
 */
function cardElevation(e) {

	// Because it's set in XML the initial value will be a string
	var cardElevation = parseInt(e.value, 10);

	$.cardElevation.cardElevation = cardElevation;

	$.cardElevationLabel.text = 'cardElevation: ' + cardElevation;
}

/**
 * Event listener added in the view.
 * Fired when user changes the first Slider.
 * Changes the cardElevation and displays the value.
 */
function cardMaxElevation(e) {

	// Because it's set in XML the initial value will be a string
	var cardElevation = parseInt(e.value, 10);

	$.cardMaxElevation.cardElevation = cardElevation;

	$.cardMaxElevation.text = 'cardElevation: ' + cardElevation + '\ncardMaxElevation: 50';
}
