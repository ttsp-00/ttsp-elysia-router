import fs from 'node:fs'
import { join } from 'node:path'

export const fs2 = {
	readdirRecursive: (dir: string): string[] => {
		const files = fs.readdirSync(dir)
		const result: string[] = []
		for (const file of files) {
			if (file.startsWith('_')) {
				continue
			}
			const filePath = join(dir, file)
			const stats = fs.statSync(filePath)
			if (stats.isDirectory()) {
				result.push(...fs2.readdirRecursive(filePath))
			} else {
				result.push(filePath)
			}
		}
		return result
	}
}