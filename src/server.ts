import App from './app'
import { Server as HttpServer } from 'http'
import { Server as SocketServer } from 'socket.io'

// Events
import JoinEventHandler from './event_handlers/join'

// Lib
import logger from './lib/logger'

class Server extends SocketServer {
	constructor(http_server: HttpServer, app: App) {
		super({
			// CORS config
			cors: {
				origin: process.env.CLIENT_ORIGIN ?? '*'
			},
			// Do no serve the client library
			serveClient: false
		})

		// Assign all event handlers
		this.on('connection', socket => {
			logger.debug('received connection: ', {
				id: socket.id,
				handshake: socket.handshake.auth
			})

			new JoinEventHandler(this, socket)
		})
	}
}

export default Server
