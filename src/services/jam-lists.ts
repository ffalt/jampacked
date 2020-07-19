import {AlbumType, JamObjectType, ListType} from './jam';

export interface JamAlbumType {
	id: AlbumType;
	text: string;
	link: string;
	icon: string;
}

export enum JamUrlType {
	albums = 'albums',
	compilations = 'compilations',
	series = 'series',
	artists = 'artists',
	podcasts = 'podcasts',
	soundtracks = 'soundtracks',
	audiobooks = 'audiobooks',
	live = 'live',
	bootlegs = 'bootlegs',
	eps = 'eps',
	singles = 'singles',
	playlists = 'playlists',
	folders = 'folders',
	tracks = 'tracks',
	episodes = 'episodes'
}

export interface JamType {
	id: JamUrlType;
	text: string;
	icon: string;
	category?: string;
	type: JamObjectType;
	albumType?: AlbumType;
}

export const JamUrlTypes: Array<JamType> = [
	{
		id: JamUrlType.albums, text: 'Albums', icon: 'album', type: JamObjectType.album, albumType: AlbumType.album
	},
	{
		id: JamUrlType.compilations,
		text: 'Compilations',
		icon: 'compilation',
		type: JamObjectType.album,
		albumType: AlbumType.compilation
	},
	{
		id: JamUrlType.soundtracks, text: 'Soundtracks', icon: 'soundtrack', type: JamObjectType.album, albumType: AlbumType.soundtrack
	},
	{
		id: JamUrlType.audiobooks, text: 'Audiobooks', icon: 'audiobook', type: JamObjectType.album, albumType: AlbumType.audiobook
	},
	{
		id: JamUrlType.live, text: 'Live Albums', icon: 'live', type: JamObjectType.album, albumType: AlbumType.live
	},
	{
		id: JamUrlType.bootlegs, text: 'Bootlegs', icon: 'bootleg', type: JamObjectType.album, albumType: AlbumType.bootleg
	},
	{
		id: JamUrlType.eps, text: 'EPs', icon: 'ep', type: JamObjectType.album, albumType: AlbumType.ep
	},
	{
		id: JamUrlType.singles, text: 'Singles', icon: 'single', type: JamObjectType.album, albumType: AlbumType.single
	},
	{
		id: JamUrlType.series, text: 'Series', category: 'Audiobook', icon: 'series', type: JamObjectType.series
	},
	{
		id: JamUrlType.artists, text: 'Artists', icon: 'artist', type: JamObjectType.artist
	},
	{
		id: JamUrlType.podcasts, text: 'Podcasts', icon: 'podcasts', type: JamObjectType.podcast
	},
	{
		id: JamUrlType.playlists, text: 'Playlists', icon: 'playlist', type: JamObjectType.playlist
	},
	{
		id: JamUrlType.folders, text: 'Folders', icon: 'folder', type: JamObjectType.folder
	},
	{
		id: JamUrlType.tracks, text: 'Tracks', icon: 'track', type: JamObjectType.track
	},
	{
		id: JamUrlType.episodes, text: 'Episodes', icon: 'episodes', type: JamObjectType.episode
	}
];

export function getTypeByAlbumType(albumType: string): JamType | undefined {
	return JamUrlTypes.find(part => part.albumType === albumType);
}

export function getUrlTypeByID(val?: string): JamType | undefined {
	if (!val) {
		return;
	}
	return JamUrlTypes.find(part => part.id === val);
}

export const ListTypeUrlNamesKeys: { [key: string]: ListType } = {
	random: ListType.random,
	favorites: ListType.faved,
	'top-rated': ListType.highest,
	'most-played': ListType.frequent,
	'recently-played': ListType.recent
};
