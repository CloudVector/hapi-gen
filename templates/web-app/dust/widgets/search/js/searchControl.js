/*global window, hiso, dust, $ */
"use strict";

/**
* Search page with navigation and pagination
* @class SearchControl
* @param {object} options
* @constructor
*/
var SearchControl = function (options) {
    var self = this,
    _dom = {},
    _search = '',
    _mode = 'search',
    initNavigation,
    initPagination,
    searchChanged,
    pageChanged,
    createUrl,
    updateUrl,
    detailClicked,
    getData,
    bind;

    /**
    * Options
    * @property options
    */
    self.options = options || {};
    // Set defaults
    self.options.container = self.options.container || '#search';
    self.options.container = typeof self.options.container === 'string' ? $(self.options.container) : self.options.container;
    self.options.template = self.options.template || 'search-page.dust';
    self.options.timeout = self.options.timeout || 500;
    self.options.start = self.options.start || 3;

    /**
    * Search Model
    * @property {SearchModel} model
    */
    self.model = null;

    /* Client component */
    self.client = new hiso.SearchClient();

    /* Subcomponents */
    self.navigation = null;
    self.pagination = null;

    /* Binding events to DOM elements */
    bind = function () {
        // Create and cache DOM elements
        _dom.body = $('body');
        _dom.items = $('#search-items');
        _dom.items.on('click', '.js-detail', detailClicked);
    };

    /* Initialize navigation */
    initNavigation = function (cb) {
        if (self.options.navigation) {
            self.navigation = new hiso.NavigationControl(self.options.navigation);
            self.navigation.init(function () {
                // Wire up events
                self.navigation.onSearch(searchChanged);
                if (typeof cb === 'function') {
                    cb();
                }
            });
        } else if (typeof cb === 'function') {
            cb();
        }
    };

    /* Initialize contacts */
    initPagination = function (cb) {
        // Add client as option
        if (self.options.pagination) {
            self.pagination = new hiso.PaginationControl(self.options.pagination);
            self.pagination.init(function () {
                // Wire up events
                self.pagination.onClick(pageChanged);
                if (typeof cb === 'function') {
                    cb();
                }
            });
        } else if (typeof cb === 'function') {
            cb();
        }
    };

    /* Search changed */
    searchChanged = function (e, text) {
        _search = text.trim();
        getData(updateUrl);
    };

    /* Page changed */
    pageChanged = function () {
        getData(updateUrl);
    };

    /* When detail clicked */
    detailClicked = function () {
        var id = $(this).data('id');
        console.log('DETAIL:', id);
    }

    /* Create url */
    createUrl = function () {
        var loc = window.location;
        var result = [
            loc.protocol, '//', 
            loc.hostname,
            loc.port === '' ? '' : ':', 
            loc.port
        ];
        result.push('/' + _mode);
        if (_mode === 'search') {
            var m = self.pagination.model;
            result.push(['?page=' + m.page, '&size=', m.size, '&sort=', m.sort].join(''));
            if (_search !== '') {
                result.push('&search=', _search);
            }
        }
        return result.join('');
    };

    /* Update the url if possible */
    updateUrl = function () {
        // Add to the page
        if (typeof window.history !== 'undefined' && window.history.pushState) {
            var oldUrl = window.location.href,
            newUrl = createUrl();
            // Push to history only if not the same
            if (newUrl !== oldUrl) {
                window.history.pushState({ path: newUrl },'', newUrl);
            }
        }
    };

    /* Requests data from server side */
    getData = function (cb) {
        var request = {
            page: self.pagination.model.page,
            size: self.pagination.model.size,
            sort: self.pagination.model.sort
        };
        if (_search !== '') {
            request.search = _search;
        }
        // Execute search
        self.client.search(request, function (response) {
            if (response && response.items) {
                self.model = new hiso.SearchModel(response);
                dust.render('search-items.dust', self.model, function (err, out) {
                    if (err) {
                        window.hiso.log.error(err);
                    } else {
                        _dom.items.html('').append(out);
                    }
                    if (typeof cb === 'function') {
                        cb();
                    }
                });
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
        // Init all components
        var initComponents = function () {
            bind();
            initNavigation(function () {
                initPagination(function () {
                    updateUrl('/search');
                    if (typeof cb === 'function') {
                        cb();
                    }
                });
            });
        };

        // Create model
        self.model = (self.options.model) ? self.options.model : new hiso.SearchModel(self.options);
        // Check if navigation rendered on server side if not render it!
        if (self.options.container.html() === '') {
            self.render(initComponents);
        } else {
            initComponents();
        }
    };
};

window.hiso = window.hiso || {};
window.hiso.SearchControl = SearchControl;