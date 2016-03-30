'use strict';

const Configstore	= require('configstore');
const pkg			= require(__dirname + '/../package.json');

class ConfigStore {
	constructor() {
		this.conf = new Configstore(pkg.name);
	}

	get(name) {
		return this.conf.get(name);
	}

	set(name, value) {
		this.conf.set(name, value);
	}
}

module.exports = new ConfigStore();
