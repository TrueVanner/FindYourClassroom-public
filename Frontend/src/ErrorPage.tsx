import { useRouteError } from "react-router-dom";
import React from 'react'
import { Stack } from '@mui/system';
import Clickable from './assets/Clickable';

export default function ErrorPage() {
  const error: any = useRouteError();
  console.error(error);

  return (
	<Stack className='centered'>
		<h1>Oops!</h1>
		<p>Sorry, an unexpected error has occurred.</p>
		<p>
			<i>{error.statusText || error.message}</i>
		</p>
		<Clickable link='/report' sx={{ textDecoration: 'underline' }} colors={{ main: 'black', hover: 'gray' }} text='Report the bug'/>
	</Stack>
	);
}