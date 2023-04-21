import { Avatar,  Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { redirect, useLoaderData } from 'react-router-dom'
import BG from './assets/BG'
import ClassroomDisplay from './assets/ClassroomDisplay'
import fetchData from './assets/fetchData'
import MainPageSidebar from './assets/MainPageSidebar'
import Timer from './assets/Timer'

type TypeCurrentLesson = {
	type: true,
	timeUntil: {
		h: number,
		m: number
	},
	lesson: string,
	rooms: number
}

type TypeNextLesson = {
	type: true,
	lesson: string,
	rooms: number
}

type TypeCurrentBreak = {
	type: false,
	timeUntil: {
		h: number,
		m: number
	}
	rooms: [number[], number[]]
}

type TypeNextBreak = {
	type: false,
	rooms: number[]
}

const get = (id: any) => document.getElementById(id.toString())

// further attempt to make the thing bearable when viewed from the phone


const LegendPiece = (props: {color: string, text: string, wOh: string}) => {
	return (
		<Stack direction='row' spacing={1} alignItems='center' justifyContent='left'>
			<Avatar sx={{ width: 2.5+props.wOh, height: 2.5+props.wOh, bgcolor: props.color }}> </Avatar>
			<Typography fontSize={1+props.wOh}>{props.text}</Typography>
		</Stack>
	)
}

export default function MainPage() {

	// the upper few segments of code define how the page reacts to being adjusted in size

	const [wOh, set_wOh] = useState(window.innerWidth > window.innerHeight ? 'vw' : 'vh')
	
	// not the best thing but i'll keep it for now
	window.addEventListener('resize', () => set_wOh(window.innerWidth < window.innerHeight ? 'vh' : 'vw'))

	const univVal = (n: number) => wOh == 'vw' ? n+wOh : n+wOh

	const data = useLoaderData() as { current: any, next?: any, ended?: boolean}

	if(data.ended) document.body.style.backgroundColor = 'white'
	const current = !data.ended ? (data.current.data.type ? data.current.data as TypeCurrentLesson : data.current.data as TypeCurrentBreak) : undefined
	const next = !data.ended ? (data.next.data ? (data.next.data.type ? data.next.data as TypeNextLesson : data.next.data as TypeNextBreak) : undefined) : undefined

	let sideElem = current ? (
		<div style={{userSelect: 'none'}}>
			<Stack
				direction='column'
				justifyContent='center'
				alignItems='center'
				spacing={2}
				sx={{
					width: '50vw',
					height: '100vh',
					position: 'absolute',
					right: '0.01%'
				}}>
				
					<Typography fontSize={univVal(2)}>Time left until the end:</Typography>
					<Timer fontSize={univVal(7)} color={current.type ? 'red' : 'aqua'} timeUntil={current.timeUntil}/>
					<Typography fontSize={univVal(1.25)}>Current lesson: {current.type ? current.lesson : <span style={{color: 'blue'}}>Break!</span>}</Typography>
					<Typography fontSize={univVal(1.25)}>Next lesson: {next ? (next.type ? next.lesson : <span style={{color: 'blue'}}>Break!</span>) : <span style={{color: 'gray'}}>None</span>}</Typography>
					<p></p>
					<Typography fontSize={univVal(1.5)}>Legend:</Typography>
					<Stack spacing={1}>
						<LegendPiece color='red' text='Current lesson' wOh={wOh}/>
						<LegendPiece color='rgba(255, 0, 0, 0.33)' text='Next lesson' wOh={wOh}/>
						<LegendPiece color='rgba(0, 0, 255, 0.5)' text='Rooms free for a part of the break' wOh={wOh}/>
						<LegendPiece color='rgba(0, 255, 255, 0.33)' text='Rooms free for the next break' wOh={wOh}/>
					</Stack>
			</Stack>
		</div>
	) : (
		<div style={{height: '100vh', width: '100vw', backgroundColor: 'rgba(128, 128, 128, 0.66)', position: 'absolute', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
			<div style={{width: '50%', position: 'absolute', right: '0.01%'}}>
				<Typography fontSize={univVal(4)} sx={{color: 'gray'}}>No lessons at this time.</Typography>
			</div>
		</div>
	)
	
	useEffect(() => {
		if(current) {
			if(next) {
				if(next.type) {
					const roomElem = get(next.rooms)
					if(roomElem) roomElem.style.backgroundColor = 'rgba(255, 0, 0, 0.33)' // lighter red
				} else {
					next.rooms.forEach(room => {
						const roomElem = get(room)
						if(roomElem) roomElem.style.backgroundColor = 'rgba(0, 255, 255, 0.33)' // lighter aqua
					})
				}
			}

			if(current.type) {
				const roomElem = get(current.rooms)
				if(roomElem) roomElem.style.backgroundColor = 'red'
			} else {
				current.rooms[0].forEach(room => {
					const roomElem = get(room)
					if(roomElem) roomElem.style.backgroundColor = 'aqua'
				})
				current.rooms[1].forEach(room => {
					const roomElem = get(room)
					if(roomElem) roomElem.style.backgroundColor = 'rgba(0, 255, 255, 0.5)' // light aqua
				})
			}
		}
	}, [])
	
	return (
		<div>
			<ClassroomDisplay classNumber={217} pos={0} type='l'/>
			<ClassroomDisplay classNumber={216} pos={1} type='l'/>
			<ClassroomDisplay classNumber={215} pos={2} type='l'/>
			<ClassroomDisplay classNumber={214} pos={3} type='l'/>
			<ClassroomDisplay classNumber={213} pos={4} type='l'/>
			<ClassroomDisplay classNumber={212} pos={5} type='l'/>
			<ClassroomDisplay classNumber={211} pos={0} type='r'/>
			<ClassroomDisplay classNumber={210} pos={1} type='r'/>
			<ClassroomDisplay classNumber={209} pos={2} type='r'/>
			<ClassroomDisplay classNumber={208} pos={3} type='r'/>
			<ClassroomDisplay classNumber={207} pos={4} type='r'/>
			<ClassroomDisplay classNumber={206} pos={5} type='r'/>
			
			{sideElem}
			<MainPageSidebar name='Name Surname'/>
		</div>
	)
}

export async function mainLoader() {
	document.body.style.backgroundColor = BG.hex

	const data: any = {}

	data.current = await fetchData('/current')

	// if a response object was returned, execute it
	if(data.current.redirectTo) return redirect(data.current.redirectTo)
	
	data.next = await fetchData('/next')

	if(data.current.status) {
		if(data.current.status == 403)
			return { ended: true }
		else
			throw new Error(data.current.message)
	}
	
	return data
}