import App from './app'
import { Server as HttpServer } from 'http'
import { Server as SocketServer } from 'socket.io'

// Events
import JoinEvent from './client_events/join'

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
			let sid: string = socket.handshake.auth['sid']
			// If the sid is absent
			// Or no player with that sid exists
			if (!sid || !app.players.exists(sid)) {
				// Create a new player with a new sid
				let { sid, player } = app.players.create()
				// Store it all inside the socket to be used later
				socket.data.sid = sid
				socket.data.player = player
			} else {
				// Sid and player both exist
				// Get existing player data and store it inside socket
				socket.data.sid = sid
				socket.data.player = app.players.get(sid)
			}
			next()
		})

		this.on('connection', socket => {
			// Upon connection, emit the sid and pid to the client
			socket.emit('session', { sid: socket.data.sid, pid: socket.data.player.pid })

			// Assign all event handlers
			new JoinEvent(this, socket, app)
		})
	}
}

export default Server
