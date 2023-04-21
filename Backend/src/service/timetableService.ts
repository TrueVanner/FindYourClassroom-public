import { ClassroomLike, Days, PeriodValues } from '../utils/classrooms.js'
import TT from '../codes&other/fullTimetable.json' assert { type: 'json'}

class TimetableService {

	getClassesDuringPeriod(day: Days, prd: {start: PeriodValues, end: PeriodValues}, year: number) {
		const classes: ClassroomLike[] = []
		
		// doesn't start after the period and doesn't end before the start of the period
		// old version:
		// TT[year][day].periods.filter(p => (p.start >= prd.start && p.start <= prd.end) || (p.end >= prd.start && p.end <= prd.end)).forEach(period => {
		
		TT[year][day].periods.filter(p => (p.start <= prd.end && p.end >= prd.start)).forEach(period => {
			period.classes.forEach(clazz => {
				classes.push(clazz)
			})
		})

		return classes
	}

	getEmptyRooms(day: Days, periodBounds: {start: PeriodValues, end: PeriodValues}) {
		
		const classes = [...this.getClassesDuringPeriod(day, periodBounds, 0), ...this.getClassesDuringPeriod(day, periodBounds, 1)]
		const takenRooms: number[] = []
		const rooms: number[] = []

		classes.forEach(clazz => {
			if(clazz.room && !takenRooms.includes(clazz.room)) takenRooms.push(clazz.room)
		})
		
		for(let i = 7; i < 18; i++) {
			if(!takenRooms.includes(i)) rooms.push(200 + i)
		}

		return rooms
	}
}

export default new TimetableService()