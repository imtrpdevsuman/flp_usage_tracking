sap.ui.define([], function () {
    "use strict";

    return {
        logs: [],

        logAction: function (page, controlId, actionType, additionalInfo = {}) {
            const logEntry = {
                timestamp: new Date().toISOString(),
                page: page,
                controlId: controlId,
                actionType: actionType,
                ...additionalInfo
            };

            // Store in memory
            this.logs.push(logEntry);

            // Print to console (optional)
            console.log("LOG:", JSON.stringify(logEntry));

            // Optional: send to backend
            /*
            $.ajax({
                url: "/log-endpoint", // replace with your backend logging endpoint
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify(logEntry)
            });
            */
        },

        getLogs: function () {
            return this.logs;
        },

        clearLogs: function () {
            this.logs = [];
        }
    };
});
