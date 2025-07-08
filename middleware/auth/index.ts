import TTSP from '@/lib/ttsp'
import Elysia from 'elysia'

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