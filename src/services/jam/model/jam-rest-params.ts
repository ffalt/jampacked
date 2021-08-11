// @generated
// This file was automatically generated and should not be edited.

import * as JamEnums from './jam-enums';

export declare namespace JamParameters {

	export interface AcousticBrainzLookupArgs {
		/** MusicBrainz ID */
		mbID: string;
		/**
		 * Page parameter if more than one acousticbrainz info is available
		 * @TJS-type integer
		 * @minimum 0
		 */
		nr?: number;
	}

	export interface AcoustidLookupArgs {
		/** Track ID */
		trackID: string;
		/**
		 * Lookup Includes (comma-separated AcoustId includes)
		 * @default recordings,releases,releasegroups,tracks,compress,usermeta,sources
		 */
		inc?: string;
	}

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

	export interface AdminSettingsArgs extends AdminSettings {
	}

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

	export interface AdminSettingsExternal {
		/**
		 * Enable External Services
		 * @TJS-type boolean
		 */
		enabled: boolean;
	}

	export interface AdminSettingsIndex {
		/** List of ignored Articles */
		ignoreArticles: Array<string>;
	}

	export interface AdminSettingsLibrary {
		/**
		 * Start Root Scanning on Server Start
		 * @TJS-type boolean
		 */
		scanAtStart: boolean;
	}

	export interface AlbumFilterArgs {
		/** filter by Search Query */
		query?: string;
		/** filter by Album Name */
		name?: string;
		/** filter by Album Slug */
		slug?: string;
		/** filter by Artist Name */
		artist?: string;
		/** filter by Album Ids */
		ids?: Array<string>;
		/** filter by Root Ids */
		rootIDs?: Array<string>;
		/** filter by Artist Ids */
		artistIDs?: Array<string>;
		/** filter by Track Ids */
		trackIDs?: Array<string>;
		/** filter by Folder Ids */
		folderIDs?: Array<string>;
		/** filter by Series Ids */
		seriesIDs?: Array<string>;
		/** filter by Album Types */
		albumTypes?: Array<JamEnums.AlbumType>;
		/** filter by MusicBrainz Release Ids */
		mbReleaseIDs?: Array<string>;
		/** filter by MusicBrainz Artist Ids */
		mbArtistIDs?: Array<string>;
		/** exclude by MusicBrainz Artist Id */
		notMbArtistID?: string;
		/** filter by Genres */
		genres?: Array<string>;
		/** filter by Genre Ids */
		genreIDs?: Array<string>;
		/**
		 * filter by Creation timestamp
		 * @TJS-type integer
		 * @minimum 0
		 */
		since?: number;
		/**
		 * filter by since year
		 * @TJS-type integer
		 * @minimum 0
		 */
		fromYear?: number;
		/**
		 * filter by until year
		 * @TJS-type integer
		 * @minimum 0
		 */
		toYear?: number;
	}

	export interface AlbumOrderArgs extends OrderByArgs {
		/** order by field */
		orderBy?: JamEnums.AlbumOrderFields;
	}

	export interface ArtistFilterArgs {
		/** filter by Search Query */
		query?: string;
		/** filter by Artist Name */
		name?: string;
		/** filter by Artist Slug */
		slug?: string;
		/** filter by Artist Ids */
		ids?: Array<string>;
		/** filter by Root Ids */
		rootIDs?: Array<string>;
		/** filter by Album Ids */
		albumIDs?: Array<string>;
		/** filter by Track Ids */
		trackIDs?: Array<string>;
		/** filter by Album Track Ids */
		albumTrackIDs?: Array<string>;
		/** filter by Series Ids */
		seriesIDs?: Array<string>;
		/** filter by Folder Ids */
		folderIDs?: Array<string>;
		/** filter by Genres */
		genres?: Array<string>;
		/** filter by Genre Ids */
		genreIDs?: Array<string>;
		/** filter by Album Types */
		albumTypes?: Array<JamEnums.AlbumType>;
		/** filter by MusicBrainz Artist Ids */
		mbArtistIDs?: Array<string>;
		/** exclude by MusicBrainz Artist Id */
		notMbArtistID?: string;
		/**
		 * filter by Creation timestamp
		 * @TJS-type integer
		 * @minimum 0
		 */
		since?: number;
	}

	export interface ArtistOrderArgs extends OrderByArgs {
		/** order by field */
		orderBy?: JamEnums.ArtistOrderFields;
	}

	export interface ArtworkFilterArgs {
		/** filter by Search Query */
		query?: string;
		/** filter by Artist Name */
		name?: string;
		/** filter by Artwork Ids */
		ids?: Array<string>;
		/** filter by Artwork Image Formats */
		formats?: Array<string>;
		/** filter by Folder Ids */
		folderIDs?: Array<string>;
		/** filter if artwork is in folder id (or its child folders) */
		childOfID?: string;
		/** filter by Artwork Image Types */
		types?: Array<JamEnums.ArtworkImageType>;
		/**
		 * filter by Creation timestamp
		 * @TJS-type integer
		 * @minimum 0
		 */
		since?: number;
		/**
		 * filter by since size
		 * @TJS-type integer
		 * @minimum 0
		 */
		sizeFrom?: number;
		/**
		 * filter by until size
		 * @TJS-type integer
		 * @minimum 0
		 */
		sizeTo?: number;
		/**
		 * filter by since width
		 * @TJS-type integer
		 * @minimum 0
		 */
		widthFrom?: number;
		/**
		 * filter by until width
		 * @TJS-type integer
		 * @minimum 0
		 */
		widthTo?: number;
		/**
		 * filter by since height
		 * @TJS-type integer
		 * @minimum 0
		 */
		heightFrom?: number;
		/**
		 * filter by until height
		 * @TJS-type integer
		 * @minimum 0
		 */
		heightTo?: number;
	}

	export interface ArtworkNewArgs extends ArtworkNewUploadArgs {
		/** URL of an image */
		url: string;
	}

	export interface ArtworkNewUploadArgs {
		/** Folder Id */
		folderID: string;
		/** Types of the image */
		types: Array<JamEnums.ArtworkImageType>;
	}

	export interface ArtworkOrderArgs extends DefaultOrderArgs {
	}

	export interface ArtworkRenameArgs {
		/** Artwork Id */
		id: string;
		/** New Image Filename */
		newName: string;
	}

	export interface AutoCompleteFilterArgs {
		/** query to complete */
		query: string;
		/**
		 * amount of track names to complete
		 * @TJS-type integer
		 * @minimum 0
		 * @default 0
		 */
		track?: number;
		/**
		 * amount of artist names to complete
		 * @TJS-type integer
		 * @minimum 0
		 * @default 0
		 */
		artist?: number;
		/**
		 * amount of album names to complete
		 * @TJS-type integer
		 * @minimum 0
		 * @default 0
		 */
		album?: number;
		/**
		 * amount of folder names to complete
		 * @TJS-type integer
		 * @minimum 0
		 * @default 0
		 */
		folder?: number;
		/**
		 * amount of playlist names to complete
		 * @TJS-type integer
		 * @minimum 0
		 * @default 0
		 */
		playlist?: number;
		/**
		 * amount of podcast names to complete
		 * @TJS-type integer
		 * @minimum 0
		 * @default 0
		 */
		podcast?: number;
		/**
		 * amount of episode names to complete
		 * @TJS-type integer
		 * @minimum 0
		 * @default 0
		 */
		episode?: number;
		/**
		 * amount of series names to complete
		 * @TJS-type integer
		 * @minimum 0
		 * @default 0
		 */
		series?: number;
	}

	export interface BookmarkCreateArgs {
		/** a track or episode id */
		mediaID: string;
		/**
		 * the position of the bookmark (in ms)
		 * @TJS-type integer
		 * @minimum 0
		 */
		position: number;
		/** a comment */
		comment: string;
	}

	export interface BookmarkFilterArgs {
		/** filter by Search Query */
		query?: string;
		/** filter by Comment */
		comment?: string;
		/** filter by Bookmark Ids */
		ids?: Array<string>;
		/** filter by Track Ids */
		trackIDs?: Array<string>;
		/** filter by Episode Ids */
		episodeIDs?: Array<string>;
		/**
		 * filter by Creation timestamp
		 * @TJS-type integer
		 * @minimum 0
		 */
		since?: number;
		/** filter by User Ids */
		userIDs?: Array<string>;
	}

	export interface BookmarkOrderArgs extends OrderByArgs {
		/** order by field */
		orderBy?: JamEnums.BookmarkOrderFields;
	}

	export interface ChatCreateArgs {
		/** Chat message */
		message: string;
	}

	export interface ChatFilterArgs {
		/**
		 * filter by message timestamp
		 * @TJS-type integer
		 * @minimum 0
		 */
		since?: number;
	}

	export interface ChatRemoveArgs {
		/**
		 * Chat time
		 * @TJS-type integer
		 */
		time: number;
	}

	export interface CoverArtArchiveImageArgs {
		/** Coverart URL */
		url: string;
	}

	export interface CoverArtArchiveLookupArgs {
		/** MusicBrainz ID */
		mbID: string;
		/** Lookup by CoverArtArchive MusicBrainz Type */
		type: JamEnums.CoverArtArchiveLookupType;
	}

	export interface CredentialsArgs {
		/** User password */
		password: string;
		/** User name */
		username: string;
		/** User client */
		client: string;
		/**
		 * Generate JSON Web Token
		 * @TJS-type boolean
		 */
		jwt?: boolean;
	}

	export interface DefaultOrderArgs extends OrderByArgs {
		/** order by field */
		orderBy?: JamEnums.DefaultOrderFields;
	}

	export interface DownloadArgs {
		/**
		 * format of download stream
		 * @default zip
		 */
		format?: JamEnums.DownloadFormatType;
	}

	export interface EpisodeFilterArgs {
		/** filter by Search Query */
		query?: string;
		/** filter by Name */
		name?: string;
		/** filter by Episode Ids */
		ids?: Array<string>;
		/** filter by Podcast Ids */
		podcastIDs?: Array<string>;
		/**
		 * filter by Creation timestamp
		 * @TJS-type integer
		 * @minimum 0
		 */
		since?: number;
		/** filter by Authors */
		authors?: Array<string>;
		/** filter by GUIDs */
		guids?: Array<string>;
		/** filter by Podcast Status */
		statuses?: Array<JamEnums.PodcastStatus>;
	}

	export interface EpisodeOrderArgs extends OrderByArgs {
		/** order by field */
		orderBy?: JamEnums.EpisodeOrderFields;
	}

	export interface FavArgs {
		/** ID */
		id: string;
		/**
		 * add or remove the item fav
		 * @TJS-type boolean
		 * @default false
		 */
		remove: boolean;
	}

	export interface FolderCreateArgs {
		/** Parent Folder Id */
		id: string;
		/** New Folder Name */
		name: string;
	}

	export interface FolderFilterArgs {
		/** filter by Search Query */
		query?: string;
		/** filter by Name */
		name?: string;
		/** filter by Folder Ids */
		ids?: Array<string>;
		/**
		 * filter by Creation timestamp
		 * @TJS-type integer
		 * @minimum 0
		 */
		since?: number;
		/** filter by Folder Parent Ids */
		parentIDs?: Array<string>;
		/** filter if folder is in folder id (or its child folders) */
		childOfID?: string;
		/**
		 * filter by Folder Tree Level
		 * @TJS-type integer
		 * @minimum 0
		 */
		level?: number;
		/** filter by Album Types */
		albumTypes?: Array<JamEnums.AlbumType>;
		/** filter by Folder Types */
		folderTypes?: Array<JamEnums.FolderType>;
		/** filter by Genres */
		genres?: Array<string>;
		/** filter by Album Name */
		album?: Array<string>;
		/** filter by Artist Name */
		artist?: Array<string>;
		/** filter by Artist Sort Name */
		artistSort?: Array<string>;
		/** filter by Title */
		title?: Array<string>;
		/**
		 * filter by since year
		 * @TJS-type integer
		 * @minimum 0
		 */
		fromYear?: number;
		/**
		 * filter by until year
		 * @TJS-type integer
		 * @minimum 0
		 */
		toYear?: number;
		/** filter by MusicBrainz Release Ids */
		mbReleaseIDs?: Array<string>;
		/** filter by MusicBrainz Release Group Ids */
		mbReleaseGroupIDs?: Array<string>;
		/** filter by MusicBrainz Album Type */
		mbAlbumTypes?: Array<string>;
		/** filter by MusicBrainz Artist Ids */
		mbArtistIDs?: Array<string>;
		/** filter by Artwork Ids */
		artworksIDs?: Array<string>;
		/** filter by Root Ids */
		rootIDs?: Array<string>;
		/** filter by Track Ids */
		trackIDs?: Array<string>;
		/** filter by Album Ids */
		albumIDs?: Array<string>;
		/** filter by Artist Ids */
		artistIDs?: Array<string>;
		/** filter by Series Ids */
		seriesIDs?: Array<string>;
		/** filter by Genre Ids */
		genreIDs?: Array<string>;
	}

	export interface FolderMoveArgs {
		/** Folder Ids */
		ids: Array<string>;
		/** Destination Parent Folder Id */
		newParentID: string;
	}

	export interface FolderOrderArgs extends OrderByArgs {
		/** order by field */
		orderBy?: JamEnums.FolderOrderFields;
	}

	export interface FolderRenameArgs {
		/** Folder Id */
		id: string;
		/** New Folder Name */
		name: string;
	}

	export interface GenreFilterArgs {
		/** filter by Search Query */
		query?: string;
		/** filter by Genre Name */
		name?: string;
		/** filter by Genre Ids */
		ids?: Array<string>;
		/** filter by Track Ids */
		trackIDs?: Array<string>;
		/**
		 * filter by Creation timestamp
		 * @TJS-type integer
		 * @minimum 0
		 */
		since?: number;
	}

	export interface GenreOrderArgs extends OrderByArgs {
		/** order by field */
		orderBy?: JamEnums.GenreOrderFields;
	}

	export interface ImageArgs extends ImageSizeArgs {
		/** Object Id */
		id: string;
		/** format of the image */
		format?: JamEnums.ImageFormatType;
	}

	export interface ImageFormatArgs {
		/** format of the image */
		format?: JamEnums.ImageFormatType;
	}

	export interface ImageSizeArgs {
		/**
		 * size of the image
		 * @TJS-type integer
		 * @minimum 16
		 * @maximum 1024
		 */
		size?: number;
	}

	export interface IncludesAlbumArgs {
		/**
		 * include track ids on album(s)
		 * @TJS-type boolean
		 * @default false
		 */
		albumIncTrackIDs?: boolean;
		/**
		 * include track count on album(s)
		 * @TJS-type boolean
		 * @default false
		 */
		albumIncTrackCount?: boolean;
		/**
		 * include user states (fav,rate) on album(s)
		 * @TJS-type boolean
		 * @default false
		 */
		albumIncState?: boolean;
		/**
		 * include extended meta data on album(s)
		 * @TJS-type boolean
		 * @default false
		 */
		albumIncInfo?: boolean;
		/**
		 * include genre on album(s)
		 * @TJS-type boolean
		 * @default false
		 */
		albumIncGenres?: boolean;
	}

	export interface IncludesAlbumChildrenArgs {
		/**
		 * include tracks on album(s)
		 * @TJS-type boolean
		 * @default false
		 */
		albumIncTracks?: boolean;
		/**
		 * include artist on album(s)
		 * @TJS-type boolean
		 * @default false
		 */
		albumIncArtist?: boolean;
	}

	export interface IncludesArtistArgs {
		/**
		 * include album ids on artist(s)
		 * @TJS-type boolean
		 * @default false
		 */
		artistIncAlbumIDs?: boolean;
		/**
		 * include album count on artist(s)
		 * @TJS-type boolean
		 * @default false
		 */
		artistIncAlbumCount?: boolean;
		/**
		 * include user states (fav,rate) on artist(s)
		 * @TJS-type boolean
		 * @default false
		 */
		artistIncState?: boolean;
		/**
		 * include track ids on artist(s)
		 * @TJS-type boolean
		 * @default false
		 */
		artistIncTrackIDs?: boolean;
		/**
		 * include track count on artist(s)
		 * @TJS-type boolean
		 * @default false
		 */
		artistIncTrackCount?: boolean;
		/**
		 * include series ids on artist(s)
		 * @TJS-type boolean
		 * @default false
		 */
		artistIncSeriesIDs?: boolean;
		/**
		 * include series count on artist(s)
		 * @TJS-type boolean
		 * @default false
		 */
		artistIncSeriesCount?: boolean;
		/**
		 * include extended meta data on artist(s)
		 * @TJS-type boolean
		 * @default false
		 */
		artistIncInfo?: boolean;
		/**
		 * include genre on artist(s)
		 * @TJS-type boolean
		 * @default false
		 */
		artistIncGenres?: boolean;
	}

	export interface IncludesArtistChildrenArgs {
		/**
		 * include albums on artist(s)
		 * @TJS-type boolean
		 * @default false
		 */
		artistIncAlbums?: boolean;
		/**
		 * include tracks on artist(s)
		 * @TJS-type boolean
		 * @default false
		 */
		artistIncTracks?: boolean;
		/**
		 * include series on artist(s)
		 * @TJS-type boolean
		 * @default false
		 */
		artistIncSeries?: boolean;
		/**
		 * include similar artists on artist(s)
		 * @TJS-type boolean
		 * @default false
		 */
		artistIncSimilar?: boolean;
	}

	export interface IncludesArtworkArgs {
		/**
		 * include state (fav,rate) on artwork(s)
		 * @TJS-type boolean
		 * @default false
		 */
		artworkIncState?: boolean;
	}

	export interface IncludesArtworkChildrenArgs {
		/**
		 * include folder on artwork(s)
		 * @TJS-type boolean
		 * @default false
		 */
		artworkIncFolder?: boolean;
	}

	export interface IncludesBookmarkChildrenArgs {
		/**
		 * include track on bookmarks(s)
		 * @TJS-type boolean
		 * @default false
		 */
		bookmarkIncTrack?: boolean;
	}

	export interface IncludesEpisodeArgs {
		/**
		 * include media information on episode(s)
		 * @TJS-type boolean
		 * @default false
		 */
		episodeIncMedia?: boolean;
		/**
		 * include tag on episode(s)
		 * @TJS-type boolean
		 * @default false
		 */
		episodeIncTag?: boolean;
		/**
		 * include raw tag on episode(s)
		 * @TJS-type boolean
		 * @default false
		 */
		episodeIncRawTag?: boolean;
		/**
		 * include user states (fav,rate) on episode(s)
		 * @TJS-type boolean
		 * @default false
		 */
		episodeIncState?: boolean;
	}

	export interface IncludesEpisodeParentArgs {
		/**
		 * include parent podcast on episode(s)
		 * @TJS-type boolean
		 * @default false
		 */
		episodeIncParent?: boolean;
	}

	export interface IncludesFolderArgs {
		/**
		 * include tag on folder(s)
		 * @TJS-type boolean
		 * @default false
		 */
		folderIncTag?: boolean;
		/**
		 * include state (fav,rate) on folder(s)
		 * @TJS-type boolean
		 * @default false
		 */
		folderIncState?: boolean;
		/**
		 * include child folder count on folder(s)
		 * @TJS-type boolean
		 * @default false
		 */
		folderIncChildFolderCount?: boolean;
		/**
		 * include track count on folder(s)
		 * @TJS-type boolean
		 * @default false
		 */
		folderIncTrackCount?: boolean;
		/**
		 * include genre on folder(s)
		 * @TJS-type boolean
		 * @default false
		 */
		folderIncGenres?: boolean;
		/**
		 * include artwork count on folder(s)
		 * @TJS-type boolean
		 * @default false
		 */
		folderIncArtworkCount?: boolean;
		/**
		 * include a list of all parent folder ids/names on folder(s)
		 * @TJS-type boolean
		 * @default false
		 */
		folderIncParents?: boolean;
		/**
		 * include extended meta data on folder(s)
		 * @TJS-type boolean
		 * @default false
		 */
		folderIncInfo?: boolean;
		/**
		 * include similar folders list on folder(s) - only for folders of type artist
		 * @TJS-type boolean
		 * @default false
		 */
		folderIncSimilar?: boolean;
		/**
		 * include artwork images Ids on folder(s)
		 * @TJS-type boolean
		 * @default false
		 */
		folderIncArtworkIDs?: boolean;
		/**
		 * include track Ids on folder(s)
		 * @TJS-type boolean
		 * @default false
		 */
		folderIncTrackIDs?: boolean;
		/**
		 * include children folder Ids on folder(s)
		 * @TJS-type boolean
		 * @default false
		 */
		folderIncFolderIDs?: boolean;
	}

	export interface IncludesFolderChildrenArgs {
		/**
		 * include artwork images list on folder(s)
		 * @TJS-type boolean
		 * @default false
		 */
		folderIncArtworks?: boolean;
		/**
		 * include tracks and sub folders on folder(s)
		 * @TJS-type boolean
		 * @default false
		 */
		folderIncChildren?: boolean;
		/**
		 * include child folders on folder(s)
		 * @TJS-type boolean
		 * @default false
		 */
		folderIncFolders?: boolean;
		/**
		 * include tracks on folder(s)
		 * @TJS-type boolean
		 * @default false
		 */
		folderIncTracks?: boolean;
		/**
		 * include tag on child folder(s)
		 * @TJS-type boolean
		 * @default false
		 */
		folderChildIncTag?: boolean;
		/**
		 * include state (fav,rate) on child folder(s)
		 * @TJS-type boolean
		 * @default false
		 */
		folderChildIncState?: boolean;
		/**
		 * include child folder count on child folder(s)
		 * @TJS-type boolean
		 * @default false
		 */
		folderChildIncChildFolderCount?: boolean;
		/**
		 * include track count on child folder(s)
		 * @TJS-type boolean
		 * @default false
		 */
		folderChildIncTrackCount?: boolean;
		/**
		 * include artwork count on child folder(s)
		 * @TJS-type boolean
		 * @default false
		 */
		folderChildIncArtworkCount?: boolean;
		/**
		 * include a list of all parent folder ids/names on child folder(s)
		 * @TJS-type boolean
		 * @default false
		 */
		folderChildIncParents?: boolean;
		/**
		 * include extended meta data on child folder(s)
		 * @TJS-type boolean
		 * @default false
		 */
		folderChildIncInfo?: boolean;
		/**
		 * include similar folders list on child folder(s) - only for folders of type artist
		 * @TJS-type boolean
		 * @default false
		 */
		folderChildIncSimilar?: boolean;
		/**
		 * include artwork images Ids on child folder(s)
		 * @TJS-type boolean
		 * @default false
		 */
		folderChildIncArtworkIDs?: boolean;
		/**
		 * include track Ids on child folder(s)
		 * @TJS-type boolean
		 * @default false
		 */
		folderChildIncTrackIDs?: boolean;
		/**
		 * include children folder Ids on child folder(s)
		 * @TJS-type boolean
		 * @default false
		 */
		folderChildIncFolderIDs?: boolean;
	}

	export interface IncludesGenreArgs {
		/**
		 * include state (fav,rate) on genre(s)
		 * @TJS-type boolean
		 * @default false
		 */
		genreState?: boolean;
	}

	export interface IncludesNowPlayingArgs {
		/**
		 * include track Id on now playing entries
		 * @TJS-type boolean
		 * @default false
		 */
		nowPlayingIncTrackIDs?: boolean;
		/**
		 * include tracks on now playing entries
		 * @TJS-type boolean
		 * @default false
		 */
		nowPlayingIncTracks?: boolean;
		/**
		 * include track Id on now playing entries
		 * @TJS-type boolean
		 * @default false
		 */
		nowPlayingIncEpisodeIDs?: boolean;
		/**
		 * include tracks on now playing entries
		 * @TJS-type boolean
		 * @default false
		 */
		nowPlayingIncEpisodes?: boolean;
	}

	export interface IncludesPlaylistArgs {
		/**
		 * include entries on playlist
		 * @TJS-type boolean
		 * @default false
		 */
		playlistIncEntries?: boolean;
		/**
		 * include entry ids on playlist
		 * @TJS-type boolean
		 * @default false
		 */
		playlistIncEntriesIDs?: boolean;
		/**
		 * include user state on playlist
		 * @TJS-type boolean
		 * @default false
		 */
		playlistIncState?: boolean;
	}

	export interface IncludesPlayQueueArgs {
		/**
		 * include entries on play queue
		 * @TJS-type boolean
		 * @default false
		 */
		playQueueEntries?: boolean;
		/**
		 * include entry ids on play queue
		 * @TJS-type boolean
		 * @default false
		 */
		playQueueEntriesIDs?: boolean;
	}

	export interface IncludesPodcastArgs {
		/**
		 * include state (fav,rate) on podcast(s)
		 * @TJS-type boolean
		 * @default false
		 */
		podcastIncState?: boolean;
		/**
		 * include episodes id on podcast(s)
		 * @TJS-type boolean
		 * @default false
		 */
		podcastIncEpisodeIDs?: boolean;
		/**
		 * include episode count on podcast(s)
		 * @TJS-type boolean
		 * @default false
		 */
		podcastIncEpisodeCount?: boolean;
	}

	export interface IncludesPodcastChildrenArgs {
		/**
		 * include episodes on podcast(s)
		 * @TJS-type boolean
		 * @default false
		 */
		podcastIncEpisodes?: boolean;
	}

	export interface IncludesRadioArgs {
		/**
		 * include state (fav,rate) on radio(s)
		 * @TJS-type boolean
		 * @default false
		 */
		radioState?: boolean;
	}

	export interface IncludesRootArgs {
	}

	export interface IncludesSeriesArgs {
		/**
		 * include album ids on artist(s)
		 * @TJS-type boolean
		 * @default false
		 */
		seriesIncAlbumIDs?: boolean;
		/**
		 * include album counts on artist(s)
		 * @TJS-type boolean
		 * @default false
		 */
		seriesIncAlbumCount?: boolean;
		/**
		 * include user states (fav,rate) on artist(s)
		 * @TJS-type boolean
		 * @default false
		 */
		seriesIncState?: boolean;
		/**
		 * include track ids on artist(s)
		 * @TJS-type boolean
		 * @default false
		 */
		seriesIncTrackIDs?: boolean;
		/**
		 * include track counts on artist(s)
		 * @TJS-type boolean
		 * @default false
		 */
		seriesIncTrackCount?: boolean;
		/**
		 * include extended meta data on artist(s)
		 * @TJS-type boolean
		 * @default false
		 */
		seriesIncInfo?: boolean;
	}

	export interface IncludesSeriesChildrenArgs {
		/**
		 * include albums on series
		 * @TJS-type boolean
		 * @default false
		 */
		seriesIncAlbums?: boolean;
		/**
		 * include tracks on artist(s)
		 * @TJS-type boolean
		 * @default false
		 */
		seriesIncTracks?: boolean;
	}

	export interface IncludesTrackArgs {
		/**
		 * include media information on track(s)
		 * @TJS-type boolean
		 * @default false
		 */
		trackIncMedia?: boolean;
		/**
		 * include tag on track(s)
		 * @TJS-type boolean
		 * @default false
		 */
		trackIncTag?: boolean;
		/**
		 * include raw tag on track(s)
		 * @TJS-type boolean
		 * @default false
		 */
		trackIncRawTag?: boolean;
		/**
		 * include genre on track(s)
		 * @TJS-type boolean
		 * @default false
		 */
		trackIncGenres?: boolean;
		/**
		 * include user states (fav,rate) on track(s)
		 * @TJS-type boolean
		 * @default false
		 */
		trackIncState?: boolean;
	}

	export interface IncludesUserArgs {
	}

	export interface LastFMLookupArgs {
		/** MusicBrainz ID */
		mbID: string;
		/** lookup by lastfm type */
		type: JamEnums.LastFMLookupType;
	}

	export interface ListArgs {
		/** filter by special list */
		list?: JamEnums.ListType;
		/** seed for random list */
		seed?: string;
	}

	export interface LyricsOVHSearchArgs {
		/** Song Title */
		title: string;
		/** Song Artist */
		artist: string;
	}

	export interface MediaHealthArgs {
		/**
		 * check media file integrity
		 * @TJS-type boolean
		 * @default false
		 */
		healthMedia?: boolean;
	}

	export interface MediaTagRawUpdateArgs {
		/**
		 * Tag Version
		 * @TJS-type integer
		 */
		version: number;
		/** Tag Frames */
		frames: any;
	}

	export interface MusicBrainzLookupArgs {
		/** MusicBrainz ID */
		mbID: string;
		/** MusicBrainz Lookup Type */
		type: JamEnums.MusicBrainzLookupType;
		/** Lookup Includes (comma-separated MusicBrainz includes https://musicbrainz.org/doc/Development/XML_Web_Service/Version_2#Lookups ) */
		inc?: string;
	}

	export interface MusicBrainzSearchArgs {
		/** MusicBrainz Search Type */
		type: JamEnums.MusicBrainzSearchType;
		/** Search by Recording Name */
		recording?: string;
		/** Search by Releasegroup Name */
		releasegroup?: string;
		/** Search by Release Name */
		release?: string;
		/** Search by Artist Name */
		artist?: string;
		/**
		 * Search by Number of Release Tracks
		 * @TJS-type integer
		 * @minimum 0
		 */
		tracks?: number;
	}

	export interface OrderByArgs {
		/**
		 * order direction ascending or descending
		 * @TJS-type boolean
		 */
		orderDesc?: boolean;
	}

	export interface PageArgs {
		/**
		 * return items starting from offset position
		 * @TJS-type integer
		 * @minimum 0
		 * @default 0
		 */
		skip?: number;
		/**
		 * amount of returned items
		 * @TJS-type integer
		 * @minimum 1
		 */
		take?: number;
	}

	export interface PlaylistEntryFilterArgs {
		/** filter by Playlist Ids */
		playlistIDs?: Array<string>;
	}

	export interface PlaylistEntryOrderArgs extends OrderByArgs {
		/** order by field */
		orderBy?: JamEnums.PlaylistEntryOrderFields;
	}

	export interface PlaylistFilterArgs {
		/** filter by Search Query */
		query?: string;
		/** filter by Name */
		name?: string;
		/** filter by Comment */
		comment?: string;
		/** filter by Playlist Ids */
		ids?: Array<string>;
		/**
		 * filter by Creation timestamp
		 * @TJS-type integer
		 * @minimum 0
		 */
		since?: number;
		/** filter by User Ids */
		userIDs?: Array<string>;
		/**
		 * filter by isPublic Flag
		 * @TJS-type boolean
		 */
		isPublic?: boolean;
		/**
		 * filter by since Playlist duration
		 * @TJS-type integer
		 * @minimum 0
		 */
		durationFrom?: number;
		/**
		 * filter by until Playlist duration
		 * @TJS-type integer
		 * @minimum 0
		 */
		durationTo?: number;
	}

	export interface PlaylistMutateArgs {
		/** Playlist Name */
		name?: string;
		/** Comment */
		comment?: string;
		/**
		 * Playlist is public?
		 * @TJS-type boolean
		 */
		isPublic?: boolean;
		/** Track/Episode IDs of the playlist, may include duplicates */
		mediaIDs?: Array<string>;
	}

	export interface PlaylistOrderArgs extends DefaultOrderArgs {
	}

	export interface PlayQueueSetArgs {
		/** Media Ids of the play queue */
		mediaIDs?: Array<string>;
		/** Current Media Id */
		currentID?: string;
		/**
		 * Position in Current Media
		 * @TJS-type integer
		 * @minimum 0
		 */
		position?: number;
	}

	export interface PodcastCreateArgs {
		/** Podcast Feed URL */
		url: string;
	}

	export interface PodcastDiscoverArgs {
		/** Search Podcast by Name */
		query: string;
	}

	export interface PodcastDiscoverByTagArgs {
		/** Search Podcast by Tag */
		tag: string;
	}

	export interface PodcastFilterArgs {
		/** filter by Search Query */
		query?: string;
		/** filter by Name */
		name?: string;
		/** filter by Podcast Ids */
		ids?: Array<string>;
		/** filter by Episode Ids */
		episodeIDs?: Array<string>;
		/**
		 * filter by Creation timestamp
		 * @TJS-type integer
		 * @minimum 0
		 */
		since?: number;
		/** filter by URL */
		url?: string;
		/** filter by Podcast Status */
		statuses?: Array<JamEnums.PodcastStatus>;
		/**
		 * filter by since Last Check timestamp
		 * @TJS-type integer
		 * @minimum 0
		 */
		lastCheckFrom?: number;
		/**
		 * filter by until Last Check timestamp
		 * @TJS-type integer
		 * @minimum 0
		 */
		lastCheckTo?: number;
		/** filter by Title */
		title?: string;
		/** filter by Author */
		author?: string;
		/** filter by Title */
		description?: string;
		/** filter by Title */
		generator?: string;
		/** filter by Podcast Category */
		categories?: Array<string>;
	}

	export interface PodcastOrderArgs extends OrderByArgs {
		/** order by field */
		orderBy?: JamEnums.PodcastOrderFields;
	}

	export interface PodcastRefreshArgs {
		/** Podcast ID to refresh (empty for refreshing all) */
		id?: string;
	}

	export interface RadioFilterArgs {
		/** filter by Search Query */
		query?: string;
		/** filter by Name */
		name?: string;
		/** filter by Radio Ids */
		ids?: Array<string>;
		/** filter by URL */
		url?: string;
		/** filter by Homepage URL */
		homepage?: string;
		/**
		 * filter by Creation timestamp
		 * @TJS-type integer
		 * @minimum 0
		 */
		since?: number;
		/**
		 * filter by Disabled Flag
		 * @TJS-type boolean
		 */
		disabled?: boolean;
	}

	export interface RadioMutateArgs {
		/** Radio Name */
		name: string;
		/** URL */
		url: string;
		/** Homepage */
		homepage?: string;
		/**
		 * Disabled
		 * @TJS-type boolean
		 */
		disabled?: boolean;
	}

	export interface RadioOrderArgs extends DefaultOrderArgs {
	}

	export interface RateArgs {
		/** ID */
		id: string;
		/**
		 * Rating
		 * @TJS-type integer
		 * @minimum 0
		 * @maximum 5
		 */
		rating: number;
	}

	export interface RawTagUpdateArgs {
		/** Track Id */
		id: string;
		/** Raw tag to store in the track (e.g. id3v2/vorbis) */
		tag: any;
	}

	export interface RootFilterArgs {
		/** filter by Search Query */
		query?: string;
		/** filter by Artist Name */
		name?: string;
		/** filter by Root Ids */
		ids?: Array<string>;
		/**
		 * filter by Creation timestamp
		 * @TJS-type integer
		 * @minimum 0
		 */
		since?: number;
		/** filter by Scan Strategy */
		strategies?: Array<JamEnums.RootScanStrategy>;
		/** filter by Track Ids */
		trackIDs?: Array<string>;
		/** filter by Folder Ids */
		folderIDs?: Array<string>;
		/** filter by Album Ids */
		albumIDs?: Array<string>;
		/** filter by Artist Ids */
		artistIDs?: Array<string>;
		/** filter by Series Ids */
		seriesIDs?: Array<string>;
	}

	export interface RootMutateArgs {
		/** Root Name */
		name: string;
		/** Absolute Path for Root  */
		path: string;
		/** Scan Strategy */
		strategy: JamEnums.RootScanStrategy;
	}

	export interface RootOrderArgs extends DefaultOrderArgs {
	}

	export interface RootRefreshArgs {
		/** Root ID to refresh (empty for refreshing all) */
		id?: string;
	}

	export interface SeriesFilterArgs {
		/** filter by Search Query */
		query?: string;
		/** filter by Name */
		name?: string;
		/** filter by Series Ids */
		ids?: Array<string>;
		/** filter by Album Types */
		albumTypes?: Array<JamEnums.AlbumType>;
		/**
		 * filter by Creation timestamp
		 * @TJS-type integer
		 * @minimum 0
		 */
		since?: number;
		/** filter by Track Ids */
		trackIDs?: Array<string>;
		/** filter by Album Ids */
		albumIDs?: Array<string>;
		/** filter by Artist Ids */
		artistIDs?: Array<string>;
		/** filter by Root Ids */
		rootIDs?: Array<string>;
		/** filter by Folder Ids */
		folderIDs?: Array<string>;
		/** filter by Genre Ids */
		genreIDs?: Array<string>;
	}

	export interface SeriesOrderArgs extends DefaultOrderArgs {
	}

	export interface SessionFilterArgs {
		/**
		 * filter by session timestamp
		 * @TJS-type integer
		 * @minimum 0
		 */
		since?: number;
		/** filter by client name */
		client?: string;
		/** filter by client name */
		agent?: string;
		/**
		 * filter by since expiry date
		 * @TJS-type integer
		 * @minimum 0
		 */
		expiresFrom?: number;
		/**
		 * filter by to expiry date
		 * @TJS-type integer
		 * @minimum 0
		 */
		expiresTo?: number;
		/** filter by session mode */
		mode?: JamEnums.SessionMode;
		/** filter by User Ids */
		userIDs?: Array<string>;
	}

	export interface SessionOrderArgs extends OrderByArgs {
		/** order by field */
		orderBy?: JamEnums.SessionOrderFields;
	}

	export interface StatesArgs {
		/** IDs */
		ids: Array<string>;
	}

	export interface StatsFilter {
		/** filter stats by Root Id */
		rootID?: string;
	}

	export interface StreamArgs {
		/**
		 * maximal bitrate if transcoding (in Kbps)
		 * @TJS-type integer
		 * @minimum 10
		 * @maximum 480
		 */
		maxBitRate?: number;
		/** format of the audio */
		format?: JamEnums.AudioFormatType;
	}

	export interface TrackFilterArgs {
		/** filter by Search Query */
		query?: string;
		/** filter by Track Title */
		name?: string;
		/** filter by Track Ids */
		ids?: Array<string>;
		/** filter if track is in folder id (or its child folders) */
		childOfID?: string;
		/** filter by artist name */
		artist?: string;
		/** filter by album name */
		album?: string;
		/** filter by genres */
		genres?: Array<string>;
		/** filter by Genre Ids */
		genreIDs?: Array<string>;
		/**
		 * filter by Creation timestamp
		 * @TJS-type integer
		 * @minimum 0
		 */
		since?: number;
		/** filter by Series Ids */
		seriesIDs?: Array<string>;
		/** filter by Album Ids */
		albumIDs?: Array<string>;
		/** filter by Artist Ids */
		artistIDs?: Array<string>;
		/** filter by Album Artist Ids */
		albumArtistIDs?: Array<string>;
		/** filter by Root Ids */
		rootIDs?: Array<string>;
		/** filter by Folder Ids */
		folderIDs?: Array<string>;
		/** filter by Bookmark Ids */
		bookmarkIDs?: Array<string>;
		/**
		 * filter by since year
		 * @TJS-type integer
		 * @minimum 0
		 */
		fromYear?: number;
		/**
		 * filter by until year
		 * @TJS-type integer
		 * @minimum 0
		 */
		toYear?: number;
	}

	export interface TrackFixArgs {
		/** Track Id */
		id: string;
		/** Which issue to fix with the track */
		fixID: JamEnums.TrackHealthID;
	}

	export interface TrackMoveArgs {
		/** Track Ids */
		ids: Array<string>;
		/** ID of the destination folder */
		folderID: string;
	}

	export interface TrackOrderArgs extends OrderByArgs {
		/** order by field */
		orderBy?: JamEnums.TrackOrderFields;
	}

	export interface TrackRenameArgs {
		/** Track Id */
		id: string;
		/** New track file name */
		name: string;
	}

	export interface UserEmailUpdateArgs {
		/** Password of calling user (or admin) is required to change the email */
		password: string;
		/** New email */
		email: string;
	}

	export interface UserFilterArgs {
		/** filter by Search Query */
		query?: string;
		/** filter by User name */
		name?: string;
		/** filter by User Ids */
		ids?: Array<string>;
		/**
		 * filter by Creation timestamp
		 * @TJS-type integer
		 * @minimum 0
		 */
		since?: number;
		/** filter by User email */
		email?: string;
		/** filter by User roles */
		roles?: Array<JamEnums.UserRole>;
	}

	export interface UserGenerateImageArgs {
		/** Random Seed String */
		seed?: string;
	}

	export interface UserMutateArgs {
		/** Password of calling admin user is required to create an user. this is NOT the user password! */
		password: string;
		/** User Name */
		name: string;
		/** User Email */
		email: string;
		/**
		 * User has admin rights?
		 * @TJS-type boolean
		 * @default false
		 */
		roleAdmin: boolean;
		/**
		 * User has podcast admin rights?
		 * @TJS-type boolean
		 * @default false
		 */
		rolePodcast: boolean;
		/**
		 * User has api rights?
		 * @TJS-type boolean
		 * @default true
		 */
		roleStream: boolean;
		/**
		 * User has upload rights?
		 * @TJS-type boolean
		 * @default false
		 */
		roleUpload: boolean;
	}

	export interface UserOrderArgs extends DefaultOrderArgs {
	}

	export interface UserPasswordUpdateArgs {
		/** Password of calling user (or admin) is required to change the password */
		password: string;
		/** New Password */
		newPassword: string;
	}

	export interface WaveformArgs {
		/** format of the waveform */
		format?: JamEnums.WaveformFormatType;
		/**
		 * Width of svg
		 * @TJS-type integer
		 * @minimum 100
		 * @maximum 4000
		 */
		width?: number;
	}

	export interface WaveformSVGArgs {
		/** Object Id */
		id: string;
		/**
		 * Width of svg
		 * @TJS-type integer
		 * @minimum 100
		 * @maximum 4000
		 */
		width?: number;
	}

	export interface WikidataLookupArgs {
		/** WikiData ID */
		wikiDataID: string;
	}

	export interface WikidataSummaryArgs {
		/** WikiData ID */
		wikiDataID: string;
		/**
		 * Wikipedia Language
		 * @default en
		 */
		lang?: string;
	}

	export interface WikipediaSummaryArgs {
		/** MusicBrainz ID */
		title: string;
		/**
		 * Wikipedia Language
		 * @default en
		 */
		lang?: string;
	}

	export interface ID {
		id: string;
	}

	export interface MaybeID {
		id?: string;
	}

	export type AlbumIdArgs = IncludesArtistArgs & IncludesTrackArgs & IncludesAlbumChildrenArgs & IncludesAlbumArgs & ID;

	export type AlbumSearchArgs = ListArgs & AlbumOrderArgs & AlbumFilterArgs & IncludesArtistArgs & IncludesTrackArgs & IncludesAlbumChildrenArgs & IncludesAlbumArgs & PageArgs;

	export type AlbumTracksArgs = TrackOrderArgs & AlbumFilterArgs & IncludesTrackArgs & PageArgs;

	export type AlbumSimilarTracksArgs = IncludesTrackArgs & PageArgs & ID;

	export type ArtistIdArgs = IncludesSeriesArgs & IncludesAlbumArgs & IncludesTrackArgs & IncludesArtistChildrenArgs & IncludesArtistArgs & ID;

	export type ArtistSearchArgs = ListArgs & ArtistOrderArgs & ArtistFilterArgs & IncludesSeriesArgs & IncludesAlbumArgs & IncludesTrackArgs & IncludesArtistChildrenArgs & IncludesArtistArgs & PageArgs;

	export type ArtistSimilarArgs = IncludesArtistArgs & PageArgs & ID;

	export type ArtistSimilarTracksArgs = IncludesTrackArgs & PageArgs & ID;

	export type ArtistTracksArgs = TrackOrderArgs & ArtistFilterArgs & IncludesTrackArgs & PageArgs;

	export type ArtistAlbumsArgs = AlbumOrderArgs & ArtistFilterArgs & IncludesAlbumArgs & PageArgs;

	export type ArtistSeriesArgs = SeriesOrderArgs & SeriesFilterArgs & IncludesSeriesArgs & PageArgs;

	export type BookmarkIdArgs = IncludesEpisodeArgs & IncludesTrackArgs & IncludesBookmarkChildrenArgs & ID;

	export type BookmarkSearchArgs = BookmarkOrderArgs & BookmarkFilterArgs & IncludesEpisodeArgs & IncludesTrackArgs & IncludesBookmarkChildrenArgs & PageArgs;

	export type RootIdArgs = IncludesRootArgs & ID;

	export type RootSearchArgs = RootOrderArgs & RootFilterArgs & IncludesRootArgs & PageArgs;

	export type EpisodeIdArgs = IncludesPodcastArgs & IncludesEpisodeParentArgs & IncludesEpisodeArgs & ID;

	export type EpisodeSearchArgs = ListArgs & EpisodeOrderArgs & EpisodeFilterArgs & IncludesPodcastArgs & IncludesEpisodeParentArgs & IncludesEpisodeArgs & PageArgs;

	export type FolderIdArgs = IncludesArtworkArgs & IncludesTrackArgs & IncludesFolderChildrenArgs & IncludesFolderArgs & ID;

	export type FolderSearchArgs = ListArgs & FolderOrderArgs & FolderFilterArgs & IncludesArtworkArgs & IncludesTrackArgs & IncludesFolderChildrenArgs & IncludesFolderArgs & PageArgs;

	export type FolderTracksArgs = TrackOrderArgs & FolderFilterArgs & IncludesTrackArgs & PageArgs;

	export type FolderSubfoldersArgs = FolderOrderArgs & FolderFilterArgs & IncludesFolderArgs & PageArgs;

	export type FolderArtworksArgs = ArtworkOrderArgs & FolderFilterArgs & IncludesArtworkArgs & PageArgs;

	export type FolderArtistsSimilarArgs = IncludesFolderArgs & PageArgs & ID;

	export type FolderArtistsSimilarTracksArgs = IncludesTrackArgs & PageArgs & ID;

	export type FolderHealthArgs = IncludesFolderArgs & FolderFilterArgs;

	export type PodcastIdArgs = IncludesEpisodeArgs & IncludesPodcastChildrenArgs & IncludesPodcastArgs & ID;

	export type PodcastSearchArgs = ListArgs & PodcastOrderArgs & PodcastFilterArgs & IncludesEpisodeArgs & IncludesPodcastChildrenArgs & IncludesPodcastArgs & PageArgs;

	export type PodcastEpisodesArgs = EpisodeOrderArgs & PodcastFilterArgs & IncludesEpisodeArgs & PageArgs;

	export type PodcastPodcastsDiscoverByTagArgs = PageArgs & PodcastDiscoverByTagArgs;

	export type RadioIdArgs = IncludesRadioArgs & ID;

	export type RadioSearchArgs = RadioOrderArgs & RadioFilterArgs & IncludesRadioArgs & PageArgs;

	export type SeriesIdArgs = IncludesTrackArgs & IncludesAlbumArgs & IncludesSeriesChildrenArgs & IncludesSeriesArgs & ID;

	export type SeriesSearchArgs = ListArgs & SeriesOrderArgs & SeriesFilterArgs & IncludesTrackArgs & IncludesAlbumArgs & IncludesSeriesChildrenArgs & IncludesSeriesArgs & PageArgs;

	export type SeriesAlbumsArgs = AlbumOrderArgs & SeriesFilterArgs & IncludesAlbumArgs & PageArgs;

	export type SeriesTracksArgs = TrackOrderArgs & SeriesFilterArgs & IncludesTrackArgs & PageArgs;

	export type TrackIdArgs = IncludesTrackArgs & ID;

	export type TrackSearchArgs = ListArgs & TrackOrderArgs & TrackFilterArgs & IncludesTrackArgs & PageArgs;

	export type TrackSimilarArgs = IncludesTrackArgs & PageArgs & ID;

	export type TrackHealthArgs = IncludesTrackArgs & TrackFilterArgs & MediaHealthArgs;

	export type UserIdArgs = IncludesUserArgs & ID;

	export type UserSearchArgs = UserOrderArgs & UserFilterArgs & IncludesUserArgs & PageArgs;

	export type PlayQueueGetArgs = IncludesEpisodeArgs & IncludesTrackArgs & IncludesPlayQueueArgs;

	export type PlaylistIdArgs = IncludesEpisodeArgs & IncludesTrackArgs & IncludesPlaylistArgs & ID;

	export type PlaylistSearchArgs = ListArgs & PlaylistOrderArgs & PlaylistFilterArgs & IncludesEpisodeArgs & IncludesTrackArgs & IncludesPlaylistArgs & PageArgs;

	export type PlaylistEntriesArgs = PlaylistEntryOrderArgs & PlaylistFilterArgs & IncludesEpisodeArgs & IncludesTrackArgs & PageArgs;

	export type GenreIdArgs = IncludesGenreArgs & ID;

	export type GenreSearchArgs = GenreOrderArgs & ListArgs & GenreFilterArgs & IncludesGenreArgs & PageArgs;

	export type GenreTracksArgs = TrackOrderArgs & GenreFilterArgs & IncludesTrackArgs & PageArgs;

	export type GenreAlbumsArgs = AlbumOrderArgs & GenreFilterArgs & IncludesAlbumArgs & PageArgs;

	export type GenreArtistsArgs = ArtistOrderArgs & GenreFilterArgs & IncludesArtistArgs & PageArgs;

	export type DownloadDownloadArgs = DownloadArgs & ID;

	export type WaveformWaveformArgs = WaveformArgs & ID;

	export type StreamStreamArgs = StreamArgs & ID;

	export type ArtworkIdArgs = IncludesFolderArgs & IncludesArtworkChildrenArgs & IncludesArtworkArgs & ID;

	export type ArtworkSearchArgs = ListArgs & ArtworkOrderArgs & ArtworkFilterArgs & IncludesFolderArgs & IncludesArtworkChildrenArgs & IncludesArtworkArgs & PageArgs;

	export type NowPlayingListArgs = IncludesEpisodeArgs & IncludesTrackArgs & IncludesNowPlayingArgs;

	export type RootUpdateArgs = RootMutateArgs & ID;

	export type RadioUpdateArgs = RadioMutateArgs & ID;

	export type UserUpdateArgs = UserMutateArgs & ID;

	export type UserChangePasswordArgs = UserPasswordUpdateArgs & ID;

	export type UserChangeEmailArgs = UserEmailUpdateArgs & ID;

	export type UserGenerateUserImageArgs = UserGenerateImageArgs & ID;

	export type UserUploadUserImageArgs = ID;

	export type PlaylistUpdateArgs = PlaylistMutateArgs & ID;

	export type ArtworkCreateByUploadArgs = ArtworkNewUploadArgs;

	export type ArtworkUpdateArgs = ID;
}
