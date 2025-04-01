export function formatDate(date: Date): string {
	const month = ('0' + (date.getMonth() + 1)).slice(-2)
	const day = ('0' + date.getDate()).slice(-2)
	return date.getFullYear() + '-' + month + '-' + day
}
