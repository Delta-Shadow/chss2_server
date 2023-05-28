import { type Server, type Socket } from 'socket.io'

abstract class EventHandler {
	io: Server
	socket: Socket
	event_name: string

	constructor(event_name: string, io: Server, socket: Socket) {
		this.event_name = event_name
		this.io = io
		this.socket = socket
		socket.on(this.event_name, this.handle)
	}

	abstract handle(data: any, callback: () => void): void
}

export default EventHandler
