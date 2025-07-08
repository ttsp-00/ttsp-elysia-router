import { expect, test } from 'bun:test'
import TTSP from '@/lib/ttsp'
import { join } from 'node:path'

const app = await TTSP.run(join(__dirname, '..', 'endpoints'))

test('401 Unauthorized', async () => {
	const request = new Request('http://localhost/v1/restricted')
	const response = await app.handle(request)
	expect(response.status).toBe(401)
})