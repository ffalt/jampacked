import {AlbumType, ListType} from './jam';

export interface JamAlbumTypeInfo {
	albumType: AlbumType;
	title: string;
	icon: string;
}

const albumTypeInfos: Array<JamAlbumTypeInfo> = [
	{
		title: 'Albums',
		icon: 'album',
		albumType: AlbumType.album
	},
	{
		title: 'Compilations',
		icon: 'compilation',
		albumType: AlbumType.compilation
	},
	{
		title: 'Soundtracks',
		icon: 'soundtrack',
		albumType: AlbumType.soundtrack
	},
	{
		title: 'Audiobooks',
		icon: 'audiobook',
		albumType: AlbumType.audiobook
	},
	{
		title: 'Live Albums',
		icon: 'live',
		albumType: AlbumType.live
	},
	{
		title: 'Bootlegs',
		icon: 'bootleg',
		albumType: AlbumType.bootleg
	},
	{
		title: 'EPs',
		icon: 'ep',
		albumType: AlbumType.ep
	},
	{
		title: 'Singles',
		icon: 'single',
		albumType: AlbumType.single
	}
];

export function getAlbumTypeInfos(albumType: AlbumType): JamAlbumTypeInfo {
	return albumTypeInfos.find(i => i.albumType === albumType) || {title: '[Invalid AlbumType]', icon: 'album', albumType}
}

export const ListTypeName: { [key: string]: string } = {
	random: 'Random',
	faved: 'Favorite',
	highest: 'Top Rated',
	avghighest: 'Avg. Top Rated',
	frequent: 'Most Played',
	recent: 'Recently Played'
};
