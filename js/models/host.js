const Backbone = require('backbone');

/**
 * HostModel is a Backbone model which handle the host and the port of the socket server.
 */
class HostModel extends Backbone.Model {
	/**
	 * Define the defaults values for the Model.
	 * @return {Object} An Object with default values.
	 */
	defaults() {
		return {
			host: 'http://127.0.0.1',
			port: 5000,
		};
	}
}

module.exports = HostModel;
