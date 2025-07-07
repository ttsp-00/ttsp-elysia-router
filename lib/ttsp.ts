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
import fs from 'node:fs'

const app = new Elysia()
const endpoints: any = {}
let initialized = false

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
async function run(dirname: string, options = {}) {
	if (initialized) {
		return app
	}

	initialized = true

	if (!fs.existsSync(dirname)) {
		throw new Error('Enpoints directory not found')
	}

	if (dirname === process.cwd()) {
		throw new Error('Enpoints directory cannot be the same as the process.cwd()')
	}

	// setting up app
	app.use(swagger())
	app.onError(({ error, path, set }) => {
		const e: any = error
		// console.error('[ERROR]:', set.status, e.message)
		// console.error('[ERROR]:', path)
	})

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

		// for search/entity.ts, parentFile is search.ts
		const parentFile = file
			.split('/')
			.slice(0, -1) // remove last part of the path
			.join('/') + '.ts' // add .ts to the path

		const module = modules[file] // search/entity.ts
		const parentModule = modules[parentFile] // search.ts

		// if parentFile is not a module, then app is the parent
		if (!parentModule) {
			app.use(module)
			continue
		}

		parentModule.use(module)
		lastParentModule = parentModule
	}

	return app
}

class TTSPError extends Error {
	status: number
	constructor(message: string, status: number = 500) {
		super(message)
		this.name = 'TTSPError'
		this.status = status
	}
}

const TTSP = {
	run,
	endpoint,
	Error: TTSPError
}

export default TTSP
