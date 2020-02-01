export function genreDisplay(genres?: Array<string>): string {
	return genres && genres.length > 0 ? genres[0] : '';
}
