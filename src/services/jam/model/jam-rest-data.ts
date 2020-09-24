// @generated
// This file was automatically generated and should not be edited.

import * as JamEnums from './jam-enums';

export declare namespace Jam {

	/*
	 * Admin Change Queue Info
	 */
	export interface AdminChangeQueueInfo {
		/** Queue ID */
		id: string;
		/**
		 * Waiting Position
		 * @TJS-type integer
		 */
		position?: number;
		/** Error (if any) */
		error?: string;
		/**
		 * Changes Completed Timestamp
		 * @TJS-type integer
		 */
		done?: number;
	}

	/*
	 * Admin Settings
	 */
	export interface AdminSettings {
		/** Admin Chat Settings */
		chat: AdminSettingsChat;
		/** Admin Index Settings */
		index: AdminSettingsIndex;
		/** Admin Library Settings */
		library: AdminSettingsLibrary;
		/** Admin External Services Settings */
		externalServices: AdminSettingsExternal;
	}

	/*
	 * Admin Chat Settings
	 */
	export interface AdminSettingsChat {
		/**
		 * Maximum Number of Chat Messages to keep
		 * @TJS-type integer
		 * @minimum 0
		 */
		maxMessages: number;
		/** Maximum Age of Chat Messages to keep */
		maxAge: AdminSettingsChatMaxAge;
	}

	/*
	 * Admin Chat Maximum Age Settings
	 */
	export interface AdminSettingsChatMaxAge {
		/**
		 * Value of Maximum Age
		 * @TJS-type integer
		 * @minimum 0
		 */
		value: number;
		/** Unit of Maximum Age */
		unit: string;
	}

	/*
	 * Admin External Services Settings
	 */
	export interface AdminSettingsExternal {
		/**
		 * Enable External Services
		 * @TJS-type boolean
		 */
		enabled: boolean;
	}

	/*
	 * Admin Index Settings
	 */
	export interface AdminSettingsIndex {
		/** List of ignored Articles */
		ignoreArticles: Array<string>;
	}

	/*
	 * Admin Library Settings
	 */
	export interface AdminSettingsLibrary {
		/**
		 * Start Root Scanning on Server Start
		 * @TJS-type boolean
		 */
		scanAtStart: boolean;
	}

	/*
	 * Album with tracks
	 */
	export interface Album extends AlbumBase {
		/** List of Tracks */
		tracks?: Array<TrackBase>;
		/** Album Artist */
		artist?: ArtistBase;
	}

	/*
	 * Album
	 */
	export interface AlbumBase extends Base {
		/** Album Type */
		albumType: JamEnums.AlbumType;
		/**
		 * Album Play Duration
		 * @TJS-type integer
		 */
		duration: number;
		/** Album Artist Id */
		artistID: string;
		/** Album Artist */
		artistName: string;
		/**
		 * Number of Tracks
		 * @TJS-type integer
		 * @minimum 0
		 */
		trackCount?: number;
		/** List of Track Ids */
		trackIDs?: Array<string>;
		/** Genres */
		genres?: Array<GenreBase>;
		/**
		 * Album Release Year
		 * @TJS-type integer
		 */
		year?: number;
		/** MusicBrainz Artist Id */
		mbArtistID?: string;
		/** MusicBrainz Release Id */
		mbReleaseID?: string;
		/** Series Name */
		series?: string;
		/** Series Id */
		seriesID?: string;
		/** Series Nr */
		seriesNr?: string;
		/** Metadata for the Album (via External Service) */
		info?: ExtendedInfo;
	}

	/*
	 * Album Index
	 */
	export interface AlbumIndex {
		/**
		 * Last Change Timestamp
		 * @TJS-type integer
		 */
		lastModified: number;
		/** Album Index Groups */
		groups: Array<AlbumIndexGroup>;
	}

	/*
	 * Album Index Entry
	 */
	export interface AlbumIndexEntry {
		/** ID */
		id: string;
		/** Name */
		name: string;
		/** Artist */
		artist: string;
		/** Artist Id */
		artistID: string;
		/**
		 * Track Count
		 * @TJS-type integer
		 * @minimum 0
		 */
		trackCount: number;
	}

	/*
	 * Album Index Group
	 */
	export interface AlbumIndexGroup {
		/** Index Group Name */
		name: string;
		items: Array<AlbumIndexEntry>;
	}

	/*
	 * Album Page
	 */
	export interface AlbumPage extends Page {
		/** List of Albums */
		items: Array<Album>;
	}

	/*
	 * Artist with Albums,...
	 */
	export interface Artist extends ArtistBase {
		/** List of similar Artists (via External Service) */
		similar?: Array<ArtistBase>;
		/** List of Series */
		series?: Array<SeriesBase>;
		/** List of Albums */
		albums?: Array<AlbumBase>;
		/** List of Tracks */
		tracks?: Array<TrackBase>;
	}

	/*
	 * Artist
	 */
	export interface ArtistBase extends Base {
		/** List of Album Type */
		albumTypes: Array<JamEnums.AlbumType>;
		/** Genres */
		genres?: Array<GenreBase>;
		/** MusicBrainz Artist Id */
		mbArtistID?: string;
		/**
		 * Number of Albums
		 * @TJS-type integer
		 * @minimum 0
		 */
		albumCount?: number;
		/** List of Album Ids */
		albumIDs?: Array<string>;
		/**
		 * Number of Series
		 * @TJS-type integer
		 * @minimum 0
		 */
		seriesCount?: number;
		/** List of Series Ids */
		seriesIDs?: Array<string>;
		/**
		 * Number of Tracks
		 * @TJS-type integer
		 * @minimum 0
		 */
		trackCount?: number;
		/** List of Track Ids */
		trackIDs?: Array<string>;
		/** Metadata for the Artist (via External Service) */
		info?: ExtendedInfo;
	}

	/*
	 * Artist Index
	 */
	export interface ArtistIndex {
		/**
		 * Last Change Timestamp
		 * @TJS-type integer
		 */
		lastModified: number;
		/** Artist Index Groups */
		groups: Array<ArtistIndexGroup>;
	}

	/*
	 * Artist Index Entry
	 */
	export interface ArtistIndexEntry {
		/** ID */
		id: string;
		/** Name */
		name: string;
		/**
		 * Album Count
		 * @TJS-type integer
		 * @minimum 0
		 */
		albumCount: number;
		/**
		 * Track Count
		 * @TJS-type integer
		 * @minimum 0
		 */
		trackCount: number;
	}

	/*
	 * Artist Index Group
	 */
	export interface ArtistIndexGroup {
		/** Artist Group Name */
		name: string;
		items: Array<ArtistIndexEntry>;
	}

	/*
	 * Artist Page
	 */
	export interface ArtistPage extends Page {
		/** List of Artists */
		items: Array<Artist>;
	}

	/*
	 * Artwork with Folder
	 */
	export interface Artwork extends ArtworkBase {
		/** Artwork Folder */
		folder?: FolderBase;
	}

	/*
	 * Artwork
	 */
	export interface ArtworkBase extends Base {
		/** Artwork Image Type */
		types: Array<JamEnums.ArtworkImageType>;
		/**
		 * Image Height
		 * @TJS-type integer
		 * @minimum 0
		 */
		height?: number;
		/**
		 * Image Width
		 * @TJS-type integer
		 * @minimum 0
		 */
		width?: number;
		/** Image Format */
		format?: string;
		/**
		 * File Size
		 * @TJS-type integer
		 * @minimum 0
		 */
		size: number;
	}

	/*
	 * Artwork Page
	 */
	export interface ArtworkPage extends Page {
		/** List of Artworks */
		items: Array<Artwork>;
	}

	/*
	 * AutoComplete
	 */
	export interface AutoComplete {
		/** Autocomplete Tracks */
		tracks?: Array<AutoCompleteEntry>;
		/** Autocomplete Artists */
		artists?: Array<AutoCompleteEntry>;
		/** Autocomplete Albums */
		albums?: Array<AutoCompleteEntry>;
		/** Autocomplete Folder */
		folders?: Array<AutoCompleteEntry>;
		/** Autocomplete Playlist */
		playlists?: Array<AutoCompleteEntry>;
		/** Autocomplete Podcasts */
		podcasts?: Array<AutoCompleteEntry>;
		/** Autocomplete Episode */
		episodes?: Array<AutoCompleteEntry>;
		/** Autocomplete Series */
		series?: Array<AutoCompleteEntry>;
	}

	/*
	 * AutoComplete Entry
	 */
	export interface AutoCompleteEntry {
		/** ID */
		id: string;
		/** Name */
		name: string;
	}

	export interface Base {
		/** ID */
		id: string;
		/** Name */
		name: string;
		/** User State Info */
		state?: State;
		/**
		 * Created Timestamp
		 * @TJS-type integer
		 * @minimum 0
		 */
		created: number;
	}

	/*
	 * Bookmark
	 */
	export interface Bookmark extends BookmarkBase {
		/** The bookmarked Track */
		track?: TrackBase;
		/** The bookmarked Episode */
		episode?: EpisodeBase;
	}

	/*
	 * Bookmark Base
	 */
	export interface BookmarkBase {
		/** ID */
		id: string;
		/** Track Id */
		trackID: string;
		/** Episode Id */
		episodeID: string;
		/**
		 * Position in Audio
		 * @TJS-type integer
		 */
		position: number;
		/** Comment */
		comment: string;
		/**
		 * Created Timestamp
		 * @TJS-type integer
		 * @minimum 0
		 */
		created: number;
		/**
		 * Changed Timestamp
		 * @TJS-type integer
		 * @minimum 0
		 */
		changed: number;
	}

	/*
	 * Bookmark Page
	 */
	export interface BookmarkPage extends Page {
		/** List of Bookmark */
		items: Array<Bookmark>;
	}

	/*
	 * Chat
	 */
	export interface Chat {
		/** User Name */
		userName: string;
		/** User Id */
		userID: string;
		/**
		 * Created Timestamp
		 * @TJS-type integer
		 * @minimum 0
		 */
		created: number;
		/** Chat Message */
		message: string;
	}

	/*
	 * Episode
	 */
	export interface Episode extends EpisodeBase {
		/** Podcast */
		podcast?: PodcastBase;
	}

	/*
	 * Episode
	 */
	export interface EpisodeBase extends MediaBase {
		/** Podcast Id */
		podcastID: string;
		/** Podcast Name */
		podcastName: string;
		/** Episode Status */
		status: JamEnums.PodcastStatus;
		/**
		 * Published Timestamp
		 * @TJS-type integer
		 * @minimum 0
		 */
		date: number;
		/** Episode Summary */
		summary?: string;
		/** Episode GUID */
		guid?: string;
		/** Episode Author */
		author?: string;
		/** Episode Link */
		link?: string;
		/** Episode File Link */
		url?: string;
		/** Episode Download Error (if any) */
		error?: string;
		/** Episode Chapters */
		chapters?: Array<EpisodeChapter>;
	}

	/*
	 * Episode Chapter
	 */
	export interface EpisodeChapter {
		/**
		 * Chapter Start Time
		 * @TJS-type integer
		 * @minimum 0
		 */
		start: number;
		/** Chapter Title */
		title: string;
	}

	/*
	 * Episodes Page
	 */
	export interface EpisodePage extends Page {
		/** List of Episodes */
		items: Array<Episode>;
	}

	/*
	 * Episode Status Data
	 */
	export interface EpisodeUpdateStatus {
		/** Episode Status */
		status: JamEnums.PodcastStatus;
		/** Episode Download Error (if any) */
		error?: string;
	}

	/*
	 * Track/Folder/Artist/Album Info Data
	 */
	export interface ExtendedInfo {
		/** Description */
		description: string;
		/** Source of the Description */
		source: string;
		/** License of the Description */
		license: string;
		/** Url of the Description */
		url: string;
		/** Url of the License */
		licenseUrl: string;
	}

	/*
	 * Extended Info Result
	 */
	export interface ExtendedInfoResult {
		/** Extended Info */
		info?: ExtendedInfo;
	}

	/*
	 * Folder with tracks
	 */
	export interface Folder extends FolderBase {
		/** List of Tracks */
		tracks?: Array<TrackBase>;
		/** List of Folders */
		folders?: Array<FolderBase>;
		/** List of Artwork Images */
		artworks?: Array<Artwork>;
		/** List of similar Folders (via Exteernal Service) */
		similar?: Array<FolderBase>;
	}

	/*
	 * Folder
	 */
	export interface FolderBase extends Base {
		/** Title */
		title?: string;
		/** Album Type */
		type: JamEnums.FolderType;
		/**
		 * Level in Root
		 * @TJS-type integer
		 */
		level: number;
		/** Parent Folder Id */
		parentID?: string;
		/**
		 * Number of Tracks
		 * @TJS-type integer
		 * @minimum 0
		 */
		trackCount?: number;
		/**
		 * Number of Folders
		 * @TJS-type integer
		 * @minimum 0
		 */
		folderCount?: number;
		/**
		 * Number of Artworks
		 * @TJS-type integer
		 * @minimum 0
		 */
		artworkCount?: number;
		/** Genres */
		genres?: Array<GenreBase>;
		/** Folder Meta Information */
		tag?: FolderTag;
		/** List of Track Ids */
		trackIDs?: Array<string>;
		/** List of Folder Ids */
		folderIDs?: Array<string>;
		/** List of Artwork Ids */
		artworkIDs?: Array<string>;
		/** Metadata for the Folder (via External Service) */
		info?: ExtendedInfo;
		/** List of Parent Folders up to Root */
		parents?: Array<FolderParent>;
	}

	/*
	 * Folder Health
	 */
	export interface FolderHealth {
		/** Folder */
		folder: Folder;
		/** List of Health Hints */
		health: Array<FolderHealthHint>;
	}

	/*
	 * Folder Health Hint
	 */
	export interface FolderHealthHint extends HealthHint {
		/** Folder Health Hint ID */
		id: JamEnums.FolderHealthID;
	}

	/*
	 * Folder Index
	 */
	export interface FolderIndex {
		/**
		 * Last Change Timestamp
		 * @TJS-type integer
		 */
		lastModified: number;
		/** Folder Index Groups */
		groups: Array<FolderIndexGroup>;
	}

	/*
	 * Folder Index Entry
	 */
	export interface FolderIndexEntry {
		/** ID */
		id: string;
		/** Name */
		name: string;
		/**
		 * Track Count
		 * @TJS-type integer
		 * @minimum 0
		 */
		trackCount: number;
	}

	/*
	 * Folder Index Group
	 */
	export interface FolderIndexGroup {
		/** Folder Group Name */
		name: string;
		items: Array<FolderIndexEntry>;
	}

	/*
	 * Folder Page
	 */
	export interface FolderPage extends Page {
		/** List of Folders */
		items: Array<Folder>;
	}

	/*
	 * Folder Parent Information
	 */
	export interface FolderParent {
		/** ID */
		id: string;
		/** Name */
		name: string;
	}

	/*
	 * Folder Meta Information
	 */
	export interface FolderTag {
		/** Album Name */
		album?: string;
		/** Album Type */
		albumType?: JamEnums.AlbumType;
		/** Artist Name */
		artist?: string;
		/** Artist Sort Name */
		artistSort?: string;
		/** Genres */
		genres?: Array<string>;
		/**
		 * Year
		 * @TJS-type integer
		 */
		year?: number;
		/** MusicBrainz Artist Id */
		mbArtistID?: string;
		/** MusicBrainz Release Id */
		mbReleaseID?: string;
		/** MusicBrainz Release Group Id */
		mbReleaseGroupID?: string;
	}

	/*
	 * Genre
	 */
	export interface Genre extends GenreBase {
		/**
		 * Album Count
		 * @TJS-type integer
		 * @minimum 0
		 */
		albumCount: number;
		/**
		 * Track Count
		 * @TJS-type integer
		 * @minimum 0
		 */
		trackCount: number;
		/**
		 * Artist Count
		 * @TJS-type integer
		 * @minimum 0
		 */
		artistCount: number;
		/**
		 * Folder Count
		 * @TJS-type integer
		 * @minimum 0
		 */
		folderCount: number;
	}

	/*
	 * Genre
	 */
	export interface GenreBase extends Base {
	}

	/*
	 * Genre Index
	 */
	export interface GenreIndex {
		/**
		 * Last Change Timestamp
		 * @TJS-type integer
		 */
		lastModified: number;
		/** Genre Index Groups */
		groups: Array<GenreIndexGroup>;
	}

	/*
	 * Genre Index Entry
	 */
	export interface GenreIndexEntry {
		/** ID */
		id: string;
		/** Name */
		name: string;
		/**
		 * Track Count
		 * @TJS-type integer
		 * @minimum 0
		 */
		trackCount: number;
		/**
		 * Artist Count
		 * @TJS-type integer
		 * @minimum 0
		 */
		artistCount: number;
		/**
		 * Album Count
		 * @TJS-type integer
		 * @minimum 0
		 */
		albumCount: number;
		/**
		 * Folder Count
		 * @TJS-type integer
		 * @minimum 0
		 */
		folderCount: number;
	}

	/*
	 * Genre Index Group
	 */
	export interface GenreIndexGroup {
		/** Genre Group Name */
		name: string;
		items: Array<GenreIndexEntry>;
	}

	/*
	 * Genre Page
	 */
	export interface GenrePage extends Page {
		/** List of Genre */
		items: Array<Genre>;
	}

	/*
	 * Health Hint
	 */
	export interface HealthHint {
		/** Health Hint Name */
		name: string;
		/** List of Health Hints */
		details?: Array<HealthHintDetail>;
	}

	/*
	 * Health Hint Detail
	 */
	export interface HealthHintDetail {
		/** Hint Description */
		reason: string;
		/** Expected Value */
		expected?: string;
		/** Actual Value */
		actual?: string;
	}

	/*
	 * Media Base
	 */
	export interface MediaBase extends Base {
		/** Media Base Object Type */
		objType: JamEnums.JamObjectType;
		/**
		 * Duration of Track
		 * @TJS-type integer
		 * @minimum 0
		 */
		duration: number;
		/** Tag Meta Information */
		tag?: MediaTag;
		/** Tag Raw Frames */
		tagRaw?: MediaTagRaw;
		/** Media Information */
		media?: MediaInfo;
		/** Artist Id */
		artistID?: string;
		/** Album Artist Id */
		albumArtistID?: string;
		/** Album Id */
		albumID?: string;
		/** Series Id */
		seriesID?: string;
		/** Genres */
		genres?: Array<GenreBase>;
	}

	/*
	 * Media Raw Tag
	 */
	export interface MediaIDTagRaw extends MediaTagRaw {
		/** Media File ID (Track/Episode) */
		id: string;
	}

	/*
	 * Media Audio Info
	 */
	export interface MediaInfo {
		/**
		 * Bit Rate
		 * @TJS-type integer
		 */
		bitRate: number;
		/** Media Format */
		format?: string;
		/**
		 * Media Channels
		 * @TJS-type integer
		 */
		channels?: number;
		/**
		 * Sample Rate (Hz)
		 * @TJS-type integer
		 */
		sampleRate?: number;
		/**
		 * File Size
		 * @TJS-type integer
		 */
		size?: number;
	}

	/*
	 * Media Tag Data
	 */
	export interface MediaTag {
		/** Title */
		title?: string;
		/** Album Name */
		album?: string;
		/** Artist Name */
		artist?: string;
		/** Genres */
		genres?: Array<string>;
		/**
		 * Year
		 * @TJS-type integer
		 */
		year?: number;
		/**
		 * Track Nr
		 * @TJS-type integer
		 */
		trackNr?: number;
		/**
		 * Disc Nr
		 * @TJS-type integer
		 */
		disc?: number;
		/**
		 * Total Nr. of Disc
		 * @TJS-type integer
		 */
		discTotal?: number;
		/** MusicBrainz Track Id */
		mbTrackID?: string;
		/** MusicBrainz Recording Id */
		mbRecordingID?: string;
		/** MusicBrainz Release Track Id */
		mbReleaseTrackID?: string;
		/** MusicBrainz Release Group Id */
		mbReleaseGroupID?: string;
		/** MusicBrainz Release Id */
		mbReleaseID?: string;
		/** MusicBrainz Artist Id */
		mbArtistID?: string;
		/** MusicBrainz Album Artist Id */
		mbAlbumArtistID?: string;
	}

	/*
	 * Media Raw Tag
	 */
	export interface MediaTagRaw {
		/**
		 * Tag Version
		 * @TJS-type integer
		 */
		version?: number;
		/** Tag Frames */
		frames?: any;
	}

	/*
	 * Metadata Result
	 */
	export interface MetaDataResult {
		/** MetaData */
		data?: any;
	}

	/*
	 * Now Playing Data
	 */
	export interface NowPlaying {
		/** User Name */
		userName: string;
		/** User Id */
		userID: string;
		/**
		 * Minutes ago
		 * @TJS-type integer
		 */
		minutesAgo: number;
		/** The played track */
		track?: TrackBase;
		/** The played track id */
		trackID?: string;
		/** The played episode */
		episode?: EpisodeBase;
		/** The played episode id */
		episodeID?: string;
	}

	/*
	 * Now Playing Page
	 */
	export interface NowPlayingPage extends Page {
		/** List of Now Playing Data */
		items: Array<NowPlaying>;
	}

	export interface Page {
		/**
		 * Items starting from offset position
		 * @TJS-type integer
		 * @minimum 0
		 */
		skip?: number;
		/**
		 * Amount of returned items
		 * @TJS-type integer
		 * @minimum 0
		 */
		take?: number;
		/**
		 * Total amount of available items
		 * @TJS-type integer
		 * @minimum 0
		 */
		total?: number;
	}

	export interface Ping {
		/** Jam Api Version */
		version: string;
	}

	/*
	 * Playlist
	 */
	export interface Playlist extends Base {
		/** Owner User Id */
		userID: string;
		/** Owner User Name */
		userName: string;
		/**
		 * Playlist is public?
		 * @TJS-type boolean
		 */
		isPublic: boolean;
		/** Comment */
		comment?: string;
		/**
		 * Playlist Created Timestamp
		 * @TJS-type integer
		 * @minimum 0
		 */
		created: number;
		/**
		 * Playlist Changed Timestamp
		 * @TJS-type integer
		 * @minimum 0
		 */
		changed: number;
		/**
		 * Playlist duration
		 * @TJS-type integer
		 * @minimum 0
		 */
		duration: number;
		/**
		 * Number of Entries
		 * @TJS-type integer
		 * @minimum 0
		 */
		entriesCount: number;
		/** List of Media Base IDs */
		entriesIDs: Array<string>;
		/** List of Media Base Entries */
		entries?: Array<MediaBase>;
	}

	/*
	 * Playlist Entry Page
	 */
	export interface PlaylistEntryPage extends Page {
		/** List of Playlist Entries */
		items: Array<MediaBase>;
	}

	/*
	 * Playlist Index
	 */
	export interface PlaylistIndex {
		/**
		 * Last Change Timestamp
		 * @TJS-type integer
		 */
		lastModified: number;
		/** Playlist Index Groups */
		groups: Array<PlaylistIndexGroup>;
	}

	/*
	 * Playlist Index Entry
	 */
	export interface PlaylistIndexEntry {
		/** ID */
		id: string;
		/** Name */
		name: string;
		/**
		 * Entry Count
		 * @TJS-type integer
		 * @minimum 0
		 */
		entryCount: number;
	}

	/*
	 * Playlist Index Group
	 */
	export interface PlaylistIndexGroup {
		/** Playlist Group Name */
		name: string;
		items: Array<PlaylistIndexEntry>;
	}

	/*
	 * Album Playlist
	 */
	export interface PlaylistPage extends Page {
		/** List of Playlists */
		items: Array<Playlist>;
	}

	/*
	 * PlayQueue Data
	 */
	export interface PlayQueue {
		/** User Name */
		userName: string;
		/** User Id */
		userID: string;
		/**
		 * Number of Entries
		 * @TJS-type integer
		 * @minimum 0
		 */
		entriesCount: number;
		/** List of Media IDs */
		entriesIDs?: Array<string>;
		/** List of Media Entries */
		entries?: Array<MediaBase>;
		/**
		 * Current Entry Index in PlayQueue
		 * @TJS-type integer
		 * @minimum 0
		 */
		currentIndex?: number;
		/**
		 * Position in Current Entry
		 * @TJS-type integer
		 * @minimum 0
		 */
		mediaPosition?: number;
		/**
		 * Created Timestamp
		 * @TJS-type integer
		 * @minimum 0
		 */
		created: number;
		/**
		 * Changed Timestamp
		 * @TJS-type integer
		 * @minimum 0
		 */
		changed: number;
		/** Last Changed by Client */
		changedBy: string;
	}

	/*
	 * Podcast
	 */
	export interface Podcast extends PodcastBase {
		/** List of Episodes */
		episodes?: Array<EpisodeBase>;
	}

	/*
	 * Podcast Base
	 */
	export interface PodcastBase extends Base {
		/** Podcast Feed URL */
		url: string;
		/** Podcast Status */
		status: JamEnums.PodcastStatus;
		/**
		 * Last Check Timestamp
		 * @TJS-type integer
		 */
		lastCheck?: number;
		/** Podcast Download Error (if any) */
		error?: string;
		/** Podcast Summary */
		description?: string;
		/** List of Episode Ids */
		episodeIDs?: Array<string>;
		/**
		 * Number of Episode
		 * @TJS-type integer
		 * @minimum 0
		 */
		episodeCount?: number;
	}

	/*
	 * Podcast Discover Result
	 */
	export interface PodcastDiscover {
		url: string;
		title: string;
		author: string;
		description: string;
		/** @TJS-type integer */
		subscribers: number;
		/** @TJS-type integer */
		subscribers_last_week: number;
		logo_url: string;
		scaled_logo_url: string;
		website: string;
		mygpo_link: string;
	}

	/*
	 * Podcast Discover Page
	 */
	export interface PodcastDiscoverPage extends Page {
		/** List of Podcasts */
		items: Array<PodcastDiscover>;
	}

	/*
	 * Podcast Discover Tag
	 */
	export interface PodcastDiscoverTag {
		title: string;
		tag: string;
		/** @TJS-type integer */
		usage: number;
	}

	/*
	 * Podcast Discover Tags Page
	 */
	export interface PodcastDiscoverTagPage extends Page {
		/** List of Podcast Tags */
		items: Array<PodcastDiscoverTag>;
	}

	/*
	 * Podcast Index
	 */
	export interface PodcastIndex {
		/**
		 * Last Change Timestamp
		 * @TJS-type integer
		 */
		lastModified: number;
		/** Podcast Index Groups */
		groups: Array<PodcastIndexGroup>;
	}

	/*
	 * Podcast Index Entry
	 */
	export interface PodcastIndexEntry {
		/** ID */
		id: string;
		/** Name */
		name: string;
		/**
		 * Episode Count
		 * @TJS-type integer
		 * @minimum 0
		 */
		episodeCount: number;
	}

	/*
	 * Podcast Index Group
	 */
	export interface PodcastIndexGroup {
		/** Podcast Group Name */
		name: string;
		items: Array<PodcastIndexEntry>;
	}

	/*
	 * Podcast Page
	 */
	export interface PodcastPage extends Page {
		/** List of Podcasts */
		items: Array<Podcast>;
	}

	/*
	 * Podcast Status Data
	 */
	export interface PodcastUpdateStatus {
		/** Podcast Status */
		status: JamEnums.PodcastStatus;
		/** Feed Download Error (if any) */
		error?: string;
		/**
		 * Last Check Timestamp
		 * @TJS-type integer
		 */
		lastCheck?: number;
	}

	/*
	 * Radio
	 */
	export interface Radio extends Base {
		/** URL */
		url: string;
		/** Homepage */
		homepage: string;
		/**
		 * Changed Timestamp
		 * @TJS-type integer
		 */
		changed: number;
		/**
		 * Disabled
		 * @TJS-type boolean
		 */
		disabled?: boolean;
	}

	/*
	 * Radio Index
	 */
	export interface RadioIndex {
		/**
		 * Last Change Timestamp
		 * @TJS-type integer
		 */
		lastModified: number;
		/** Radio Index Groups */
		groups: Array<RadioIndexGroup>;
	}

	/*
	 * Radio Index Entry
	 */
	export interface RadioIndexEntry {
		/** ID */
		id: string;
		/** Name */
		name: string;
		/** URL */
		url: string;
	}

	/*
	 * Radio Index Group
	 */
	export interface RadioIndexGroup {
		/** Radio Group Name */
		name: string;
		items: Array<RadioIndexEntry>;
	}

	/*
	 * Radio Page
	 */
	export interface RadioPage extends Page {
		/** List of Radio */
		items: Array<Radio>;
	}

	/*
	 * Root Data
	 */
	export interface Root extends Base {
		/** Root Path */
		path: string;
		/** Root Update Status */
		status: RootUpdateStatus;
		/** Root Scan Strategy */
		strategy: JamEnums.RootScanStrategy;
	}

	/*
	 * Roots Page
	 */
	export interface RootPage extends Page {
		/** List of Roots */
		items: Array<Root>;
	}

	/*
	 * Root Scan Info
	 */
	export interface RootUpdateStatus {
		/**
		 * Last Scan Timestamp
		 * @TJS-type integer
		 */
		lastScan: number;
		/** Last Error (if any) */
		error?: string;
		/**
		 * Is currently scanning?
		 * @TJS-type boolean
		 */
		scanning?: boolean;
	}

	/*
	 * Series with Albums & Tracks
	 */
	export interface Series extends SeriesBase {
		/** List of Tracks */
		tracks?: Array<TrackBase>;
		/** List of Albums */
		albums?: Array<AlbumBase>;
	}

	/*
	 * Series
	 */
	export interface SeriesBase extends Base {
		/** Series Artist Name */
		artist: string;
		/** Series Artist Id */
		artistID: string;
		/**
		 * Album Count
		 * @TJS-type integer
		 * @minimum 0
		 */
		albumCount?: number;
		/**
		 * Track Count
		 * @TJS-type integer
		 * @minimum 0
		 */
		trackCount?: number;
		/** Album Types */
		albumTypes: Array<JamEnums.AlbumType>;
		/** Track Ids */
		trackIDs?: Array<string>;
		/** Album Ids */
		albumIDs?: Array<string>;
		/** Metadata for the Series (via External Service) */
		info?: ExtendedInfo;
	}

	/*
	 * Series Index
	 */
	export interface SeriesIndex {
		/**
		 * Last Change Timestamp
		 * @TJS-type integer
		 */
		lastModified: number;
		/** Series Index Groups */
		groups: Array<SeriesIndexGroup>;
	}

	/*
	 * Series Index Entry
	 */
	export interface SeriesIndexEntry {
		/** ID */
		id: string;
		/** Name */
		name: string;
		/**
		 * Album Count
		 * @TJS-type integer
		 * @minimum 0
		 */
		albumCount: number;
		/**
		 * Track Count
		 * @TJS-type integer
		 * @minimum 0
		 */
		trackCount: number;
	}

	/*
	 * Series Index Group
	 */
	export interface SeriesIndexGroup {
		/** Series Group Name */
		name: string;
		items: Array<SeriesIndexEntry>;
	}

	/*
	 * Series Page
	 */
	export interface SeriesPage extends Page {
		/** List of Series */
		items: Array<Series>;
	}

	/*
	 * Session Data
	 */
	export interface Session {
		/** Api Version */
		version: string;
		/** Allowed Cookie Domains for CORS */
		allowedCookieDomains: Array<string>;
		/** JSON Web Token */
		jwt?: string;
		/** User of this session */
		user?: SessionUser;
	}

	export interface SessionUser {
		/** User ID */
		id: string;
		/** User Name */
		name: string;
		/** User Roles */
		roles: UserRoles;
	}

	/*
	 * User State Data
	 */
	export interface State {
		/**
		 * Number of Plays
		 * @TJS-type integer
		 * @minimum 0
		 */
		played?: number;
		/**
		 * Last Played Timestamp
		 * @TJS-type integer
		 * @minimum 0
		 */
		lastPlayed?: number;
		/**
		 * Faved Timestamp
		 * @TJS-type integer
		 * @minimum 0
		 */
		faved?: number;
		/**
		 * User Rating
		 * @TJS-type integer
		 * @minimum 0
		 * @maximum 5
		 */
		rated?: number;
	}

	/*
	 * User StateInfo Data
	 */
	export interface StateInfo {
		/** ID */
		id: string;
		/** State */
		state: State;
	}

	/*
	 * User States Data
	 */
	export interface States {
		/** List of State Infos */
		states: Array<StateInfo>;
	}

	/*
	 * Library Stats
	 */
	export interface Stats {
		/** Root ID */
		rootID?: string;
		/**
		 * Number of Tracks
		 * @TJS-type integer
		 * @minimum 0
		 */
		track: number;
		/**
		 * Number of Folders
		 * @TJS-type integer
		 * @minimum 0
		 */
		folder: number;
		/**
		 * Number of Series
		 * @TJS-type integer
		 * @minimum 0
		 */
		series: number;
		/**
		 * Number of Artists
		 * @TJS-type integer
		 * @minimum 0
		 */
		artist: number;
		/** Detailed Artists Stats */
		artistTypes: StatsAlbumTypes;
		/**
		 * Number of Albums
		 * @TJS-type integer
		 * @minimum 0
		 */
		album: number;
		/** Detailed Album Stats */
		albumTypes: StatsAlbumTypes;
	}

	/*
	 * Library Stats by Album Type
	 */
	export interface StatsAlbumTypes {
		/**
		 * Number of Type Album
		 * @TJS-type integer
		 * @minimum 0
		 */
		album: number;
		/**
		 * Number of Various Artists Type Compilation
		 * @TJS-type integer
		 * @minimum 0
		 */
		compilation: number;
		/**
		 * Number of Single Artists Type Compilation
		 * @TJS-type integer
		 * @minimum 0
		 */
		artistCompilation: number;
		/**
		 * Number of Type Live
		 * @TJS-type integer
		 * @minimum 0
		 */
		live: number;
		/**
		 * Number of Type Audiobooks
		 * @TJS-type integer
		 * @minimum 0
		 */
		audiobook: number;
		/**
		 * Number of Type Soundtracks
		 * @TJS-type integer
		 * @minimum 0
		 */
		soundtrack: number;
		/**
		 * Number of Type Series
		 * @TJS-type integer
		 * @minimum 0
		 */
		series: number;
		/**
		 * Number of Type Bootlegs
		 * @TJS-type integer
		 * @minimum 0
		 */
		bootleg: number;
		/**
		 * Number of Type EPs
		 * @TJS-type integer
		 * @minimum 0
		 */
		ep: number;
		/**
		 * Number of Type Singles
		 * @TJS-type integer
		 * @minimum 0
		 */
		single: number;
		/**
		 * Number of Type Unknown
		 * @TJS-type integer
		 * @minimum 0
		 */
		unknown: number;
	}

	/*
	 * Track
	 */
	export interface Track extends TrackBase {
	}

	/*
	 * Track Base
	 */
	export interface TrackBase extends MediaBase {
		/** Parent Folder Id */
		parentID: string;
	}

	/*
	 * Track Health
	 */
	export interface TrackHealth {
		/** Track */
		track: TrackBase;
		/** List of Health Hints */
		health: Array<TrackHealthHint>;
	}

	/*
	 * Track Health Hint
	 */
	export interface TrackHealthHint extends HealthHint {
		/** Track Health Hint ID */
		id: JamEnums.TrackHealthID;
	}

	/*
	 * Track Lyrics (via External Service or Audio Tag)
	 */
	export interface TrackLyrics {
		/** Lyrics */
		lyrics?: string;
		/** Audio Tag or External Service */
		source?: string;
	}

	/*
	 * Tracks Page
	 */
	export interface TrackPage extends Page {
		/** List of Tracks */
		items: Array<Track>;
	}

	export interface User extends Base {
		/** User Email */
		email?: string;
		/** User Roles */
		roles: UserRoles;
	}

	/*
	 * User Detail Stats
	 */
	export interface UserDetailStats {
		/**
		 * Number of Tracks
		 * @TJS-type integer
		 * @minimum 0
		 */
		track: number;
		/**
		 * Number of Folders
		 * @TJS-type integer
		 * @minimum 0
		 */
		folder: number;
		/**
		 * Number of Series
		 * @TJS-type integer
		 * @minimum 0
		 */
		series: number;
		/**
		 * Number of Artist
		 * @TJS-type integer
		 * @minimum 0
		 */
		artist: number;
		/** Detailed Artists Stats */
		artistTypes: StatsAlbumTypes;
		/**
		 * Number of Albums
		 * @TJS-type integer
		 * @minimum 0
		 */
		album: number;
		/** Detailed Album Stats */
		albumTypes: StatsAlbumTypes;
	}

	/*
	 * Users Page
	 */
	export interface UserPage extends Page {
		/** List of Users */
		items: Array<User>;
	}

	export interface UserRoles {
		/**
		 * User is Administrator
		 * @TJS-type boolean
		 */
		admin: boolean;
		/**
		 * User has API Access
		 * @TJS-type boolean
		 */
		stream: boolean;
		/**
		 * User can upload files
		 * @TJS-type boolean
		 */
		upload: boolean;
		/**
		 * User can manage podcasts
		 * @TJS-type boolean
		 */
		podcast: boolean;
	}

	/*
	 * User Session
	 */
	export interface UserSession {
		/** ID */
		id: string;
		/** Session Client */
		client: string;
		/**
		 * Session Expiration
		 * @TJS-type integer
		 */
		expires?: number;
		/** Session Mode */
		mode: JamEnums.SessionMode;
		/** Session Platform */
		platform?: string;
		/** Session OS */
		os?: string;
		/** Session User Agent */
		agent: string;
	}

	/*
	 * User Stats
	 */
	export interface UserStats {
		/**
		 * Number of Playlists
		 * @TJS-type integer
		 * @minimum 0
		 */
		playlist: number;
		/**
		 * Number of Bookmarks
		 * @TJS-type integer
		 * @minimum 0
		 */
		bookmark: number;
		/** Detailed User Favorites Stats */
		favorite: UserDetailStats;
		/** Detailed User Played Stats */
		played: UserDetailStats;
	}

	/*
	 * WaveForm Data
	 */
	export interface WaveFormData {
		/**
		 * The version number of the waveform data format
		 * @TJS-type integer
		 * @minimum 1
		 */
		version: number;
		/**
		 * The number of waveform channels present (version 2 only)
		 * @TJS-type integer
		 * @minimum 0
		 */
		channels?: number;
		/**
		 * Sample rate of original audio file (Hz)
		 * @TJS-type integer
		 * @minimum 0
		 */
		sample_rate: number;
		/**
		 * Number of audio samples per waveform minimum/maximum pair
		 * @TJS-type integer
		 * @minimum 0
		 */
		samples_per_pixel: number;
		/**
		 * Resolution of waveform data. May be either 8 or 16
		 * @TJS-type integer
		 * @minimum 0
		 */
		bits: number;
		/**
		 * Length of waveform data (number of minimum and maximum value pairs per channel)
		 * @TJS-type integer
		 * @minimum 0
		 */
		length: number;
		/**
		 * Array of minimum and maximum waveform data points, interleaved. Depending on bits, each value may be in the range -128 to +127 or -32768 to +32727
		 * @TJS-type integer
		 */
		data: Array<number>;
	}

}
