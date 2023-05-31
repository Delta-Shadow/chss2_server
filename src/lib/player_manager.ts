import { v4 as uuid } from 'uuid'
import logger from './logger'

interface PlayerData {
	pid: string
	rid?: string
	name?: string
}

type UpdatablePlayerData = Omit<PlayerData, 'pid'>

class PlayerManager {
	#players: Record<string, PlayerData> = {}

	exists(sid: string) {
		return sid in this.#players
	}

	get(sid: string) {
		return this.#players[sid]
	}

	create() {
		const sid = uuid()
		const pid = uuid()
		this.#players[sid] = { pid }
		return { sid, player: this.#players[sid] }
	}

	update(sid: string, data: UpdatablePlayerData) {
		const player = this.#players[sid]
		Object.entries(data).forEach(datum => {
			const [field, value] = datum as [keyof UpdatablePlayerData, any]
			if (field in player) player[field] = value
		})
	}
}

export default PlayerManager
