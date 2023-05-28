import { type Server, type Socket } from 'socket.io'

// Lib
import logger from '../lib/logger'
import EventHandler from '../lib/event_handler'

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
