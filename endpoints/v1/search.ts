import TTSP from '@/lib/ttsp'

export default TTSP.endpoint(import.meta.url)
	.get('/', ({ headers }) => {
		return 'search'
	})