const io = require('socket.io-client');
const path = require('path');

const configstore = require('../configStore.js');
const View = require('./view.js');

/**
 * The SocketTester view where we can emit and listen socketss.
 */
class SocketTesterView extends View {
	/**
	 * Initialize datas for the SocketTesterView.
	 */
	constructor() {
		super({
			events: {
				'click #buttonChangeStatus':          'onClickButtonChangeStatus',
				'click #buttonSendSocket':            'onClickButtonSendSocket',
				'click #buttonSendListen':            'onClickButtonSendListen',
				'click #buttonRemoveOutputDiv':       'onClickButtonRemoveOutputDiv',
				'click #buttonRemoveOutputDivListen': 'onButtonRemoveOutputDivListen',
				'change input[type=radio]':           'onChangeInput',
			},
		});

		this.initializeTemplate(path.join(__dirname, '../templates/socket_tester.hbs'));

		this.host = configstore.get('host');
		if (this.host.port.length > 0) {
			this.socket	= io(`${this.host.host}:${this.host.port}`);
		} else {
			this.socket	= io(this.host.host);
		}

		this.socket.on('connect', () => {
			$('#statusIcon').removeClass('green').addClass('green');
			$('#statusMessage').text('Connected');

			$('.field').removeClass('disabled');

			$('#buttonSendSocket').removeClass('disabled');
			$('#buttonSendListen').removeClass('disabled');
			$('#buttonChangeStatus').addClass('red').removeClass('green').text('Disconnect');
		});

		this.socket.on('disconnect', () => {
			$('#statusIcon').removeClass('green').addClass('red');
			$('#statusMessage').text('Disconnected');

			$('.field').addClass('disabled');

			$('#buttonSendSocket').addClass('disabled');
			$('#buttonSendListen').addClass('disabled');
			$('#buttonChangeStatus').addClass('green').removeClass('red').text('Reconnect');
		});
	}

	/**
	 * Add a div with the result from the socket server.
	 * @param {String} className - The name the class associated with the div.
	 * @param {String} eventName - The name of the socket event.
	 * @param {Object} insertBefore - Insert the div before this element.
	 * @param {Object} data - The result from the server.
	 * @param {Function} onRemove - A function called when the element is removed.
	 * @return {Object} The created div.
	 */
	createOutput(className, eventName, insertBefore, data, onRemove) {
		const outputDiv = $('#divOutput').clone();

		outputDiv.attr('id', '');
		outputDiv.addClass(className);

		outputDiv.find('i').click(function () {
			$(this).parent().remove();
			onRemove();
		});

		outputDiv.find('h2').text(eventName);
		if (data) {
			outputDiv.find('p').append(JSON.stringify(data));
		}

		outputDiv.insertBefore(insertBefore);
		outputDiv.show();

		return outputDiv;
	}

	/**
	 * When the user click on the button to reconnect the app to the socket server.
	 */
	onClickButtonChangeStatus() {
		if (this.socket.connected) {
			this.socket.disconnect();
		} else {
			this.socket.connect();
		}
	}

	/**
	 * When the user click on the button to emit a message.
	 * @param {Object} e - The click event.
	 */
	onClickButtonSendSocket(e) {
		e.preventDefault();

		const eventName	= $('#inputEventName').val();
		const radio		= $('input[name=radioDataType]:checked', '#formTestSocket').val();
		let data		= null;

		$('#sendInputError').hide();
		$('#sendInputError').find('ul').empty();

		if (eventName === null || eventName.length === 0) {
			$('#sendInputError').show().find('ul').append('<li>Please enter the name of the event</li>');
		}

		if (radio === 'text') {
			data = $('#inputText').val();
			if (data === null || data.length === 0) {
				$('#sendInputError').show().find('ul').append('<li>Please enter the text that will be sent to the event</li>');
			}
		} else if (radio === 'json') {
			data = $('#inputJSON').val();
			if (data === null || data.length === 0) {
				$('#sendInputError').show().find('ul').append('<li>Please enter the JSON that will be sent to the event</li>');
			} else {
				try {
					data = JSON.parse(data);
				} catch (error) {
					$('#sendInputError').show().find('ul').append(`<li>${error}</li>`);
				}
			}
		}

		if (!$('#sendInputError').is(':visible')) {
			this.socket.emit(eventName, data, (dataReceived) => {
				this.createOutput('outputDiv', eventName, $('#buttonRemoveOutputDiv'), dataReceived, () => {
					if ($('.outputDiv').length === 0) {
						$('#buttonRemoveOutputDiv').hide();
					}
				});
				if (!$('#buttonRemoveOutputDiv').is(':visible')) {
					$('#buttonRemoveOutputDiv').show();
				}
			});
		}
	}

	/**
	 * When the user click on the button to add a socket to listen.
	 * @param {Object} e - The click event.
	 */
	onClickButtonSendListen(e) {
		e.preventDefault();

		$('#sendInputListenError').hide().find('ul').empty();

		const eventName = $('#inputEventNameToListen').val();

		if (eventName === null || eventName.length === 0) {
			$('#sendInputListenError').show().find('ul').append('<li>Please enter the name of the event</li>');
		} else {
			const outputDiv = this.createOutput('outputDivListen', eventName, $('#buttonRemoveOutputDivListen'), null, () => {
				if ($('.outputDivListen').length === 0) {
					$('#buttonRemoveOutputDivListen').hide();
				}
				this.socket.removeAllListeners(eventName);
			});

			if (!$('#buttonRemoveOutputDivListen').is(':visible')) {
				$('#buttonRemoveOutputDivListen').show();
			}

			this.socket.on(eventName, (data) => {
				outputDiv.find('p').append(JSON.stringify(data));
				outputDiv.find('p').append('<br>');
			});
		}
	}

	/**
	 * Called when the user click on the cross to remove the emit div output.
	 */
	onClickButtonRemoveOutputDiv() {
		$('.outputDiv').remove();
		$('#buttonRemoveOutputDiv').hide();
	}

	/**
	 * Called when the user click on the cross to remove the listen div output.
	 */
	onButtonRemoveOutputDivListen() {
		$('.outputDivListen').remove();
		$('#buttonRemoveOutputDivListen').hide();
		this.socket.removeAllListeners();
	}

	/**
	 * Method called when the user change the data type.
	 * @param {Object} e - The change event.
	 */
	onChangeInput(e) {
		const value = $(e.currentTarget).val();
		if (value === 'text') {
			$('#textField').show();
			$('#jsonField').hide();
		} else {
			$('#textField').hide();
			$('#jsonField').show();
		}
		$('#sendInputError').hide();
	}

	/**
	 * Render the view.
	 */
	render() {
		this.$el.html(this.template(this.host));
	}
}

module.exports = SocketTesterView;
