type Fail = {
	value: string,
	msg: string,
	param: string,
	location: string
}

type Other = {
	type: boolean,
	lessonData: {
		subject: number,
		level: number,
		room: number,
		timeUntil: {
			h: number,
			m: number
		}
	}
}

type FailData = {
	status?: number,
	fails: Fail[],
	message: string,
}

type Data = {
	success: boolean,
} | FailData | Other

export default async function fetchData(path: string, body?: any, method?: 'GET' | 'POST' | 'DELETE') {

	let data

	// code segments that attempted to connect to the main client were removed

	/* try {

		data = await fetch(process.env.API_PATH + path, {
			method: method ?? 'GET',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
			body: JSON.stringify(body)
		}).then(res => res.json())
		
	} catch(e) {
		console.log('Error while fetching: ', e)

		if(e.message.includes('NetworkError')) { */
			try {

				data = await fetch(`http://localhost:8081/api${path}`, {
					method: method ?? 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
					credentials: 'include',
					body: JSON.stringify(body),
				}).then(res => res.json())
				
			} catch(e) {

				console.log('Error while fetching: ', e)
				return { redirectTo: '/503' } // this is better as I can configure the actions taken separately
			}
		/* }
		else
			return e
	} */
	if(data.status == 401) {
		return { redirectTo: '/login' }
	}
	
	return data
}


const goToPage = (endpoint: string) => {
	const link = document.createElement('a')
	link.style.display = 'none'
	link.href = endpoint
	document.body.appendChild(link)
	link.click();
	document.body.removeChild(link)
}