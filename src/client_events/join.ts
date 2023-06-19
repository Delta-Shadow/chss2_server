import { type Server, type Socket } from 'socket.io'
import { z } from 'zod'

import App from '../app'
import ClientEvent from '../lib/client_event'
import { OpFailed } from '../lib/errors'

class JoinEvent extends ClientEvent {
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

export default JoinEvent
