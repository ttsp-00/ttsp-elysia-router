import TTSP from '@/lib/ttsp'
import Elysia from 'elysia'
import { log } from 'node:console'

// class Auth {
// 	static getUser(headers: Record<string, string | undefined>) {
// 		log('getUser', headers.authorization)
// 		return false
// 	}
// }

// export default Auth

const auth = new Elysia()
	.derive({ as: 'scoped' }, async ({ headers }) => {
		return {
			user: () => {
				if (!headers.authorization) {
					throw new TTSP.Error('Unauthorized', 401)
				}
			}
		}
	})

export default auth