import ChssEngine from '../chss_engine'

interface Msg {
	sender: string
	content: string
}

export interface RoomData {
	game: ChssEngine
	msgs: Array<Msg>
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
			game: new ChssEngine(),
			msgs: []
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

	add_msg(rid: string, sender: string, content: string) {
		if (!this.exists(rid)) return
		const msgs = this.#rooms[rid].msgs
		msgs[0] = msgs[1]
		msgs[1] = msgs[2]
		msgs[2] = { sender, content }
		this.#rooms[rid].msgs = msgs
	}

	get_msgs(rid: string) {
		if (!this.exists(rid)) return
		return this.#rooms[rid].msgs
	}
}

export default RoomManager
