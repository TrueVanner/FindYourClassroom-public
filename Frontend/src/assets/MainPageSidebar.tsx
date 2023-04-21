import React, { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import { Avatar, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function MainPageSidebar(props: {name: string}) {
	const [open, setOpen] = useState(false)
	const navigate = useNavigate()
  	return (
	<div>
		<Button
			sx={{
				borderTopRightRadius: 0,
				borderBottomRightRadius: 0,
				position: 'absolute',
				top: '50%',
				right: '0.01%',
				width: '1vw',
				height: '2.5vw',
				minWidth: '3px',
				zIndex: 3
			}}
			variant='contained'
			onClick={() => setOpen(true)}
		><span style={{fontSize: '1vw'}}>←</span></Button>

		<Drawer
			anchor={'right'}
			open={open}
			onClose={() => setOpen(false)}>
			<Stack
				spacing={2}
				display='flex'
				justifyContent='center'
				alignItems='center'
				m={3}
				sx={{ width: 250 }}
				onKeyDown={() => setOpen(false)}>
					<Avatar sx={{height: 70, width: 70}}></Avatar>
					<Typography>{props.name}</Typography>
					<p></p>
					<p></p>
					<p></p>
					<Button
						variant='outlined'
						onClick={() => navigate('/edit')}
					>Edit student data</Button>
					<Button
						variant='outlined'
						onClick={() => navigate('/report')}
					>Report a bug</Button>
			</Stack>
		</Drawer>
	</div>
  );
}