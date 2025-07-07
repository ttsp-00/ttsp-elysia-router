# TTSP Elysia Router

> 🔴 [Bun](https://bun.sh/) only package.

Simple and Fast filesystem based routing for [Elysia](https://elysiajs.com/). Built with 🤖AI for Vibe-coders.

## Usage

```typescript

// src/index.ts

import path from 'node:path'
import TTSP from 'ttsp-elysia-router'

const port = Bun.env.PORT || 3000

const app = TTSP.run(
	path.join(__dirname, 'endpoints')
)

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`)
	console.log(`Try: http://localhost:${port}/swagger`)
})

```

```typescript

// src/endpoints/v1.ts
// uri: /v1

import TTSP from 'ttsp-elysia-router'

export default TTSP.endpoint(import.meta.url)
	.get('/', () => 'v1 root endpoint')

// src/endpoints/v1/search.ts
// uri: /v1/search

import TTSP from 'ttsp-elysia-router'

export default TTSP.endpoint(import.meta.url)
	.get('/', () => 'Search endpoint')

```

## Example

[ttsp-elysia-router-example](https://github.com/ttsp-00/ttsp-elysia-router-example)