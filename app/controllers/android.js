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