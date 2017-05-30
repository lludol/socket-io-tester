const Backbone = require('backbone');
const path = require('path');

const Router = require(path.resolve('js/router.js'));

/**
 * Start the app by setting the Backbone Router.
 */
class SocketIOTester {
	/**
	 * Initilize the Backbone Router.
	 */
	constructor() {
		this.router = new Router();
		Backbone.history.start();
	}
}

module.exports = new SocketIOTester();
