function cardUseCompatPadding(e) {
	e.source.cardUseCompatPadding = !e.source.cardUseCompatPadding;

	$.cardUseCompatPadding.text = 'cardUseCompatPadding: ' + (e.source.cardUseCompatPadding ? 'true' : 'false');
}

function cardPreventCornerOverlap(e) {

	// Default (undefined) behaviour is true as well
	e.source.cardPreventCornerOverlap = !(e.source.cardPreventCornerOverlap === undefined || e.source.cardPreventCornerOverlap === true);

	$.cardPreventCornerOverlap.text = 'cardPreventCornerOverlap: ' + (e.source.cardPreventCornerOverlap ? 'true' : 'false');
}

function cardElevation(e) {
	var cardElevation = parseInt(e.value, 10);

	$.cardElevation.cardElevation = cardElevation;

	$.cardElevationLabel.text = 'cardElevation: ' + cardElevation;
}

function cardMaxElevation(e) {
	var cardElevation = parseInt(e.value, 10);

	$.cardMaxElevation.cardElevation = cardElevation;

	$.cardMaxElevation.text = 'cardElevation: ' + cardElevation + '\ncardMaxElevation: 50';
}