// var Canvas = require('Windows.UI.Xaml.Controls.Canvas');
var TextBlock = require('Windows.UI.Xaml.Controls.TextBlock');

/**
 * I wrap code that executes on creation in a self-executing function just to
 * keep it organised, not to protect global scope like it would in alloy.js
 */
(function constructor(args) {

	// var nativeText = new TextBlock();
	// nativeText.Text = "Hello, world!";
	// nativeText.FontSize = 60;

	// $.win.add(nativeText);

	/*

	var tiView = Ti.UI.View();
	tiView.add(nativeText);

	var nativeView = new Canvas();
	nativeView.Children.Append(tiView);

	$.window.add(nativeView);

	*/

})(arguments[0] || {});