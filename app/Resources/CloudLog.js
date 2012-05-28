var exports = exports || this;
exports.CloudLog = (function(global){
	var K = function(){}

	var CloudLog = function(options){
		var self;

		if (this instanceof CloudLog) {
			self = this;
		} else {
			self = new K();
		}

		if (!options) { options = {}; }
		self.username = options.username;
		self.password = options.password;
		self.classname = options.classname || 'logs';

		self.Cloud = require('ti.cloud');

		self.Cloud.Users.login({
			login: self.username,
			password: self.password
		}, function(e){
			if (e.success) {
				Ti.API.info('Logger user logged in');
			} else {
				Ti.API.info('Logger user login failed');
			}
		});

		return self;
	};

	K.prototype = CloudLog.prototype;

	CloudLog.prototype._log = function(level, options){
		var self = this;

		if (!options) { options = {}; }
		if (!options.message) { return; }

		self.Cloud.Objects.create({
			classname: self.classname,
			fields: {
				level: level,
				message: options.message
			}
		}, function(e){
			if (e.success) {
				if (options.success) { options.success(); }
			} else {
				if (options.error) { options.error(); }
			}
		});
	};

	CloudLog.prototype.debug = function(options){
		var self = this;

		self._log('debug', options);
	};

	CloudLog.prototype.info = function(options){
		var self = this;

		self._log('info', options);
	};

	CloudLog.prototype.warn = function(options){
		var self = this;

		self._log('warn', options);
	};

	CloudLog.prototype.error = function(options){
		var self = this;

		self._log('error', options);
	};

	return CloudLog;
})(this);
