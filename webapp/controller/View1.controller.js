sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "../model/LoggingService"
], function (Controller, LoggingService) {
    "use strict";

    return Controller.extend("test_a.controller.View1", {

        onInit: function () {
            LoggingService.logAction("View1", "View1Init", "PageLoad");
            this._attachButtonLogging(this.getView(), "View1");
        },

        _attachButtonLogging: function (oView, sPage) {
    const aButtons = oView.findAggregatedObjects(true, function(oControl) {
        return oControl.isA && oControl.isA("sap.m.Button");
    });

    aButtons.forEach((btn, index) => {
        if (btn && btn.setId && (!btn.getId() || btn.getId().startsWith("__"))) {
            btn.setId(sPage + "_btn" + index);
        }
        if (btn && btn.attachPress) {
            btn.attachPress(() => {
                LoggingService.logAction(sPage, btn.getId(), "ButtonPress");
            });
        }
    });
},


        onButtonPress: function (oEvent) {
            const btn = oEvent.getSource();
            LoggingService.logAction("View1", btn.getId(), "ButtonPress");
            sap.m.MessageToast.show("Button pressed!");
        },

        onNavBack: function () {
            LoggingService.logAction("View1", "NavBack", "Navigation");
            this.getOwnerComponent().getRouter().navTo("App");
        },

        onInputChange: function (oEvent) {
            const input = oEvent.getSource();
            LoggingService.logAction("View1", input.getId(), "InputChange", {
                value: input.getValue()
            });
        },

        onSelectChange: function (oEvent) {
            const select = oEvent.getSource();
            LoggingService.logAction("View1", select.getId(), "SelectChange", {
                key: select.getSelectedKey()
            });
        }

    });
});
