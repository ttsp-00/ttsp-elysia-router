import TTSP from '@/lib/ttsp'
import { join } from 'node:path'

const dirname = join(__dirname, 'endpoints')
const app = await TTSP.run(dirname)

const port = Bun.env.PORT || 3000

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`)
	console.log(`Try: http://localhost:${port}/swagger`)
})