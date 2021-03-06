(function e(t, n, r) { function s(o, u) { if (!n[o]) { if (!t[o]) { var a = typeof require == "function" && require; if (!u && a) return a(o, !0); if (i) return i(o, !0); var f = new Error("Cannot find module '" + o + "'"); throw f.code = "MODULE_NOT_FOUND", f } var l = n[o] = { exports: {} }; t[o][0].call(l.exports, function (e) { var n = t[o][1][e]; return s(n ? n : e) }, l, l.exports, e, t, n, r) } return n[o].exports } var i = typeof require == "function" && require; for (var o = 0; o < r.length; o++)s(r[o]); return s })({
    1: [function (require, module, exports) {
        'use strict';

        var _Polyfill = require('./core/Polyfill');

        var _Core = require('./core/Core');

        var _Core2 = _interopRequireDefault(_Core);

        function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

        (function () {
            // if (typeof SB === "undefined") {
            /**
          * Expose core components for use in testing / jsonp
          * @param  {[type]} window [description]
          * @return {[type]}        [description]
          */
            _Core2.default._exposeTo(window);

            /**
          * The main switchboard object containing
          * all switchboard-client functionality
          */
            window.SB = _Core2.default;
            // }
        })();

    }, { "./core/Core": 2, "./core/Polyfill": 6 }], 2: [function (require, module, exports) {
        'use strict';

        Object.defineProperty(exports, "__esModule", {
            value: true
        });

        var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

        var _Dataset2 = require('./Dataset');

        var _Dataset3 = _interopRequireDefault(_Dataset2);

        var _Timeline = require('./Timeline');

        var _Timeline2 = _interopRequireDefault(_Timeline);

        var _DataSource = require('./DataSource');

        var _DataSource2 = _interopRequireDefault(_DataSource);

        var _Environment = require('./Environment');

        var _Environment2 = _interopRequireDefault(_Environment);

        var _QueryString = require('../tool/QueryString');

        var _QueryString2 = _interopRequireDefault(_QueryString);

        var _Util = require('../tool/Util.js');

        var _Util2 = _interopRequireDefault(_Util);

        function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

        function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

        var EnvLocal = "local";
        var EnvSwitchboard = "switchboard";
        var EnvSwitchboardOld = "old_switchboard";

        var Environment = typeof window.Switchboard === 'undefined' ? typeof window.data === 'undefined' ? EnvLocal : EnvSwitchboardOld : EnvSwitchboard;

        // Instantiate Switchboard object
        if (Environment === EnvLocal || Environment === EnvSwitchboardOld) {
            window.Switchboard = {};
        }

        var CoreLoaded = {
            data: false,
            env: false,
            init: false
        };

        var CoreDebug = 0;

        var SetupDeferred = [];
        var SetupCallbacks = [];

        /**
         * Wraps the core components
         */

        var Core = function () {

            /**
          * Create a new switchboard
          */
            function Core() {
                var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                _classCallCheck(this, Core);

                config.offset = config.offset || _QueryString2.default.get('localOffset');

                if (config.debug) {
                    CoreDebug++;
                    config.debug = CoreDebug;
                }

                this.Timeline = new _Timeline2.default(config);
            }

            /**
          * A single entry point for initiating the framework
          * @param  {object} config Config object containing all the details for the framework
          */


            _createClass(Core, [{
                key: 'timeline',


                /**
           * The timeline object for this instance
           * @return {[type]} [description]
           */
                get: function get() {
                    return this.Timeline;
                }

                /**
           * Is the current environment local
           * @return {Boolean}    Current Environment is local
           */

            }], [{
                key: 'setup',
                value: function setup(config) {
                    // if data is already loaded
                    if (CoreLoaded.data && CoreLoaded.env) {
                        if (config.success) {
                            config.success();
                        }
                        return Q.when();
                    }

                    // else store callback / promise
                    var deferred = Q.defer();
                    SetupDeferred.push(deferred);
                    if (config.success) {
                        SetupCallbacks.push(config.success);
                    }

                    // if initial load has not been completed
                    if (!CoreLoaded.init) {
                        CoreLoaded.init = true;

                        var resolveAll = function resolveAll() {
                            SetupCallbacks.forEach(function (callback) {
                                return callback();
                            });
                            SetupCallbacks = [];

                            SetupDeferred.forEach(function (deferred) {
                                deferred.resolve();
                            });
                            SetupDeferred = [];
                        };

                        // create configuration
                        var datasource = {
                            url: config.url || null,
                            location: config.location || config.dataSourceLocation || null,
                            sources: config.sources || null,
                            success: function success() {
                                console.log("Datasources loaded.");
                                CoreLoaded.data = true;
                                if (CoreLoaded.env) {
                                    resolveAll();
                                }
                            }
                        };

                        config.env = config.env || {};

                        var env = {
                            url: config.url || null,
                            location: config.location || config.environmentLocation || null,
                            content: config.content || _Util2.default.contentName,
                            channelScreenId: config.channelScreenId,
                            screenId: config.screenId,
                            orientation: config.orientation,
                            success: function success() {
                                console.log("Environment loaded.");
                                CoreLoaded.env = true;
                                if (CoreLoaded.data) {
                                    resolveAll();
                                }
                            }
                        };

                        // setup
                        Core.Data.load(datasource);
                        Core.Env.load(env);
                    }

                    return deferred.promise;
                }
            }, {
                key: 'Dataset',


                /**
           * Dataset factory
           * @param {object} data The primary datasource to combine to
           * @return {Dataset}    New dataset object using data
           */
                value: function Dataset(data) {
                    return new _Dataset3.default(data);
                }

                /**
           * Get DataSource singleton
           * @return {DataSource}   The DataSource singleton
           */

            }, {
                key: '_exposeTo',


                /**
           * Exposes core components for global access (testing)
           * @param  {object} root Usually the window object
           */
                value: function _exposeTo(root) {
                    root._sb = {};
                    root._sb._dataset = Core.Dataset;
                    root._sb._timeline = _Timeline2.default;

                    root._sb._dataSource = _DataSource2.default;
                    root._sb._environment = _Environment2.default;

                    root._sb._dataSourceInstance = Core.Data;
                    root._sb._environmentInstance = Core.Env;

                    root._sb._tool = {};
                    root._sb._tool._queryString = Core.QueryString;

                    root._sb._reset = function () {
                        CoreLoaded = {
                            data: false,
                            env: false,
                            init: false
                        };

                        CoreDebug = 0;

                        SetupDeferred = [];
                        SetupCallbacks = [];
                    };
                }
            }, {
                key: 'local',
                get: function get() {
                    return Environment === EnvLocal;
                }

                /**
           * Is the current environment in compatability mode
           * @return {Boolean}    Current Environment is in compatibility
           */

            }, {
                key: 'compatability',
                get: function get() {
                    return Environment === EnvSwitchboardOld;
                }
            }, {
                key: 'Data',
                get: function get() {
                    return new _DataSource2.default(this);
                }

                /**
           * Get Environment singleton
           * @return {Environment}    The Environment singleton
           */

            }, {
                key: 'Env',
                get: function get() {
                    return new _Environment2.default(this);
                }

                /**
           * The timeline class for coordinating events according to system clock
           */

            }, {
                key: 'Timeline',
                get: function get() {
                    return _Timeline2.default;
                }

                /**
           * Get QueryString tool
           */

            }, {
                key: 'QueryString',
                get: function get() {
                    return _QueryString2.default;
                }
            }]);

            return Core;
        }();

        ;

        /**
         * Wraps the core components
         */
        exports.default = Core;

    }, { "../tool/QueryString": 9, "../tool/Util.js": 10, "./DataSource": 3, "./Dataset": 4, "./Environment": 5, "./Timeline": 7 }], 3: [function (require, module, exports) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
            value: true
        });

        var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

        function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

        var instance = null;
        /**
         * The global datasource instance for use by jsonp
         * @type {string}
         */
        var DataSourceGlobal = "window.SB.Data";

        /**
         * To assist with switchboard data handling on local and remote deployments
         * @note This class mutates the Switchboard.dataSource object
         * It assigns data sources to their alias as well as adds a meta attribute
         * where info about the data source resides
         */

        var DataSource = function () {

            /**
          * @see instance()
          */
            function DataSource(core) {
                _classCallCheck(this, DataSource);

                if (!instance) {
                    this._core = core;
                    this._sources = [];
                    this._completeCallback = null;
                    this._jsonpCallbacks = { i: 0 };

                    this._global = DataSourceGlobal;

                    this.base = "";
                    this.location = "";

                    instance = this;
                }
                return instance;
            }

            /**
          * Get the singleton instance of DataSource
          * @return {DataSource} The DataSource singleton
          */


            _createClass(DataSource, [{
                key: "load",


                /**
           * Load data from switchboard for local development
           * @param  {object}   config   See example for full configuration
           *
           * @example
           * SB.Data.load({
           * 	url:'http://demo.coatesdigital.com.au',
           * 	sources: [
           * 		{ name:'config', filename:'basic-menu-config.csv' },
           * 		'basic-product-group-nutrition.csv'
           * 	],
           * 	success: function () {
           * 		// start application
           * 	}
           * });
           */
                value: function load(config) {
                    var _this = this;

                    this._completeCallback = config.success || function () { };

                    this.base = config.url || '';
                    this.location = config.location || '';
                    this._sources = config.sources || [];

                    if (this._core.local && this._sources.length > 0) {
                        window.Switchboard.dataSources = {};

                        // get each source map
                        this._sources.map(function (s) {
                            var source = typeof s == 'string' ? s : s.filename;
                            var name = typeof s.name != 'undefined' ? s.name : source;
                            var datasource = _this._toAPIFormat(_this.base, _this.location) + source + '.jsonp';

                            // setup callback
                            var jsonpName = "fn" + _this._jsonpCallbacks.i++;
                            _this._jsonpCallbacks[jsonpName] = function (dn, fn) {
                                var that = _this;
                                return function () {
                                    delete that._jsonpCallbacks[fn];

                                    var args = Array.prototype.slice.call(arguments);
                                    args.unshift(dn);
                                    that._complete.apply(that, args);
                                };
                            }(name, jsonpName);

                            // get data via jsonp
                            _this._jsonp(datasource, jsonpName);
                        });
                    } else {
                        // compatability
                        if (this._core.compatability) {
                            window.Switchboard.dataSources = window.data;
                        }
                        //
                        this._completeCallback();
                    }
                }

                /**
           * Load data from switchboard for local and hq environments
           * @param {string}    filename  The filename of the dataSource on hq
           * @param {string}    name      The alias for the dataSource
           * @param {Boolean}   reload    Reload the dataSource
           * @return {Promise}  A promise that returns the dataSource data
           *
           * @example
           * SB.Data.fetch('basic-products.csv', 'products', true).then(function (data) {
           *   // basic-products.csv data
           *   console.log(data);
           *   // basic-products.csv data
           *   console.log(SB.Data.get('products'));
           * });
           */

            }, {
                key: "fetch",
                value: function fetch(filename, name, reload) {
                    var _this2 = this;

                    var source = name || filename;
                    // source exists and don't reload it
                    if (this.has(source) && !reload) {
                        return Q.when(this.get(source));
                    }

                    // if no source or reload, load it
                    var deferred = Q.defer();
                    var datasource = this._toAPIFormat(this.base, this.location) + source + '.jsonp';

                    // setup callback
                    var jsonpName = "fn" + this._jsonpCallbacks.i++;
                    this._jsonpCallbacks[jsonpName] = function (dn, fn, filename) {
                        var that = _this2;
                        return function () {
                            delete that._jsonpCallbacks[fn];

                            var args = Array.prototype.slice.call(arguments);
                            args.unshift(dn);

                            // add source to switchboard object
                            var name = args[0];
                            var data = args[1];

                            window.Switchboard.dataSources[name] = data;

                            that._sources.push({
                                name: name,
                                filename: filename
                            });

                            // resolve source
                            deferred.resolve(data);
                        };
                    }(source, jsonpName);

                    // get data via jsonp
                    this._jsonp(datasource, jsonpName);
                    return deferred.promise;
                }

                /**
           * Load several dataSources from switchboard for local and hq environments
           * @param {Array}     dataSources The collection of dataSources to load
           * @param {Boolean}   reload      Reload the dataSources
           *
           * @example
           * SB.Data.fetchAll([
           * 		{ name:'config', filename:'basic-menu-config.csv' },
           * 		'basic-product-group-nutrition.csv'
           * 	], true).then((data) => {
           *    // array of data sources
           *    console.log(data);
           *  });
           */

            }, {
                key: "fetchAll",
                value: function fetchAll(dataSources) {
                    var _this3 = this;

                    var reload = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

                    var promises = [];

                    dataSources.forEach(function (item) {
                        item = typeof s === 'string' ? { filename: item } : item;
                        promises.push(_this3.fetch(item.filename, item.name, reload));
                    });

                    return Q.all(promises);
                }

                /**
           * Get a data source from Switchboard
           * @param  {string} name Name of file or custom name
           * @return {Array}      Data from Switchboard
           *
           * @example
           * SB.Data.load({
           * 	url:'http://demo.coatesdigital.com.au',
           * 	sources: [
           * 		{ name:'config', filename:'basic-menu-config.csv' },
           * 		'basic-products.csv'
           * 	],
           * 	success: function () {
           * 		SB.Data.get('config'); // returns basic-menu-config.csv
           *   	SB.Data.get('basic-menu-config.csv'); // returns the same
           * 	  SB.Data.get('basic-products.csv'); // returns basic-products.csv
           * 	  SB.Data.get('not-a-data-source'); // throws error
           * 	}
           * });
           */

            }, {
                key: "get",
                value: function get(name) {
                    this._assignMeta();

                    // if name isn't given, return all
                    if (typeof name === 'undefined') {
                        var data = this._toArray(window.Switchboard.dataSources);
                        if (typeof data === 'undefined') data = {};
                        return this._addMethods(data);
                    }

                    // exists with name
                    if (typeof window.Switchboard.dataSources[name] !== 'undefined') {
                        return this._toArray(window.Switchboard.dataSources[name]);
                    }

                    // find source with name and use filename
                    for (var i = 0; i < this._sources.length; i++) {
                        var _s = this._sources[i];

                        if (typeof _s === 'string') continue;
                        if (name == _s.name && typeof window.Switchboard.dataSources[_s.filename] !== 'undefined') {
                            return this._toArray(window.Switchboard.dataSources[_s.filename]);
                        }
                    }

                    // nothing exists
                    throw new Error('DataSource "' + name + '" does not exist in Switchboard.dataSource');
                }

                /**
           * Get a datasource with name like name
           * @param  {String} name The name to compare
           * @return {object}      All matching datasources
           */

            }, {
                key: "like",
                value: function like(name) {
                    return this.get().like(name);
                }

                /**
           * Update a data source with new data
           * @param {update} name The name of the data source to update
           * @param {Array} data The data to store
           *
           * @example
           * SB.Data.load({
           * 	url:'http://demo.coatesdigital.com.au',
           * 	sources: [
           * 		{ name:'prices', filename:'basic-prices.csv' },
           * 		{ name:'products', filename:'basic-products.csv' }
           * 	],
           * 	success: function () {
           * 		var joinedDataset = SB.Dataset(SB.Data(products))
           * 				.join(SB.Data(prices)).on('id')
           * 			 	.get();
           *    SB.Data.set('products', joinedDataset); // overwrite with the newly combined dataset
           * 	}
           * });
           */

            }, {
                key: "set",
                value: function set(name, data) {
                    if (typeof window.Switchboard.dataSources[name] === 'undefined') {
                        var notFound = name;
                        // find source with name and use filename
                        for (var i = 0; i < this._sources.length; i++) {
                            var _s2 = this._sources[i];

                            if (typeof _s2 === 'string') continue;
                            if (name == _s2.name && typeof window.Switchboard.dataSources[_s2.filename] !== 'undefined') {
                                name = _s2.filename;
                            }
                        }
                    }

                    window.Switchboard.dataSources[name] = data;
                }

                /**
           * Verify a data source exists
           * @param  {string}  name Name of file or custom name
           * @return {Boolean}      Data source exists
           *
           * @example
           * SB.Data.load({
           * 	url:'http://demo.coatesdigital.com.au',
           * 	sources: [
           * 		{ name:'config', filename:'basic-menu-config.csv' },
           * 		'basic-products.csv'
           * 	],
           * 	success: function () {
           * 	 SB.Data.has('config'); // returns true
           * 	 SB.Data.has('basic-menu-config.csv'); // returns true
           * 	 SB.Data.has('not-a-data-source'); // returns false}
           * });
           */

            }, {
                key: "has",
                value: function has(name) {
                    try {
                        this.get(name);
                    } catch (e) {
                        return false;
                    }
                    return true;
                }

                /**
           * Get a datasource with name like name
           * @param  {String} name The name to compare
           * @param  {Array}  data The datasources to match against
           * @return {object}      All matching datasources
           */

            }, {
                key: "_like",
                value: function _like(name, data) {

                    var datasources = {};
                    for (var prop in data) {
                        if (prop.toLowerCase().indexOf('.csv') > 0 && prop.toLowerCase().indexOf(name.toLowerCase()) >= 0) datasources[prop] = data[prop];
                    }

                    return this._addMethods(datasources);
                }

                /**
           * Get the most recently scheduled datasource
           * @param  {Array}  data   The datasources to match against
           * @return {object}        The closest scheduled datasource or the single one
           */

            }, {
                key: "_scheduled",
                value: function _scheduled(data) {
                    var offset = new Date().getTimezoneOffset() * 60000; // offset in milliseconds
                    var now = Date.now();

                    var min = null,
                        minKey = null;
                    var pattern = /\d{8}(T\d{6}Z*)*(\.csv)/g;

                    for (var prop in data) {
                        // get data section using format
                        if (prop.match(pattern)) {
                            // has a date in the name
                            // pull date from name and convert to standard
                            var nd = prop.match(pattern)[0].replace('.csv', '');
                            var iso8601 = nd.substring(0, 4) + '-' + nd.substring(4, 6) + '-' + nd.substring(6, 8);

                            if (nd.indexOf('T') > 0) {
                                iso8601 += nd.substring(8, 11) + ':' + nd.substring(11, 13) + ':' + nd.substring(13);

                                if (nd.indexOf('Z') < 0) {
                                    iso8601 += 'Z';
                                }
                            } else {
                                iso8601 += "T00:00:00Z";
                            }

                            // create date to compare
                            var date = new Date(iso8601).getTime() + offset;

                            // find closest previous date
                            if (date <= now && (min == null || min < date)) {
                                min = date;
                                minKey = prop;
                            }
                        }
                    }

                    if (minKey) return data[minKey];

                    return data.single();
                }

                /**
           * Get the single datasource from Switchboard Datasources
           * @return {object} The single datasource object
           */

            }, {
                key: "single",
                value: function single() {
                    return this.get().single();
                }

                /**
           * Get the single csv object from the datasources
           * @return {object} The single datasource object
           */

            }, {
                key: "_single",
                value: function _single() {
                    for (var prop in this) {
                        if (prop.toLowerCase().indexOf('.csv') > 0) return this[prop];
                    }
                    return null;
                }

                /**
           * Add data and verify complete data load
           * @param  {string} name The name of the data source that has loaded
           * @param  {Array} data The data to store to the Switchboard object
           */

            }, {
                key: "_complete",
                value: function _complete(name, data) {
                    window.Switchboard.dataSources[name] = data;
                    // verify all sources loaded
                    var complete = true;
                    for (var i = 0; i < this._sources.length; i++) {
                        var _s3 = this._sources[i];
                        var source = typeof _s3 == 'string' ? _s3 : _s3.filename;
                        var _name = typeof _s3.name != 'undefined' ? _s3.name : source;

                        if (typeof window.Switchboard.dataSources[_name] === 'undefined') {
                            complete = false;
                        }
                    }
                    if (complete) {
                        this._completeCallback();
                    }
                }

                /**
           * Formats url to include api path
           * @param  {string} url The url to format
           * @return {string}     The formatted url
           */

            }, {
                key: "_toAPIFormat",
                value: function _toAPIFormat(url, location) {
                    if (location) {
                        if (url[url.length - 1] != '/') url += '/';
                        url += "local/" + location + "/";
                    }

                    if (url.indexOf('/api/dataSource/') < 0) {
                        if (url[url.length - 1] != '/') url += '/';
                        return url + 'api/dataSource/';
                    }
                }

                /**
           * Generates a script element from parameters
           * @param  {string} src          The url to the data source
           * @param  {string} callbackName The function name to call on data load
           * @return {HTMLElement}              Script HTML Element
           */

            }, {
                key: "_toScriptTag",
                value: function _toScriptTag(src, callbackName) {
                    var script = document.createElement('script');
                    script.src = src + "?callback=" + DataSourceGlobal + "._jsonpCallbacks." + callbackName;
                    script.dataset.switchboard = true;
                    return script;
                }

                /**
           * Start JSONP
           * @param  {string} src          The url to the data source
           * @param  {string} callbackName The function name to call on data load
           */

            }, {
                key: "_jsonp",
                value: function _jsonp(src, callbackName) {
                    document.body.appendChild(this._toScriptTag(src, callbackName));
                }

                /**
           * Convert array-like data to an array if possible
           * @param  {object} data The data to convert
           * @return {Array}      The data as an Array
           */

            }, {
                key: "_toArray",
                value: function _toArray(data) {
                    if (data instanceof Array) return Array.from(data);
                    return data;
                }

                /**
           * Add fancy methods to data being returned
           * @param {Array} data Array to update
           */

            }, {
                key: "_addMethods",
                value: function _addMethods(data) {
                    var _this4 = this;

                    data.like = function (e) {
                        return _this4._like(e, data);
                    };
                    data.scheduled = function () {
                        return _this4._scheduled(data);
                    };
                    data.single = this._single;
                    return data;
                }

                /**
           * Loops through and assigns info to all data sources
           */

            }, {
                key: "_assignMeta",
                value: function _assignMeta() {
                    for (var key in window.Switchboard.dataSources) {
                        var filename = key;
                        for (var i = 0; i < this._sources.length; i++) {
                            var _s4 = this._sources[i];
                            var source = typeof _s4 == 'string' ? _s4 : _s4.filename;
                            var alias = typeof _s4.name != 'undefined' ? _s4.name : source;

                            if (key === alias) {
                                filename = source;
                            }
                        }
                        window.Switchboard.dataSources[key].meta = {
                            name: key,
                            filename: filename
                        };
                    }
                }
            }], [{
                key: "instance",
                value: function instance() {
                    return new DataSource();
                }
            }]);

            return DataSource;
        }();

        /**
         * Assists with loading and accessing Switchboard data
         */


        exports.default = DataSource;

    }, {}], 4: [function (require, module, exports) {
        'use strict';

        Object.defineProperty(exports, "__esModule", {
            value: true
        });

        var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

        function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

        /**
         * Join arrays of related data
         * @example
         * var dataset = SB.Dataset(products)
         * 		.join(prices).on('id', 'product_id')
         * 		.get();
         */
        var Dataset = function () {

            /**
          * Initialises the dataset a single source of data.
          * @param  {object} dataset the primary datasource to combine to
          */
            function Dataset(dataset) {
                _classCallCheck(this, Dataset);

                if (!Array.isArray(dataset)) {
                    dataset = [dataset];
                }

                this._primary = dataset;
                this._stack = [];
                this._callstack = [];
            }

            /**
          * Get all objects with prop 'eq' value
          * @param  {string} prop The property to get
          * @param  {string} op   The operator used to compare
          * @param  {any}    val  The value to compare
          * @return {Array}       Array of matching objects
          */


            _createClass(Dataset, [{
                key: 'where',
                value: function where(prop, op, val) {
                    var data = [];
                    var ops = {
                        '=': function _(x, y) {
                            return x == y;
                        },
                        '!=': function _(x, y) {
                            return x != y;
                        },
                        '<=': function _(x, y) {
                            return x <= y;
                        },
                        '<': function _(x, y) {
                            return x < y;
                        },
                        '>=': function _(x, y) {
                            return x >= y;
                        },
                        '>': function _(x, y) {
                            return x > y;
                        }
                    };

                    if (typeof ops[op] == 'undefined') {
                        throw new Error('Invalid operator (' + op + ')');
                    }

                    this.get().map(function (m) {
                        if (ops[op](m[prop], val)) data.push(m);
                    });

                    return data;
                }

                /**
           * Schedule a one-to-one join to the primary dataset.
           * @param  {Array} dataset the related dataset
           * @param  {string} name    the property to attach the related values to (optional)
           * @return {Dataset}         this dataset object
           *
           * @example
           * var dataset = Dataset(products)
           * 		.join(prices).on('id', 'product_id')
           * 		.get();
           */

            }, {
                key: 'join',
                value: function join(dataset, name) {
                    return this._join(dataset, name, "one");
                }

                /**
           * Schedule a one-to-many join to the primary dataset.
           * @param  {Array} dataset the related dataset
           * @param  {string} name    the property to attach the array of related values to (optional)
           * @return {Dataset}         this dataset object
           */

            }, {
                key: 'joinMany',
                value: function joinMany(dataset, name) {
                    if (arguments.length != 2) {
                        throw new Error("JoinMany requires a name to be provided");
                    }
                    return this._join(dataset, name, "many");
                }

                /**
           * Adds a typed join to the stack.
           * @param  {Array} dataset the related dataset
           * @param  {string} name    the property to attach the related values to (optional)
           * @param  {string} type    the type of join being performed
           * @return {dataset}         this dataset object
           */

            }, {
                key: '_join',
                value: function _join(dataset, name, type) {
                    if (this._callstack[this._callstack.length - 1] != "join") {
                        this._stack.push({ name: name, dataset: dataset, key: null, foreignKey: null, type: type });
                    } else {
                        throw new Error("On must be called before performing another join.");
                    }

                    // add call to stack
                    this._callstack.push("join");

                    return this;
                }

                /**
           * Add key descriptions to the most recent join, uses key as foreignKey if foreignKey is not provided.
           * @param  {string} key        the name of the matching property on the primary dataset
           * @param  {string} foreignKey the name of the matching property on the foreign dataset
           * @return {Dataset}            this dataset object
           */

            }, {
                key: 'on',
                value: function on(key, foreignKey) {
                    if (arguments.length == 1) {
                        foreignKey = key;
                    }

                    var latest = this._stack.pop();
                    latest.key = key;
                    latest.foreignKey = foreignKey;
                    this._stack.push(latest);

                    this._callstack.push("on");

                    return this;
                }

                /**
           * Perform scheduled joins and return dataset as Array
           * @return {Array} The joined dataset
           */

            }, {
                key: 'get',
                value: function get() {
                    var _this = this;

                    // clear callstack
                    this._callstack = [];

                    // perform joins
                    this._stack.reverse();

                    var _loop = function _loop() {
                        var join = _this._stack.pop();

                        _this._primary.map(function (a) {
                            // find the first matching value
                            var b = [];
                            for (var i = 0; i < join.dataset.length; i++) {
                                var c = join.dataset[i];
                                if (a[join.key] == c[join.foreignKey]) b.push(c);
                            }

                            // copy over props
                            if (join.type == "one") {
                                b = b[0];

                                if (join.name) a[join.name] = {};

                                for (var prop in b) {
                                    if (join.name) a[join.name][prop] = b[prop]; else a[prop] = b[prop];
                                }
                            }

                            // set matching values to property
                            if (join.type == "many") {
                                a[join.name] = b;
                            }
                        });
                    };

                    while (this._stack.length > 0) {
                        _loop();
                    }

                    return this._primary;
                }
            }]);

            return Dataset;
        }();

        /**
         * Assists with common Switchboard data operations
         */


        exports.default = Dataset;

    }, {}], 5: [function (require, module, exports) {
        'use strict';

        Object.defineProperty(exports, "__esModule", {
            value: true
        });

        var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

        function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

        var instance = null;

        /**
         * The global datasource instance for use by jsonp
         * @type {String}
         */
        var EnvironmentGlobal = 'window.SB.Env';

        /**
         * To assist with switchboard environment data access on local and remote deployments
         */

        var Environment = function () {
            /**
          * @see instance()
          */
            function Environment(core) {
                _classCallCheck(this, Environment);

                if (!instance) {
                    this._core = core;
                    instance = this;
                }
                return instance;
            }

            /**
          * Get the singleton instance of DataSource
          * @return {DataSource} The DataSource singleton
          */


            _createClass(Environment, [{
                key: 'load',


                /**
           * Load environment data from switchboard for local development
           * @param  {object}   config   See example for full configuration
           *
           * @example
           * SB.Env.load({
           * 	url:'http://demo.coatesdigital.com.au',
           * 	location: 'TEST',
           * 	content:'basic-coffee.zip',
           * 	success: function () {
           * 		// start application
           * 	}
           * });
           */
                value: function load(config) {
                    this._completeCallback = config.success || function () { };

                    var base = config.url || '';
                    var location = config.location || '';
                    var orientation = config.orientation || '';
                    var channelScreenId = config.channelScreenId || null;
                    var screenId = config.screenId || null;
                    var content = config.content || '';
                    this._sources = config.sources || [];

                    if (this._core.local && location != '' && content == '') {
                        console.warn('Location provided to environment but no content provided.');
                    }

                    if (this._core.local && content != '') {
                        window.Switchboard.environmentData = {};

                        // mock location using query string
                        var query = void 0;
                        var params = {
                            'locationCode': location,
                            'orientation': orientation,
                            'channelScreenId': channelScreenId,
                            'screenId': screenId
                        };
                        var queryParams = [];
                        Object.keys(params).forEach(function (e) {
                            if (params[e]) {
                                queryParams.push(e + '=' + params[e]);
                            }
                        });
                        query = queryParams.length > 0 ? '?' + queryParams.join('&') : "";

                        // get environment data endpoint
                        var dataEndpoint = this._toAPIFormat(base, location) + content + '.jsonp/' + query;
                        // get data via jsonp
                        this._jsonp(dataEndpoint);
                    } else {
                        //
                        if (this._core.compatability) {
                            window.Switchboard.environmentData = window.meta;
                        }
                        //
                        this._completeCallback();
                    }
                }

                /**
           * Get a data source from Switchboard
           * @param  {string} name Name of file or custom name
           * @return {*}      Environment data from Switchboard
           *
           * @example
           * SB.Env.load({
           * 	url:'http://demo.coatesdigital.com.au',
           * 	content: 'basic-coffee.zip',
           * 	success: function () {
           * 		SB.Env.get('content-name'); // return "basic-coffee.zip"
           *   	SB.Env.get('not-a-env-value'); // throw error
           * 	}
           * });
           */

            }, {
                key: 'get',
                value: function get(name) {
                    // exists with name
                    if (typeof window.Switchboard.environmentData[name] !== 'undefined') return window.Switchboard.environmentData[name];
                    // return the lot
                    if (typeof name === 'undefined') return window.Switchboard.environmentData;
                    // nothing exists
                    throw new Error('Environment Data does not exist in SB.Env');
                }

                /**
           * Verify a data source exists
           * @param  {string}  name Name of file or custom name
           * @return {Boolean}      Data source exists
           *
           * @example
           * SB.Env.load({
           * 	url:'http://demo.coatesdigital.com.au',
           * 	content: 'basic-coffee.zip',
           * 	success: function () {
           * 		SB.Env.has('content-name'); // return true
           *   	SB.Env.has('not-a-env-value'); // return false
           * 	}
           * });
           */

            }, {
                key: 'has',
                value: function has(name) {
                    try {
                        this.get(name);
                    } catch (e) {
                        return false;
                    }
                    return true;
                }

                /**
           * Add data and verify complete data load
           * @param  {string} name The name of the data source that has loaded
           * @param  {Array} data The data to store to the Switchboard object
           */

            }, {
                key: '_complete',
                value: function _complete(data) {
                    window.Switchboard.environmentData = data;
                    this._completeCallback();
                }

                /**
           * Formats url to include api path
           * @param  {string} url The url to format
           * @return {string}     The formatted url
           */

            }, {
                key: '_toAPIFormat',
                value: function _toAPIFormat(url, location, orientation, channelScreenId, screenId) {
                    if (url.indexOf('/api/environmentData/') < 0) {
                        if (url[url.length - 1] != '/') {
                            url += '/';
                        }
                        return url + 'api/environmentData/';
                    }
                }

                /**
           * Generates a script element from parameters
           * @param  {string} src          The url to the data source
           * @param  {string} callbackName The function name to call on data load
           * @return {HTMLElement}              Script HTML Element
           */

            }, {
                key: '_toScriptTag',
                value: function _toScriptTag(src, callback) {
                    var script = document.createElement('script');
                    var joinChar = src.indexOf('?') > 0 ? '&' : '?';
                    script.src = '' + src + joinChar + 'callback=' + EnvironmentGlobal + '._complete';
                    script.dataset.switchboard = true;
                    script.dataset.switchboardenv = true;
                    return script;
                }

                /**
           * Start JSONP
           * @param  {string} src          The url to the data source
           * @param  {string} callback     The name of the callback
           */

            }, {
                key: '_jsonp',
                value: function _jsonp(src, callback) {
                    document.body.appendChild(this._toScriptTag(src));
                }
            }, {
                key: 'location',


                /**
           * Get the environments location data
           * @return {object} See example
           *
           * @example
           * {
           * 	id: "Test",
           * 	name: "New Location 1",
           * 	label: "Red",
           * 	timezone: "Australia/Sydney",
           * 	groups: [
           * 		"location-group-1",
           * 		"location-group-2"
           * 	]
           * }
           */
                get: function get() {
                    return {
                        id: this.get('location'),
                        name: this.get('location-name'),
                        label: this.get('location-label'),
                        timezone: this.get('location-timezone'),
                        groups: this.get('location-groups')
                    };
                }

                /**
           * Get the orientation for this environment
           * @return {string} "vertical" | "horizontal"
           * @note "normal" === "vertical", "left" === "horizontal"
           */

            }, {
                key: 'orientation',
                get: function get() {
                    return this.get('orientation').toLowerCase() !== "normal" ? "vertical" : "horizontal";
                }

                /**
           * Get the screen sequence in the environment
           * @return {Number} the screens relative position in the environment, between 1-6
           */

            }, {
                key: 'sequence',
                get: function get() {
                    return parseInt(this.get('sequence'));
                }

                /**
           * Get the details for the content in this environment
           * @return {object} See example
           *
           * @example
           * {
           * 	name:"basic-coffee.zip",
           * 	label:"Red",
           * 	modified: "2016-01-17T19:18:54.000Z",
           * 	groups: [
           * 		"my-group",
           * 		"my-test-group"
           * 	]
           * }
           */

            }, {
                key: 'content',
                get: function get() {
                    return {
                        name: this.get('content-name'),
                        label: this.get('content-label'),
                        modified: this.get('content-modified'),
                        groups: this.get('content-groups')
                    };
                }

                /**
           * Get channel details for environment
           * @return {object} See example
           *
           * @example
           * {
           * 	name: "My channel name",
           * 	screen: "",
           * 	screens: [],
           * 	groups: []
           * }
           */

            }, {
                key: 'channel',
                get: function get() {
                    return {
                        name: this.get('channel-name'),
                        screen: this.get('channel-screen'),
                        screens: this.get('channel-screens'),
                        groups: this.get('channel-groups')
                    };
                }
            }], [{
                key: 'instance',
                value: function instance() {
                    return new Environment();
                }
            }]);

            return Environment;
        }();

        exports.default = Environment;

    }, {}], 6: [function (require, module, exports) {
        'use strict';

        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        /**
         * Add Array.from polyfill
         */
        if (!Array.from) {
            Array.from = function (object) {
                'use strict';

                return [].slice.call(object);
            };
        }

        /**
         * RequestAnimationFrame polyfill
         * @type {Number}
         */
        (function () {
            var lastTime = 0;
            var vendors = ['webkit', 'moz'];
            for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
                window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
                window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
            }
            if (!window.requestAnimationFrame) {
                window.requestAnimationFrame = function (callback, element) {
                    var currTime = new Date().getTime();
                    var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                    var id = window.setTimeout(function () {
                        callback(currTime + timeToCall);
                    }, timeToCall);
                    lastTime = currTime + timeToCall;
                    return id;
                };
            }
            if (!window.cancelAnimationFrame) {
                window.cancelAnimationFrame = function (id) {
                    clearTimeout(id);
                };
            }
        })();

        exports.Array = Array;

    }, {}], 7: [function (require, module, exports) {
        'use strict';

        Object.defineProperty(exports, "__esModule", {
            value: true
        });

        var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

        var _TimelineDebug = require('../debug/TimelineDebug');

        var _TimelineDebug2 = _interopRequireDefault(_TimelineDebug);

        var _Polyfill = require('./Polyfill');

        function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

        function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

        function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

        function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

        /**
         * The default framerate of a timeline
         * @type {Number}
         */
        var DefaultTimelineFramerate = 10;

        /**
         * The default cycle time of a timeline
         * @type {Number}
         */
        var DefaultTimelineCycleTime = 0;

        /**
         * Coordinates events within a cycle based on system clock
         * @example
         * var sb = new SB();
         * sb.timeline.addEvent(function () {...}, 0, 100); // callback will run every 100 ms
         */

        var Timeline = function () {

            /**
          * Initialises a new timeline and begins ticking
          * @param  {object} config  Adjusts timeline behaviour
          */
            function Timeline() {
                var _this = this;

                var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                _classCallCheck(this, Timeline);

                this._drawDebug = config.debug || false;
                this._timelineDebug = new _TimelineDebug2.default(this._drawDebug);

                this._framerate = config.framerate || DefaultTimelineFramerate;
                this._cycleTime = config.cycleTime || DefaultTimelineCycleTime;
                this._offset = config.offset || 0;

                this._timelineEvents = {};
                this._fixedEvents = [];
                this._intervalEvents = [];

                this._previous = 0;
                this._currentlyExecuting = null;

                this._frameLength = Math.floor(1000 / this._framerate);

                window.requestAnimationFrame(function () {
                    _this._update();
                });
            }

            /**
          * Add an event, if interval parameter is given the event will repeat
          * @param {Function}  callback The function to call on event trigger
          * @param {Number}  time The start time of the first event trigger
          * @param {Number} interval The interval between event trigger
          */


            _createClass(Timeline, [{
                key: 'addEvent',
                value: function addEvent(callback, time) {
                    var interval = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
                    var tag = arguments[3];

                    if (interval == null) return this._addFixedEvent(callback, time, tag); else return this._addIntervalEvent(callback, time, interval, tag);
                }

                /**
           * Get the latest event to the current time
           * @param  {Number} time The time to step back from
           */

            }, {
                key: 'triggerLatest',
                value: function triggerLatest() {
                    var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

                    if (time == null) time = this._cyclePosition;

                    while (time >= 0) {
                        if (this._timelineEvents[time]) {
                            this._timelineEvents[time].forEach(function (e) {
                                return e.trigger(time);
                            });
                            time = 0;
                        }

                        time -= this._frameLength;
                    }
                }

                /**
           * Clear current timeline events
           */

            }, {
                key: 'clear',
                value: function clear() {
                    this._timelineEvents = {};
                }

                /**
           * @deprecated
           * Perform cleanup operations
           */

            }, {
                key: 'cleanUp',
                value: function cleanUp() { }

                /**
           * Reset the timeline back to 0
           */

            }, {
                key: 'reset',
                value: function reset() {
                    this._offset = -Date.now();
                }

                /**
           * Set the total cycle time in milliseconds
           * @param  {Number} val The number of milliseconds
           */

            }, {
                key: '_update',


                /**
           * Update the timeline clock and run any events
           */
                value: function _update() {
                    var _this2 = this;

                    // store cycle position in local due to [Date mock limitation]
                    var cyclePosition = this._cyclePosition;

                    // if total animation time is 0, return
                    if (this._cycleTime == 0) {
                        return;
                    }

                    // get time from system clock
                    if (cyclePosition != this._currentExecuting) {
                        this._currentExecuting = cyclePosition;

                        var previous = this._previous;
                        for (var i = previous; i < cyclePosition; i++) {
                            if (this._timelineEvents[i]) {
                                this._timelineEvents[i].forEach(function (e) {
                                    return e.trigger(cyclePosition);
                                });
                            }
                        }
                        this._previous = this._currentExecuting;

                        // debug draw
                        this._timelineDebug.update(cyclePosition, this._cycleTime, this._timelineEvents);
                    }

                    window.requestAnimationFrame(function () {
                        _this2._update();
                    });
                }

                /**
           * Add an event that will play once per cycle
           * @param {Function}  callback The function to call on event trigger
           * @param {Number}  time The start time of the event trigger
           * @return {Object} The event that was created
           */

            }, {
                key: '_addFixedEvent',
                value: function _addFixedEvent(callback, time, tag) {
                    var ev = new FixedTimelineEvent(callback, this._toFrameTime(time), tag);
                    this._fixedEvents.push(ev);
                    this._generate();
                    return ev;
                }

                /**
           * Add an event that will play every {interval} seconds after {time}
           * @param {Function}  callback  The function to call on event trigger
           * @param {Number}  time  The start time of the first event trigger
           * @param {Number}  interval The interval between event trigger
           * @return {Object} The event that was created
           */

            }, {
                key: '_addIntervalEvent',
                value: function _addIntervalEvent(callback, time, interval, tag) {
                    var ev = new IntervalTimelineEvent(callback, this._toFrameTime(time), this._toFrameTime(interval), tag);
                    this._intervalEvents.push(ev);
                    this._generate();
                    return ev;
                }

                /**
          * Generate the timeline from events
          */

            }, {
                key: '_generate',
                value: function _generate() {
                    var _this3 = this;

                    if (this._cycleTime == 0) {
                        return;
                    }

                    // clear timeline
                    this.clear();

                    // insert fixed events to timeline
                    this._fixedEvents.forEach(function (e) {
                        _this3._insertEvent(e.time, e);
                    });

                    // insert interval events to timeline
                    this._intervalEvents.forEach(function (e) {
                        var counter = e.time;
                        while (counter < _this3._cycleTime) {
                            _this3._insertEvent(counter, e);
                            counter += e.interval;
                        }
                    });
                }

                /**
           * Insert event at time
           * @param {Number}  time The time to trigger the event
           * @param {TimelineEvent}  e The event to trigger
           */

            }, {
                key: '_insertEvent',
                value: function _insertEvent(time, e) {
                    if (typeof this._timelineEvents[time] === 'undefined') {
                        this._timelineEvents[time] = [];
                    }
                    this._timelineEvents[time].push(e);
                }

                /**
           * Get the current cycle position of timeline
           */

            }, {
                key: '_toFrameTime',


                /**
           * round the time to the nearest frame time
           * @param  {Number} time The time to convert in milliseconds
           * @return {Number}      The frame for that time
           */
                value: function _toFrameTime(time) {
                    return Math.floor(time / this._frameLength) * this._frameLength;
                }
            }, {
                key: 'cycleTime',
                set: function set(val) {
                    this._cycleTime = val;
                    this._generate();
                }
            }, {
                key: '_cyclePosition',
                get: function get() {
                    var millisecs = Date.now();

                    // offset milliseconds
                    millisecs += this._offset;

                    // check if any items to process from the timeline
                    return this._toFrameTime(millisecs % this._cycleTime);
                }
            }]);

            return Timeline;
        }();

        ;

        /**
         * Parent class of timeline events
         */

        var TimelineEvent = function () {
            /**
          * @param {Function} The function to call on event trigger
          * @param {Number} The time to trigger the event
          */
            function TimelineEvent(callback, time) {
                var tag = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

                _classCallCheck(this, TimelineEvent);

                this._callback = callback;
                this._time = time;
                this._tag = tag;
            }

            /**
          * The time the event runs
          * @return {number} The time the event runs
          */


            _createClass(TimelineEvent, [{
                key: 'trigger',


                /**
           * Executes the event callback
           */
                value: function trigger(time) {
                    this._callback(time);
                }
            }, {
                key: 'time',
                get: function get() {
                    return this._time;
                }

                /**
           * A tag describing the event
           * @return {string} The tag describing the event
           */

            }, {
                key: 'tag',
                get: function get() {
                    return this._tag;
                }
            }]);

            return TimelineEvent;
        }();

        /**
         * Timeline event that triggers once per timeline loop
         */


        var FixedTimelineEvent = function (_TimelineEvent) {
            _inherits(FixedTimelineEvent, _TimelineEvent);

            /**
          * @param {Function} callback The function to call on event trigger
          * @param {Number} time The time to trigger the event
          */
            function FixedTimelineEvent(callback, time, tag) {
                _classCallCheck(this, FixedTimelineEvent);

                return _possibleConstructorReturn(this, (FixedTimelineEvent.__proto__ || Object.getPrototypeOf(FixedTimelineEvent)).call(this, callback, time, tag));
            }

            return FixedTimelineEvent;
        }(TimelineEvent);

        /**
         * Timeline event that triggers multiple times per timeline loop
         */


        var IntervalTimelineEvent = function (_TimelineEvent2) {
            _inherits(IntervalTimelineEvent, _TimelineEvent2);

            /**
          * @param {Function} callback The function to call an event trigger
          * @param {Number}  time The time to trigger the event
          * @param {Number}  interval Time til event repeat trigger
          */
            function IntervalTimelineEvent(callback, time, interval, tag) {
                _classCallCheck(this, IntervalTimelineEvent);

                var _this5 = _possibleConstructorReturn(this, (IntervalTimelineEvent.__proto__ || Object.getPrototypeOf(IntervalTimelineEvent)).call(this, callback, time, tag));

                _this5._interval = interval;
                return _this5;
            }

            /**
          * The number of milliseconds between triggers
          * @return {Number} The number of milliseconds between triggers
          */


            _createClass(IntervalTimelineEvent, [{
                key: 'interval',
                get: function get() {
                    return this._interval;
                }
            }]);

            return IntervalTimelineEvent;
        }(TimelineEvent);

        /**
         * Performs event scheduling and syncing between switchboard interfaces
         */


        exports.default = Timeline;

    }, { "../debug/TimelineDebug": 8, "./Polyfill": 6 }], 8: [function (require, module, exports) {
        'use strict';

        Object.defineProperty(exports, "__esModule", {
            value: true
        });

        var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

        function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

        var TimelineDebugStyles = {
            canvas: {
                position: 'absolute',
                bottom: '0',
                left: '0',
                background: '#000',
                'border-top': '#f8f8f8 1px solid'
            }
        };

        var TDOuterPadding = 30;

        var TDMargin = 2;
        var TDBar = 4;

        var TDOffsetY = 0.5;
        var TDHeight = 0.3333333;

        var TDColor = {
            unprogress: '#333',
            progress: '#666',

            eventFixed: 'rgba(255,178,102,1)',
            eventInterval: 'rgba(102,204,255,1)',

            eventFixedDone: 'rgba(225,148,72,1)',
            eventIntervalDone: 'rgba(72,174,225,1)',

            eventTag: '#fff',

            text: '#FFFFFF'
        };

        /**
         * Debug class for timeline
         */

        var TimelineDebug = function () {

            /**
          * Set up TimelineDebug class
          * @param  {Boolean} debug Whether or not to draw the debug
          */
            function TimelineDebug() {
                var _this = this;

                var debug = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

                _classCallCheck(this, TimelineDebug);

                this._debug = debug;

                this._frame = 0;
                this._cycle = 0;
                this._events = [];

                this._mouse = { x: 0, y: 0 };
                this._tag = "";

                if (this._debug) {
                    this._canvas = document.createElement('canvas');
                    this._canvas.id = "sb-timeline-debug";

                    for (var key in TimelineDebugStyles.canvas) {
                        this._canvas.style[key] = TimelineDebugStyles.canvas[key];
                    } this._canvas.style.bottom = (this._debug - 1) * 10 + '%';

                    this._ctx = this._canvas.getContext('2d');
                    document.body.appendChild(this._canvas);

                    window.addEventListener('resize', function () {
                        _this.update(_this._frame, _this._cycle, _this._events);
                    });
                    this._resizeCanvas();

                    this._ctx.font = '20px Arial';
                    this._ctx.textAlign = 'center';
                    this._ctx.fillStyle = TDColor.text;
                    this._ctx.fillText("Timeline Inactive", this._canvas.width / 2, this._canvas.height / 2);

                    window.addEventListener('mousemove', function (e) {
                        _this._setMouse(e);
                    });
                }
            }

            /**
          * Update the timeline debug with timeline data and draw
          * @param  {Number} frame  The current time within the timeline
          * @param  {Number} cycle  The length of the timeline cycle
          * @param  {Array} events Array of events to draw
          */


            _createClass(TimelineDebug, [{
                key: 'update',
                value: function update(frame, cycle, events) {
                    this._frame = frame;
                    this._cycle = cycle;
                    this._events = events;

                    if (this._debug) {
                        var canvas = this._canvas;
                        var ctx = this._ctx;
                        this._resizeCanvas();

                        //
                        var width = canvas.width - TDOuterPadding * 2;

                        // clear draw
                        ctx.clearRect(0, 0, canvas.width, canvas.height);

                        var margin = TDMargin;
                        var bar = TDBar;

                        // draw progress
                        var progress = 0;
                        if (cycle) progress = Math.floor(frame / cycle * width / (margin + bar)) * (margin + bar);

                        for (var i = 0; i < width; i += margin + bar) {
                            ctx.fillStyle = TDColor.unprogress;
                            if (i < progress) {
                                ctx.fillStyle = TDColor.progress;
                            }

                            ctx.fillRect(i + TDOuterPadding, canvas.height * TDOffsetY, bar, canvas.height * TDHeight);
                        }

                        // draw events
                        this._eventTag = "";
                        for (var key in events) {
                            for (var _i = 0; _i < events[key].length; _i++) {
                                var event = events[key][_i];
                                this._drawEvent(progress, cycle, key, event, events[key]);
                            }
                        }
                        this._drawEventTag(this._eventTag, TDOuterPadding, TDOuterPadding);

                        ctx.fillStyle = "#000";
                        ctx.fillRect(0, canvas.height * (TDOffsetY + TDHeight * 0.5), canvas.width, 1);
                    }
                }

                /**
           * Draw event to the timeline
           * @param  {Number} progress Current position in timeline
           * @param  {Number} cycle    Total length of timeline
           * @param  {Number} time     Event position in timeline
           * @param  {TimelineEvent} event    Event to draw
           * @param  {TimelineEvents[]} events   All the events for the current position
           */

            }, {
                key: '_drawEvent',
                value: function _drawEvent(progress, cycle, time, event, events) {
                    var canvas = this._canvas;
                    var ctx = this._ctx;

                    var width = canvas.width - TDOuterPadding * 2;

                    var margin = TDMargin;
                    var bar = TDBar;

                    var isFixed = this._isFixed(event);
                    var color = TDColor.eventFixed,
                        doneColor = TDColor.eventFixedDone,
                        offsetY = canvas.height * TDHeight * 0.5,
                        offsetH = offsetY;

                    if (!isFixed) {
                        color = TDColor.eventInterval;
                        doneColor = TDColor.eventIntervalDone;
                        offsetY = 0;
                        offsetH = canvas.height * TDHeight * 0.5;
                    }

                    var pos = {
                        x: Math.floor(time / cycle * width / (margin + bar)) * (margin + bar) + TDOuterPadding,
                        y: canvas.height * TDOffsetY + offsetY
                    };

                    ctx.fillStyle = color;
                    if (pos < progress) {
                        ctx.fillStyle = doneColor;
                    }

                    ctx.fillRect(pos.x, pos.y, bar, offsetH);

                    // Add event name to label
                    var tagOffset = isFixed ? offsetH + 12 : -10;
                    if (this._isOver(pos.x, pos.y, bar, offsetH)) {
                        this._addEventTag((event.tag || '[No Tag]') + ' ' + (time / 1000).toFixed(3) + 's');
                    }
                }

                /**
           * Add current event tag to current event label
           * @param {string} tag The tag describing the event
           */

            }, {
                key: '_addEventTag',
                value: function _addEventTag(tag) {
                    if (this._eventTag != "") this._eventTag += ", ";
                    this._eventTag += tag;
                }

                /**
           * Draw the event tag to canvas
           * @param  {string} tag The tag to draw
           * @param  {Number} x   The x coord to draw text
           * @param  {Number} y   The y coord to draw text
           */

            }, {
                key: '_drawEventTag',
                value: function _drawEventTag(tag, x, y) {
                    this._ctx.textAlign = 'left';
                    this._ctx.font = '20px Arial';
                    this._ctx.fillStyle = TDColor.eventTag;
                    this._ctx.fillText(tag, x, y);
                }

                /**
           * Resize the canvas on window resize event
           */

            }, {
                key: '_resizeCanvas',
                value: function _resizeCanvas() {
                    this._canvas.width = window.innerWidth;
                    this._canvas.height = window.innerHeight * 0.1;
                }

                /**
           * Is an event a fixed event
           * @param  {TimelineEvent}  event The event to determine is fixed
           * @return {Boolean}       Event is instance of FixedTimelineEvent
           */

            }, {
                key: '_isFixed',
                value: function _isFixed(event) {
                    return typeof event.interval === 'undefined';
                }

                /**
           * Check if mouse is over certain area
           * @param  {Number}  x Top x coord of area
           * @param  {Number}  y Top y coord of area
           * @param  {Number}  w Width of the area
           * @param  {Number}  h Height of the area
           * @return {Boolean}   Is the mouse over the area specified
           */

            }, {
                key: '_isOver',
                value: function _isOver(x, y, w, h) {
                    // check if mouse is over box
                    var m = this._mouse;

                    var padding = 4;
                    x -= padding;
                    y -= padding;
                    w += padding * 2;
                    h += padding * 2;

                    return x < m.x && x + w > m.x && y < m.y && y + h > m.y;
                }

                /**
           * Handle mouse move event
           * @param {Event} e The mouse move event object
           */

            }, {
                key: '_setMouse',
                value: function _setMouse(e) {
                    var rect = this._canvas.getBoundingClientRect();
                    this._mouse = {
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top
                    };
                }
            }]);

            return TimelineDebug;
        }();

        ;

        exports.default = TimelineDebug;

    }, {}], 9: [function (require, module, exports) {
        'use strict';

        Object.defineProperty(exports, "__esModule", {
            value: true
        });

        var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

        function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

        /**
         * Wraps the core components
         */
        var QueryString = function () {
            function QueryString() {
                _classCallCheck(this, QueryString);
            }

            _createClass(QueryString, null, [{
                key: 'get',


                /**
           * Get a query string parameter
           * @param  {string} param The name of the value to get
           * @return {string}       The corresponding value
           */
                value: function get(param) {
                    var searchString = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window.location.search;

                    var search = searchString.substring(1);
                    var vars = search.split('&');

                    for (var i = 0; i < vars.length; i++) {
                        var keyvalue = vars[i].split('=');
                        if (keyvalue[0] == param) {
                            return keyvalue[1];
                        }
                    }

                    return null;
                }
            }]);

            return QueryString;
        }();

        ;

        /**
         * Provide helper function for dealing with url
         */
        exports.default = QueryString;

    }, {}], 10: [function (require, module, exports) {
        'use strict';

        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        /**
         *	Util.js
         *
         *	@file Includes generic utilities and helpers
         *
         */

        var Util = {
            /**
          * @return {String}	return name of current zipfile from URL or undefined
          */
            get contentName() {
                delete this.contentName;
                return this.contentName = _.find(window.location.href.split('/'), function (val) {
                    return val.indexOf('.zip') !== -1;
                }).replace('%20', ' ');
            }
        };

        exports.default = Util;

    }, {}]
}, {}, [1])