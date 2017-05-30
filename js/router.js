const Backbone = require('backbone');
const HomeView = require('./views/home.js');
const SocketTesterView = require('./views/socketTester.js');
const $ = require('jquery');

/**
 * The Router class handle every route of the Backbone app.
 */
class Router extends Backbone.Router {
	/**
	 * Define routes.
	 */
	constructor() {
		const options = {
			routes: {
				'':            'home',
				socket_tester: 'socketTester',
			},
		};
		super(options);
	}

	/**
	 * Load the HomeView.
	 */
	home() {
		const homeView = new HomeView();
		homeView.render();
		$('#view').empty().append(homeView.$el);
	}

	/**
	 * Load the SocketTesterView.
	 */
	socketTester() {
		const socketTesterView = new SocketTesterView();
		socketTesterView.render();
		$('#view').empty().append(socketTesterView.$el);
	}
}

module.exports = Router;
