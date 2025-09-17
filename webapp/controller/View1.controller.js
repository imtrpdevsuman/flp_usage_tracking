sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "../model/LoggingService",
    "../model/AppConfig"
], function (Controller, JSONModel, LoggingService, AppConfig) {
    "use strict";

    return Controller.extend("test_a.controller.View1", {

        onInit: function () {
            LoggingService.logAction("View1", "View1Init", "PageLoad");
            this._attachButtonLogging(this.getView(), "View1");

            // Load environment variables
            this._loadEnvironmentConfig();

            // Add sample data for chart
            var oData = {
                sales: [
                    { quarter: "Q1", revenue: 200 },
                    { quarter: "Q2", revenue: 350 },
                    { quarter: "Q3", revenue: 500 },
                    { quarter: "Q4", revenue: 400 }
                ]
            };
            var oModel = new JSONModel(oData);
            this.getView().setModel(oModel);
        },

        _loadEnvironmentConfig: function () {
            try {
                // Debug logging
                console.log(" Checking window.APP_CONFIG:", window.APP_CONFIG);
                console.log(" typeof window.APP_CONFIG:", typeof window.APP_CONFIG);
                
                // Get environment variables from window.APP_CONFIG (loaded via AppConfig module)
                const displayUsername = window.APP_CONFIG?.DISPLAY_USERNAME || "Default User";
                
                console.log(" DISPLAY_USERNAME from APP_CONFIG:", window.APP_CONFIG?.DISPLAY_USERNAME);
                console.log(" Final displayUsername:", displayUsername);
                
                // Create a config model to store environment variables
                var oConfigData = {
                    username: displayUsername,
                    welcomeMessage: "Welcome, " + displayUsername + "!",
                    rawConfig: window.APP_CONFIG // Add for debugging
                };
                
                var oConfigModel = new JSONModel(oConfigData);
                this.getView().setModel(oConfigModel, "config");
                
                // Log the loaded configuration
                LoggingService.logAction("View1", "ConfigLoad", "EnvironmentConfig", {
                    username: displayUsername
                });
                
                console.log(" Environment config loaded:", oConfigData);
                
            } catch (error) {
                console.error("Error loading environment config:", error);
                
                // Fallback configuration
                var oFallbackConfig = {
                    username: "Default User",
                    welcomeMessage: "Welcome, Default User!"
                };
                
                var oFallbackModel = new JSONModel(oFallbackConfig);
                this.getView().setModel(oFallbackModel, "config");
                
                LoggingService.logAction("View1", "ConfigLoadError", "EnvironmentConfig", {
                    error: error.message
                });
            }
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
            
            // Get username from config model for personalized message
            const username = this.getView().getModel("config").getProperty("/username");
            sap.m.MessageToast.show("Hello " + username + "! Button pressed!");
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
        },

        // New method to get current user info
        getCurrentUser: function () {
            return this.getView().getModel("config").getProperty("/username");
        },

        // New method to refresh environment config
        refreshConfig: function () {
            this._loadEnvironmentConfig();
            sap.m.MessageToast.show("Configuration refreshed!");
        }

    });
});