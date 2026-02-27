// @generated
// This file was automatically generated and should not be edited.

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
	[K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
	[SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
	[SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
	T extends { [key: string]: unknown },
	K extends keyof T
> = { [_ in K]?: never };
export type Incremental<T> =
	| T |
	{
		[P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
	};
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
	ID: { input: string; output: string };
	String: { input: string; output: string };
	Boolean: { input: boolean; output: boolean };
	Int: { input: number; output: number };
	Float: { input: number; output: number };
	/** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.This scalar is serialized to a string in ISO 8601 format and parsed from a string in ISO 8601 format. */
	DateTimeISO: { input: string; output: string };
	/** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
	JSON: { input: unknown; output: unknown };
}

/** Admin Change Queue Info */
export interface AdminChangeQueueInfoQL {
	/** Changes Completed Timestamp */
	done: Scalars['Int']['output'];
	/** Error (if any) */
	error: Scalars['String']['output'];
	/** Queue ID */
	id: Scalars['ID']['output'];
	/** Waiting Position */
	position: Scalars['Int']['output'];
}

/** Admin Chat Maximum Age Settings */
export interface AdminSettingsChatMaxAgeQL {
	/** Unit of Maximum Age */
	unit: Scalars['String']['output'];
	/** Value of Maximum Age */
	value: Scalars['Int']['output'];
}

/** Admin Chat Settings */
export interface AdminSettingsChatQL {
	/** Maximum Age of Chat Messages to keep */
	maxAge: AdminSettingsChatMaxAgeQL;
	/** Maximum Number of Chat Messages to keep */
	maxMessages: Scalars['Int']['output'];
}

/** Admin External Services Settings */
export interface AdminSettingsExternalQL {
	/** Enable External Services */
	enabled: Scalars['Boolean']['output'];
}

/** Admin Index Settings */
export interface AdminSettingsIndexQL {
	/** List of ignored Articles */
	ignoreArticles: Array<Scalars['String']['output']>;
}

/** Admin Library Settings */
export interface AdminSettingsLibraryQL {
	/** Start Root Scanning on Server Start */
	scanAtStart: Scalars['Boolean']['output'];
}

/** Admin Settings */
export interface AdminSettingsQL {
	chat: AdminSettingsChatQL;
	externalServices: AdminSettingsExternalQL;
	index: AdminSettingsIndexQL;
	library: AdminSettingsLibraryQL;
}

export interface AlbumFilterParametersQL {
	albumTypes?: InputMaybe<Array<AlbumType>>;
	artist?: InputMaybe<Scalars['String']['input']>;
	artistIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
	folderIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
	fromYear?: InputMaybe<Scalars['Int']['input']>;
	genreIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
	genres?: InputMaybe<Array<Scalars['String']['input']>>;
	ids?: InputMaybe<Array<Scalars['ID']['input']>>;
	mbArtistIDs?: InputMaybe<Array<Scalars['String']['input']>>;
	mbReleaseIDs?: InputMaybe<Array<Scalars['String']['input']>>;
	name?: InputMaybe<Scalars['String']['input']>;
	notMbArtistID?: InputMaybe<Scalars['String']['input']>;
	query?: InputMaybe<Scalars['String']['input']>;
	rootIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
	seriesIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
	since?: InputMaybe<Scalars['Int']['input']>;
	slug?: InputMaybe<Scalars['String']['input']>;
	toYear?: InputMaybe<Scalars['Int']['input']>;
	trackIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
}

export interface AlbumIndexGroupQL {
	items: Array<AlbumQL>;
	name: Scalars['String']['output'];
}

export interface AlbumIndexQL {
	groups: Array<AlbumIndexGroupQL>;
}

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

export interface AlbumOrderParametersQL {
	orderBy?: InputMaybe<AlbumOrderFields>;
	orderDesc?: InputMaybe<Scalars['Boolean']['input']>;
}

export interface AlbumPageQL {
	items: Array<AlbumQL>;
	skip?: Maybe<Scalars['Int']['output']>;
	take?: Maybe<Scalars['Int']['output']>;
	total: Scalars['Int']['output'];
}

export interface AlbumQL {
	albumType: AlbumType;
	artist: ArtistQL;
	createdAt: Scalars['DateTimeISO']['output'];
	duration?: Maybe<Scalars['Int']['output']>;
	folders: Array<FolderQL>;
	foldersCount: Scalars['Int']['output'];
	genres: Array<GenreQL>;
	id: Scalars['ID']['output'];
	mbArtistID?: Maybe<Scalars['String']['output']>;
	mbReleaseID?: Maybe<Scalars['String']['output']>;
	name: Scalars['String']['output'];
	roots: Array<RootQL>;
	rootsCount: Scalars['Int']['output'];
	series?: Maybe<SeriesQL>;
	seriesNr?: Maybe<Scalars['String']['output']>;
	slug: Scalars['String']['output'];
	state: StateQL;
	tracks: Array<TrackQL>;
	tracksCount: Scalars['Int']['output'];
	updatedAt: Scalars['DateTimeISO']['output'];
	year?: Maybe<Scalars['Int']['output']>;
}

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

export interface ArtistFilterParametersQL {
	albumIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
	albumTrackIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
	albumTypes?: InputMaybe<Array<AlbumType>>;
	folderIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
	genreIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
	genres?: InputMaybe<Array<Scalars['String']['input']>>;
	ids?: InputMaybe<Array<Scalars['ID']['input']>>;
	mbArtistIDs?: InputMaybe<Array<Scalars['String']['input']>>;
	name?: InputMaybe<Scalars['String']['input']>;
	notMbArtistID?: InputMaybe<Scalars['String']['input']>;
	query?: InputMaybe<Scalars['String']['input']>;
	rootIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
	seriesIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
	since?: InputMaybe<Scalars['Int']['input']>;
	slug?: InputMaybe<Scalars['String']['input']>;
	trackIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
}

export interface ArtistIndexGroupQL {
	items: Array<ArtistQL>;
	name: Scalars['String']['output'];
}

export interface ArtistIndexQL {
	groups: Array<ArtistIndexGroupQL>;
}

export enum ArtistOrderFields {
	created = 'created',
	default = 'default',
	name = 'name',
	nameSort = 'nameSort',
	updated = 'updated'
}

export interface ArtistOrderParametersQL {
	orderBy?: InputMaybe<ArtistOrderFields>;
	orderDesc?: InputMaybe<Scalars['Boolean']['input']>;
}

export interface ArtistPageQL {
	items: Array<ArtistQL>;
	skip?: Maybe<Scalars['Int']['output']>;
	take?: Maybe<Scalars['Int']['output']>;
	total: Scalars['Int']['output'];
}

export interface ArtistQL {
	albumTracks: Array<TrackQL>;
	albumTypes: Array<AlbumType>;
	albums: Array<AlbumQL>;
	albumsCount: Scalars['Int']['output'];
	albumsTracksCount: Scalars['Int']['output'];
	createdAt: Scalars['DateTimeISO']['output'];
	folders: Array<FolderQL>;
	foldersCount: Scalars['Int']['output'];
	genres: Array<GenreQL>;
	genresCount: Scalars['Int']['output'];
	id: Scalars['ID']['output'];
	mbArtistID?: Maybe<Scalars['String']['output']>;
	name: Scalars['String']['output'];
	nameSort: Scalars['String']['output'];
	roots: Array<RootQL>;
	rootsCount: Scalars['Int']['output'];
	series: Array<SeriesQL>;
	seriesCount: Scalars['Int']['output'];
	slug: Scalars['String']['output'];
	state: StateQL;
	tracks: Array<TrackQL>;
	tracksCount: Scalars['Int']['output'];
	updatedAt: Scalars['DateTimeISO']['output'];
}

export interface ArtworkFilterParametersQL {
	childOfID?: InputMaybe<Scalars['ID']['input']>;
	folderIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
	formats?: InputMaybe<Array<Scalars['String']['input']>>;
	heightFrom?: InputMaybe<Scalars['Int']['input']>;
	heightTo?: InputMaybe<Scalars['Int']['input']>;
	ids?: InputMaybe<Array<Scalars['ID']['input']>>;
	name?: InputMaybe<Scalars['String']['input']>;
	query?: InputMaybe<Scalars['String']['input']>;
	since?: InputMaybe<Scalars['Int']['input']>;
	sizeFrom?: InputMaybe<Scalars['Int']['input']>;
	sizeTo?: InputMaybe<Scalars['Int']['input']>;
	types?: InputMaybe<Array<ArtworkImageType>>;
	widthFrom?: InputMaybe<Scalars['Int']['input']>;
	widthTo?: InputMaybe<Scalars['Int']['input']>;
}

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

export interface ArtworkOrderParametersQL {
	orderBy?: InputMaybe<DefaultOrderFields>;
	orderDesc?: InputMaybe<Scalars['Boolean']['input']>;
}

export interface ArtworkPageQL {
	items: Array<ArtworkQL>;
	skip?: Maybe<Scalars['Int']['output']>;
	take?: Maybe<Scalars['Int']['output']>;
	total: Scalars['Int']['output'];
}

export interface ArtworkQL {
	createdAt: Scalars['DateTimeISO']['output'];
	fileSize: Scalars['Int']['output'];
	/** Get the Navigation Index for Albums */
	folder: FolderQL;
	format?: Maybe<Scalars['String']['output']>;
	height?: Maybe<Scalars['Int']['output']>;
	id: Scalars['ID']['output'];
	name: Scalars['String']['output'];
	path: Scalars['String']['output'];
	statCreated: Scalars['DateTimeISO']['output'];
	statModified: Scalars['DateTimeISO']['output'];
	types: Array<ArtworkImageType>;
	updatedAt: Scalars['DateTimeISO']['output'];
	width?: Maybe<Scalars['Int']['output']>;
}

export enum AudioFormatType {
	flac = 'flac',
	flv = 'flv',
	m4a = 'm4a',
	m4b = 'm4b',
	mp3 = 'mp3',
	mp4 = 'mp4',
	oga = 'oga',
	ogg = 'ogg',
	wav = 'wav',
	webma = 'webma'
}

export interface BookmarkFilterParametersQL {
	comment?: InputMaybe<Scalars['String']['input']>;
	episodeIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
	ids?: InputMaybe<Array<Scalars['ID']['input']>>;
	query?: InputMaybe<Scalars['String']['input']>;
	since?: InputMaybe<Scalars['Int']['input']>;
	trackIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
	userIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
}

export enum BookmarkOrderFields {
	created = 'created',
	default = 'default',
	media = 'media',
	position = 'position',
	updated = 'updated'
}

export interface BookmarkOrderParametersQL {
	orderBy?: InputMaybe<BookmarkOrderFields>;
	orderDesc?: InputMaybe<Scalars['Boolean']['input']>;
}

export interface BookmarkPageQL {
	items: Array<BookmarkQL>;
	skip?: Maybe<Scalars['Int']['output']>;
	take?: Maybe<Scalars['Int']['output']>;
	total: Scalars['Int']['output'];
}

export interface BookmarkQL {
	comment?: Maybe<Scalars['String']['output']>;
	createdAt: Scalars['DateTimeISO']['output'];
	episode?: Maybe<EpisodeQL>;
	id: Scalars['ID']['output'];
	position: Scalars['Int']['output'];
	track?: Maybe<TrackQL>;
	updatedAt: Scalars['DateTimeISO']['output'];
}

export interface ChatQL {
	created: Scalars['DateTimeISO']['output'];
	message: Scalars['String']['output'];
	userID: Scalars['ID']['output'];
	userName: Scalars['String']['output'];
}

export enum DefaultOrderFields {
	created = 'created',
	default = 'default',
	name = 'name',
	updated = 'updated'
}

export interface EpisodeChapterQL {
	start: Scalars['Float']['output'];
	title: Scalars['String']['output'];
}

export interface EpisodeEnclosureQL {
	length?: Maybe<Scalars['Float']['output']>;
	type?: Maybe<Scalars['String']['output']>;
	url: Scalars['String']['output'];
}

export interface EpisodeFilterParametersQL {
	authors?: InputMaybe<Array<Scalars['String']['input']>>;
	guids?: InputMaybe<Array<Scalars['String']['input']>>;
	ids?: InputMaybe<Array<Scalars['ID']['input']>>;
	name?: InputMaybe<Scalars['String']['input']>;
	podcastIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
	query?: InputMaybe<Scalars['String']['input']>;
	since?: InputMaybe<Scalars['Int']['input']>;
	statuses?: InputMaybe<Array<PodcastStatus>>;
}

export enum EpisodeOrderFields {
	created = 'created',
	date = 'date',
	default = 'default',
	name = 'name',
	status = 'status',
	updated = 'updated'
}

export interface EpisodeOrderParametersQL {
	orderBy?: InputMaybe<EpisodeOrderFields>;
	orderDesc?: InputMaybe<Scalars['Boolean']['input']>;
}

export interface EpisodePageQL {
	items: Array<EpisodeQL>;
	skip?: Maybe<Scalars['Int']['output']>;
	take?: Maybe<Scalars['Int']['output']>;
	total: Scalars['Int']['output'];
}

export interface EpisodeQL {
	author?: Maybe<Scalars['String']['output']>;
	bookmarks: Array<BookmarkQL>;
	bookmarksCount: Scalars['Int']['output'];
	chapters?: Maybe<Array<EpisodeChapterQL>>;
	createdAt: Scalars['DateTimeISO']['output'];
	date: Scalars['DateTimeISO']['output'];
	duration?: Maybe<Scalars['Int']['output']>;
	enclosures?: Maybe<Array<EpisodeEnclosureQL>>;
	error?: Maybe<Scalars['String']['output']>;
	fileCreated?: Maybe<Scalars['DateTimeISO']['output']>;
	fileModified?: Maybe<Scalars['DateTimeISO']['output']>;
	fileSize?: Maybe<Scalars['Int']['output']>;
	guid?: Maybe<Scalars['String']['output']>;
	id: Scalars['ID']['output'];
	link?: Maybe<Scalars['String']['output']>;
	name: Scalars['String']['output'];
	path?: Maybe<Scalars['String']['output']>;
	podcast: PodcastQL;
	state: StateQL;
	status: PodcastStatus;
	summary?: Maybe<Scalars['String']['output']>;
	tag?: Maybe<TagQL>;
	updatedAt: Scalars['DateTimeISO']['output'];
	waveform: WaveformQL;
}

export interface ExtendedInfoQL {
	description: Scalars['String']['output'];
	license: Scalars['String']['output'];
	licenseUrl: Scalars['String']['output'];
	source: Scalars['String']['output'];
	url: Scalars['String']['output'];
}

export interface ExtendedInfoResultQL {
	info?: Maybe<ExtendedInfoQL>;
}

export interface FolderFilterParametersQL {
	album?: InputMaybe<Scalars['String']['input']>;
	albumIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
	albumTypes?: InputMaybe<Array<AlbumType>>;
	artist?: InputMaybe<Scalars['String']['input']>;
	artistIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
	artistSort?: InputMaybe<Scalars['String']['input']>;
	artworksIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
	childOfID?: InputMaybe<Scalars['ID']['input']>;
	folderTypes?: InputMaybe<Array<FolderType>>;
	fromYear?: InputMaybe<Scalars['Int']['input']>;
	genreIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
	genres?: InputMaybe<Array<Scalars['String']['input']>>;
	ids?: InputMaybe<Array<Scalars['ID']['input']>>;
	level?: InputMaybe<Scalars['Int']['input']>;
	mbAlbumTypes?: InputMaybe<Array<Scalars['String']['input']>>;
	mbArtistIDs?: InputMaybe<Array<Scalars['String']['input']>>;
	mbReleaseGroupIDs?: InputMaybe<Array<Scalars['String']['input']>>;
	mbReleaseIDs?: InputMaybe<Array<Scalars['String']['input']>>;
	name?: InputMaybe<Scalars['String']['input']>;
	parentIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
	query?: InputMaybe<Scalars['String']['input']>;
	rootIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
	seriesIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
	since?: InputMaybe<Scalars['Int']['input']>;
	title?: InputMaybe<Scalars['String']['input']>;
	toYear?: InputMaybe<Scalars['Int']['input']>;
	trackIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
}

export interface FolderIndexGroupQL {
	items: Array<FolderQL>;
	name: Scalars['String']['output'];
}

export interface FolderIndexQL {
	groups: Array<FolderIndexGroupQL>;
}

export enum FolderOrderFields {
	album = 'album',
	artist = 'artist',
	created = 'created',
	default = 'default',
	level = 'level',
	name = 'name',
	title = 'title',
	updated = 'updated',
	year = 'year'
}

export interface FolderOrderParametersQL {
	orderBy?: InputMaybe<FolderOrderFields>;
	orderDesc?: InputMaybe<Scalars['Boolean']['input']>;
}

export interface FolderPageQL {
	items: Array<FolderQL>;
	skip?: Maybe<Scalars['Int']['output']>;
	take?: Maybe<Scalars['Int']['output']>;
	total: Scalars['Int']['output'];
}

export interface FolderQL {
	album?: Maybe<Scalars['String']['output']>;
	albumTrackCount?: Maybe<Scalars['Int']['output']>;
	albumType?: Maybe<AlbumType>;
	albums?: Maybe<Array<AlbumQL>>;
	albumsCount: Scalars['Int']['output'];
	artist?: Maybe<Scalars['String']['output']>;
	artistSort?: Maybe<Scalars['String']['output']>;
	artists?: Maybe<Array<ArtistQL>>;
	artistsCount: Scalars['Int']['output'];
	artworks?: Maybe<Array<ArtworkQL>>;
	artworksCount: Scalars['Int']['output'];
	children: Array<FolderQL>;
	childrenCount: Scalars['Int']['output'];
	createdAt: Scalars['DateTimeISO']['output'];
	folderType: FolderType;
	genres: Array<GenreQL>;
	genresCount: Scalars['Int']['output'];
	id: Scalars['ID']['output'];
	level: Scalars['Int']['output'];
	mbAlbumType?: Maybe<Scalars['String']['output']>;
	mbArtistID?: Maybe<Scalars['String']['output']>;
	mbReleaseGroupID?: Maybe<Scalars['String']['output']>;
	mbReleaseID?: Maybe<Scalars['String']['output']>;
	name: Scalars['String']['output'];
	parent?: Maybe<FolderQL>;
	path: Scalars['String']['output'];
	root: RootQL;
	rootsCount: Scalars['Int']['output'];
	series?: Maybe<Array<SeriesQL>>;
	seriesCount: Scalars['Int']['output'];
	statCreated: Scalars['DateTimeISO']['output'];
	statModified: Scalars['DateTimeISO']['output'];
	state: StateQL;
	title: Scalars['String']['output'];
	tracks?: Maybe<Array<TrackQL>>;
	tracksCount: Scalars['Int']['output'];
	updatedAt: Scalars['DateTimeISO']['output'];
	year?: Maybe<Scalars['Int']['output']>;
}

export enum FolderType {
	album = 'album',
	artist = 'artist',
	collection = 'collection',
	extras = 'extras',
	multialbum = 'multialbum',
	unknown = 'unknown'
}

export interface GenreFilterParametersQL {
	ids?: InputMaybe<Array<Scalars['ID']['input']>>;
	name?: InputMaybe<Scalars['String']['input']>;
	query?: InputMaybe<Scalars['String']['input']>;
	since?: InputMaybe<Scalars['Int']['input']>;
	trackIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
}

export interface GenreIndexGroupQL {
	items: Array<GenreQL>;
	name: Scalars['String']['output'];
}

export interface GenreIndexQL {
	groups: Array<GenreIndexGroupQL>;
}

export enum GenreOrderFields {
	created = 'created',
	default = 'default',
	name = 'name',
	updated = 'updated'
}

export interface GenreOrderParametersQL {
	orderBy?: InputMaybe<GenreOrderFields>;
	orderDesc?: InputMaybe<Scalars['Boolean']['input']>;
}

export interface GenrePageQL {
	items: Array<GenreQL>;
	skip?: Maybe<Scalars['Int']['output']>;
	take?: Maybe<Scalars['Int']['output']>;
	total: Scalars['Int']['output'];
}

export interface GenreQL {
	albumCount: Scalars['Int']['output'];
	albums: AlbumPageQL;
	artistCount: Scalars['Int']['output'];
	artists: ArtistPageQL;
	createdAt: Scalars['DateTimeISO']['output'];
	folderCount: Scalars['Int']['output'];
	folders: Array<FolderQL>;
	id: Scalars['ID']['output'];
	name: Scalars['String']['output'];
	series: Array<SeriesQL>;
	trackCount: Scalars['Int']['output'];
	tracks: TrackPageQL;
	updatedAt: Scalars['DateTimeISO']['output'];
}

export interface GenreQLalbumsArgs {
	filter?: InputMaybe<AlbumFilterParametersQL>;
	order?: InputMaybe<Array<AlbumOrderParametersQL>>;
	page?: InputMaybe<PageParametersQL>;
}

export interface GenreQLartistsArgs {
	filter?: InputMaybe<ArtistFilterParametersQL>;
	order?: InputMaybe<Array<ArtistOrderParametersQL>>;
	page?: InputMaybe<PageParametersQL>;
}

export interface GenreQLtracksArgs {
	filter?: InputMaybe<TrackFilterParametersQL>;
	order?: InputMaybe<Array<TrackOrderParametersQL>>;
	page?: InputMaybe<PageParametersQL>;
}

/** Type of List Request */
export enum ListType {
	avghighest = 'avghighest',
	faved = 'faved',
	frequent = 'frequent',
	highest = 'highest',
	random = 'random',
	recent = 'recent'
}

export interface MediaTagRawQL {
	frames: Scalars['JSON']['output'];
	version: Scalars['String']['output'];
}

export interface Mutation {
	fav: StateQL;
	rate: StateQL;
	scrobble: NowPlayingQL;
}

export interface MutationfavArgs {
	id: Scalars['ID']['input'];
	remove?: InputMaybe<Scalars['Boolean']['input']>;
}

export interface MutationrateArgs {
	id: Scalars['ID']['input'];
	rating: Scalars['Int']['input'];
}

export interface MutationscrobbleArgs {
	id: Scalars['ID']['input'];
}

export interface NowPlayingQL {
	episode?: Maybe<EpisodeQL>;
	time: Scalars['Int']['output'];
	track?: Maybe<TrackQL>;
	userID: Scalars['ID']['output'];
	userName: Scalars['String']['output'];
}

export interface PageParametersQL {
	/** return items starting from offset position */
	skip?: InputMaybe<Scalars['Int']['input']>;
	/** amount of returned items */
	take?: InputMaybe<Scalars['Int']['input']>;
}

export interface PlayQueueEntryQL {
	createdAt: Scalars['DateTimeISO']['output'];
	episode?: Maybe<EpisodeQL>;
	id: Scalars['ID']['output'];
	playQueue: PlayQueueQL;
	position: Scalars['Int']['output'];
	track?: Maybe<TrackQL>;
	updatedAt: Scalars['DateTimeISO']['output'];
}

export interface PlayQueueQL {
	changedBy: Scalars['String']['output'];
	createdAt: Scalars['DateTimeISO']['output'];
	current?: Maybe<Scalars['Int']['output']>;
	duration?: Maybe<Scalars['Int']['output']>;
	entries: Array<PlayQueueEntryQL>;
	entriesCount: Scalars['Int']['output'];
	id: Scalars['ID']['output'];
	position?: Maybe<Scalars['Int']['output']>;
	updatedAt: Scalars['DateTimeISO']['output'];
}

export interface PlaylistEntryQL {
	createdAt: Scalars['DateTimeISO']['output'];
	episode?: Maybe<EpisodeQL>;
	id: Scalars['ID']['output'];
	playlist: PlaylistQL;
	position: Scalars['Int']['output'];
	track?: Maybe<TrackQL>;
	updatedAt: Scalars['DateTimeISO']['output'];
}

export interface PlaylistFilterParametersQL {
	comment?: InputMaybe<Scalars['String']['input']>;
	durationFrom?: InputMaybe<Scalars['Int']['input']>;
	durationTo?: InputMaybe<Scalars['Int']['input']>;
	ids?: InputMaybe<Array<Scalars['ID']['input']>>;
	isPublic?: InputMaybe<Scalars['Boolean']['input']>;
	name?: InputMaybe<Scalars['String']['input']>;
	query?: InputMaybe<Scalars['String']['input']>;
	since?: InputMaybe<Scalars['Int']['input']>;
	userIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
}

export interface PlaylistIndexGroupQL {
	items: Array<PlaylistQL>;
	name: Scalars['String']['output'];
}

export interface PlaylistIndexQL {
	groups: Array<PlaylistIndexGroupQL>;
}

export interface PlaylistOrderParametersQL {
	orderBy?: InputMaybe<DefaultOrderFields>;
	orderDesc?: InputMaybe<Scalars['Boolean']['input']>;
}

export interface PlaylistPageQL {
	items: Array<PlaylistQL>;
	skip?: Maybe<Scalars['Int']['output']>;
	take?: Maybe<Scalars['Int']['output']>;
	total: Scalars['Int']['output'];
}

export interface PlaylistQL {
	comment?: Maybe<Scalars['String']['output']>;
	createdAt: Scalars['DateTimeISO']['output'];
	duration: Scalars['Int']['output'];
	entries: Array<PlaylistEntryQL>;
	entriesCount: Scalars['Int']['output'];
	id: Scalars['ID']['output'];
	isPublic: Scalars['Boolean']['output'];
	name: Scalars['String']['output'];
	state: StateQL;
	updatedAt: Scalars['DateTimeISO']['output'];
	userID: Scalars['ID']['output'];
	userName: Scalars['String']['output'];
}

export interface PodcastDiscoverPageQL {
	items: Array<PodcastDiscoverQL>;
	skip?: Maybe<Scalars['Int']['output']>;
	take?: Maybe<Scalars['Int']['output']>;
	total: Scalars['Int']['output'];
}

export interface PodcastDiscoverQL {
	author: Scalars['String']['output'];
	description: Scalars['String']['output'];
	logo_url: Scalars['String']['output'];
	mygpo_link: Scalars['String']['output'];
	scaled_logo_url: Scalars['String']['output'];
	subscribers: Scalars['Int']['output'];
	subscribers_last_week: Scalars['Int']['output'];
	title: Scalars['String']['output'];
	url: Scalars['String']['output'];
	website: Scalars['String']['output'];
}

export interface PodcastDiscoverTagPageQL {
	items: Array<PodcastDiscoverTagQL>;
	skip?: Maybe<Scalars['Int']['output']>;
	take?: Maybe<Scalars['Int']['output']>;
	total: Scalars['Int']['output'];
}

export interface PodcastDiscoverTagQL {
	tag: Scalars['String']['output'];
	title: Scalars['String']['output'];
	usage: Scalars['Int']['output'];
}

export interface PodcastFilterParametersQL {
	author?: InputMaybe<Scalars['String']['input']>;
	categories?: InputMaybe<Array<Scalars['String']['input']>>;
	description?: InputMaybe<Scalars['String']['input']>;
	episodeIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
	generator?: InputMaybe<Scalars['String']['input']>;
	ids?: InputMaybe<Array<Scalars['ID']['input']>>;
	lastCheckFrom?: InputMaybe<Scalars['Int']['input']>;
	lastCheckTo?: InputMaybe<Scalars['Int']['input']>;
	name?: InputMaybe<Scalars['String']['input']>;
	query?: InputMaybe<Scalars['String']['input']>;
	since?: InputMaybe<Scalars['Int']['input']>;
	statuses?: InputMaybe<Array<PodcastStatus>>;
	title?: InputMaybe<Scalars['String']['input']>;
	url?: InputMaybe<Scalars['String']['input']>;
}

export interface PodcastIndexGroupQL {
	items: Array<PodcastQL>;
	name: Scalars['String']['output'];
}

export interface PodcastIndexQL {
	groups: Array<PodcastIndexGroupQL>;
}

export enum PodcastOrderFields {
	created = 'created',
	default = 'default',
	lastCheck = 'lastCheck',
	name = 'name',
	updated = 'updated'
}

export interface PodcastOrderParametersQL {
	orderBy?: InputMaybe<PodcastOrderFields>;
	orderDesc?: InputMaybe<Scalars['Boolean']['input']>;
}

export interface PodcastPageQL {
	items: Array<PodcastQL>;
	skip?: Maybe<Scalars['Int']['output']>;
	take?: Maybe<Scalars['Int']['output']>;
	total: Scalars['Int']['output'];
}

export interface PodcastQL {
	author?: Maybe<Scalars['String']['output']>;
	categories: Array<Scalars['String']['output']>;
	createdAt: Scalars['DateTimeISO']['output'];
	description?: Maybe<Scalars['String']['output']>;
	episodes: Array<EpisodeQL>;
	episodesCount: Scalars['Int']['output'];
	errorMessage?: Maybe<Scalars['String']['output']>;
	generator?: Maybe<Scalars['String']['output']>;
	id: Scalars['ID']['output'];
	image?: Maybe<Scalars['String']['output']>;
	language?: Maybe<Scalars['String']['output']>;
	lastCheck: Scalars['DateTimeISO']['output'];
	link?: Maybe<Scalars['String']['output']>;
	name: Scalars['String']['output'];
	state: StateQL;
	status: PodcastStatus;
	title?: Maybe<Scalars['String']['output']>;
	updatedAt: Scalars['DateTimeISO']['output'];
	url: Scalars['String']['output'];
}

export enum PodcastStatus {
	completed = 'completed',
	deleted = 'deleted',
	downloading = 'downloading',
	error = 'error',
	new = 'new'
}

export interface Query {
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
	version: Scalars['String']['output'];
	waveform: WaveformQL;
}

export interface QueryadminQueueArgs {
	id: Scalars['ID']['input'];
}

export interface QueryalbumArgs {
	id: Scalars['ID']['input'];
}

export interface QueryalbumIndexArgs {
	filter?: InputMaybe<AlbumFilterParametersQL>;
}

export interface QueryalbumInfoArgs {
	id: Scalars['ID']['input'];
}

export interface QueryalbumsArgs {
	filter?: InputMaybe<AlbumFilterParametersQL>;
	list?: InputMaybe<ListType>;
	order?: InputMaybe<Array<AlbumOrderParametersQL>>;
	page?: InputMaybe<PageParametersQL>;
	seed?: InputMaybe<Scalars['String']['input']>;
}

export interface QueryartistArgs {
	id: Scalars['ID']['input'];
}

export interface QueryartistIndexArgs {
	filter?: InputMaybe<ArtistFilterParametersQL>;
}

export interface QueryartistInfoArgs {
	id: Scalars['ID']['input'];
}

export interface QueryartistsArgs {
	filter?: InputMaybe<ArtistFilterParametersQL>;
	list?: InputMaybe<ListType>;
	order?: InputMaybe<Array<ArtistOrderParametersQL>>;
	page?: InputMaybe<PageParametersQL>;
	seed?: InputMaybe<Scalars['String']['input']>;
}

export interface QueryartworkArgs {
	id: Scalars['ID']['input'];
}

export interface QueryartworksArgs {
	filter?: InputMaybe<ArtworkFilterParametersQL>;
	list?: InputMaybe<ListType>;
	order?: InputMaybe<Array<ArtworkOrderParametersQL>>;
	page?: InputMaybe<PageParametersQL>;
	seed?: InputMaybe<Scalars['String']['input']>;
}

export interface QuerybookmarkArgs {
	id: Scalars['ID']['input'];
}

export interface QuerybookmarksArgs {
	filter?: InputMaybe<BookmarkFilterParametersQL>;
	order?: InputMaybe<Array<BookmarkOrderParametersQL>>;
	page?: InputMaybe<PageParametersQL>;
}

export interface QuerychatsArgs {
	since?: InputMaybe<Scalars['Int']['input']>;
}

export interface QueryepisodeArgs {
	id: Scalars['ID']['input'];
}

export interface QueryepisodesArgs {
	filter?: InputMaybe<EpisodeFilterParametersQL>;
	list?: InputMaybe<ListType>;
	order?: InputMaybe<Array<EpisodeOrderParametersQL>>;
	page?: InputMaybe<PageParametersQL>;
	seed?: InputMaybe<Scalars['String']['input']>;
}

export interface QueryfolderArgs {
	id: Scalars['ID']['input'];
}

export interface QueryfolderIndexArgs {
	filter?: InputMaybe<FolderFilterParametersQL>;
}

export interface QueryfolderInfoArgs {
	id: Scalars['ID']['input'];
}

export interface QueryfoldersArgs {
	filter?: InputMaybe<FolderFilterParametersQL>;
	list?: InputMaybe<ListType>;
	order?: InputMaybe<Array<FolderOrderParametersQL>>;
	page?: InputMaybe<PageParametersQL>;
	seed?: InputMaybe<Scalars['String']['input']>;
}

export interface QuerygenreArgs {
	id: Scalars['ID']['input'];
}

export interface QuerygenreIndexArgs {
	filter?: InputMaybe<GenreFilterParametersQL>;
}

export interface QuerygenresArgs {
	filter?: InputMaybe<GenreFilterParametersQL>;
	list?: InputMaybe<ListType>;
	order?: InputMaybe<Array<GenreOrderParametersQL>>;
	page?: InputMaybe<PageParametersQL>;
	seed?: InputMaybe<Scalars['String']['input']>;
}

export interface QueryplaylistArgs {
	id: Scalars['ID']['input'];
}

export interface QueryplaylistIndexArgs {
	filter?: InputMaybe<PlaylistFilterParametersQL>;
}

export interface QueryplaylistsArgs {
	filter?: InputMaybe<PlaylistFilterParametersQL>;
	list?: InputMaybe<ListType>;
	order?: InputMaybe<Array<PlaylistOrderParametersQL>>;
	page?: InputMaybe<PageParametersQL>;
	seed?: InputMaybe<Scalars['String']['input']>;
}

export interface QuerypodcastArgs {
	id: Scalars['ID']['input'];
}

export interface QuerypodcastIndexArgs {
	filter?: InputMaybe<PodcastFilterParametersQL>;
}

export interface QuerypodcastsArgs {
	filter?: InputMaybe<PodcastFilterParametersQL>;
	list?: InputMaybe<ListType>;
	order?: InputMaybe<Array<PodcastOrderParametersQL>>;
	page?: InputMaybe<PageParametersQL>;
	seed?: InputMaybe<Scalars['String']['input']>;
}

export interface QuerypodcastsDiscoverArgs {
	query: Scalars['String']['input'];
}

export interface QuerypodcastsDiscoverByTagArgs {
	skip?: InputMaybe<Scalars['Int']['input']>;
	tag: Scalars['String']['input'];
	take?: InputMaybe<Scalars['Int']['input']>;
}

export interface QuerypodcastsDiscoverTagsArgs {
	skip?: InputMaybe<Scalars['Int']['input']>;
	take?: InputMaybe<Scalars['Int']['input']>;
}

export interface QuerypodcastsDiscoverTopArgs {
	skip?: InputMaybe<Scalars['Int']['input']>;
	take?: InputMaybe<Scalars['Int']['input']>;
}

export interface QueryradioArgs {
	id: Scalars['ID']['input'];
}

export interface QueryradioIndexArgs {
	filter?: InputMaybe<RadioFilterParametersQL>;
}

export interface QueryradiosArgs {
	filter?: InputMaybe<RadioFilterParametersQL>;
	list?: InputMaybe<ListType>;
	order?: InputMaybe<Array<RadioOrderParametersQL>>;
	page?: InputMaybe<PageParametersQL>;
	seed?: InputMaybe<Scalars['String']['input']>;
}

export interface QueryrootArgs {
	id: Scalars['ID']['input'];
}

export interface QueryrootsArgs {
	filter?: InputMaybe<RootFilterParametersQL>;
	list?: InputMaybe<ListType>;
	order?: InputMaybe<Array<RootOrderParametersQL>>;
	page?: InputMaybe<PageParametersQL>;
	seed?: InputMaybe<Scalars['String']['input']>;
}

export interface QueryseriesArgs {
	id: Scalars['ID']['input'];
}

export interface QueryseriesIndexArgs {
	filter?: InputMaybe<SeriesFilterParametersQL>;
}

export interface QueryseriesInfoArgs {
	id: Scalars['ID']['input'];
}

export interface QueryseriesesArgs {
	filter?: InputMaybe<SeriesFilterParametersQL>;
	list?: InputMaybe<ListType>;
	order?: InputMaybe<Array<SeriesOrderParametersQL>>;
	page?: InputMaybe<PageParametersQL>;
	seed?: InputMaybe<Scalars['String']['input']>;
}

export interface QuerysessionsArgs {
	filter?: InputMaybe<SessionFilterParametersQL>;
	order?: InputMaybe<Array<SessionOrderParametersQL>>;
	page?: InputMaybe<PageParametersQL>;
}

export interface QuerystateArgs {
	id: Scalars['ID']['input'];
}

export interface QuerystatsArgs {
	rootID?: InputMaybe<Scalars['ID']['input']>;
}

export interface QuerytrackArgs {
	id: Scalars['ID']['input'];
}

export interface QuerytracksArgs {
	filter?: InputMaybe<TrackFilterParametersQL>;
	list?: InputMaybe<ListType>;
	order?: InputMaybe<Array<TrackOrderParametersQL>>;
	page?: InputMaybe<PageParametersQL>;
	seed?: InputMaybe<Scalars['String']['input']>;
}

export interface QueryuserArgs {
	id: Scalars['ID']['input'];
}

export interface QueryuserIndexArgs {
	filter?: InputMaybe<UserFilterParametersQL>;
}

export interface QueryusersArgs {
	filter?: InputMaybe<UserFilterParametersQL>;
	order?: InputMaybe<Array<UserOrderParametersQL>>;
	page?: InputMaybe<PageParametersQL>;
}

export interface QuerywaveformArgs {
	id: Scalars['ID']['input'];
}

export interface RadioFilterParametersQL {
	disabled?: InputMaybe<Scalars['Boolean']['input']>;
	homepage?: InputMaybe<Scalars['String']['input']>;
	ids?: InputMaybe<Array<Scalars['ID']['input']>>;
	name?: InputMaybe<Scalars['String']['input']>;
	query?: InputMaybe<Scalars['String']['input']>;
	since?: InputMaybe<Scalars['Int']['input']>;
	url?: InputMaybe<Scalars['String']['input']>;
}

export interface RadioIndexGroupQL {
	items: Array<RadioQL>;
	name: Scalars['String']['output'];
}

export interface RadioIndexQL {
	groups: Array<RadioIndexGroupQL>;
}

export interface RadioOrderParametersQL {
	orderBy?: InputMaybe<DefaultOrderFields>;
	orderDesc?: InputMaybe<Scalars['Boolean']['input']>;
}

export interface RadioPageQL {
	items: Array<RadioQL>;
	skip?: Maybe<Scalars['Int']['output']>;
	take?: Maybe<Scalars['Int']['output']>;
	total: Scalars['Int']['output'];
}

export interface RadioQL {
	createdAt: Scalars['DateTimeISO']['output'];
	disabled?: Maybe<Scalars['Boolean']['output']>;
	homepage?: Maybe<Scalars['String']['output']>;
	id: Scalars['ID']['output'];
	name: Scalars['String']['output'];
	state: StateQL;
	updatedAt: Scalars['DateTimeISO']['output'];
	url: Scalars['String']['output'];
}

export interface RootFilterParametersQL {
	albumIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
	artistIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
	folderIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
	ids?: InputMaybe<Array<Scalars['ID']['input']>>;
	name?: InputMaybe<Scalars['String']['input']>;
	query?: InputMaybe<Scalars['String']['input']>;
	seriesIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
	since?: InputMaybe<Scalars['Int']['input']>;
	strategies: Array<RootScanStrategy>;
	trackIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
}

export interface RootOrderParametersQL {
	orderBy?: InputMaybe<DefaultOrderFields>;
	orderDesc?: InputMaybe<Scalars['Boolean']['input']>;
}

export interface RootPageQL {
	items: Array<RootQL>;
	skip?: Maybe<Scalars['Int']['output']>;
	take?: Maybe<Scalars['Int']['output']>;
	total: Scalars['Int']['output'];
}

export interface RootQL {
	albums: Array<AlbumQL>;
	artists: Array<ArtistQL>;
	createdAt: Scalars['DateTimeISO']['output'];
	folders: Array<FolderQL>;
	id: Scalars['ID']['output'];
	name: Scalars['String']['output'];
	path: Scalars['String']['output'];
	series: Array<SeriesQL>;
	status: RootStatusQL;
	strategy: RootScanStrategy;
	tracks: Array<TrackQL>;
	updatedAt: Scalars['DateTimeISO']['output'];
}

export enum RootScanStrategy {
	artistalbum = 'artistalbum',
	audiobook = 'audiobook',
	auto = 'auto',
	compilation = 'compilation'
}

export interface RootStatusQL {
	error?: Maybe<Scalars['String']['output']>;
	lastScan?: Maybe<Scalars['DateTimeISO']['output']>;
	scanning?: Maybe<Scalars['Boolean']['output']>;
}

export interface SeriesFilterParametersQL {
	albumIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
	albumTypes?: InputMaybe<Array<AlbumType>>;
	artistIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
	folderIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
	genreIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
	ids?: InputMaybe<Array<Scalars['ID']['input']>>;
	name?: InputMaybe<Scalars['String']['input']>;
	query?: InputMaybe<Scalars['String']['input']>;
	rootIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
	since?: InputMaybe<Scalars['Int']['input']>;
	trackIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
}

export interface SeriesIndexGroupQL {
	items: Array<SeriesQL>;
	name: Scalars['String']['output'];
}

export interface SeriesIndexQL {
	groups: Array<SeriesIndexGroupQL>;
}

export interface SeriesOrderParametersQL {
	orderBy?: InputMaybe<DefaultOrderFields>;
	orderDesc?: InputMaybe<Scalars['Boolean']['input']>;
}

export interface SeriesPageQL {
	items: Array<SeriesQL>;
	skip?: Maybe<Scalars['Int']['output']>;
	take?: Maybe<Scalars['Int']['output']>;
	total: Scalars['Int']['output'];
}

export interface SeriesQL {
	albumTypes: Array<AlbumType>;
	albums: Array<AlbumQL>;
	albumsCount: Scalars['Int']['output'];
	artist?: Maybe<ArtistQL>;
	createdAt: Scalars['DateTimeISO']['output'];
	folders: Array<FolderQL>;
	foldersCount: Scalars['Int']['output'];
	genres: Array<GenreQL>;
	genresCount: Scalars['Int']['output'];
	id: Scalars['ID']['output'];
	name: Scalars['String']['output'];
	roots: Array<RootQL>;
	rootsCount: Scalars['Int']['output'];
	state: StateQL;
	tracks: Array<TrackQL>;
	tracksCount: Scalars['Int']['output'];
	updatedAt: Scalars['DateTimeISO']['output'];
}

export interface SessionFilterParametersQL {
	agent?: InputMaybe<Scalars['String']['input']>;
	client?: InputMaybe<Scalars['String']['input']>;
	expiresFrom?: InputMaybe<Scalars['Int']['input']>;
	expiresTo?: InputMaybe<Scalars['Int']['input']>;
	ids?: InputMaybe<Array<Scalars['ID']['input']>>;
	mode?: InputMaybe<SessionMode>;
	since?: InputMaybe<Scalars['Int']['input']>;
	userIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
}

export enum SessionMode {
	browser = 'browser',
	jwt = 'jwt',
	subsonic = 'subsonic'
}

export enum SessionOrderFields {
	default = 'default',
	expires = 'expires'
}

export interface SessionOrderParametersQL {
	orderBy?: InputMaybe<SessionOrderFields>;
	orderDesc?: InputMaybe<Scalars['Boolean']['input']>;
}

export interface SessionPageQL {
	items: Array<SessionQL>;
	skip?: Maybe<Scalars['Int']['output']>;
	take?: Maybe<Scalars['Int']['output']>;
	total: Scalars['Int']['output'];
}

export interface SessionQL {
	agent: Scalars['String']['output'];
	client: Scalars['String']['output'];
	createdAt: Scalars['DateTimeISO']['output'];
	expires: Scalars['DateTimeISO']['output'];
	id: Scalars['ID']['output'];
	mode: SessionMode;
	updatedAt: Scalars['DateTimeISO']['output'];
}

export interface StateQL {
	createdAt: Scalars['DateTimeISO']['output'];
	faved?: Maybe<Scalars['DateTimeISO']['output']>;
	id: Scalars['ID']['output'];
	lastPlayed?: Maybe<Scalars['DateTimeISO']['output']>;
	played?: Maybe<Scalars['Int']['output']>;
	rated?: Maybe<Scalars['Int']['output']>;
	updatedAt: Scalars['DateTimeISO']['output'];
}

export interface StatsAlbumTypesQL {
	album: Scalars['Int']['output'];
	artistCompilation: Scalars['Int']['output'];
	audiobook: Scalars['Int']['output'];
	bootleg: Scalars['Int']['output'];
	compilation: Scalars['Int']['output'];
	ep: Scalars['Int']['output'];
	live: Scalars['Int']['output'];
	series: Scalars['Int']['output'];
	single: Scalars['Int']['output'];
	soundtrack: Scalars['Int']['output'];
	unknown: Scalars['Int']['output'];
}

export interface StatsQL {
	album: Scalars['Int']['output'];
	albumTypes: StatsAlbumTypesQL;
	artist: Scalars['Int']['output'];
	artistTypes: StatsAlbumTypesQL;
	folder: Scalars['Int']['output'];
	rootID?: Maybe<Scalars['ID']['output']>;
	series: Scalars['Int']['output'];
	track: Scalars['Int']['output'];
}

export interface TagChapterQL {
	end: Scalars['Float']['output'];
	start: Scalars['Float']['output'];
	title: Scalars['String']['output'];
}

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

export interface TagQL {
	album?: Maybe<Scalars['String']['output']>;
	albumArtist?: Maybe<Scalars['String']['output']>;
	albumArtistSort?: Maybe<Scalars['String']['output']>;
	albumSort?: Maybe<Scalars['String']['output']>;
	artist?: Maybe<Scalars['String']['output']>;
	artistSort?: Maybe<Scalars['String']['output']>;
	chapters?: Maybe<Array<TagChapterQL>>;
	createdAt: Scalars['DateTimeISO']['output'];
	disc?: Maybe<Scalars['Int']['output']>;
	discTotal?: Maybe<Scalars['Int']['output']>;
	format: TagFormatType;
	genres?: Maybe<Array<Scalars['String']['output']>>;
	id: Scalars['ID']['output'];
	lyrics?: Maybe<Scalars['String']['output']>;
	mbAlbumArtistID?: Maybe<Scalars['String']['output']>;
	mbAlbumStatus?: Maybe<Scalars['String']['output']>;
	mbAlbumType?: Maybe<Scalars['String']['output']>;
	mbArtistID?: Maybe<Scalars['String']['output']>;
	mbRecordingID?: Maybe<Scalars['String']['output']>;
	mbReleaseCountry?: Maybe<Scalars['String']['output']>;
	mbReleaseGroupID?: Maybe<Scalars['String']['output']>;
	mbReleaseID?: Maybe<Scalars['String']['output']>;
	mbReleaseTrackID?: Maybe<Scalars['String']['output']>;
	mbTrackID?: Maybe<Scalars['String']['output']>;
	mediaBitDepth?: Maybe<Scalars['Int']['output']>;
	mediaBitRate?: Maybe<Scalars['Int']['output']>;
	mediaChannels?: Maybe<Scalars['Int']['output']>;
	mediaDuration?: Maybe<Scalars['Int']['output']>;
	mediaEncoded?: Maybe<Scalars['String']['output']>;
	mediaFormat?: Maybe<AudioFormatType>;
	mediaMode?: Maybe<Scalars['String']['output']>;
	mediaSampleRate?: Maybe<Scalars['Int']['output']>;
	mediaVersion?: Maybe<Scalars['String']['output']>;
	nrTagImages?: Maybe<Scalars['Int']['output']>;
	series?: Maybe<Scalars['String']['output']>;
	seriesNr?: Maybe<Scalars['String']['output']>;
	syncedlyrics?: Maybe<Scalars['String']['output']>;
	title?: Maybe<Scalars['String']['output']>;
	titleSort?: Maybe<Scalars['String']['output']>;
	trackNr?: Maybe<Scalars['Int']['output']>;
	trackTotal?: Maybe<Scalars['Int']['output']>;
	updatedAt: Scalars['DateTimeISO']['output'];
	year?: Maybe<Scalars['Int']['output']>;
}

export interface TrackFilterParametersQL {
	album?: InputMaybe<Scalars['String']['input']>;
	albumArtistIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
	albumIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
	artist?: InputMaybe<Scalars['String']['input']>;
	artistIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
	bookmarkIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
	childOfID?: InputMaybe<Scalars['ID']['input']>;
	folderIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
	fromYear?: InputMaybe<Scalars['Int']['input']>;
	genreIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
	genres?: InputMaybe<Array<Scalars['String']['input']>>;
	ids?: InputMaybe<Array<Scalars['ID']['input']>>;
	name?: InputMaybe<Scalars['String']['input']>;
	query?: InputMaybe<Scalars['String']['input']>;
	rootIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
	seriesIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
	since?: InputMaybe<Scalars['Int']['input']>;
	toYear?: InputMaybe<Scalars['Int']['input']>;
}

export interface TrackLyricsQL {
	lyrics?: Maybe<Scalars['String']['output']>;
	source?: Maybe<Scalars['String']['output']>;
}

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

export interface TrackOrderParametersQL {
	orderBy?: InputMaybe<TrackOrderFields>;
	orderDesc?: InputMaybe<Scalars['Boolean']['input']>;
}

export interface TrackPageQL {
	items: Array<TrackQL>;
	skip?: Maybe<Scalars['Int']['output']>;
	take?: Maybe<Scalars['Int']['output']>;
	total: Scalars['Int']['output'];
}

export interface TrackQL {
	album?: Maybe<AlbumQL>;
	albumArtist?: Maybe<ArtistQL>;
	artist?: Maybe<ArtistQL>;
	bookmarks: Array<BookmarkQL>;
	bookmarksCount: Scalars['Int']['output'];
	createdAt: Scalars['DateTimeISO']['output'];
	fileCreated: Scalars['DateTimeISO']['output'];
	fileModified: Scalars['DateTimeISO']['output'];
	fileName: Scalars['String']['output'];
	fileSize: Scalars['Int']['output'];
	folder: FolderQL;
	genres: Array<GenreQL>;
	id: Scalars['ID']['output'];
	lyrics: TrackLyricsQL;
	name: Scalars['String']['output'];
	path: Scalars['String']['output'];
	rawTag: MediaTagRawQL;
	root: RootQL;
	series?: Maybe<SeriesQL>;
	state: StateQL;
	tag?: Maybe<TagQL>;
	updatedAt: Scalars['DateTimeISO']['output'];
	waveform: WaveformQL;
}

export interface UserDetailStatsQL {
	album: Scalars['Int']['output'];
	albumTypes: StatsAlbumTypesQL;
	artist: Scalars['Int']['output'];
	artistTypes: StatsAlbumTypesQL;
	folder: Scalars['Int']['output'];
	series: Scalars['Int']['output'];
	track: Scalars['Int']['output'];
}

export interface UserFavoritesQL {
	albums: AlbumPageQL;
	artists: ArtistPageQL;
	artworks: ArtistPageQL;
	episodes: EpisodePageQL;
	folders: FolderPageQL;
	playlists: PlaylistPageQL;
	podcasts: PodcastPageQL;
	series: SeriesPageQL;
	tracks: TrackPageQL;
}

export interface UserFavoritesQLalbumsArgs {
	filter?: InputMaybe<AlbumFilterParametersQL>;
	order?: InputMaybe<Array<AlbumOrderParametersQL>>;
	page?: InputMaybe<PageParametersQL>;
}

export interface UserFavoritesQLartistsArgs {
	filter?: InputMaybe<ArtistFilterParametersQL>;
	order?: InputMaybe<Array<ArtistOrderParametersQL>>;
	page?: InputMaybe<PageParametersQL>;
}

export interface UserFavoritesQLartworksArgs {
	filter?: InputMaybe<ArtworkFilterParametersQL>;
	order?: InputMaybe<Array<ArtworkOrderParametersQL>>;
	page?: InputMaybe<PageParametersQL>;
}

export interface UserFavoritesQLepisodesArgs {
	filter?: InputMaybe<EpisodeFilterParametersQL>;
	order?: InputMaybe<Array<EpisodeOrderParametersQL>>;
	page?: InputMaybe<PageParametersQL>;
}

export interface UserFavoritesQLfoldersArgs {
	filter?: InputMaybe<FolderFilterParametersQL>;
	order?: InputMaybe<Array<FolderOrderParametersQL>>;
	page?: InputMaybe<PageParametersQL>;
}

export interface UserFavoritesQLplaylistsArgs {
	filter?: InputMaybe<PlaylistFilterParametersQL>;
	order?: InputMaybe<Array<PlaylistOrderParametersQL>>;
	page?: InputMaybe<PageParametersQL>;
}

export interface UserFavoritesQLpodcastsArgs {
	filter?: InputMaybe<PodcastFilterParametersQL>;
	order?: InputMaybe<Array<PodcastOrderParametersQL>>;
	page?: InputMaybe<PageParametersQL>;
}

export interface UserFavoritesQLseriesArgs {
	filter?: InputMaybe<SeriesFilterParametersQL>;
	order?: InputMaybe<Array<SeriesOrderParametersQL>>;
	page?: InputMaybe<PageParametersQL>;
}

export interface UserFavoritesQLtracksArgs {
	filter?: InputMaybe<TrackFilterParametersQL>;
	order?: InputMaybe<Array<TrackOrderParametersQL>>;
	page?: InputMaybe<PageParametersQL>;
}

export interface UserFilterParametersQL {
	email?: InputMaybe<Scalars['String']['input']>;
	ids?: InputMaybe<Array<Scalars['ID']['input']>>;
	name?: InputMaybe<Scalars['String']['input']>;
	query?: InputMaybe<Scalars['String']['input']>;
	roles?: InputMaybe<Array<UserRole>>;
	since?: InputMaybe<Scalars['Int']['input']>;
}

export interface UserIndexGroupQL {
	items: Array<UserQL>;
	name: Scalars['String']['output'];
}

export interface UserIndexQL {
	groups: Array<UserIndexGroupQL>;
}

export interface UserOrderParametersQL {
	orderBy?: InputMaybe<DefaultOrderFields>;
	orderDesc?: InputMaybe<Scalars['Boolean']['input']>;
}

export interface UserPageQL {
	items: Array<UserQL>;
	skip?: Maybe<Scalars['Int']['output']>;
	take?: Maybe<Scalars['Int']['output']>;
	total: Scalars['Int']['output'];
}

export interface UserQL {
	bookmarks: BookmarkPageQL;
	createdAt: Scalars['DateTimeISO']['output'];
	email: Scalars['String']['output'];
	favorites: UserFavoritesQL;
	id: Scalars['ID']['output'];
	maxBitRate?: Maybe<Scalars['Int']['output']>;
	name: Scalars['String']['output'];
	playQueue?: Maybe<PlayQueueQL>;
	playlists: PlaylistPageQL;
	roles: Array<UserRole>;
	sessions: SessionPageQL;
	stats: UserStatsQL;
	updatedAt: Scalars['DateTimeISO']['output'];
}

export interface UserQLbookmarksArgs {
	filter?: InputMaybe<BookmarkFilterParametersQL>;
	order?: InputMaybe<Array<BookmarkOrderParametersQL>>;
	page?: InputMaybe<PageParametersQL>;
}

export interface UserQLplaylistsArgs {
	filter?: InputMaybe<PlaylistFilterParametersQL>;
	order?: InputMaybe<Array<PlaylistOrderParametersQL>>;
	page?: InputMaybe<PageParametersQL>;
}

export interface UserQLsessionsArgs {
	filter?: InputMaybe<SessionFilterParametersQL>;
	order?: InputMaybe<Array<SessionOrderParametersQL>>;
	page?: InputMaybe<PageParametersQL>;
}

/** User Roles */
export enum UserRole {
	admin = 'admin',
	podcast = 'podcast',
	stream = 'stream',
	upload = 'upload'
}

export interface UserStatsQL {
	bookmark: Scalars['Int']['output'];
	favorite: UserDetailStatsQL;
	played: UserDetailStatsQL;
	playlist: Scalars['Int']['output'];
}

export interface WaveformQL {
	json?: Maybe<Scalars['String']['output']>;
	svg?: Maybe<Scalars['String']['output']>;
}

export interface WaveformQLsvgArgs {
	width: Scalars['Int']['input'];
}
