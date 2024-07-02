export const prerender = false

export async function GET() {
	console.log('GET /api/health')
	return new Response(JSON.stringify({
			healthy: true,
		}),
	)
}
