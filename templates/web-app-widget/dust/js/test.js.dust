/*global hiso, window, document, dust, $ */
"use strict";

$(document).ready(function () {
    // Set the widget name for testing
    window.hiso = window.hiso || {};
    window.hiso.widget = 'search';
    $('#render').on('click', function () {
        var model = new hiso.SearchItemModel();
        var control = new hiso.SearchControl({ container: '#widget', model: model });
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
