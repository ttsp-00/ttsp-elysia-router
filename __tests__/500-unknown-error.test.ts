import TTSP from '@/lib/ttsp'
import { test, expect } from 'bun:test'
import { log } from 'node:console'
import { join } from 'node:path'

const app = await TTSP.run(join(__dirname, '..', 'endpoints'))

test('500 Unknown Error', async () => {
	const request = new Request('http://localhost/v1/unknown-error')
	const response = await app.handle(request)
	expect(response.status).toBe(500)
})