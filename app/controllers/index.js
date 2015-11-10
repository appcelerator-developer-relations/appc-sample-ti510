var log = require('log');

/**
 * I wrap code that executes on creation in a self-executing function just to
 * keep it organised, not to protect global scope like it would in alloy.js
 */
(function constructor(args) {

	$.index.open();

})(arguments[0] || {});

function onSelected(e) {
	log.argsWithoutApis('Ti.UI.TabGroup:selected', e);
}

function onUnselected(e) {
	log.argsWithoutApis('Ti.UI.TabGroup:unselected', e);
}