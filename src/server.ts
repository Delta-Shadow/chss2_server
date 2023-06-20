import App from './app'
import { Server as HttpServer } from 'http'
import { Server as SocketServer, Socket } from 'socket.io'

// Client Events
import JoinEvent from './client_events/join'
import Disconnect from './client_events/disconnect'
import MsgEvent from './client_events/msg'
import PlayEvent from './client_events/play'

// Server Events
import SessionUpdate from './server_events/session_update'

// Types
import { PlayerData } from './lib/player_manager'

interface SocketInfo {
	sid: string
	player: PlayerData
}

// Declaring a new property 'info' on the socket object
declare module 'socket.io' {
	interface Socket {
		info: SocketInfo
	}
}

Socket.prototype.info = new Object() as SocketInfo

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
				socket.info.sid = sid
				socket.info.player = player
			} else {
				// Sid and player both exist
				// Get existing player data and store it inside socket
				socket.info.sid = sid
				socket.info.player = app.players.get(sid)
			}
			next()
		})

		this.on('connection', socket => {
			// Upon connection, emit the sid and pid to the client
			new SessionUpdate(this, socket, app).emit()

			// Assign all event handlers
			new JoinEvent(this, socket, app)
			new PlayEvent(this, socket, app)
			new MsgEvent(this, socket, app)
			new Disconnect(this, socket, app)
		})
	}
}

export default Server
