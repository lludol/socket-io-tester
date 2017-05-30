const path = require('path');
const Configstore = require('configstore');

const pkg = require(path.resolve('package.json'));

/**
 * The ConfigStore class handle the storage of persistant datas for the app.
 */
class ConfigStore {
	/**
	 * Initialize the ConfigStore Object.
	 */
	constructor() {
		this.conf = new Configstore(pkg.name);
	}

	/**
	 * Return a value from the storage.
	 * @param {String} name - The name of the value.
	 * @return {Object} The value.
	 */
	get(name) {
		return this.conf.get(name);
	}

	/**
	 * Set a value associated with a name in the storage.
	 * @param {String} name - The name.
	 * @param {Object} value - The value.
	 */
	set(name, value) {
		this.conf.set(name, value);
	}
}

module.exports = new ConfigStore();
