import { type Server, type Socket } from 'socket.io'

import EventHandler from './event_handler'

// Lib
import logger from '../lib/logger'

interface EventData {}

interface EventResponseData {}

type EventCallback = (data: EventResponseData) => void

class DisconnectEventHandler extends EventHandler {
	constructor(io: Server, socket: Socket) {
		super('disconnect', io, socket)
	}

	handle(data: EventData, callback: EventCallback) {
		logger.debug(`received ${this.event_name} event`)
	}
}

export default DisconnectEventHandler
