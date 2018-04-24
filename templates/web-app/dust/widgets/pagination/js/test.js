/*global hiso, window, document, dust, $ */
"use strict";

$(document).ready(function () {
    var data = {
        page: 1,
        size: 20,
        total: 345
    };
    // This should have 18 pages (17.25)
    window.hiso = window.hiso || {};
    window.hiso.widget = 'pagination';
    // Load initial json data
    $('#test-data').val(JSON.stringify(data, null, 4));
    $('#render').on('click', function () {
        try {
            var model = new hiso.PaginationModel(JSON.parse($('#test-data').val()));
            var control = new hiso.PaginationControl({ container: '#widget', model: model });
            control.init();
            $('#message').html(['Page count: <b>', control.model.count, '</b>'].join(''));
            control.onClick(function (e) {
                $('#message').html(['Selected: <b>', e.page, '</b> of <b> ', control.model.count].join(''));
            });
            window.hiso.control = control;
            window.hiso.model = model;
        }
        catch (err) {
            console.error(err);
        }
    }).trigger('click');
});
