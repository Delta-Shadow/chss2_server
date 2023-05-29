import { Server } from 'socket.io'

// Events
import JoinEventHandler from './event_handlers/join'

// Lib
import logger from './lib/logger'
import Manager from './lib/manager'

class App {
	io: Server
	manager: Manager

	constructor() {
		// Creating the manager
		this.manager = new Manager()

		// Creating the Socket IO Server
		this.io = new Server({
			// CORS config
			cors: {
				origin: process.env.CLIENT_ORIGIN ?? '*'
			},
			// Do no serve the client library
			serveClient: false
		})

		// Assign all event handlers
		this.io.on('connection', socket => {
			logger.debug('received connection: ', {
				id: socket.id,
				handshake: socket.handshake.auth
			})

			new JoinEventHandler(this.io, socket)
		})
	}
}

export default App
