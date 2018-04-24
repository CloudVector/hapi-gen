/*global window */
"use strict";

window.hiso = window.hiso || {};

// Create global log object
window.hiso.log = {
    error: function (err) {
        if (console) {
            console.error(err);
        }
    },
    info: function (obj) {
        if (console) {
            console.log(obj);
        }
    }
};
