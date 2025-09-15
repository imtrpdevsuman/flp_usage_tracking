sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "../model/LoggingService"
], function (Controller, LoggingService) {
    "use strict";

    return Controller.extend("test_a.controller.App", {

        onInit: function () {
            LoggingService.logAction("App", "AppInit", "PageLoad");
            this._attachButtonLogging(this.getView(), "App");
        },

        _attachButtonLogging: function (oView, sPage) {
            const aButtons = oView.findAggregatedObjects(true, function(oControl) {
                return oControl.isA("sap.m.Button");
            });

            aButtons.forEach((btn, index) => {
                if (!btn.getId() || btn.getId().startsWith("__")) {
                    btn.setId(sPage + "_btn" + index);
                }
                btn.attachPress(() => {
                    LoggingService.logAction(sPage, btn.getId(), "ButtonPress");
                });
            });
        },

        onNavToView1: function () {
            LoggingService.logAction("App", "NavToView1", "Navigation");
            this.getOwnerComponent().getRouter().navTo("View1");
        }

    });
});
