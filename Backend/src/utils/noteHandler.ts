import { NextFunction, Request, Response } from 'express'
import fs from 'fs'

class NoteHandler {

	async main(req: Request, res: Response, next: NextFunction) {
		try {
			const id = parseInt(req.params.id)
			const { name, descr, login } = req.body

			const final = {
				author: login.split('@')[0],
				date: new Date().toString(),
				name: name,
				descr: descr,
			}

			const path = process.env.PATH_TO_REPORTS + (id ? 'suggestionNotes.json' : 'bugNotes.json')
			const doc = JSON.parse(fs.readFileSync(path).toString('utf-8'))
			doc.push(final)

			fs.writeFileSync(path, JSON.stringify(doc, null, 4))

			res.status(200).json({ success: true })
		} catch(e) {
			next(e)
		}
	}

	validateNote(id: number, name: string, descr: string, author: string) {

		const path = process.env.PATH_TO_REPORTS + (id ? 'suggestionNotes.json' : 'bugNotes.json')
		const notes = JSON.parse(fs.readFileSync(path).toString('utf-8'))

		// i don't think i should be concerned by time offset too much
		const today = new Date().getDate()
		let count = 0

		let result: any = { success: true }

		notes.forEach((note: any) => {
			if(note.author == author && note.name == name) result = { success: false, msg: 'A note with the same name created by you already exists!' }
			if(note.author == author && note.descr == descr) result = { success: false, msg: 'A note with the same description created by you already exists!' }
			if(new Date(note.date).getDate() == today && note.author == author) count++
		})

		if(count >= 5) return { success: false, msg: 'For security reasons you can\'t make more than 5 reports in one day.' }
		return result
	}
	
}

export default new NoteHandler()