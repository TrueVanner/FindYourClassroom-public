import { Paper } from '@mui/material'
import React, { useState } from 'react'

type props = {
	pos: number,
	type: 'l'|'r',
	classNumber: number
}

function handleClick() {
	return false
}

export default function ClassroomDisplay(props: props) {
	const n = 6 // number of rooms in a collumn

	// basically the point of all this is to distribute the classrooms correctly on small screens
	const [isHeight, setIsHeight] = useState(window.innerWidth > 650)
	const [componentHeight, setComponentHeight] = useState(Math.round((window.innerHeight - 20) / ((8*n/7) - 1/7)))
	const componentWidth = isHeight ? Math.round(1.33*componentHeight) : Math.round(componentHeight*0.75)
	window.addEventListener('resize', () => setComponentHeight(Math.round((window.innerHeight - 20) / ((8*n/7) - 1/7))))
	window.addEventListener('resize', () => setIsHeight(window.innerWidth > 650))

	return (
		<Paper 
			component='div'
			id={props.classNumber.toString()}
			sx={{
				width: componentWidth,
				height: componentHeight,
				position: 'absolute',
				top: 7 + Math.round(((8*componentHeight / 7))*props.pos),
				bottom: '10ch',
				left: `${props.type == 'l' ? 10 : 30}vw`,
				border: '1px black dotted',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center'
			}}
			onClick={handleClick}>
				<p style={{fontSize: 20, userSelect:'none'}}>{props.classNumber}</p>
		</Paper>
	)
}