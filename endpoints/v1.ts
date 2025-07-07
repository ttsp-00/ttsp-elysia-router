/**
 * Automatically creates endpoints for all files in directory
 * and subdirectories
 *
 * Example:
 *
 * endpoints/v1/search/users.ts
 *
 * will create endpoint /v1/search/users
 */
import TTSP from '@/lib/ttsp'

export default TTSP.endpoint(import.meta.url)
	.get('/', () => 'v1')