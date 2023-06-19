import ServerEvent from '../lib/server_event'
import { Server, Socket } from 'socket.io'
import App from '../app'

class SocialUpdate extends ServerEvent {
	constructor(io: Server, socket: Socket, app: App, rid: string) {
		super('social_update', io, socket, app, rid)
	}

	get data() {
		return {
			players: this.app.players.from(this.rid!),
			msgs: []
		}
	}
}

export default SocialUpdate
