import { Typography } from '@mui/material'
import React from 'react'

type props = {
	timeUntil: {h: number, m: number},
	color: string,
	fontSize: string,
}

// basic time formatting
function f(t: number) {
	return t < 10 ? ('0'+t) : t
}

export default function Timer(props: props) {
	const [timer, setTimer] = React.useState(props.timeUntil)

	const updateTime = () => {
		let {h, m} = timer
		m--
		if(m < 0) {
			h--
			m += 59
		}

		// eslint-disable-next-line no-restricted-globals
		if(h == 0 && m == 0) location.reload()

		setTimer({h: h, m: m})
	}

	
	// calibrate
	setTimeout(() => updateTime(), 1000*(60 - new Date().getSeconds()))
	
	return (
		<Typography fontSize={props.fontSize} sx={{color: props.color}}>{f(timer.h)}:{f(timer.m)}</Typography>
	)
}