// @generated
// This file was automatically generated and should not be edited.

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
	ID: string;
	String: string;
	Boolean: boolean;
	Int: number;
	Float: number;
	/** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
	DateTime: any;
	/** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
	JSON: any;
};

/** Admin Change Queue Info */
export type AdminChangeQueueInfoQL = {
	/** Changes Completed Timestamp */
	done: Scalars['Int'];
	/** Error (if any) */
	error: Scalars['String'];
	/** Queue ID */
	id: Scalars['ID'];
	/** Waiting Position */
	position: Scalars['Int'];
};

/** Admin Chat Maximum Age Settings */
export type AdminSettingsChatMaxAgeQL = {
	/** Unit of Maximum Age */
	unit: Scalars['String'];
	/** Value of Maximum Age */
	value: Scalars['Int'];
};

/** Admin Chat Settings */
export type AdminSettingsChatQL = {
	/** Maximum Age of Chat Messages to keep */
	maxAge: AdminSettingsChatMaxAgeQL;
	/** Maximum Number of Chat Messages to keep */
	maxMessages: Scalars['Int'];
};

/** Admin External Services Settings */
export type AdminSettingsExternalQL = {
	/** Enable External Services */
	enabled: Scalars['Boolean'];
};

/** Admin Index Settings */
export type AdminSettingsIndexQL = {
	/** List of ignored Articles */
	ignoreArticles: Array<Scalars['String']>;
};

/** Admin Library Settings */
export type AdminSettingsLibraryQL = {
	/** Start Root Scanning on Server Start */
	scanAtStart: Scalars['Boolean'];
};

/** Admin Settings */
export type AdminSettingsQL = {
	chat: AdminSettingsChatQL;
	externalServices: AdminSettingsExternalQL;
	index: AdminSettingsIndexQL;
	library: AdminSettingsLibraryQL;
};

export type AlbumFilterArgsQL = {
	albumTypes?: InputMaybe<Array<AlbumType>>;
	artist?: InputMaybe<Scalars['String']>;
	artistIDs?: InputMaybe<Array<Scalars['ID']>>;
	folderIDs?: InputMaybe<Array<Scalars['ID']>>;
	fromYear?: InputMaybe<Scalars['Int']>;
	genreIDs?: InputMaybe<Array<Scalars['ID']>>;
	genres?: InputMaybe<Array<Scalars['String']>>;
	ids?: InputMaybe<Array<Scalars['ID']>>;
	mbArtistIDs?: InputMaybe<Array<Scalars['String']>>;
	mbReleaseIDs?: InputMaybe<Array<Scalars['String']>>;
	name?: InputMaybe<Scalars['String']>;
	notMbArtistID?: InputMaybe<Scalars['String']>;
	query?: InputMaybe<Scalars['String']>;
	rootIDs?: InputMaybe<Array<Scalars['ID']>>;
	seriesIDs?: InputMaybe<Array<Scalars['ID']>>;
	since?: InputMaybe<Scalars['Float']>;
	slug?: InputMaybe<Scalars['String']>;
	toYear?: InputMaybe<Scalars['Int']>;
	trackIDs?: InputMaybe<Array<Scalars['ID']>>;
};

export type AlbumIndexGroupQL = {
	items: Array<AlbumQL>;
	name: Scalars['String'];
};

export type AlbumIndexQL = {
	groups: Array<AlbumIndexGroupQL>;
};

export type AlbumOrderArgsQL = {
	orderBy?: InputMaybe<AlbumOrderFields>;
	orderDesc?: InputMaybe<Scalars['Boolean']>;
};

export enum AlbumOrderFields {
	albumType = 'albumType',
	artist = 'artist',
	created = 'created',
	default = 'default',
	duration = 'duration',
	name = 'name',
	seriesNr = 'seriesNr',
	updated = 'updated',
	year = 'year'
}

export type AlbumPageQL = {
	items: Array<AlbumQL>;
	skip?: Maybe<Scalars['Int']>;
	take?: Maybe<Scalars['Int']>;
	total: Scalars['Int'];
};

export type AlbumQL = {
	albumType: AlbumType;
	artist: ArtistQL;
	createdAt: Scalars['DateTime'];
	duration?: Maybe<Scalars['Float']>;
	folders: Array<FolderQL>;
	foldersCount: Scalars['Int'];
	genres: Array<GenreQL>;
	id: Scalars['ID'];
	mbArtistID?: Maybe<Scalars['String']>;
	mbReleaseID?: Maybe<Scalars['String']>;
	name: Scalars['String'];
	roots: Array<RootQL>;
	rootsCount: Scalars['Int'];
	series?: Maybe<SeriesQL>;
	seriesNr?: Maybe<Scalars['String']>;
	slug: Scalars['String'];
	state: StateQL;
	tracks: Array<TrackQL>;
	tracksCount: Scalars['Int'];
	updatedAt: Scalars['DateTime'];
	year?: Maybe<Scalars['Int']>;
};

export enum AlbumType {
	album = 'album',
	audiobook = 'audiobook',
	bootleg = 'bootleg',
	compilation = 'compilation',
	ep = 'ep',
	live = 'live',
	series = 'series',
	single = 'single',
	soundtrack = 'soundtrack',
	unknown = 'unknown'
}

export type ArtistFilterArgsQL = {
	albumIDs?: InputMaybe<Array<Scalars['ID']>>;
	albumTrackIDs?: InputMaybe<Array<Scalars['ID']>>;
	albumTypes?: InputMaybe<Array<AlbumType>>;
	folderIDs?: InputMaybe<Array<Scalars['ID']>>;
	genreIDs?: InputMaybe<Array<Scalars['ID']>>;
	genres?: InputMaybe<Array<Scalars['String']>>;
	ids?: InputMaybe<Array<Scalars['ID']>>;
	mbArtistIDs?: InputMaybe<Array<Scalars['String']>>;
	name?: InputMaybe<Scalars['String']>;
	notMbArtistID?: InputMaybe<Scalars['String']>;
	query?: InputMaybe<Scalars['String']>;
	rootIDs?: InputMaybe<Array<Scalars['ID']>>;
	seriesIDs?: InputMaybe<Array<Scalars['ID']>>;
	since?: InputMaybe<Scalars['Float']>;
	slug?: InputMaybe<Scalars['String']>;
	trackIDs?: InputMaybe<Array<Scalars['ID']>>;
};

export type ArtistIndexGroupQL = {
	items: Array<ArtistQL>;
	name: Scalars['String'];
};

export type ArtistIndexQL = {
	groups: Array<ArtistIndexGroupQL>;
};

export type ArtistOrderArgsQL = {
	orderBy?: InputMaybe<ArtistOrderFields>;
	orderDesc?: InputMaybe<Scalars['Boolean']>;
};

export enum ArtistOrderFields {
	created = 'created',
	default = 'default',
	name = 'name',
	nameSort = 'nameSort',
	updated = 'updated'
}

export type ArtistPageQL = {
	items: Array<ArtistQL>;
	skip?: Maybe<Scalars['Int']>;
	take?: Maybe<Scalars['Int']>;
	total: Scalars['Int'];
};

export type ArtistQL = {
	albumTracks: Array<TrackQL>;
	albumTypes: Array<AlbumType>;
	albums: Array<AlbumQL>;
	albumsCount: Scalars['Int'];
	albumsTracksCount: Scalars['Int'];
	createdAt: Scalars['DateTime'];
	folders: Array<FolderQL>;
	foldersCount: Scalars['Int'];
	genres: Array<GenreQL>;
	genresCount: Scalars['Int'];
	id: Scalars['ID'];
	mbArtistID?: Maybe<Scalars['String']>;
	name: Scalars['String'];
	nameSort: Scalars['String'];
	roots: Array<RootQL>;
	rootsCount: Scalars['Int'];
	series: Array<SeriesQL>;
	seriesCount: Scalars['Int'];
	slug: Scalars['String'];
	state: StateQL;
	tracks: Array<TrackQL>;
	tracksCount: Scalars['Int'];
	updatedAt: Scalars['DateTime'];
};

export type ArtworkFilterArgsQL = {
	childOfID?: InputMaybe<Scalars['ID']>;
	folderIDs?: InputMaybe<Array<Scalars['ID']>>;
	formats?: InputMaybe<Array<Scalars['String']>>;
	heightFrom?: InputMaybe<Scalars['Int']>;
	heightTo?: InputMaybe<Scalars['Int']>;
	ids?: InputMaybe<Array<Scalars['ID']>>;
	name?: InputMaybe<Scalars['String']>;
	query?: InputMaybe<Scalars['String']>;
	since?: InputMaybe<Scalars['Float']>;
	sizeFrom?: InputMaybe<Scalars['Int']>;
	sizeTo?: InputMaybe<Scalars['Int']>;
	types?: InputMaybe<Array<ArtworkImageType>>;
	widthFrom?: InputMaybe<Scalars['Int']>;
	widthTo?: InputMaybe<Scalars['Int']>;
};

export enum ArtworkImageType {
	artist = 'artist',
	back = 'back',
	booklet = 'booklet',
	front = 'front',
	liner = 'liner',
	medium = 'medium',
	obi = 'obi',
	other = 'other',
	poster = 'poster',
	raw = 'raw',
	spine = 'spine',
	sticker = 'sticker',
	track = 'track',
	tray = 'tray',
	unedited = 'unedited',
	watermark = 'watermark'
}

export type ArtworkOrderArgsQL = {
	orderBy?: InputMaybe<DefaultOrderFields>;
	orderDesc?: InputMaybe<Scalars['Boolean']>;
};

export type ArtworkPageQL = {
	items: Array<ArtworkQL>;
	skip?: Maybe<Scalars['Int']>;
	take?: Maybe<Scalars['Int']>;
	total: Scalars['Int'];
};

export type ArtworkQL = {
	createdAt: Scalars['DateTime'];
	fileSize: Scalars['Int'];
	/** Get the Navigation Index for Albums */
	folder: FolderQL;
	format?: Maybe<Scalars['String']>;
	height?: Maybe<Scalars['Int']>;
	id: Scalars['ID'];
	name: Scalars['String'];
	path: Scalars['String'];
	statCreated: Scalars['DateTime'];
	statModified: Scalars['DateTime'];
	types: Array<ArtworkImageType>;
	updatedAt: Scalars['DateTime'];
	width?: Maybe<Scalars['Int']>;
};

export enum AudioFormatType {
	flac = 'flac',
	flv = 'flv',
	m4a = 'm4a',
	mp3 = 'mp3',
	mp4 = 'mp4',
	oga = 'oga',
	ogg = 'ogg',
	wav = 'wav',
	webma = 'webma'
}

export type BookmarkFilterArgsQL = {
	comment?: InputMaybe<Scalars['String']>;
	episodeIDs?: InputMaybe<Array<Scalars['ID']>>;
	ids?: InputMaybe<Array<Scalars['ID']>>;
	query?: InputMaybe<Scalars['String']>;
	since?: InputMaybe<Scalars['Float']>;
	trackIDs?: InputMaybe<Array<Scalars['ID']>>;
	userIDs?: InputMaybe<Array<Scalars['ID']>>;
};

export type BookmarkOrderArgsQL = {
	orderBy?: InputMaybe<BookmarkOrderFields>;
	orderDesc?: InputMaybe<Scalars['Boolean']>;
};

export enum BookmarkOrderFields {
	created = 'created',
	default = 'default',
	media = 'media',
	position = 'position',
	updated = 'updated'
}

export type BookmarkPageQL = {
	items: Array<BookmarkQL>;
	skip?: Maybe<Scalars['Int']>;
	take?: Maybe<Scalars['Int']>;
	total: Scalars['Int'];
};

export type BookmarkQL = {
	comment?: Maybe<Scalars['String']>;
	createdAt: Scalars['DateTime'];
	episode?: Maybe<EpisodeQL>;
	id: Scalars['ID'];
	position: Scalars['Float'];
	track?: Maybe<TrackQL>;
	updatedAt: Scalars['DateTime'];
};

export type ChatQL = {
	created: Scalars['DateTime'];
	message: Scalars['String'];
	userID: Scalars['ID'];
	userName: Scalars['String'];
};

export enum DefaultOrderFields {
	created = 'created',
	default = 'default',
	name = 'name',
	updated = 'updated'
}

export type EpisodeChapterQL = {
	start: Scalars['Float'];
	title: Scalars['String'];
};

export type EpisodeEnclosureQL = {
	length?: Maybe<Scalars['Float']>;
	type?: Maybe<Scalars['String']>;
	url: Scalars['String'];
};

export type EpisodeFilterArgsQL = {
	authors?: InputMaybe<Array<Scalars['String']>>;
	guids?: InputMaybe<Array<Scalars['String']>>;
	ids?: InputMaybe<Array<Scalars['ID']>>;
	name?: InputMaybe<Scalars['String']>;
	podcastIDs?: InputMaybe<Array<Scalars['ID']>>;
	query?: InputMaybe<Scalars['String']>;
	since?: InputMaybe<Scalars['Float']>;
	statuses?: InputMaybe<Array<PodcastStatus>>;
};

export type EpisodeOrderArgsQL = {
	orderBy?: InputMaybe<EpisodeOrderFields>;
	orderDesc?: InputMaybe<Scalars['Boolean']>;
};

export enum EpisodeOrderFields {
	created = 'created',
	date = 'date',
	default = 'default',
	name = 'name',
	status = 'status',
	updated = 'updated'
}

export type EpisodePageQL = {
	items: Array<EpisodeQL>;
	skip?: Maybe<Scalars['Int']>;
	take?: Maybe<Scalars['Int']>;
	total: Scalars['Int'];
};

export type EpisodeQL = {
	author?: Maybe<Scalars['String']>;
	bookmarks: Array<BookmarkQL>;
	bookmarksCount: Scalars['Int'];
	chapters?: Maybe<Array<EpisodeChapterQL>>;
	createdAt: Scalars['DateTime'];
	date: Scalars['DateTime'];
	duration?: Maybe<Scalars['Float']>;
	enclosures?: Maybe<Array<EpisodeEnclosureQL>>;
	error?: Maybe<Scalars['String']>;
	fileCreated?: Maybe<Scalars['DateTime']>;
	fileModified?: Maybe<Scalars['DateTime']>;
	fileSize?: Maybe<Scalars['Int']>;
	guid?: Maybe<Scalars['String']>;
	id: Scalars['ID'];
	link?: Maybe<Scalars['String']>;
	name: Scalars['String'];
	path?: Maybe<Scalars['String']>;
	podcast: PodcastQL;
	state: StateQL;
	status: PodcastStatus;
	summary?: Maybe<Scalars['String']>;
	tag?: Maybe<TagQL>;
	updatedAt: Scalars['DateTime'];
	waveform: WaveformQL;
};

export type ExtendedInfoQL = {
	description: Scalars['String'];
	license: Scalars['String'];
	licenseUrl: Scalars['String'];
	source: Scalars['String'];
	url: Scalars['String'];
};

export type ExtendedInfoResultQL = {
	info?: Maybe<ExtendedInfoQL>;
};

export type FolderFilterArgsQL = {
	album?: InputMaybe<Scalars['String']>;
	albumIDs?: InputMaybe<Array<Scalars['ID']>>;
	albumTypes?: InputMaybe<Array<AlbumType>>;
	artist?: InputMaybe<Scalars['String']>;
	artistIDs?: InputMaybe<Array<Scalars['ID']>>;
	artistSort?: InputMaybe<Scalars['String']>;
	artworksIDs?: InputMaybe<Array<Scalars['ID']>>;
	childOfID?: InputMaybe<Scalars['ID']>;
	folderTypes?: InputMaybe<Array<FolderType>>;
	fromYear?: InputMaybe<Scalars['Int']>;
	genreIDs?: InputMaybe<Array<Scalars['ID']>>;
	genres?: InputMaybe<Array<Scalars['String']>>;
	ids?: InputMaybe<Array<Scalars['ID']>>;
	level?: InputMaybe<Scalars['Int']>;
	mbAlbumTypes?: InputMaybe<Array<Scalars['String']>>;
	mbArtistIDs?: InputMaybe<Array<Scalars['String']>>;
	mbReleaseGroupIDs?: InputMaybe<Array<Scalars['String']>>;
	mbReleaseIDs?: InputMaybe<Array<Scalars['String']>>;
	name?: InputMaybe<Scalars['String']>;
	parentIDs?: InputMaybe<Array<Scalars['ID']>>;
	query?: InputMaybe<Scalars['String']>;
	rootIDs?: InputMaybe<Array<Scalars['ID']>>;
	seriesIDs?: InputMaybe<Array<Scalars['ID']>>;
	since?: InputMaybe<Scalars['Float']>;
	title?: InputMaybe<Scalars['String']>;
	toYear?: InputMaybe<Scalars['Int']>;
	trackIDs?: InputMaybe<Array<Scalars['ID']>>;
};

export type FolderIndexGroupQL = {
	items: Array<FolderQL>;
	name: Scalars['String'];
};

export type FolderIndexQL = {
	groups: Array<FolderIndexGroupQL>;
};

export type FolderOrderArgsQL = {
	orderBy?: InputMaybe<FolderOrderFields>;
	orderDesc?: InputMaybe<Scalars['Boolean']>;
};

export enum FolderOrderFields {
	created = 'created',
	default = 'default',
	level = 'level',
	name = 'name',
	title = 'title',
	updated = 'updated',
	year = 'year'
}

export type FolderPageQL = {
	items: Array<FolderQL>;
	skip?: Maybe<Scalars['Int']>;
	take?: Maybe<Scalars['Int']>;
	total: Scalars['Int'];
};

export type FolderQL = {
	album?: Maybe<Scalars['String']>;
	albumTrackCount?: Maybe<Scalars['Int']>;
	albumType?: Maybe<AlbumType>;
	albums?: Maybe<Array<AlbumQL>>;
	albumsCount: Scalars['Int'];
	artist?: Maybe<Scalars['String']>;
	artistSort?: Maybe<Scalars['String']>;
	artists?: Maybe<Array<ArtistQL>>;
	artistsCount: Scalars['Int'];
	artworks?: Maybe<Array<ArtworkQL>>;
	artworksCount: Scalars['Int'];
	children: Array<FolderQL>;
	childrenCount: Scalars['Int'];
	createdAt: Scalars['DateTime'];
	folderType: FolderType;
	genres: Array<GenreQL>;
	genresCount: Scalars['Int'];
	id: Scalars['ID'];
	level: Scalars['Int'];
	mbAlbumType?: Maybe<Scalars['String']>;
	mbArtistID?: Maybe<Scalars['String']>;
	mbReleaseGroupID?: Maybe<Scalars['String']>;
	mbReleaseID?: Maybe<Scalars['String']>;
	name: Scalars['String'];
	parent?: Maybe<FolderQL>;
	path: Scalars['String'];
	root: RootQL;
	rootsCount: Scalars['Int'];
	series?: Maybe<Array<SeriesQL>>;
	seriesCount: Scalars['Int'];
	statCreated: Scalars['DateTime'];
	statModified: Scalars['DateTime'];
	state: StateQL;
	title: Scalars['String'];
	tracks?: Maybe<Array<TrackQL>>;
	tracksCount: Scalars['Int'];
	updatedAt: Scalars['DateTime'];
	year?: Maybe<Scalars['Int']>;
};

export enum FolderType {
	album = 'album',
	artist = 'artist',
	collection = 'collection',
	extras = 'extras',
	multialbum = 'multialbum',
	unknown = 'unknown'
}

export type GenreFilterArgsQL = {
	ids?: InputMaybe<Array<Scalars['ID']>>;
	name?: InputMaybe<Scalars['String']>;
	query?: InputMaybe<Scalars['String']>;
	since?: InputMaybe<Scalars['Float']>;
	trackIDs?: InputMaybe<Array<Scalars['ID']>>;
};

export type GenreIndexGroupQL = {
	items: Array<GenreQL>;
	name: Scalars['String'];
};

export type GenreIndexQL = {
	groups: Array<GenreIndexGroupQL>;
};

export type GenreOrderArgsQL = {
	orderBy?: InputMaybe<GenreOrderFields>;
	orderDesc?: InputMaybe<Scalars['Boolean']>;
};

export enum GenreOrderFields {
	created = 'created',
	default = 'default',
	name = 'name',
	updated = 'updated'
}

export type GenrePageQL = {
	items: Array<GenreQL>;
	skip?: Maybe<Scalars['Int']>;
	take?: Maybe<Scalars['Int']>;
	total: Scalars['Int'];
};

export type GenreQL = {
	albumCount: Scalars['Int'];
	albums: AlbumPageQL;
	artistCount: Scalars['Int'];
	artists: ArtistPageQL;
	createdAt: Scalars['DateTime'];
	folderCount: Scalars['Int'];
	folders: Array<FolderQL>;
	id: Scalars['ID'];
	name: Scalars['String'];
	series: Array<SeriesQL>;
	trackCount: Scalars['Int'];
	tracks: TrackPageQL;
	updatedAt: Scalars['DateTime'];
};


export type GenreQLalbumsArgs = {
	filter?: InputMaybe<AlbumFilterArgsQL>;
	order?: InputMaybe<Array<AlbumOrderArgsQL>>;
	page?: InputMaybe<PageArgsQL>;
};


export type GenreQLartistsArgs = {
	filter?: InputMaybe<ArtistFilterArgsQL>;
	order?: InputMaybe<Array<ArtistOrderArgsQL>>;
	page?: InputMaybe<PageArgsQL>;
};


export type GenreQLtracksArgs = {
	filter?: InputMaybe<TrackFilterArgsQL>;
	order?: InputMaybe<Array<TrackOrderArgsQL>>;
	page?: InputMaybe<PageArgsQL>;
};

/** Type of List Request */
export enum ListType {
	avghighest = 'avghighest',
	faved = 'faved',
	frequent = 'frequent',
	highest = 'highest',
	random = 'random',
	recent = 'recent'
}

export type MediaTagRawQL = {
	frames: Scalars['JSON'];
	version: Scalars['String'];
};

export type Mutation = {
	fav: StateQL;
	rate: StateQL;
	scrobble: NowPlayingQL;
};


export type MutationfavArgs = {
	id: Scalars['ID'];
	remove?: InputMaybe<Scalars['Boolean']>;
};


export type MutationrateArgs = {
	id: Scalars['ID'];
	rating: Scalars['Int'];
};


export type MutationscrobbleArgs = {
	id: Scalars['ID'];
};

export type NowPlayingQL = {
	episode?: Maybe<EpisodeQL>;
	time: Scalars['Float'];
	track?: Maybe<TrackQL>;
	userID: Scalars['ID'];
	userName: Scalars['String'];
};

export type PageArgsQL = {
	/** return items starting from offset position */
	skip?: InputMaybe<Scalars['Int']>;
	/** amount of returned items */
	take?: InputMaybe<Scalars['Int']>;
};

export type PlayQueueEntryQL = {
	createdAt: Scalars['DateTime'];
	episode?: Maybe<EpisodeQL>;
	id: Scalars['ID'];
	playQueue: PlayQueueQL;
	position: Scalars['Int'];
	track?: Maybe<TrackQL>;
	updatedAt: Scalars['DateTime'];
};

export type PlayQueueQL = {
	changedBy: Scalars['String'];
	createdAt: Scalars['DateTime'];
	current?: Maybe<Scalars['Int']>;
	duration?: Maybe<Scalars['Float']>;
	entries: Array<PlayQueueEntryQL>;
	entriesCount: Scalars['Int'];
	id: Scalars['ID'];
	position?: Maybe<Scalars['Float']>;
	updatedAt: Scalars['DateTime'];
};

export type PlaylistEntryQL = {
	createdAt: Scalars['DateTime'];
	episode?: Maybe<EpisodeQL>;
	id: Scalars['ID'];
	playlist: PlaylistQL;
	position: Scalars['Float'];
	track?: Maybe<TrackQL>;
	updatedAt: Scalars['DateTime'];
};

export type PlaylistFilterArgsQL = {
	comment?: InputMaybe<Scalars['String']>;
	durationFrom?: InputMaybe<Scalars['Float']>;
	durationTo?: InputMaybe<Scalars['Float']>;
	ids?: InputMaybe<Array<Scalars['ID']>>;
	isPublic?: InputMaybe<Scalars['Boolean']>;
	name?: InputMaybe<Scalars['String']>;
	query?: InputMaybe<Scalars['String']>;
	since?: InputMaybe<Scalars['Float']>;
	userIDs?: InputMaybe<Array<Scalars['ID']>>;
};

export type PlaylistIndexGroupQL = {
	items: Array<PlaylistQL>;
	name: Scalars['String'];
};

export type PlaylistIndexQL = {
	groups: Array<PlaylistIndexGroupQL>;
};

export type PlaylistOrderArgsQL = {
	orderBy?: InputMaybe<DefaultOrderFields>;
	orderDesc?: InputMaybe<Scalars['Boolean']>;
};

export type PlaylistPageQL = {
	items: Array<PlaylistQL>;
	skip?: Maybe<Scalars['Int']>;
	take?: Maybe<Scalars['Int']>;
	total: Scalars['Int'];
};

export type PlaylistQL = {
	comment?: Maybe<Scalars['String']>;
	createdAt: Scalars['DateTime'];
	duration: Scalars['Float'];
	entries: Array<PlaylistEntryQL>;
	entriesCount: Scalars['Int'];
	id: Scalars['ID'];
	isPublic: Scalars['Boolean'];
	name: Scalars['String'];
	state: StateQL;
	updatedAt: Scalars['DateTime'];
	userID: Scalars['ID'];
	userName: Scalars['String'];
};

export type PodcastDiscoverPageQL = {
	items: Array<PodcastDiscoverQL>;
	skip?: Maybe<Scalars['Int']>;
	take?: Maybe<Scalars['Int']>;
	total: Scalars['Int'];
};

export type PodcastDiscoverQL = {
	author: Scalars['String'];
	description: Scalars['String'];
	logo_url: Scalars['String'];
	mygpo_link: Scalars['String'];
	scaled_logo_url: Scalars['String'];
	subscribers: Scalars['Float'];
	subscribers_last_week: Scalars['Float'];
	title: Scalars['String'];
	url: Scalars['String'];
	website: Scalars['String'];
};

export type PodcastDiscoverTagPageQL = {
	items: Array<PodcastDiscoverTagQL>;
	skip?: Maybe<Scalars['Int']>;
	take?: Maybe<Scalars['Int']>;
	total: Scalars['Int'];
};

export type PodcastDiscoverTagQL = {
	tag: Scalars['String'];
	title: Scalars['String'];
	usage: Scalars['Float'];
};

export type PodcastFilterArgsQL = {
	author?: InputMaybe<Scalars['String']>;
	categories?: InputMaybe<Array<Scalars['String']>>;
	description?: InputMaybe<Scalars['String']>;
	episodeIDs?: InputMaybe<Array<Scalars['ID']>>;
	generator?: InputMaybe<Scalars['String']>;
	ids?: InputMaybe<Array<Scalars['ID']>>;
	lastCheckFrom?: InputMaybe<Scalars['Float']>;
	lastCheckTo?: InputMaybe<Scalars['Float']>;
	name?: InputMaybe<Scalars['String']>;
	query?: InputMaybe<Scalars['String']>;
	since?: InputMaybe<Scalars['Float']>;
	statuses?: InputMaybe<Array<PodcastStatus>>;
	title?: InputMaybe<Scalars['String']>;
	url?: InputMaybe<Scalars['String']>;
};

export type PodcastIndexGroupQL = {
	items: Array<PodcastQL>;
	name: Scalars['String'];
};

export type PodcastIndexQL = {
	groups: Array<PodcastIndexGroupQL>;
};

export type PodcastOrderArgsQL = {
	orderBy?: InputMaybe<PodcastOrderFields>;
	orderDesc?: InputMaybe<Scalars['Boolean']>;
};

export enum PodcastOrderFields {
	created = 'created',
	default = 'default',
	lastCheck = 'lastCheck',
	name = 'name',
	updated = 'updated'
}

export type PodcastPageQL = {
	items: Array<PodcastQL>;
	skip?: Maybe<Scalars['Int']>;
	take?: Maybe<Scalars['Int']>;
	total: Scalars['Int'];
};

export type PodcastQL = {
	author?: Maybe<Scalars['String']>;
	categories: Array<Scalars['String']>;
	createdAt: Scalars['DateTime'];
	description?: Maybe<Scalars['String']>;
	episodes: Array<EpisodeQL>;
	episodesCount: Scalars['Int'];
	errorMessage?: Maybe<Scalars['String']>;
	generator?: Maybe<Scalars['String']>;
	id: Scalars['ID'];
	image?: Maybe<Scalars['String']>;
	language?: Maybe<Scalars['String']>;
	lastCheck: Scalars['DateTime'];
	link?: Maybe<Scalars['String']>;
	name: Scalars['String'];
	state: StateQL;
	status: PodcastStatus;
	title?: Maybe<Scalars['String']>;
	updatedAt: Scalars['DateTime'];
	url: Scalars['String'];
};

export enum PodcastStatus {
	completed = 'completed',
	deleted = 'deleted',
	downloading = 'downloading',
	error = 'error',
	new = 'new'
}

export type Query = {
	/** Get Queue Information for Admin Change Tasks */
	adminQueue: AdminChangeQueueInfoQL;
	/** Get the Server Admin Settings */
	adminSettings: AdminSettingsQL;
	/** Get an Album by Id */
	album: AlbumQL;
	/** Get the Navigation Index for Albums */
	albumIndex: AlbumIndexQL;
	/** Get Extended Info for Album by Id */
	albumInfo: ExtendedInfoResultQL;
	/** Search albums */
	albums: AlbumPageQL;
	/** Get an Artist by Id */
	artist: ArtistQL;
	/** Get the Navigation Index for Albums */
	artistIndex: ArtistIndexQL;
	/** Get Extended Info for Artist by Id */
	artistInfo: ExtendedInfoResultQL;
	/** Search Artists */
	artists: ArtistPageQL;
	/** Get an Artwork by Id */
	artwork: ArtworkQL;
	/** Search Artworks */
	artworks: ArtworkPageQL;
	/** Get a Bookmark by Id */
	bookmark: BookmarkQL;
	/** Search Bookmarks */
	bookmarks: BookmarkPageQL;
	/** Get Chat Messages */
	chats: Array<ChatQL>;
	currentUser: UserQL;
	/** Get a Episode by Id */
	episode: EpisodeQL;
	/** Search Episodes */
	episodes: EpisodePageQL;
	/** Get a Folder by Id */
	folder: FolderQL;
	/** Get the Navigation Index for Folders */
	folderIndex: FolderIndexQL;
	/** Get Extended Info for Folder by Id */
	folderInfo: ExtendedInfoResultQL;
	/** Search Folders */
	folders: FolderPageQL;
	/** Get an Genre by Id */
	genre: GenreQL;
	/** Get the Navigation Index for Genres */
	genreIndex: GenreIndexQL;
	/** Search Genres */
	genres: GenrePageQL;
	/** Get a List of media [Track, Episode] played currently by Users */
	nowPlaying: Array<NowPlayingQL>;
	/** Get a PlayQueue for the calling user */
	playQueue: PlayQueueQL;
	/** Get a Playlist by Id */
	playlist: PlaylistQL;
	/** Get the Navigation Index for Playlists */
	playlistIndex: PlaylistIndexQL;
	/** Search Playlists */
	playlists: PlaylistPageQL;
	/** Get a Podcast by Id */
	podcast: PodcastQL;
	/** Get the Navigation Index for Podcasts */
	podcastIndex: PodcastIndexQL;
	/** Search Podcasts */
	podcasts: PodcastPageQL;
	/** Discover Podcasts via gpodder.net */
	podcastsDiscover: Array<PodcastDiscoverQL>;
	/** Discover Podcasts by Tag via gpodder.net */
	podcastsDiscoverByTag: PodcastDiscoverPageQL;
	/** Discover Podcast Tags via gpodder.net */
	podcastsDiscoverTags: PodcastDiscoverTagPageQL;
	/** Discover Top Podcasts via gpodder.net */
	podcastsDiscoverTop: PodcastDiscoverPageQL;
	/** Get a Radio by Id */
	radio: RadioQL;
	/** Get the Navigation Index for Radios */
	radioIndex: RadioIndexQL;
	/** Search Radios */
	radios: RadioPageQL;
	/** Get a Root by Id */
	root: RootQL;
	/** Search Roots */
	roots: RootPageQL;
	/** Get a Series by Id */
	series: SeriesQL;
	/** Get the Navigation Index for Series */
	seriesIndex: SeriesIndexQL;
	/** Get Extended Info for Series by Id */
	seriesInfo: ExtendedInfoResultQL;
	/** Search Series */
	serieses: SeriesPageQL;
	/** Check the Login State */
	session: SessionQL;
	/** Get a list of all sessions of the current user */
	sessions: SessionPageQL;
	/** Get User State (fav/rate/etc) for Base Objects */
	state: StateQL;
	stats: StatsQL;
	track: TrackQL;
	tracks: TrackPageQL;
	user: UserQL;
	userIndex: UserIndexQL;
	users: UserPageQL;
	/** Get the API Version */
	version: Scalars['String'];
	waveform: WaveformQL;
};


export type QueryadminQueueArgs = {
	id: Scalars['ID'];
};


export type QueryalbumArgs = {
	id: Scalars['ID'];
};


export type QueryalbumIndexArgs = {
	filter?: InputMaybe<AlbumFilterArgsQL>;
};


export type QueryalbumInfoArgs = {
	id: Scalars['ID'];
};


export type QueryalbumsArgs = {
	filter?: InputMaybe<AlbumFilterArgsQL>;
	list?: InputMaybe<ListType>;
	order?: InputMaybe<Array<AlbumOrderArgsQL>>;
	page?: InputMaybe<PageArgsQL>;
	seed?: InputMaybe<Scalars['String']>;
};


export type QueryartistArgs = {
	id: Scalars['ID'];
};


export type QueryartistIndexArgs = {
	filter?: InputMaybe<ArtistFilterArgsQL>;
};


export type QueryartistInfoArgs = {
	id: Scalars['ID'];
};


export type QueryartistsArgs = {
	filter?: InputMaybe<ArtistFilterArgsQL>;
	list?: InputMaybe<ListType>;
	order?: InputMaybe<Array<ArtistOrderArgsQL>>;
	page?: InputMaybe<PageArgsQL>;
	seed?: InputMaybe<Scalars['String']>;
};


export type QueryartworkArgs = {
	id: Scalars['ID'];
};


export type QueryartworksArgs = {
	filter?: InputMaybe<ArtworkFilterArgsQL>;
	list?: InputMaybe<ListType>;
	order?: InputMaybe<Array<ArtworkOrderArgsQL>>;
	page?: InputMaybe<PageArgsQL>;
	seed?: InputMaybe<Scalars['String']>;
};


export type QuerybookmarkArgs = {
	id: Scalars['ID'];
};


export type QuerybookmarksArgs = {
	filter?: InputMaybe<BookmarkFilterArgsQL>;
	order?: InputMaybe<Array<BookmarkOrderArgsQL>>;
	page?: InputMaybe<PageArgsQL>;
};


export type QuerychatsArgs = {
	since?: InputMaybe<Scalars['Float']>;
};


export type QueryepisodeArgs = {
	id: Scalars['ID'];
};


export type QueryepisodesArgs = {
	filter?: InputMaybe<EpisodeFilterArgsQL>;
	list?: InputMaybe<ListType>;
	order?: InputMaybe<Array<EpisodeOrderArgsQL>>;
	page?: InputMaybe<PageArgsQL>;
	seed?: InputMaybe<Scalars['String']>;
};


export type QueryfolderArgs = {
	id: Scalars['ID'];
};


export type QueryfolderIndexArgs = {
	filter?: InputMaybe<FolderFilterArgsQL>;
};


export type QueryfolderInfoArgs = {
	id: Scalars['ID'];
};


export type QueryfoldersArgs = {
	filter?: InputMaybe<FolderFilterArgsQL>;
	list?: InputMaybe<ListType>;
	order?: InputMaybe<Array<FolderOrderArgsQL>>;
	page?: InputMaybe<PageArgsQL>;
	seed?: InputMaybe<Scalars['String']>;
};


export type QuerygenreArgs = {
	id: Scalars['ID'];
};


export type QuerygenreIndexArgs = {
	filter?: InputMaybe<GenreFilterArgsQL>;
};


export type QuerygenresArgs = {
	filter?: InputMaybe<GenreFilterArgsQL>;
	list?: InputMaybe<ListType>;
	order?: InputMaybe<Array<GenreOrderArgsQL>>;
	page?: InputMaybe<PageArgsQL>;
	seed?: InputMaybe<Scalars['String']>;
};


export type QueryplaylistArgs = {
	id: Scalars['ID'];
};


export type QueryplaylistIndexArgs = {
	filter?: InputMaybe<PlaylistFilterArgsQL>;
};


export type QueryplaylistsArgs = {
	filter?: InputMaybe<PlaylistFilterArgsQL>;
	list?: InputMaybe<ListType>;
	order?: InputMaybe<Array<PlaylistOrderArgsQL>>;
	page?: InputMaybe<PageArgsQL>;
	seed?: InputMaybe<Scalars['String']>;
};


export type QuerypodcastArgs = {
	id: Scalars['ID'];
};


export type QuerypodcastIndexArgs = {
	filter?: InputMaybe<PodcastFilterArgsQL>;
};


export type QuerypodcastsArgs = {
	filter?: InputMaybe<PodcastFilterArgsQL>;
	list?: InputMaybe<ListType>;
	order?: InputMaybe<Array<PodcastOrderArgsQL>>;
	page?: InputMaybe<PageArgsQL>;
	seed?: InputMaybe<Scalars['String']>;
};


export type QuerypodcastsDiscoverArgs = {
	query: Scalars['String'];
};


export type QuerypodcastsDiscoverByTagArgs = {
	skip?: InputMaybe<Scalars['Int']>;
	tag: Scalars['String'];
	take?: InputMaybe<Scalars['Int']>;
};


export type QuerypodcastsDiscoverTagsArgs = {
	skip?: InputMaybe<Scalars['Int']>;
	take?: InputMaybe<Scalars['Int']>;
};


export type QuerypodcastsDiscoverTopArgs = {
	skip?: InputMaybe<Scalars['Int']>;
	take?: InputMaybe<Scalars['Int']>;
};


export type QueryradioArgs = {
	id: Scalars['ID'];
};


export type QueryradioIndexArgs = {
	filter?: InputMaybe<RadioFilterArgsQL>;
};


export type QueryradiosArgs = {
	filter?: InputMaybe<RadioFilterArgsQL>;
	list?: InputMaybe<ListType>;
	order?: InputMaybe<Array<RadioOrderArgsQL>>;
	page?: InputMaybe<PageArgsQL>;
	seed?: InputMaybe<Scalars['String']>;
};


export type QueryrootArgs = {
	id: Scalars['ID'];
};


export type QueryrootsArgs = {
	filter?: InputMaybe<RootFilterArgsQL>;
	list?: InputMaybe<ListType>;
	order?: InputMaybe<Array<RootOrderArgsQL>>;
	page?: InputMaybe<PageArgsQL>;
	seed?: InputMaybe<Scalars['String']>;
};


export type QueryseriesArgs = {
	id: Scalars['ID'];
};


export type QueryseriesIndexArgs = {
	filter?: InputMaybe<SeriesFilterArgsQL>;
};


export type QueryseriesInfoArgs = {
	id: Scalars['ID'];
};


export type QueryseriesesArgs = {
	filter?: InputMaybe<SeriesFilterArgsQL>;
	list?: InputMaybe<ListType>;
	order?: InputMaybe<Array<SeriesOrderArgsQL>>;
	page?: InputMaybe<PageArgsQL>;
	seed?: InputMaybe<Scalars['String']>;
};


export type QuerysessionsArgs = {
	filter?: InputMaybe<SessionFilterArgsQL>;
	order?: InputMaybe<Array<SessionOrderArgsQL>>;
	page?: InputMaybe<PageArgsQL>;
};


export type QuerystateArgs = {
	id: Scalars['ID'];
};


export type QuerystatsArgs = {
	rootID?: InputMaybe<Scalars['ID']>;
};


export type QuerytrackArgs = {
	id: Scalars['ID'];
};


export type QuerytracksArgs = {
	filter?: InputMaybe<TrackFilterArgsQL>;
	list?: InputMaybe<ListType>;
	order?: InputMaybe<Array<TrackOrderArgsQL>>;
	page?: InputMaybe<PageArgsQL>;
	seed?: InputMaybe<Scalars['String']>;
};


export type QueryuserArgs = {
	id: Scalars['ID'];
};


export type QueryuserIndexArgs = {
	filter?: InputMaybe<UserFilterArgsQL>;
};


export type QueryusersArgs = {
	filter?: InputMaybe<UserFilterArgsQL>;
	order?: InputMaybe<Array<UserOrderArgsQL>>;
	page?: InputMaybe<PageArgsQL>;
};


export type QuerywaveformArgs = {
	id: Scalars['ID'];
};

export type RadioFilterArgsQL = {
	disabled?: InputMaybe<Scalars['Boolean']>;
	homepage?: InputMaybe<Scalars['String']>;
	ids?: InputMaybe<Array<Scalars['ID']>>;
	name?: InputMaybe<Scalars['String']>;
	query?: InputMaybe<Scalars['String']>;
	since?: InputMaybe<Scalars['Int']>;
	url?: InputMaybe<Scalars['String']>;
};

export type RadioIndexGroupQL = {
	items: Array<RadioQL>;
	name: Scalars['String'];
};

export type RadioIndexQL = {
	groups: Array<RadioIndexGroupQL>;
};

export type RadioOrderArgsQL = {
	orderBy?: InputMaybe<DefaultOrderFields>;
	orderDesc?: InputMaybe<Scalars['Boolean']>;
};

export type RadioPageQL = {
	items: Array<RadioQL>;
	skip?: Maybe<Scalars['Int']>;
	take?: Maybe<Scalars['Int']>;
	total: Scalars['Int'];
};

export type RadioQL = {
	createdAt: Scalars['DateTime'];
	disabled: Scalars['Boolean'];
	homepage?: Maybe<Scalars['String']>;
	id: Scalars['ID'];
	name: Scalars['String'];
	state: StateQL;
	updatedAt: Scalars['DateTime'];
	url: Scalars['String'];
};

export type RootFilterArgsQL = {
	albumIDs?: InputMaybe<Array<Scalars['ID']>>;
	artistIDs?: InputMaybe<Array<Scalars['ID']>>;
	folderIDs?: InputMaybe<Array<Scalars['ID']>>;
	ids?: InputMaybe<Array<Scalars['ID']>>;
	name?: InputMaybe<Scalars['String']>;
	query?: InputMaybe<Scalars['String']>;
	seriesIDs?: InputMaybe<Array<Scalars['ID']>>;
	since?: InputMaybe<Scalars['Float']>;
	strategies: Array<RootScanStrategy>;
	trackIDs?: InputMaybe<Array<Scalars['ID']>>;
};

export type RootOrderArgsQL = {
	orderBy?: InputMaybe<DefaultOrderFields>;
	orderDesc?: InputMaybe<Scalars['Boolean']>;
};

export type RootPageQL = {
	items: Array<RootQL>;
	skip?: Maybe<Scalars['Int']>;
	take?: Maybe<Scalars['Int']>;
	total: Scalars['Int'];
};

export type RootQL = {
	albums: Array<AlbumQL>;
	artists: Array<ArtistQL>;
	createdAt: Scalars['DateTime'];
	folders: Array<FolderQL>;
	id: Scalars['ID'];
	name: Scalars['String'];
	path: Scalars['String'];
	series: Array<SeriesQL>;
	status: RootStatusQL;
	strategy: RootScanStrategy;
	tracks: Array<TrackQL>;
	updatedAt: Scalars['DateTime'];
};

export enum RootScanStrategy {
	artistalbum = 'artistalbum',
	audiobook = 'audiobook',
	auto = 'auto',
	compilation = 'compilation'
}

export type RootStatusQL = {
	error?: Maybe<Scalars['String']>;
	lastScan?: Maybe<Scalars['DateTime']>;
	scanning?: Maybe<Scalars['Boolean']>;
};

export type SeriesFilterArgsQL = {
	albumIDs?: InputMaybe<Array<Scalars['ID']>>;
	albumTypes?: InputMaybe<Array<AlbumType>>;
	artistIDs?: InputMaybe<Array<Scalars['ID']>>;
	folderIDs?: InputMaybe<Array<Scalars['ID']>>;
	genreIDs?: InputMaybe<Array<Scalars['ID']>>;
	ids?: InputMaybe<Array<Scalars['ID']>>;
	name?: InputMaybe<Scalars['String']>;
	query?: InputMaybe<Scalars['String']>;
	rootIDs?: InputMaybe<Array<Scalars['ID']>>;
	since?: InputMaybe<Scalars['Float']>;
	trackIDs?: InputMaybe<Array<Scalars['ID']>>;
};

export type SeriesIndexGroupQL = {
	items: Array<SeriesQL>;
	name: Scalars['String'];
};

export type SeriesIndexQL = {
	groups: Array<SeriesIndexGroupQL>;
};

export type SeriesOrderArgsQL = {
	orderBy?: InputMaybe<DefaultOrderFields>;
	orderDesc?: InputMaybe<Scalars['Boolean']>;
};

export type SeriesPageQL = {
	items: Array<SeriesQL>;
	skip?: Maybe<Scalars['Int']>;
	take?: Maybe<Scalars['Int']>;
	total: Scalars['Int'];
};

export type SeriesQL = {
	albumTypes: Array<AlbumType>;
	albums: Array<AlbumQL>;
	albumsCount: Scalars['Int'];
	artist?: Maybe<ArtistQL>;
	createdAt: Scalars['DateTime'];
	folders: Array<FolderQL>;
	foldersCount: Scalars['Int'];
	genres: Array<GenreQL>;
	genresCount: Scalars['Int'];
	id: Scalars['ID'];
	name: Scalars['String'];
	roots: Array<RootQL>;
	rootsCount: Scalars['Int'];
	state: StateQL;
	tracks: Array<TrackQL>;
	tracksCount: Scalars['Int'];
	updatedAt: Scalars['DateTime'];
};

export type SessionFilterArgsQL = {
	agent?: InputMaybe<Scalars['String']>;
	client?: InputMaybe<Scalars['String']>;
	expiresFrom?: InputMaybe<Scalars['Float']>;
	expiresTo?: InputMaybe<Scalars['Float']>;
	ids?: InputMaybe<Array<Scalars['ID']>>;
	mode?: InputMaybe<SessionMode>;
	since?: InputMaybe<Scalars['Float']>;
	userIDs?: InputMaybe<Array<Scalars['ID']>>;
};

export enum SessionMode {
	browser = 'browser',
	jwt = 'jwt'
}

export type SessionOrderArgsQL = {
	orderBy?: InputMaybe<SessionOrderFields>;
	orderDesc?: InputMaybe<Scalars['Boolean']>;
};

export enum SessionOrderFields {
	default = 'default',
	expires = 'expires'
}

export type SessionPageQL = {
	items: Array<SessionQL>;
	skip?: Maybe<Scalars['Int']>;
	take?: Maybe<Scalars['Int']>;
	total: Scalars['Int'];
};

export type SessionQL = {
	agent: Scalars['String'];
	client: Scalars['String'];
	createdAt: Scalars['DateTime'];
	expires: Scalars['DateTime'];
	id: Scalars['ID'];
	mode: SessionMode;
	updatedAt: Scalars['DateTime'];
};

export type StateQL = {
	createdAt: Scalars['DateTime'];
	faved?: Maybe<Scalars['DateTime']>;
	id: Scalars['ID'];
	lastPlayed?: Maybe<Scalars['DateTime']>;
	played?: Maybe<Scalars['Int']>;
	rated?: Maybe<Scalars['Int']>;
	updatedAt: Scalars['DateTime'];
};

export type StatsAlbumTypesQL = {
	album: Scalars['Int'];
	artistCompilation: Scalars['Int'];
	audiobook: Scalars['Int'];
	bootleg: Scalars['Int'];
	compilation: Scalars['Int'];
	ep: Scalars['Int'];
	live: Scalars['Int'];
	series: Scalars['Int'];
	single: Scalars['Int'];
	soundtrack: Scalars['Int'];
	unknown: Scalars['Int'];
};

export type StatsQL = {
	album: Scalars['Int'];
	albumTypes: StatsAlbumTypesQL;
	artist: Scalars['Int'];
	artistTypes: StatsAlbumTypesQL;
	folder: Scalars['Int'];
	rootID?: Maybe<Scalars['ID']>;
	series: Scalars['Int'];
	track: Scalars['Int'];
};

export type TagChapterQL = {
	end: Scalars['Float'];
	start: Scalars['Float'];
	title: Scalars['String'];
};

export enum TagFormatType {
	ffmpeg = 'ffmpeg',
	id3v1 = 'id3v1',
	id3v20 = 'id3v20',
	id3v21 = 'id3v21',
	id3v22 = 'id3v22',
	id3v23 = 'id3v23',
	id3v24 = 'id3v24',
	none = 'none',
	vorbis = 'vorbis'
}

export type TagQL = {
	album?: Maybe<Scalars['String']>;
	albumArtist?: Maybe<Scalars['String']>;
	albumArtistSort?: Maybe<Scalars['String']>;
	albumSort?: Maybe<Scalars['String']>;
	artist?: Maybe<Scalars['String']>;
	artistSort?: Maybe<Scalars['String']>;
	chapters?: Maybe<Array<TagChapterQL>>;
	createdAt: Scalars['DateTime'];
	disc?: Maybe<Scalars['Int']>;
	discTotal?: Maybe<Scalars['Int']>;
	format: TagFormatType;
	genres?: Maybe<Array<Scalars['String']>>;
	id: Scalars['ID'];
	lyrics?: Maybe<Scalars['String']>;
	mbAlbumArtistID?: Maybe<Scalars['String']>;
	mbAlbumStatus?: Maybe<Scalars['String']>;
	mbAlbumType?: Maybe<Scalars['String']>;
	mbArtistID?: Maybe<Scalars['String']>;
	mbRecordingID?: Maybe<Scalars['String']>;
	mbReleaseCountry?: Maybe<Scalars['String']>;
	mbReleaseGroupID?: Maybe<Scalars['String']>;
	mbReleaseID?: Maybe<Scalars['String']>;
	mbReleaseTrackID?: Maybe<Scalars['String']>;
	mbTrackID?: Maybe<Scalars['String']>;
	mediaBitRate?: Maybe<Scalars['Float']>;
	mediaChannels?: Maybe<Scalars['Int']>;
	mediaDuration?: Maybe<Scalars['Float']>;
	mediaEncoded?: Maybe<Scalars['String']>;
	mediaFormat?: Maybe<AudioFormatType>;
	mediaMode?: Maybe<Scalars['String']>;
	mediaSampleRate?: Maybe<Scalars['Float']>;
	mediaVersion?: Maybe<Scalars['String']>;
	nrTagImages?: Maybe<Scalars['Int']>;
	series?: Maybe<Scalars['String']>;
	seriesNr?: Maybe<Scalars['String']>;
	title?: Maybe<Scalars['String']>;
	titleSort?: Maybe<Scalars['String']>;
	trackNr?: Maybe<Scalars['Int']>;
	trackTotal?: Maybe<Scalars['Int']>;
	updatedAt: Scalars['DateTime'];
	year?: Maybe<Scalars['Int']>;
};

export type TrackFilterArgsQL = {
	album?: InputMaybe<Scalars['String']>;
	albumArtistIDs?: InputMaybe<Array<Scalars['ID']>>;
	albumIDs?: InputMaybe<Array<Scalars['ID']>>;
	artist?: InputMaybe<Scalars['String']>;
	artistIDs?: InputMaybe<Array<Scalars['ID']>>;
	bookmarkIDs?: InputMaybe<Array<Scalars['ID']>>;
	childOfID?: InputMaybe<Scalars['ID']>;
	folderIDs?: InputMaybe<Array<Scalars['ID']>>;
	fromYear?: InputMaybe<Scalars['Int']>;
	genreIDs?: InputMaybe<Array<Scalars['ID']>>;
	genres?: InputMaybe<Array<Scalars['String']>>;
	ids?: InputMaybe<Array<Scalars['ID']>>;
	name?: InputMaybe<Scalars['String']>;
	query?: InputMaybe<Scalars['String']>;
	rootIDs?: InputMaybe<Array<Scalars['ID']>>;
	seriesIDs?: InputMaybe<Array<Scalars['ID']>>;
	since?: InputMaybe<Scalars['Float']>;
	toYear?: InputMaybe<Scalars['Int']>;
};

export type TrackLyricsQL = {
	lyrics?: Maybe<Scalars['String']>;
	source?: Maybe<Scalars['String']>;
};

export type TrackOrderArgsQL = {
	orderBy?: InputMaybe<TrackOrderFields>;
	orderDesc?: InputMaybe<Scalars['Boolean']>;
};

export enum TrackOrderFields {
	album = 'album',
	created = 'created',
	default = 'default',
	discNr = 'discNr',
	filename = 'filename',
	parent = 'parent',
	seriesNr = 'seriesNr',
	title = 'title',
	trackNr = 'trackNr',
	updated = 'updated'
}

export type TrackPageQL = {
	items: Array<TrackQL>;
	skip?: Maybe<Scalars['Int']>;
	take?: Maybe<Scalars['Int']>;
	total: Scalars['Int'];
};

export type TrackQL = {
	album?: Maybe<AlbumQL>;
	albumArtist?: Maybe<ArtistQL>;
	artist?: Maybe<ArtistQL>;
	bookmarks: Array<BookmarkQL>;
	bookmarksCount: Scalars['Int'];
	createdAt: Scalars['DateTime'];
	fileCreated: Scalars['DateTime'];
	fileModified: Scalars['DateTime'];
	fileName: Scalars['String'];
	fileSize: Scalars['Float'];
	folder: FolderQL;
	genres: Array<GenreQL>;
	id: Scalars['ID'];
	lyrics: TrackLyricsQL;
	name: Scalars['String'];
	path: Scalars['String'];
	rawTag: MediaTagRawQL;
	root: RootQL;
	series?: Maybe<SeriesQL>;
	state: StateQL;
	tag?: Maybe<TagQL>;
	updatedAt: Scalars['DateTime'];
	waveform: WaveformQL;
};

export type UserDetailStatsQL = {
	album: Scalars['Int'];
	albumTypes: StatsAlbumTypesQL;
	artist: Scalars['Int'];
	artistTypes: StatsAlbumTypesQL;
	folder: Scalars['Int'];
	series: Scalars['Int'];
	track: Scalars['Int'];
};

export type UserFavoritesQL = {
	albums: AlbumPageQL;
	artists: ArtistPageQL;
	artworks: ArtistPageQL;
	episodes: EpisodePageQL;
	folders: FolderPageQL;
	playlists: PlaylistPageQL;
	podcasts: PodcastPageQL;
	series: SeriesPageQL;
	tracks: TrackPageQL;
};


export type UserFavoritesQLalbumsArgs = {
	filter?: InputMaybe<AlbumFilterArgsQL>;
	order?: InputMaybe<Array<AlbumOrderArgsQL>>;
	page?: InputMaybe<PageArgsQL>;
};


export type UserFavoritesQLartistsArgs = {
	filter?: InputMaybe<ArtistFilterArgsQL>;
	order?: InputMaybe<Array<ArtistOrderArgsQL>>;
	page?: InputMaybe<PageArgsQL>;
};


export type UserFavoritesQLartworksArgs = {
	filter?: InputMaybe<ArtworkFilterArgsQL>;
	order?: InputMaybe<Array<ArtworkOrderArgsQL>>;
	page?: InputMaybe<PageArgsQL>;
};


export type UserFavoritesQLepisodesArgs = {
	filter?: InputMaybe<EpisodeFilterArgsQL>;
	order?: InputMaybe<Array<EpisodeOrderArgsQL>>;
	page?: InputMaybe<PageArgsQL>;
};


export type UserFavoritesQLfoldersArgs = {
	filter?: InputMaybe<FolderFilterArgsQL>;
	order?: InputMaybe<Array<FolderOrderArgsQL>>;
	page?: InputMaybe<PageArgsQL>;
};


export type UserFavoritesQLplaylistsArgs = {
	filter?: InputMaybe<PlaylistFilterArgsQL>;
	order?: InputMaybe<Array<PlaylistOrderArgsQL>>;
	page?: InputMaybe<PageArgsQL>;
};


export type UserFavoritesQLpodcastsArgs = {
	filter?: InputMaybe<PodcastFilterArgsQL>;
	order?: InputMaybe<Array<PodcastOrderArgsQL>>;
	page?: InputMaybe<PageArgsQL>;
};


export type UserFavoritesQLseriesArgs = {
	filter?: InputMaybe<SeriesFilterArgsQL>;
	order?: InputMaybe<Array<SeriesOrderArgsQL>>;
	page?: InputMaybe<PageArgsQL>;
};


export type UserFavoritesQLtracksArgs = {
	filter?: InputMaybe<TrackFilterArgsQL>;
	order?: InputMaybe<Array<TrackOrderArgsQL>>;
	page?: InputMaybe<PageArgsQL>;
};

export type UserFilterArgsQL = {
	email?: InputMaybe<Scalars['String']>;
	ids?: InputMaybe<Array<Scalars['ID']>>;
	name?: InputMaybe<Scalars['String']>;
	query?: InputMaybe<Scalars['String']>;
	roles?: InputMaybe<Array<UserRole>>;
	since?: InputMaybe<Scalars['Float']>;
};

export type UserIndexGroupQL = {
	items: Array<UserQL>;
	name: Scalars['String'];
};

export type UserIndexQL = {
	groups: Array<UserIndexGroupQL>;
};

export type UserOrderArgsQL = {
	orderBy?: InputMaybe<DefaultOrderFields>;
	orderDesc?: InputMaybe<Scalars['Boolean']>;
};

export type UserPageQL = {
	items: Array<UserQL>;
	skip?: Maybe<Scalars['Int']>;
	take?: Maybe<Scalars['Int']>;
	total: Scalars['Int'];
};

export type UserQL = {
	bookmarks: BookmarkPageQL;
	createdAt: Scalars['DateTime'];
	email: Scalars['String'];
	favorites: UserFavoritesQL;
	id: Scalars['ID'];
	maxBitRate?: Maybe<Scalars['Int']>;
	name: Scalars['String'];
	playQueue?: Maybe<PlayQueueQL>;
	playlists: PlaylistPageQL;
	roles: Array<UserRole>;
	sessions: SessionPageQL;
	stats: UserStatsQL;
	updatedAt: Scalars['DateTime'];
};


export type UserQLbookmarksArgs = {
	filter?: InputMaybe<BookmarkFilterArgsQL>;
	order?: InputMaybe<Array<BookmarkOrderArgsQL>>;
	page?: InputMaybe<PageArgsQL>;
};


export type UserQLplaylistsArgs = {
	filter?: InputMaybe<PlaylistFilterArgsQL>;
	order?: InputMaybe<Array<PlaylistOrderArgsQL>>;
	page?: InputMaybe<PageArgsQL>;
};


export type UserQLsessionsArgs = {
	filter?: InputMaybe<SessionFilterArgsQL>;
	order?: InputMaybe<Array<SessionOrderArgsQL>>;
	page?: InputMaybe<PageArgsQL>;
};

/** User Roles */
export enum UserRole {
	admin = 'admin',
	podcast = 'podcast',
	stream = 'stream',
	upload = 'upload'
}

export type UserStatsQL = {
	bookmark: Scalars['Int'];
	favorite: UserDetailStatsQL;
	played: UserDetailStatsQL;
	playlist: Scalars['Int'];
};

export type WaveformQL = {
	json?: Maybe<Scalars['String']>;
	svg?: Maybe<Scalars['String']>;
};


export type WaveformQLsvgArgs = {
	width: Scalars['Int'];
};
