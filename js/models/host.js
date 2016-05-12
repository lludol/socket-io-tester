'use strict';

const Backbone = require('backbone');

class HostModel extends Backbone.Model {
	constructor(data) {
		super(data);
	}

	defaults() {
		return {
			host: 'http://127.0.0.1',
			port: 5000
		}
	}
}

module.exports = HostModel;
