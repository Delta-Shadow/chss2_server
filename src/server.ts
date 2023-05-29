import App from './app'
import { Server as HttpServer } from 'http'
import { Server as SocketServer } from 'socket.io'

// Events
import JoinEventHandler from './event_handlers/join'

// Lib
import logger from './lib/logger'

class Server extends SocketServer {
	constructor(http_server: HttpServer, app: App) {
		super(http_server, {
			// CORS config
			cors: {
				origin: process.env.CLIENT_ORIGIN ?? '*'
			},
			// Do no serve the client library
			serveClient: false
		})

		// Session management
		this.use((socket, next) => {
			// Existing sid from the auth field
			let sid = socket.handshake.auth['sid']
			// If the sid is absent
			// Or no player with that sid exists
			// Create a new player with a new sid
			if (!sid || !app.players.exists(sid)) sid = app.players.add()
			// Store that sid inside the socket to be used later
			socket.data.sid = sid
			next()
		})

		this.on('connection', socket => {
			// Upon connection emit the session id to the client
			socket.emit('session', { sid: socket.data.sid })

			// Assign all event handlers
			new JoinEventHandler(this, socket)
		})
	}
}

export default Server
