import { type Server, type Socket } from 'socket.io'
import logger from '../lib/logger'

interface FieldOptions {
	required?: boolean
	validation_rules?: [
		{
			test: (value: string) => boolean
			fail_msg: string
		}
	]
}

interface CallbackData {
	err: string
	data?: any
}

type Callback = (data: CallbackData) => void

abstract class EventHandler<EventData> {
	io: Server
	socket: Socket
	event_name: string
	event_data?: Record<keyof EventData, FieldOptions>

	constructor(event_name: string, io: Server, socket: Socket) {
		this.event_name = event_name
		this.io = io
		this.socket = socket
		socket.on(this.event_name, this.#process.bind(this))
	}

	#process(data: any, callback?: Callback) {
		const _callback = (callback_data: CallbackData) => {
			if (callback) callback(callback_data)
		}
		const _valid = this.#valid(data, _callback)
		if (!_valid) return
		this.handle(data, _callback)
	}

	#valid(data: any, callback: Callback) {
		if (!this.event_data) return true

		const fields = Object.keys(this.event_data)
		const field_options = Object.values(this.event_data) as Array<FieldOptions>
		let failures = Object.fromEntries(fields.map(field => [field, new Array()]))

		for (let i = 0; i < fields.length; i++) {
			const field = fields[i]
			const options = field_options[i]
			if (options.required && !(field in data)) failures[field].push('This field is required')
			else if (field in data && options.validation_rules) {
				options.validation_rules.forEach(rule => {
					if (!rule.test(`${data[field]}`)) failures[field].push(rule.fail_msg)
				})
			}
		}

		const failed = Object.values(failures).some(failure => failure.length > 0)
		callback({ err: 'Validation failed', data: failures! })
		return failed
	}

	handle(data: EventData, callback: Callback) {}
}

export default EventHandler
