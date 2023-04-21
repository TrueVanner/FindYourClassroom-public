import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import React, { useState } from 'react'
import BG from './assets/BG'
import Login from './Login'
import Register from './Register'
import ErrorPage from './ErrorPage'
import ServiceUnavailableErrorPage from './ServiceUnavilableError'
import MainPage, { mainLoader } from './MainPage'
import EditStudentData, { editLoader } from './EditStudentData'
import { CircularProgress } from '@mui/material'
import ReportForm from './ReportForm'


// very important note: most school data used in the actual program has been removed.
// I kept the examples of the structure used under each such element.
// when recording Criterion D video, however, all the removed elements were
// present and the application was fully operational.


function App() {
	const [loading, setLoading] = useState(false)
	
	const router = createBrowserRouter([
		{
			path: '/',
			element: loading ? <CircularProgress/> : <MainPage/>,
			errorElement: <ErrorPage/>,
			loader: mainLoader,
			shouldRevalidate: () => false,
		},
		{
			path: '/login',
			element: <Login/>,
			loader: () => {
				document.body.style.backgroundColor = BG.hex
				return true
			}
		},
		{
			path: '/register',
			element: <Register/>,
			loader: () => {
				document.body.style.backgroundColor = BG.hex
				return true
			},
		},
		{
			path: '/503',
			element: <ServiceUnavailableErrorPage/>,
			loader: () => {
				document.body.style.backgroundColor = 'white'
				return true
			},
		},
		{
			path: '/edit',
			element: <EditStudentData/>,
			errorElement: <ErrorPage/>,
			loader: editLoader,
			shouldRevalidate: () => false
		},
		{
			path: '/report',
			element: <ReportForm/>,
			errorElement: <ErrorPage/>,
			loader: () => {
				document.body.style.backgroundColor = BG.hex
				return true
			}
		}
	])

	return (
		<div className='App'>
			<RouterProvider router={router} />
		</div>
	)
}

export default App
