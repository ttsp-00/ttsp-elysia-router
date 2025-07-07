/**
 * TTSP API Server Entry Point
 * 
 * Main application file that loads endpoints and starts the server
 */

import TTSP from '@/lib/ttsp'
import { log } from 'node:console'
import { join } from 'node:path'

/**
 * Path to the endpoints directory
 */
const dirname = join(__dirname, 'endpoints')

/**
 * Starts the TTSP API server
 */
async function run() {
	try {
		// Load endpoints and create app
		const app = await TTSP.run(dirname)

		// Start server on specified port
		app.listen(process.env.PORT || 3001)

		const entryUrl = `http://${app.server?.hostname}:${app.server?.port}/swagger`
		log(`TTSP API server started: ${entryUrl}`)
	} catch (error) {
		log('Failed to start TTSP API server:', error)
		process.exit(1)
	}
}

// Start the server
run()


