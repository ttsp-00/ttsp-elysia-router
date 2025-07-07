import Elysia from 'elysia'

export const authorizationDemo = new Elysia()
	.derive(async ({ headers }) => {
		const token = headers.authorization
		if (!token) {
			throw new Error('Unauthorized')
		}
		return { token }
	})

export default authorizationDemo