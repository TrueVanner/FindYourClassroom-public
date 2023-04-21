import React from 'react'
import { Stack } from '@mui/system';
import { Link } from 'react-router-dom';

export default function ServiceUnavailableErrorPage() {
	return (
		<Stack className='centered'>
			<h1>503 Error: Service Unavailable</h1>
			<p>The server is currently down, sorry! Please wait for a bit and try again</p>
			<Link to='/'>Go back to the main page</Link>
		</Stack>
	);
}