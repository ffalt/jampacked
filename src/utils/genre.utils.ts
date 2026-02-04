export function genreDisplay(genres?: Array<string | { name: string }>): string {
	if (!genres || genres.length === 0) {
		return '';
	}
	const first = genres[0];
	return typeof first === 'string' ? first : first.name;
}
