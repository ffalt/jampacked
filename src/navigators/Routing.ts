import { AlbumType } from '../services/jam';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// App Routes

export enum AppRouting {
	AUTH = 'Auth',
	APP = 'App',
	LOAD = 'Load'
}

export interface AppStackNavigatorParameterList {
	[key: string]: undefined;

	Auth: undefined;
	App: undefined;
	Load: undefined;
}

export type AppStackProps<T extends keyof AppStackNavigatorParameterList> = NativeStackScreenProps<AppStackNavigatorParameterList, T>;

// Modal Routes

export enum ModalRouting {
	MAIN = 'Main',
	PLAYER = 'Player'
}

export interface ModalStackNavigatorParameterList {
	[key: string]: undefined;

	Main: undefined;
	Player: undefined;
}

export type ModalStackProps<T extends keyof ModalStackNavigatorParameterList> = NativeStackScreenProps<ModalStackNavigatorParameterList, T>;

// Bottom Tab Routes

export enum BottomTabRoute {
	HOME = 'Home',
	QUEUE = 'Queue',
	SETTINGS = 'Settings'
}

export interface BottomTabNavigatorParameterList {
	[key: string]: undefined;

	Home: undefined;
	Queue: undefined;
	Settings: undefined;
}

export type BottomTabProps<T extends keyof BottomTabNavigatorParameterList> = NativeStackScreenProps<BottomTabNavigatorParameterList, T>;

// Home Routes

export enum HomeRoute {
	START = 'Start',
	ARTISTS = 'Artists',
	ALBUMS = 'Albums',
	SERIES = 'Series',
	FOLDERS = 'Folders',
	SERIE = 'Serie',
	ARTIST = 'Artist',
	FOLDER = 'Folder',
	PODCASTS = 'Podcasts',
	PODCAST = 'Podcast',
	EPISODE = 'Episode',
	PLAYLIST = 'Playlist',
	PLAYLISTS = 'Playlists',
	TRACK = 'Track',
	ALBUM = 'Album',
	TRACKS = 'Tracks',
	PINNED = 'Pinned',
	BOOKMARKS = 'Bookmarks',
	GENRES = 'Genres',
	GENRE = 'Genre'
}

export interface HomeRouteParameterList {
	[key: string]: any;

	Start: undefined;
	Artists: undefined;
	Series: undefined;
	Albums: { albumType: AlbumType };
	Folders: { albumType: AlbumType };
	Genres: undefined;
	Tracks: undefined;
	Podcasts: undefined;
	Pinned: undefined;
	Playlists: undefined;
	Bookmarks: undefined;
	Playlist: { id: string; name: string };
	Episode: { id: string; name: string };
	Podcast: { id: string; name: string };
	Track: { id: string; name: string };
	Folder: { id: string; name: string };
	Serie: { id: string; name: string };
	Artist: { id: string; name: string };
	Album: { id: string; name: string };
	Genre: { id: string; name: string };
}

export type HomeRouteProps<T extends keyof HomeRouteParameterList> = NativeStackScreenProps<HomeRouteParameterList, T>;

// Artist Routes

export enum ArtistsRoute {
	INDEX = 'ArtistsIndex',
	FAV = 'ArtistsFav',
	RECENT = 'ArtistsRecent',
	RANDOM = 'ArtistsRandom',
	HIGHEST = 'ArtistsHighest',
	AVGHIGHEST = 'ArtistsAvgHighest',
	FREQUENT = 'ArtistsFrequent'
}

export interface ArtistsRouteParameterList {
	[key: string]: undefined;

	ArtistsIndex: undefined;
	ArtistsFav: undefined;
	ArtistsRecent: undefined;
	ArtistsRandom: undefined;
	ArtistsHighest: undefined;
	ArtistsAvgHighest: undefined;
	ArtistsFrequent: undefined;
}

export type ArtistsRouteProps<T extends keyof ArtistsRouteParameterList> = NativeStackScreenProps<ArtistsRouteParameterList, T>;

// Tracks Routes

export enum TracksRoute {
	FAV = 'TracksFav',
	RECENT = 'TracksRecent',
	RANDOM = 'TracksRandom',
	HIGHEST = 'TracksHighest',
	AVGHIGHEST = 'TracksAvgHighest',
	FREQUENT = 'TracksFrequent'
}

export interface TracksRouteParameterList {
	[key: string]: undefined;

	TracksFav: undefined;
	TracksRecent: undefined;
	TracksRandom: undefined;
	TracksHighest: undefined;
	TracksAvgHighest: undefined;
	TracksFrequent: undefined;
}

export type TracksRouteProps<T extends keyof TracksRouteParameterList> = NativeStackScreenProps<TracksRouteParameterList, T>;

// Album Routes

export enum AlbumRoute {
	MAIN = 'AlbumMain',
	INFO = 'AlbumInfo'
}

export interface AlbumRouteParameterList {
	[key: string]: { id?: string; name?: string };

	AlbumMain: { id?: string; name?: string };
	AlbumInfo: { id?: string; name?: string };
}

export type AlbumRouteProps<T extends keyof AlbumRouteParameterList> = NativeStackScreenProps<AlbumRouteParameterList, T>;

// Albums Routes

export enum AlbumsRoute {
	INDEX = 'AlbumsIndex',
	FAV = 'AlbumsFav',
	RECENT = 'AlbumsRecent',
	RANDOM = 'AlbumsRandom',
	HIGHEST = 'AlbumsHighest',
	AVGHIGHEST = 'AlbumsAvgHighest',
	FREQUENT = 'AlbumsFrequent'
}

export interface AlbumsRouteParameterList {
	[key: string]: { albumType?: AlbumType };

	AlbumsIndex: { albumType?: AlbumType };
	AlbumsFav: { albumType?: AlbumType };
	AlbumsRecent: { albumType?: AlbumType };
	AlbumsRandom: { albumType?: AlbumType };
	AlbumsHighest: { albumType?: AlbumType };
	AlbumsAvgHighest: { albumType?: AlbumType };
	AlbumsFrequent: { albumType?: AlbumType };
}

export type AlbumsRouteProps<T extends keyof AlbumsRouteParameterList> = NativeStackScreenProps<AlbumsRouteParameterList, T>;

// Series Routes

export enum SeriesRoute {
	INDEX = 'SeriesIndex',
	FAV = 'SeriesFav',
	RECENT = 'SeriesRecent',
	RANDOM = 'SeriesRandom',
	HIGHEST = 'SeriesHighest',
	AVGHIGHEST = 'SeriesAvgHighest',
	FREQUENT = 'SeriesFrequent'
}

export interface SeriesRouteParameterList {
	[key: string]: undefined;

	SeriesIndex: undefined;
	SeriesFav: undefined;
	SeriesRecent: undefined;
	SeriesRandom: undefined;
	SeriesHighest: undefined;
	SeriesAvgHighest: undefined;
	SeriesFrequent: undefined;
}

export type SeriesRouteProps<T extends keyof SeriesRouteParameterList> = NativeStackScreenProps<SeriesRouteParameterList, T>;

// Folders Routes

export enum FoldersRoute {
	INDEX = 'FoldersIndex',
	FAV = 'FoldersFav',
	RECENT = 'FoldersRecent',
	RANDOM = 'FoldersRandom',
	HIGHEST = 'FoldersHighest',
	AVGHIGHEST = 'FoldersAvgHighest',
	FREQUENT = 'FoldersFrequent'
}

export interface FoldersRouteParameterList {
	[key: string]: { albumType?: AlbumType };

	FoldersIndex: { albumType?: AlbumType };
	FoldersFav: { albumType?: AlbumType };
	FoldersRecent: { albumType?: AlbumType };
	FoldersRandom: { albumType?: AlbumType };
	FoldersHighest: { albumType?: AlbumType };
	FoldersAvgHighest: { albumType?: AlbumType };
	FoldersFrequent: { albumType?: AlbumType };
}

export type FoldersRouteProps<T extends keyof FoldersRouteParameterList> = NativeStackScreenProps<FoldersRouteParameterList, T>;

// Downloads Routes

export enum DownloadsRoute {
	ACTIVE = 'DownloadsActive',
	PINNED = 'DownloadsPinned',
	ALL = 'DownloadsAll'
}

export interface DownloadsRouteParameterList {
	[key: string]: undefined;

	DownloadsActive: undefined;
	DownloadsPinned: undefined;
	DownloadsAll: undefined;
}

export type DownloadsRouteProps<T extends keyof DownloadsRouteParameterList> = NativeStackScreenProps<DownloadsRouteParameterList, T>;

// Genres Routes

export enum GenresRoute {
	INDEX = 'GenreIndex'
}

export interface GenresRouteParameterList {
	[key: string]: undefined;

	GenreIndex: undefined;
}

export type GenresRouteProps<T extends keyof GenresRouteParameterList> = NativeStackScreenProps<GenresRouteParameterList, T>;

// Genre Routes

export enum GenreRoute {
	ALBUMS = 'GenreAlbums',
	ARTISTS = 'GenreArtists',
	TRACKS = 'GenreTracks'
}

export interface GenreRouteParameterList {
	[key: string]: { id: string; name: string };

	GenreAlbums: { id: string; name: string };
	GenreArtists: { id: string; name: string };
	GenreTracks: { id: string; name: string };
}

export type GenreRouteProps<T extends keyof GenreRouteParameterList> = NativeStackScreenProps<GenreRouteParameterList, T>;
