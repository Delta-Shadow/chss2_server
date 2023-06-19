import ChssEngine from '../chss_engine'

export interface RoomData {
	game: ChssEngine
}

// type UpdatableRoomData = Omit<RoomData, 'game'>
type UpdatableRoomData = RoomData

class RoomManager {
	#rooms: Record<string, RoomData> = {}

	exists(rid: string) {
		return rid in this.#rooms
	}

	get(rid: string) {
		return this.#rooms[rid]
	}

	create(rid: string) {
		this.#rooms[rid] = {
			game: new ChssEngine()
		}
		return { rid }
	}

	update(sid: string, data: UpdatableRoomData) {
		const room = this.#rooms[sid]
		Object.entries(data).forEach(datum => {
			const [field, value] = datum as [keyof UpdatableRoomData, any]
			if (field in room) room[field] = value
		})
	}

	delete(rid: string) {
		if (this.exists(rid)) delete this.#rooms[rid]
	}
}

export default RoomManager
