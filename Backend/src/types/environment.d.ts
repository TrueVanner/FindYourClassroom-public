export {}

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			PORT: string
			DB_URL_USERS: string,
			DB_URL_TIMETABLES: string,
			CERT: string,
			TOKEN: string,
			KEY: string,
			OFFSET: string,
			DOMAIN: string,
			PATH_TO_REPORTS: string,
			ENV: 'test' | 'dev' | 'prod';
		}
	}
}
