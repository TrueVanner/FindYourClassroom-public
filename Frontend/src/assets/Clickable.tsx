import { SxProps, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import React from 'react'

type props = {
	link: string,
	sx?: SxProps,
	onClick?: React.MouseEventHandler<HTMLAnchorElement>,
	colors: {main: string, hover: string},
	text: string
}

export default function Clickable(props: props) {
	return (
		<Link to={props.link} style={{ textDecoration: 'none' }} onClick={props.onClick}><Typography
			sx={{
				...props.sx,
				userSelect: 'none',
				color: props.colors.main,
				'&:hover': {
					color: props.colors.hover
				}
			}}
			component='span'
		>{props.text}</Typography></Link>
	)
}
