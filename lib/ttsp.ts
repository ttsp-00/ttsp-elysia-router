/**
 * TTSP API Library
 * 
 * This module provides utilities for creating Elysia endpoints with authentication
 * and nested endpoint discovery functionality.
 */

import Elysia from 'elysia'
import { join, parse } from 'node:path'
import { log } from 'node:console'
import * as v from 'valibot'
import { fileURLToPath } from 'node:url'
import { fs2 } from '@/lib/fs2'
import swagger from '@elysiajs/swagger'

const app = new Elysia()
	.use(swagger())

const endpoints: any = {}

/**
 * Creates an endpoint for a directory and adds a helper user to the context
 */
function endpoint(url: string) {
	v.parse(v.string(), url)

	const filePath = fileURLToPath(url)
	const prefix = parse(filePath).name

	const endpoint = new Elysia({ prefix })
		.derive(async ({ headers, request, set }) => {
			const user = async () => {
				set.status = 401
			}
			return { user }
		})
		.mapResponse(({ set }) => {
			if (set.status === 401) {
				return new Response('')
			}
		})

	endpoints[filePath] = endpoint

	return endpoint
}

/**
 * Runs the application by loading all endpoints from the specified directory
 */
async function run(dirname: string) {
	const files = fs2
		.readdirRecursive(join(dirname))
		.sort((a, b) => b.localeCompare(a))

	const modules: any = {}

	// Load all modules
	for (const file of files) {
		const module = await import(file)
		modules[file] = module.default
	}

	// Connect nested endpoints to parent modules
	let lastParentModule: any = null
	for (const file of files) {
		const parentFile = file.split('/').slice(0, -1).join('/') + '.ts'

		const module = modules[file]
		const parentModule = modules[parentFile]

		if (!parentModule) {
			app.use(module)
			continue
		}

		parentModule.use(module)
		lastParentModule = parentModule
	}

	return app
}

const TTSP = {
	run,
	endpoint
}

export default TTSP
