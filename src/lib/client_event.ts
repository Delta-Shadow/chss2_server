import { type Server, type Socket } from 'socket.io'
import { z, type Schema, ZodError } from 'zod'

import App from '../app'
import Error, { ValidationError, InternalServerError } from './errors'

type Callback = (err: Error) => void

abstract class ClientEvent {
	io: Server
	socket: Socket
	app: App
	event_name: string
	schema: Schema = z.any()

	constructor(event_name: string, io: Server, socket: Socket, app: App) {
		this.event_name = event_name
		this.io = io
		this.socket = socket
		this.app = app
		socket.on(this.event_name, this.#process.bind(this))
	}

	#process(_params: any, _callback?: Callback) {
		const callback: Callback = err => {
			if (_callback) _callback(err)
		}

		try {
			const params = this.schema.parse(_params)
			this.handle(params)
		} catch (e) {
			if (e instanceof ZodError) {
				const err_data = e.format()
				const err = new ValidationError(err_data)
				callback(err)
			} else if (e instanceof Error) {
				callback(e)
			} else {
				const err = new InternalServerError('Unknown error occurred on the server')
				callback(err)
			}
		}
	}

	handle(data: any) {}
}

export default ClientEvent
