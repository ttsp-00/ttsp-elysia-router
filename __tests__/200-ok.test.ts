import TTSP from '@/lib/ttsp'
import { test, expect } from 'bun:test'
import { join } from 'node:path'


const app = await TTSP.run(join(__dirname, '..', 'endpoints'))
test('200 OK', async () => {
	const request = new Request('http://localhost/v1')
	const response = await app.handle(request)
	expect(response.status).toBe(200)
	expect(await response.text()).toBe('v1')
})