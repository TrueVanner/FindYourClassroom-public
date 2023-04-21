import { UserModel } from '../config/connections.js'
import { SubjectType, Time, Period, Classroom, LevelType, Levels, Days, PeriodValues, PeriodLike, ClassroomLike } from '../utils/classrooms.js'
import Subjects from '../codes&other/codesToIDs.json' assert { type: 'json' }
import TT from '../codes&other/fullTimetable.json' assert { type: 'json' }
import { encrypt } from '../utils/crypt.js'
import StudentDTO, { FullUserDTO } from '../DTOs/userDTO.js'
import timetableService from './timetableService.js'

class UserService {
	
	async registerUser(userDTO: FullUserDTO) {
		const toCreate = {
			email: userDTO.email,
			password: encrypt(userDTO.password),
			user_data: encrypt(JSON.stringify({
				name: userDTO.name,
				surname: userDTO.surname,
			})),
			student_data: encrypt(JSON.stringify({
				year: userDTO.year,
				group: userDTO.group,
				subjects: [...userDTO.subjects, userDTO.group ? { s: Subjects.HR_A, l: -1 } : { s: Subjects.HR_B, l: -1 }]
			})),
		}

		await UserModel.create(toCreate)

		return { 
			success: true,
			toCookie: { email: toCreate.email, password: toCreate.password },
			message: 'New user successfully registered!'
		}
	}
	
	private currentPeriods(studentData: StudentDTO) {
		return TT[studentData.year][new Date().getDay() - 1]
			.periods.filter(period => Time.current().isInPeriodBounds(Period.copy(period)))
	}



	// check current period. If there are no classes, that belong to the student,
	// check all periods following the current period. If found, trace back to the original.
	// If not found, throw an error because student's day has ended.

	// Above is a plan for the future. Now if the current period isn't a lesson then it'll be the longest current period.
	getTrueCurrentPeriod(studentData: StudentDTO): {
		type: true,
		period: PeriodLike,
		class: ClassroomLike
	} | {
		type: false,
		period: PeriodLike
	} {

		let trueCurrentPeriod
		const currentPeriods = this.currentPeriods(studentData)
		// check if any of the classes in the current periods is the right one
		currentPeriods.forEach(period => {
			period.classes.forEach(clazz => {
				if(studentData.subjects.find(subj => subj.s == clazz.subject && [Levels.SHL, subj.l].includes(clazz.level as LevelType))) {
					trueCurrentPeriod = {
						type: true,
						period: period,
						class: clazz
					}
				}
			})
		})

		if(!trueCurrentPeriod) {
			let longest = currentPeriods[0]
			currentPeriods.forEach(period => {
				if(period.end - period.start > longest.end - longest.start) longest = period
			})

			return {
				type: false,
				period: longest
			}
		} else return trueCurrentPeriod
	}

	getCurrent(studentData: StudentDTO) {
		// all periods within the current timeframe
		const currentPeriod = this.getTrueCurrentPeriod(studentData)

		const res: any = {
			type: currentPeriod.type,
			timeUntil: Period.copy(currentPeriod.period).getTime().end.subtract(Time.current())
		}
		if(currentPeriod.type) {
			res.lesson = Classroom.copy(currentPeriod.class).toString(),
			res.rooms = currentPeriod.class.room && currentPeriod.class?.room != 816 ? currentPeriod.class.room + 200 : currentPeriod.class?.room
		} else {
			res.rooms = this.getBreakRooms(studentData)
		}

		return res
		
		// check every class of period
		// old code:
		//
		// currentTTPeriod.classes.forEach(clazz => {
		// 	if(studentData.subjects.find((subjects: {s: SubjectType, l: LevelType}) => subjects.s == clazz.subject)) {
		// 		current = {} as any
		// 		current.timeUntil = Period.copy(period).getTime().end.subtract(Time.current())
		// 		current.room = clazz.room
		// 		if(current.room && current.room != 826)
		// 			current.room = current.room + 200
		// 		current.class = Classroom.copy(clazz).toString()
		// 	}
		// })
	}

	getNext(studentData: StudentDTO) {
		const currentPeriod = this.getTrueCurrentPeriod(studentData)

		// because I don't care which of the next periods is selected as the break one (right now),
		// the system just selects the first one
		const nextPeriod: PeriodLike | undefined = TT[studentData.year][new Date().getDay() - 1]
			.periods.find(period => period.start == currentPeriod.period.end + 1)
		
		// if there aren't any periods following the current one
		if(!nextPeriod) return null

		// we just get every empty room from the next period and don't care whether the rooms are permanently free or not.
		// this check will be done as we reach the current day
		let res: any = {
			rooms: timetableService.getEmptyRooms(new Date().getDay() - 1 as Days, { start: nextPeriod.start as PeriodValues, end: nextPeriod.end as PeriodValues })
		}

		nextPeriod.classes.forEach((clazz: ClassroomLike) => {
			// if a subject exists within the period taken by the student
			if(studentData.subjects.find((subject: {s: SubjectType, l: LevelType}) => subject.s == clazz.subject && [Levels.SHL, subject.l].includes(clazz.level as LevelType))) {

				res.rooms = clazz.room
				if(res.rooms && res.rooms != 826)
					res.rooms = res.rooms + 200
				res.lesson = Classroom.copy(clazz).toString()
			}
		})

		// timeUntil doesn't matter for nextPeriod
		return {
			type: !!res.lesson,
			lesson: res.lesson,
			rooms: res.rooms,
		}
	}

	getBreakRooms(studentData: StudentDTO) {

		// based on the length of the student's current task (break or lesson, calculate using
		// current subjects - filter by student - empty), in a loop calculate free rooms from now
		// for each moment of the student's task, send two arrays - available for the whole break
		// and only available for a part of the break
		
		const currentPeriod = this.getTrueCurrentPeriod(studentData).period

		const fullTime: number[] = [], notFullTime: number[] = []
		
		const duration = currentPeriod.end - currentPeriod.start + 1

		let all: number[] = []

		for(let i = 0; i < duration; i++) {
			all.push(...timetableService.getEmptyRooms(new Date().getDay() - 1 as Days, { start: currentPeriod.start as PeriodValues, end: (i + currentPeriod.start) as PeriodValues }))
		}

		// count which rooms are available for the full break and which - for only the part of it
		const count: any = {}
		all = all.filter((elem, index) => all.indexOf(elem) == index)

		all.forEach(elem => { count[elem] = (count[elem] || 0) + 1 })
		
		all.forEach(elem => {
			if(count[elem] == duration)
				fullTime.push(elem)
			else
				notFullTime.push(elem)
		})
		
		return [fullTime, notFullTime]
	}

	async setStudentData(login: string, studentDTO: StudentDTO) {
		const newStudentData = encrypt(JSON.stringify({
			year: studentDTO.year,
			group: studentDTO.group,
			subjects: [...studentDTO.subjects, studentDTO.group ? { s: Subjects.HR_A, l: -1 } : { s: Subjects.HR_B, l: -1 }]
		}))

		await UserModel.findOneAndUpdate({ email: login }, { student_data: newStudentData })

		return {
			success: true,
			message: 'Student data successfully updated!'
		}
	}
}

export default new UserService()