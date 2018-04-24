/*global window, hiso, dust, $ */
"use strict";

/**
* Navigation (header + side menu)
* @class NavigationControl
* @param {object} options
* @constructor
*/
var NavigationControl = function (options) {
    var self = this,
    _timer = 0,
    _events = {
        click: [],
        search: []
    },
    _dom = {},
    bind;

    /**
    * Options
    * @property options
    */
    self.options = options || {};
    // Set defaults
    self.options.container = self.options.container || '#navigation';
    self.options.container = typeof self.options.container === 'string' ? $(self.options.container) : self.options.container;
    self.options.template = self.options.template || 'navigation.dust';
    self.options.timeout = self.options.timeout || 500;
    self.options.start = self.options.start || 2;

    /**
    * Navigation Model
    * @property {NavigationModel} model
    */
    self.model = null;

    /* Binding events to DOM elements */
    bind = function () {
        // Add event handlers specified in options
        if (self.options.click) {
            self.onClick(self.options.click);
        }
        if (self.options.search) {
            self.onSearch(self.options.search);
        }
        // Create and cache DOM elements
        _dom.body = $('body');
        _dom.search = $('#nav-search-text', self.options.container);
        _dom.button = $('#nav-search-button', self.options.container);
        _dom.items = $('[data-nav]', self.options.container);
        // Add event handlers
        _dom.items.on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            _dom.items.removeClass('active');
            var value = $(this).addClass('active').data('nav');
            hiso.tools.callEvents(this, _events.click, e, value);
        });
        // Search event
        _dom.search.on('keyup', function (e) {
            var value = $(this).val();
            window.clearTimeout(_timer);
            if (value.length >= self.options.start || value.trim() === '') {
                _timer = setTimeout(function () {
                    hiso.tools.callEvents(this, _events.search, e, value);
                }, self.options.timeout);
            }
        });
    };

    /**
    * Rendering HTML content for control
    * @method render
    * @param {function} callback
    * @return {Undefined}
    */
    self.render = function (cb) {
        dust.render(self.options.template, self.model, function (err, out) {
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
    self.init = function (cb) {
        // Create model
        self.model = (self.options.model) ? self.options.model : new hiso.NavigationModel(self.options);
        // Check if navigation rendered on server side if not render it!
        if (self.options.container.html() === '') {
            self.render(function () {
                // Bind events
                bind();
                if (typeof cb === 'function') {
                    cb();
                }
            });
        } else {
            // Bind events
            bind();
            if (typeof cb === 'function') {
                cb();
            }
        }
    };

    /**
    * Event occurs when item is clicked
    *
    * @event onClick
    * @param {function} event handler callback
    */
    self.onClick = function onClick (cb) {
        return hiso.tools.addToEvents(_events.click, cb);
    };

    /**
    * Event occurs when searchable text typed into search bar
    *
    * @event onSearch
    * @param {function} event handler callback
    */
    self.onSearch = function onSearch (cb) {
        return hiso.tools.addToEvents(_events.search, cb);
    };
};

window.hiso = window.hiso || {};
window.hiso.NavigationControl = NavigationControl;