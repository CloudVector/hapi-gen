/*global hiso, window, document, $ */
"use strict";

$(document).ready(function () {
    // Set the widget name for testing
    window.hiso = window.hiso || {};
    window.hiso.widget = 'navigation';
    $('#render').on('click', function () {
        var model = new hiso.NavigationModel();
        var control = new hiso.NavigationControl({ container: '#widget', model: model });
        control.init();
        control.onClick(function (e, args) {
            e.preventDefault();
            $('#message').html(['Type: <b>', args.type, '</b> Value: <b>', args.value, '</b> clicked!'].join(''));
        });
        control.onSearch(function (e, args) {
            e.preventDefault();
            $('#message').html(['Search for: <b>"', args.value === '' ? 'Nothing!' : args.value, '"</b>'].join(''));
        });
        // Set the control and model
        window.hiso.control = control;
        window.hiso.model = model;
    }).trigger('click');
});
