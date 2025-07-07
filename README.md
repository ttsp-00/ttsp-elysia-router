# TTSP Elysia Router

> 🔴 [Bun](https://bun.sh/) only package.

Simple and Fast filesystem based routing for [Elysia](https://elysiajs.com/). Built with 🤖AI for Vibe-coders.

## Usage

```typescript
import path from 'node:path'
import TTSP from 'ttsp-elysia-router'

const app = TTSP.run(
	path.join(__dirname, 'endpoints')
)

app.listen(Bun.env.PORT, () => {
	console.log('Server is running on http://localhost:3000')
})
```

## Example

[ttsp-elysia-router-example](https://github.com/ttsp-00/ttsp-elysia-router-example)