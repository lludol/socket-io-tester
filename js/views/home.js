const Backbone = require('backbone');
const path = require('path');

const configstore = require('../configStore.js');
const HostModel = require('../models/host.js');
const validator	= require('validator');
const View = require('./view.js');

/**
 * The HomeView is where we can enter the socket URL and start the connection.
 */
class HomeView extends View {
	/**
	 * Initialize datas for the HomeView.
	 */
	constructor() {
		super({
			events: {
				'click #buttonConnection': 'clickButtonConnection',
			},
		});
		this.initializeTemplate(path.join(__dirname, '/../templates/home.hbs'));
		const hostConfig = configstore.get('host');
		this.hostModel = new HostModel(hostConfig);
	}

	/**
	 * Method called when the user click on the connection button.
	 * @param {Object} e - The click event.
	 */
	clickButtonConnection(e) {
		e.preventDefault();
		const data = {
			host: $('#inputHost').val(),
			port: $('#inputPort').val(),
		};

		if (validator.isURL(data.host) && (data.port.length === 0 || validator.isNumeric(data.port))) {
			if (!data.host.startsWith('http://') && !data.host.startsWith('https://')) {
				data.host = `http://${data.host}`;
			}
			configstore.set('host', new HostModel(data));
			Backbone.history.navigate('socket_tester', true);
		}
	}

	/**
	 * Render the view.
	 */
	render() {
		this.$el.html(this.template(this.hostModel.toJSON()));
	}
}

module.exports = HomeView;
