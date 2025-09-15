/* global QUnit */
QUnit.config.autostart = false;

sap.ui.require(["testa/test/integration/AllJourneys"
], function () {
	QUnit.start();
});
