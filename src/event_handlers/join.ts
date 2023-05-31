import { type Server, type Socket } from 'socket.io'
import isAlphanumeric from 'validator/lib/isAlphanumeric'

import App from '../app'
import EventHandler from './event_handler'

// Lib
import logger from '../lib/logger'

interface EventData {
	room: string
	name: string
}

class JoinEventHandler extends EventHandler<EventData> {
	constructor(io: Server, socket: Socket, app: App) {
		super('join', io, socket, app)

		this.event_data = {
			room: {
				required: true,
				validation_rules: [
					{
						test: isAlphanumeric,
						fail_msg: 'Can only be alphanumeric'
					}
				]
			},
			name: {
				validation_rules: [
					{
						test: isAlphanumeric,
						fail_msg: 'Can only be alphanumeric'
					}
				]
			}
		}

		this.handle = (data, callback) => {}
	}
}

export default JoinEventHandler
