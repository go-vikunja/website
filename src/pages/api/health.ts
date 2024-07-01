export const prerender = false

export async function GET() {
	return new Response(JSON.stringify({
			healthy: true,
		}),
	)
}
