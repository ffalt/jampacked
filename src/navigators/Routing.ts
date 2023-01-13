import {AlbumType} from '../services/jam';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

// App Routes

export enum AppRouting {
	AUTH = 'Auth',
	APP = 'App',
	LOAD = 'Load',
}

export type AppStackNavigatorParamList = {
	Auth: undefined;
	App: undefined;
	Load: undefined;
};

export type AppStackProps<T extends keyof AppStackNavigatorParamList> = NativeStackScreenProps<AppStackNavigatorParamList, T>;

// Modal Routes

export enum ModalRouting {
	MAIN = 'Main',
	PLAYER = 'Player'
}

export type ModalStackNavigatorParamList = {
	Main: undefined;
	Player: undefined;
};

export type ModalStackProps<T extends keyof ModalStackNavigatorParamList> = NativeStackScreenProps<ModalStackNavigatorParamList, T>;

// Bottom Tab Routes

export enum BottomTabRoute {
	HOME = 'Home',
	QUEUE = 'Queue',
	SETTINGS = 'Settings'
}

export type BottomTabNavigatorParamList = {
	Home: undefined;
	Queue: undefined;
	Settings: undefined;
};

export type BottomTabProps<T extends keyof BottomTabNavigatorParamList> = NativeStackScreenProps<BottomTabNavigatorParamList, T>;

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
	DOWNLOADS = 'Downloads',
	BOOKMARKS = 'Bookmarks',
	GENRES = 'Genres',
	GENRE = 'Genre'
}

export type HomeRouteParamList = {
	Start: undefined;
	Artists: undefined;
	Series: undefined;
	Albums: { albumType: AlbumType };
	Folders: { albumType: AlbumType };
	Genres: undefined;
	Tracks: undefined;
	Podcasts: undefined;
	Downloads: undefined;
	Playlists: undefined;
	Bookmarks: undefined;
	Playlist: { id: string, name: string };
	Episode: { id: string, name: string };
	Podcast: { id: string, name: string };
	Track: { id: string, name: string };
	Folder: { id: string, name: string };
	Serie: { id: string, name: string };
	Artist: { id: string, name: string };
	Album: { id: string, name: string };
	Genre: { id: string, name: string };
};

export type HomeRouteProps<T extends keyof HomeRouteParamList> = NativeStackScreenProps<HomeRouteParamList, T>;

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

export type ArtistsRouteParamList = {
	ArtistsIndex: undefined;
	ArtistsFav: undefined;
	ArtistsRecent: undefined;
	ArtistsRandom: undefined;
	ArtistsHighest: undefined;
	ArtistsAvgHighest: undefined;
	ArtistsFrequent: undefined;
};

export type ArtistsRouteProps<T extends keyof ArtistsRouteParamList> = NativeStackScreenProps<ArtistsRouteParamList, T>;

// Tracks Routes

export enum TracksRoute {
	FAV = 'TracksFav',
	RECENT = 'TracksRecent',
	RANDOM = 'TracksRandom',
	HIGHEST = 'TracksHighest',
	AVGHIGHEST = 'TracksAvgHighest',
	FREQUENT = 'TracksFrequent'
}

export type TracksRouteParamList = {
	TracksFav: undefined;
	TracksRecent: undefined;
	TracksRandom: undefined;
	TracksHighest: undefined;
	TracksAvgHighest: undefined;
	TracksFrequent: undefined;
};

export type TracksRouteProps<T extends keyof TracksRouteParamList> = NativeStackScreenProps<TracksRouteParamList, T>;

// Album Routes

export enum AlbumRoute {
	MAIN = 'AlbumMain',
	INFO = 'AlbumInfo'
}

export type AlbumRouteParamList = {
	AlbumMain: { id?: string; name?: string };
	AlbumInfo: { id?: string; name?: string };
};

export type AlbumRouteProps<T extends keyof AlbumRouteParamList> = NativeStackScreenProps<AlbumRouteParamList, T>;

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

export type AlbumsRouteParamList = {
	AlbumsIndex: { albumType?: AlbumType };
	AlbumsFav: { albumType?: AlbumType };
	AlbumsRecent: { albumType?: AlbumType };
	AlbumsRandom: { albumType?: AlbumType };
	AlbumsHighest: { albumType?: AlbumType };
	AlbumsAvgHighest: { albumType?: AlbumType };
	AlbumsFrequent: { albumType?: AlbumType };
};

export type AlbumsRouteProps<T extends keyof AlbumsRouteParamList> = NativeStackScreenProps<AlbumsRouteParamList, T>;

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

export type SeriesRouteParamList = {
	SeriesIndex: undefined;
	SeriesFav: undefined;
	SeriesRecent: undefined;
	SeriesRandom: undefined;
	SeriesHighest: undefined;
	SeriesAvgHighest: undefined;
	SeriesFrequent: undefined;
};

export type SeriesRouteProps<T extends keyof SeriesRouteParamList> = NativeStackScreenProps<SeriesRouteParamList, T>;

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

export type FoldersRouteParamList = {
	FoldersIndex: { albumType?: AlbumType };
	FoldersFav: { albumType?: AlbumType };
	FoldersRecent: { albumType?: AlbumType };
	FoldersRandom: { albumType?: AlbumType };
	FoldersHighest: { albumType?: AlbumType };
	FoldersAvgHighest: { albumType?: AlbumType };
	FoldersFrequent: { albumType?: AlbumType };
};

export type FoldersRouteProps<T extends keyof FoldersRouteParamList> = NativeStackScreenProps<FoldersRouteParamList, T>;

// Downloads Routes

export enum DownloadsRoute {
	ACTIVE = 'DownloadsActive',
	PINNED = 'DownloadsPinned'
}

export type DownloadsRouteParamList = {
	DownloadsActive: undefined;
	DownloadsPinned: undefined;
};

export type DownloadsRouteProps<T extends keyof DownloadsRouteParamList> = NativeStackScreenProps<DownloadsRouteParamList, T>;

// Genres Routes

export enum GenresRoute {
	INDEX = 'GenreIndex'
}

export type GenresRouteParamList = {
	GenreIndex: undefined;
};

export type GenresRouteProps<T extends keyof GenresRouteParamList> = NativeStackScreenProps<GenresRouteParamList, T>;

// Genre Routes

export enum GenreRoute {
	ALBUMS = 'GenreAlbums',
	ARTISTS = 'GenreArtists',
	TRACKS = 'GenreTracks'
}

export type GenreRouteParamList = {
	GenreAlbums: { id: string, name: string };
	GenreArtists: { id: string, name: string };
	GenreTracks: { id: string, name: string };
};

export type GenreRouteProps<T extends keyof GenreRouteParamList> = NativeStackScreenProps<GenreRouteParamList, T>;

