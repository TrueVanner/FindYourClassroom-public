import { Day, Period, Levels, Classroom } from "../utils/classrooms.js"
import Subjects from './codesToIDs.json' assert { type: 'json' }

// from the arrays present in this file, a JSON timetable is generated;
// most entries have been removed as it's considered to be private school data
// the remaining entries have been altered significantly

// all timetable is divided into 2 sections: for DP1 and DP2

export const Timetable_DP2 = [
	new Day(0, [ // a day object is created using its day of the week and the array of classes taking place within the day
		new Period([1], [ // a period object is created using its start and duration and an array of classes taking place within the period
			new Classroom(Subjects.ECON, Levels.SHL, 10) // 
		]),
		new Period([3, 1], [ // if duration of a period is ommited, it defaults to 2 (most popular period duration in the school), otherwise it has to be specified
			new Classroom(Subjects.BYS, Levels.SL, 17)
		])
	]),
	
	new Day(1, [
		new Period([1], [
			new Classroom(Subjects.POL_G1, Levels.SHL, 9),
		]),
		new Period([7], [ // several periods defined with a same starting point but different durations
			new Classroom(Subjects.BYS, Levels.SL, 7),
		]),
		new Period([7, 4], [
			// some classes don't have a room assigned to them, which is reflected in the class object
			new Classroom(Subjects.ART, Levels.SL, 0),
		]),
	]),
	
	new Day(2, [
		new Period([1], [
			new Classroom(Subjects.ECON, Levels.HL, 17),
		]),
		new Period([3], [
			new Classroom(Subjects.ENG_B_G1, Levels.HL, 15),
		])
	]),

	new Day(3, [
		new Period([1], [
			new Classroom(Subjects.POL_G2, Levels.SL, 11)
		]),
		new Period([3, 1], [
			new Classroom(Subjects.HR_A, -1, 12),
			new Classroom(Subjects.HR_B, -1, 13)
		]),
		new Period([4, 1], [
			new Classroom(Subjects.MATH_AA, Levels.HL, 10),
		]),
	]),

	new Day(4, [
		new Period([1], [
			new Classroom(Subjects.ECON, Levels.SL, 7),
		]),
		new Period([3], [
			new Classroom(Subjects.MATH_AA, Levels.SL, 10),
		]),
	])
]

export const Timetable_DP1 = [
	new Day(0, [
		new Period([1], [
			new Classroom(Subjects.MATH_AA, Levels.HL, 12),
		]),
		new Period([3], [
			new Classroom(Subjects.PSY, Levels.SL, 7),
		]),
		new Period([3, 3], [
			new Classroom(Subjects.ECON, Levels.SL, 10),
		])
	]),
	new Day(1, [
		new Period([1], [
			new Classroom(Subjects.ESP, Levels.HL, 10)
		]),
		new Period([3], [
			new Classroom(Subjects.ENG_B_G1, Levels.SHL, 13),
		]),
	]),
	new Day(2, [
		new Period([1], [
			new Classroom(Subjects.PHYS, Levels.SL, 11),
		]),
		new Period([3], [
			new Classroom(Subjects.HIST, Levels.SL, 9),
		]),
		new Period([3, 3], [
			new Classroom(Subjects.ECON, Levels.HL, 15),
		]),
		new Period([6, 1], [
			new Classroom(Subjects.POL_G1, Levels.SL, 7),
		])
	]),
	new Day(3, [
		new Period([1], [
			new Classroom(Subjects.BYS, Levels.HL, 15),
		]),
		new Period([3], [
			// tok classes don't have a level, which is reflected in a class object
			new Classroom(Subjects.TOK_THU, -1, 8),
		]),
	]),
	new Day(4, [
		new Period([1], [
			new Classroom(Subjects.PHYS, Levels.SL, 12),
		]),
		new Period([3], [
			new Classroom(Subjects.ART, Levels.SL, 0),
		]),
	])
]