/**
 * TTSP API Library
 * 
 * This module provides utilities for creating Elysia endpoints with authentication
 * and nested endpoint discovery functionality.
 */

import Elysia from 'elysia'
import { join, parse } from 'node:path'
import * as v from 'valibot'
import { fileURLToPath } from 'node:url'
import { fs2 } from '@/lib/fs2'
import swagger from '@elysiajs/swagger'
import fs from 'node:fs'
import { log } from 'node:console'

const app = new Elysia()
const endpoints: Record<string, unknown> = {}
let initialized = false

/**
 * Creates an endpoint for a directory and adds a helper user to the context
 */
function endpoint(url: string) {
	v.parse(v.string(), url)

	const filePath = fileURLToPath(url)
	const prefix = parse(filePath).name

	const endpoint = new Elysia({ prefix })

	endpoints[filePath] = endpoint

	return endpoint
}

/**
 * Runs the application by loading all endpoints from the specified directory
 */
async function run(dirname: string, _options = {}) {
	if (initialized) {
		return app
	}

	initialized = true

	if (!fs.existsSync(dirname)) {
		throw new Error('Endpoints directory not found')
	}

	if (dirname === process.cwd()) {
		throw new Error('Endpoints directory cannot be the same as the process.cwd()')
	}

	// setting up app
	app.use(swagger())
	app.onError(({ error }) => {
		const _e: unknown = error
		// console.error('[ERROR]:', set.status, e.message)
		// console.error('[ERROR]:', path)
	})

	const files = fs2
		.readdirRecursive(join(dirname))
		.sort((a, b) => b.localeCompare(a))

	const modules: Record<string, Elysia> = {}

	// Load all modules
	for (const file of files) {
		const module = await import(file)
		modules[file] = module.default as Elysia
	}

	// Connect nested endpoints to parent modules

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
		module.derive(async (props) => {
			const _props = props as any

			if (_props.user) {
				return {
					user: _props.user
				}
			}
			return {}
		})
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
