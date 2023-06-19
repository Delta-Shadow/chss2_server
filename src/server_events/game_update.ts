import ServerEvent from '../lib/server_event'
import { Server, Socket } from 'socket.io'
import App from '../app'

class GameUpdate extends ServerEvent {
	constructor(io: Server, socket: Socket, app: App, rid: string) {
		super('game_update', io, socket, app, rid)
	}

	get data() {
		return {
			state: this.app.rooms.get(this.rid!).game.state()
		}
	}
}

export default GameUpdate
