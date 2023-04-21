import { NextFunction, Request, Response } from 'express'
import timetableService from '../service/timetableService.js'
import { Time, Period, Days } from '../utils/classrooms.js'

class TimetableController {
	
	async getClassesDuringPeriod(req: Request, res: Response, next: NextFunction) {
		try {			
			const result = timetableService.getClassesDuringPeriod(new Date().getDay() - 1 as Days, { start: Period.current(), end: req.body.end }, req.body.year)
			res.status(200).json(result)
		} catch (e) {
			next(e)
		}
	}

	async getEmptyRooms(req: Request, res: Response, next: NextFunction) {		
		const { day, periodBounds } = req.body

		try {
			const rooms = timetableService.getEmptyRooms(day, periodBounds)
			res.status(200).json({ success: true, rooms: rooms })
		} catch(e) {
			next(e)
		}
	} 
}

export default new TimetableController()