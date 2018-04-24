/*global window, dt, dust, $ */
"use strict";

/**
* Pagination and sort control
*
* @class PaginationControl
* @constructor
* @param {object} options
* @param {function} cb
*/

var PaginationControl = function (options) {
    var self = this,
    _dom = {},
    _events = {
        click: []
    },
    getLabels,
    buttonClicked,
    bind;

    /**
    * Options
    * @property options
    */
    self.options = options || {};
    self.options.container = self.options.container || '#pagination';
    self.options.container = typeof self.options.container === 'string' ? $(self.options.container) : self.options.container;
    self.options.template = self.options.template || 'pagination.dust';

    /**
    * Model
    * @property model
    */
    self.model = null;

    /* Gets the page labels */
    getLabels = function getLabels (start) {
        var result = [0, 1, 2, 3, 4, 5];
        result[5] = start;
        result[4] = start - 1;
        result[3] = start - 2;
        result[2] = start - 3;
        result[1] = start - 4;
        return result;
    };

    /* Handle pagination change */
    buttonClicked = function buttonClicked (e) {
        e.preventDefault();
        var $control = $(this),
        role = $control.data('page');
        // Check if not disabled the button
        if (!$control.hasClass('disabled') || !$control.hasClass('hidden')) {
            if (!isNaN(role)) {
                self.model.go($control.data('value'));
            } else if (role === 'first') {
                self.model.first();
            } else if (role === 'prev') {
                self.model.prev();
            } else if (role === 'next') {
                self.model.next();
            } else if (role === 'last') {
                self.model.last();
            }
            hiso.tools.callEvents(this, _events.click, e, self.model.page);
        }
    };

    /* Bind events */
    bind = function bind () {
        // Add event handlers specified in options
        if (self.options.click) {
            self.onClick(self.options.click);
        }
        _dom.buttons = $('[data-page]', self.options.container);
        self.options.container.on('click', '[data-page]', buttonClicked);
        self.update();
    };

    /**
    * Updates pagination information based on model values
    *
    * @method update
    * @return {undefined}
    */
    self.update = function update () {
        var $control,
        labels = [0, 1, 2, 3, 4, 5],
        role,
        pageNo;
        // Check values

        // If page is larger than the original mid point calculate the new one
        if (self.model.page > 3 && self.model.count >= (self.model.page + 2)) {
            labels = getLabels(self.model.page + 2);
        } else if (self.model.page > 4 && (self.model.page + 1) === self.model.count) {
            labels = getLabels(self.model.page + 1);
        } else if (self.model.page > 5 && self.model.page === self.model.count) {
            labels = getLabels(self.model.page);
        }

        // Reset: remove all active and disabled
        _dom.buttons.removeClass('active').removeClass('disabled').removeClass('hidden');
        _dom.buttons.each(function () {
            $control = $(this);
            role = $control.data('page');
            // Disable first/last and next/previous
            if (self.model.page === 1 && (role === 'first' || role === 'prev')) {
                $control.addClass('disabled');
            } else if (self.model.page >= self.model.count && (role === 'last' || role === 'next')) {
                $control.addClass('disabled');
            }
            // Check for the values
            if (!isNaN(role)) {
                pageNo = parseInt(role, 10);
                // Add values to labels
                $control.data('value', labels[pageNo]);
                $control.children().text(labels[pageNo]);
                // Disable buttons not accessible
                if (pageNo > self.model.count) {
                    $control.addClass('hidden');
                } else if (labels[pageNo] === self.model.page) {
                    $control.addClass('active');
                }
            }
        });
    };

    /**
    * Rendering HTML content for control
    * @method render
    * @param {function} callback
    * @return {Undefined}
    */
    self.render = function render (cb) {
        dust.render(self.options.template, {}, function (err, out) {
            self.options.container.off().html('').append(out);
            if (typeof cb === 'function') {
                cb();
            }
        });
    };

    /**
    * Initialize component
    * @method init
    * @param {function} callback
    * @return {Undefined}
    */
    self.init = function init (cb) {
        // Create model
        self.options.search = self.options.search === undefined ? '' : self.options.search;
        self.model = (self.options.model) ? self.options.model : new hiso.PaginationModel(self.options);
        // Add to watch
        self.model._watch(self.update);
        // Check if template need to be rendered
        var flag = false;
        self.options.container.each(function () {
            var $el = $(this);
            if (!flag && $el.html() === '') {
                flag = true;
                return false;
            }
        });
        // Render if necessary
        if (flag) {
            self.render(function () {
                bind();
                if (typeof cb === 'function') {
                    cb();
                }
            });
        } else {
            bind();
            if (typeof cb === 'function') {
                cb();
            }
        }
    };

    /**
    * Event occurs when pagination item is clicked
    *
    * @event onClick
    * @param {function} event handler callback
    */
    self.onClick = function onClick (cb) {
        return hiso.tools.addToEvents(_events.click, cb);
    };
};

window.hiso = window.hiso || {};
window.hiso.PaginationControl = PaginationControl;