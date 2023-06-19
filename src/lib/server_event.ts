import { Server, Socket } from 'socket.io'
import App from '../app'

abstract class ServerEvent {
	io: Server
	socket: Socket
	app: App
	rid?: string
	name: string

	constructor(name: string, io: Server, socket: Socket, app: App, rid?: string) {
		this.io = io
		this.socket = socket
		this.app = app
		this.rid = rid
		this.name = name
	}

	abstract get data(): any

	emit() {
		this.socket.emit(this.name, this.data)
	}

	broadcast() {
		if (!this.rid) return
		this.io.in(this.rid).emit(this.name, this.data)
	}

	broadcast_except_sender() {
		if (!this.rid) return
		this.socket.in(this.rid).emit(this.name, this.data)
	}
}

export default ServerEvent
