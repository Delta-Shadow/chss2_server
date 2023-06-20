import { v4 as uuid } from 'uuid'

export interface PlayerData {
	pid: string
	rid: string | null
	name: string | null
	role: 'white' | 'black' | 'spectator' | null
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

	from(rid: string) {
		return Object.values(this.#players).filter(p => p.rid == rid)
	}

	list() {
		return Object.values(this.#players)
	}

	create() {
		const sid = uuid()
		const pid = uuid()
		this.#players[sid] = { pid, rid: null, name: null, role: null }
		return { sid, player: this.#players[sid] }
	}

	update(sid: string, data: Partial<UpdatablePlayerData>) {
		const player = this.#players[sid]
		Object.entries(data).forEach(entry => {
			const [field, value] = entry as [keyof UpdatablePlayerData, any]
			if (field in player) this.#players[sid][field] = value
		})
	}

	delete(sid: string) {
		if (this.exists(sid)) delete this.#players[sid]
	}

	count(rid?: string) {
		if (!rid) return Object.keys(this.#players).length
		return Object.values(this.#players).filter(p => p.rid == rid).length
	}
}

export default PlayerManager
