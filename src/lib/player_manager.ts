import { v4 as uuid } from 'uuid'

interface PlayerData {
	pid: string
	rid?: string
	name?: string
}

type UpdatablePlayerDataFields = Omit<PlayerData, 'pid'>

class PlayerManager {
	#players: Record<string, PlayerData> = {}

	add() {
		const sid = uuid()
		const pid = uuid()
		this.#players[sid] = { pid }
	}

	update(sid: string, fields: UpdatablePlayerDataFields) {
		const player = this.#players[sid]
		Object.entries(fields).forEach(entry => {
			const [field, value] = entry as [keyof UpdatablePlayerDataFields, any]
			if (field in player) player[field] = value
		})
	}
}

export default PlayerManager
