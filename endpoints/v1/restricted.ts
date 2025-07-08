import TTSP from '@/lib/ttsp'
import auth from '@/middleware/auth'
import Elysia from 'elysia'
import { log } from 'node:console'

export default TTSP.endpoint(import.meta.url)
	.use(auth)
	.get('/', ({ set, headers, user }) => {
		user()
		return 'you are authorized to see restricted resource'
	})