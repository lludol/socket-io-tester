'use strict';

const configstore	= require('./../configStore.js');
const View			= require('./view.js');
const io			= require('socket.io-client');

class SocketTesterView extends View {
	constructor() {
		super({
			events: {
				'click #buttonChangeStatus':			'onClickButtonChangeStatus',
				'click #buttonSendSocket':				'onClickButtonSendSocket',
				'click #buttonSendListen':				'onClickButtonSendListen',
				'click #buttonRemoveOutputDiv':			'onClickButtonRemoveOutputDiv',
				'click #buttonRemoveOutputDivListen':	'onButtonRemoveOutputDivListen',
				'change input[type=radio]':				'onChangeInput'
			}
		});

		this.initializeTemplate(__dirname + '/../templates/socket_tester.hbs');

		this.host	= configstore.get('host');
		this.socket	= io(this.host.host + ':' + this.host.port);

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

	createOutput(className, eventName, insertBefore, data, onRemove) {
		const outputDiv = $('#divOutput').clone();

		outputDiv.attr('id', '');
		outputDiv.addClass(className);

		outputDiv.find('i').click(() => {
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

	onClickButtonChangeStatus() {
		if (this.socket.connected) {
			this.socket.disconnect();
		} else {
			this.socket.connect();
		}
	}

	onClickButtonSendSocket(e) {
		e.preventDefault();

		const eventName	= $('#inputEventName').val();
		const radio		= $('input[name=radioDataType]:checked', '#formTestSocket').val();
		let data		= null;

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
					$('#sendInputError').show().find('ul').append('<li>' + error + '</li>');
				}
			}
		}

		if (!$('#sendInputError').is(':visible')) {
			this.socket.emit(eventName, data, (data) => {
				this.createOutput('outputDiv', eventName, $('#buttonRemoveOutputDiv'), data, () => {
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

			this.socket.on(eventName, function(data) {
				outputDiv.find('p').append(JSON.stringify(data));
				outputDiv.find('p').append('<br>');
			});
		}
	}

	onClickButtonRemoveOutputDiv() {
		$('.outputDiv').remove();
		$('#buttonRemoveOutputDiv').hide();
	}

	onButtonRemoveOutputDivListen() {
		$('.outputDivListen').remove();
		$('#buttonRemoveOutputDivListen').hide();
		this.socket.removeAllListeners();
	}

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

	render() {
		this.$el.html(this.template(this.host));
	}
}

module.exports = SocketTesterView;
