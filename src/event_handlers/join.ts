import { type Server, type Socket } from 'socket.io'
import { z } from 'zod'
// import isAlphanumeric from 'validator/lib/isAlphanumeric'

import App from '../app'
import EventHandler from './event_handler'
import { OpFailed } from '../lib/errors'

// Lib
// import logger from '../lib/logger'

class JoinEventHandler extends EventHandler {
	constructor(io: Server, socket: Socket, app: App) {
		super('join', io, socket, app)
	}

	schema = z.object({
		name: z.string(),
		room: z.number()
	})

	handle(params: z.infer<typeof this.schema>) {
		throw new OpFailed('You suck')
		console.log(params.name)
	}
}

export default JoinEventHandler
