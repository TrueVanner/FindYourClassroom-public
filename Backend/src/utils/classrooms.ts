// very important note: most school data used in the actual program has been removed.
// I kept the examples of the structure used under each such element.
// when recording Criterion D video, however, all the removed elements were
// present and the application was fully operational.

import TT from '../codes&other/fullTimetable.json' assert { type: 'json'}
import Subjects from '../codes&other/codesToIDs.json' assert { type: 'json' }

export const Levels = Object.freeze({
	SL: 0,
	HL: 1,
	SHL: 2
})

export type SubjectType = typeof Subjects[keyof typeof Subjects]
export type LevelType = -1 | typeof Levels[keyof typeof Levels]
export type Days = 0 | 1 | 2 | 3 | 4
export type PeriodValues = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

export type ClassroomLike = {
	subject: number,
	level: number,
	room?: number }

export type PeriodLike = {
	start: number,
	end: number,
	classes: Array<ClassroomLike>
}

export type DayLike = {
	dotw: number,
	periods: PeriodLike[]
}

export class Classroom {
	subject
	level
	room

	constructor(subject: SubjectType, level: LevelType, room: number) {
		this.subject = subject,
		this.level = level,
		this.room = room

		this.validateSubject()

		Classroom.prototype.toString = () => {
			return this.subjectIDToString() + this.levelIDtoString()
		}
	}
	
	/** @private */
	validateSubject() {
		if(!Object.values(Subjects).includes(this.subject)) throw new Error('This is not a valid subject.')
		if(![...Object.values(Levels), -1].includes(this.level)) throw new Error('This is not a valid subject level.')
		if(this.room && (this.room < 7 || this.room > 18) && this.room != 826) throw new Error('This is not a valid classroom.')

		if((this.subject == Subjects.COMP_SCI || this.subject == Subjects.SEH_SCI) && this.level != Levels.SL) throw 'Unfortunately, this is not a valid level for this class :(' 
	}
	
	subjectIDToString() {

		// subject names were changed to avoid leaking private school data

		switch(this.subject) {
			case 38: return 'Subject 38'
			case 4: return 'Subject 4'
			case 53: return 'Subject 53'
			case 46: return 'Subject 46'
			case 57: return 'Subject 57'
			case 34: return 'Subject 34'
			case 1: return 'Subject 1'
			case 12: return 'Subject 12'
			case 55: return 'Subject 55'
			case 5: return 'Subject 5'
			case 37: return 'Subject 37'
			case 2: return 'Subject 2'
			case 54: return 'Subject 54'
			case 40: return 'Subject 40'
			case 61: return 'Subject 61'
			case 10: return 'Subject 10'
			case 22: return 'Subject 22'
			case 36: return 'Subject 36'
			case 39: return 'Subject 39'
			case 56: return 'Subject 56'
			case 26: return 'Subject 26'
			case 13: return 'Subject 13'
			case 62: return 'Subject 62'
			case 35: return 'Subject 35'
			case 15: return 'Subject 15'
			case 43: return 'Subject 43'
			case 7: return 'Subject 7'
			case 33: return 'Subject 33'
			case 27: return 'Subject 27'
			case 19: return 'Subject 19'
			case 16: return 'Subject 16'
			case 9: return 'Subject 9'
			case 60: return 'Subject 60'
		}
	}
	
	levelIDtoString() {
		switch(this.level) {
			case 0: return ' SL'
			case 1: return ' HL'
			case 2: return ' SL+HL'
			default: return ''
		}
	}

	static copy(classroom: ClassroomLike) {
		return new Classroom(classroom.subject as SubjectType, classroom.level as LevelType, classroom.room ?? 0)
	}

	toString() {
		return `${this.subjectIDToString()} ${this.levelIDtoString()}`
	}
}

export class Day {
	dotw
	periods

	constructor(dotw: Days, periods: Array<Period>) {
		this.dotw = dotw
		this.periods = periods

		this.validateDay()
	}

	validateDay() {
		if(![0, 1, 2, 3, 4].includes(this.dotw)) throw 'Wrong day of the week'
	}

	static copy(day: DayLike) {
		const newDay = new Day(day.dotw as Days, [])
		day.periods.forEach(period => {
			newDay.periods.push(Period.copy(period))
		})
		
		return newDay
	}
}


export class Period {
	start
	end
	classes

	constructor(startAndDur: [PeriodValues, number] | [PeriodValues], classes: Array<Classroom>) {
		const start = startAndDur[0]
		const duration = startAndDur[1]

		this.start = start,
		this.end = start + (duration ?? 2) - 1 // either specified duration or 2 lessons long
		this.classes = classes

		this.validatePeriod()
	}
	
	/** @private */
	validatePeriod() {
		if(!this.start || !this.end) throw 'Include start and end'
		if(this.start < 1 || this.start > 10) throw 'No classes can be at this time'
		if(this.end < 1 || this.end > 10) throw 'No classes can be at this time'
	}

	static current(): PeriodValues {

		if(Time.current().compare(new Time(17, 0)) > 0) throw new Error('Current period out of bounds')
		
		let start = -1
		
		for(let i = 1; i < 10; i++) {
			if(Time.current().isInPeriodBounds(new Period([i as PeriodValues, 1], []))) start = i
		}
		return start as PeriodValues
	}

	getTime(): {start: Time, end: Time} {
		// time when the lessons start
		const time = new Time(8, 0)
		const res: any = {}

		for(let i = 1; i <= this.end; i++) {
			// if the beginning of the period was found, set it as the start
			// and add the break before it
			if(i == this.start) res.start = i == 1 ? Time.copy(time) : Time.copy(time).subtract(Period.getBreak(i-1))
			
			// add the duration of the lesson
			time.add(new Time(0, 45))

			// add break periods until the end of the lesson
			if(i != this.end) time.add(Period.getBreak(i))
		}

		res.end = time
		return res
	}

	getCurrentBreak() {
		return Period.getBreak(this.end)
	}

	static getBreak(periodStart: number) {
		switch(periodStart) {
			// returns 10 minutes for periods 2, 3, 4
			// some code was removed as it includes private school data
			case 1: return new Time(0, 5)
			case 2:
			case 3:
			case 4: return new Time(0, 10)
			default: throw new Error('Out of bounds')
		}
	}

	static copy(period: PeriodLike) {
		const newPeriod = new Period([period.start as PeriodValues, period.end - period.start + 1 as PeriodValues], [])
		period.classes.forEach((_class: ClassroomLike) => {
			newPeriod.classes.push(Classroom.copy(_class))
		})

		return newPeriod
	}
}

/**
 * a short class for generalizing time in HH:MM format.
 */
export class Time {
	h
	m

	constructor(h: number, m: number) {		
		this.h = h
		this.m = m
	}
	
	static current() {
		const date = new Date()
		return new Time(date.getHours() + parseInt(process.env.OFFSET), date.getMinutes())
	}

	add(time: Time) {
		this.h += time.h
		this.m += time.m
		if(this.m > 59) {
			this.m -= 60
			this.h++
		}
		if(this.h > 23) {
			this.h -= 24
		}

		return this
	}

	subtract(time: Time) {
		this.h -= time.h
		this.m -= time.m

		if(this.m < 0) {
			this.m += 60
			this.h--
		}

		if(this.h < 0) {
			this.h += 24
		}

		return this
	}
	
	compare(time: Time) {
		if(this.h < time.h) return -1
		if(this.h > time.h) return 1
		if(this.m < time.m) return -1
		if(this.m > time.m) return 1
		return 0
	}
	
	isInBounds(startTime: Time, endTime: Time) {
		if(startTime.compare(endTime) == 0) return this.compare(startTime) == 0

		return startTime.compare(endTime) < 0 ?

			this.compare(startTime) >= 0 && this.compare(endTime) <= 0 
			: 
			this.compare(endTime) >= 0 && this.compare(startTime) <= 0
	}

	/**
	 * @param {Period} period
	 */
	isInPeriodBounds(period: Period) {
		const time = period.getTime()
		
		// both the old period end and the period start at the same time.
		// to prevent this, the comparison will return false if the time is equal to the end of the period.
		return this.isInBounds(time.start, time.end) && this.compare(time.end) != 0
	}

	toString() {
		return `${this.h > 9 ? this.h : `0${this.h}`}:${this.m > 9 ? this.m : `0${this.m}`}`
	}

	static copy(time: Time) {
		return new Time(time.h, time.m)
	}
}

export function isInDayBounds(dotw: number, time: Time) {
	if([0,6].includes(dotw))
		return false

	let dayEnd = new Time(8, 0)
	TT.forEach(year => {
		year.forEach(day => {
			day.periods.forEach(period => {
				const end = Period.copy(period).getTime().end
				if(end.compare(dayEnd) > 0)
					dayEnd = end
			})
		})
	})
	
	return new Time(8, 0).compare(time) < 0
	&& dayEnd.compare(time) > 0
}