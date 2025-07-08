import TTSP from '@/lib/ttsp'
import auth from '@/middleware/auth'

export default TTSP.endpoint(import.meta.url)
	.use(auth)
	.get('/', ({ user }) => {
		user()
		return 'you are authorized to see restricted resource'
	})