// @generated
// This file was automatically generated and should not be edited.

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: { input: any; output: any; }
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any; }
};

/** Admin Change Queue Info */
export type AdminChangeQueueInfoQL = {
  /** Changes Completed Timestamp */
  done: Scalars['Int']['output'];
  /** Error (if any) */
  error: Scalars['String']['output'];
  /** Queue ID */
  id: Scalars['ID']['output'];
  /** Waiting Position */
  position: Scalars['Int']['output'];
};

/** Admin Chat Maximum Age Settings */
export type AdminSettingsChatMaxAgeQL = {
  /** Unit of Maximum Age */
  unit: Scalars['String']['output'];
  /** Value of Maximum Age */
  value: Scalars['Int']['output'];
};

/** Admin Chat Settings */
export type AdminSettingsChatQL = {
  /** Maximum Age of Chat Messages to keep */
  maxAge: AdminSettingsChatMaxAgeQL;
  /** Maximum Number of Chat Messages to keep */
  maxMessages: Scalars['Int']['output'];
};

/** Admin External Services Settings */
export type AdminSettingsExternalQL = {
  /** Enable External Services */
  enabled: Scalars['Boolean']['output'];
};

/** Admin Index Settings */
export type AdminSettingsIndexQL = {
  /** List of ignored Articles */
  ignoreArticles: Array<Scalars['String']['output']>;
};

/** Admin Library Settings */
export type AdminSettingsLibraryQL = {
  /** Start Root Scanning on Server Start */
  scanAtStart: Scalars['Boolean']['output'];
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
  since?: InputMaybe<Scalars['Float']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  toYear?: InputMaybe<Scalars['Int']['input']>;
  trackIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type AlbumIndexGroupQL = {
  items: Array<AlbumQL>;
  name: Scalars['String']['output'];
};

export type AlbumIndexQL = {
  groups: Array<AlbumIndexGroupQL>;
};

export type AlbumOrderArgsQL = {
  orderBy?: InputMaybe<AlbumOrderFields>;
  orderDesc?: InputMaybe<Scalars['Boolean']['input']>;
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
  skip?: Maybe<Scalars['Int']['output']>;
  take?: Maybe<Scalars['Int']['output']>;
  total: Scalars['Int']['output'];
};

export type AlbumQL = {
  albumType: AlbumType;
  artist: ArtistQL;
  createdAt: Scalars['DateTime']['output'];
  duration?: Maybe<Scalars['Float']['output']>;
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
  updatedAt: Scalars['DateTime']['output'];
  year?: Maybe<Scalars['Int']['output']>;
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
  since?: InputMaybe<Scalars['Float']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  trackIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type ArtistIndexGroupQL = {
  items: Array<ArtistQL>;
  name: Scalars['String']['output'];
};

export type ArtistIndexQL = {
  groups: Array<ArtistIndexGroupQL>;
};

export type ArtistOrderArgsQL = {
  orderBy?: InputMaybe<ArtistOrderFields>;
  orderDesc?: InputMaybe<Scalars['Boolean']['input']>;
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
  skip?: Maybe<Scalars['Int']['output']>;
  take?: Maybe<Scalars['Int']['output']>;
  total: Scalars['Int']['output'];
};

export type ArtistQL = {
  albumTracks: Array<TrackQL>;
  albumTypes: Array<AlbumType>;
  albums: Array<AlbumQL>;
  albumsCount: Scalars['Int']['output'];
  albumsTracksCount: Scalars['Int']['output'];
  createdAt: Scalars['DateTime']['output'];
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
  updatedAt: Scalars['DateTime']['output'];
};

export type ArtworkFilterArgsQL = {
  childOfID?: InputMaybe<Scalars['ID']['input']>;
  folderIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
  formats?: InputMaybe<Array<Scalars['String']['input']>>;
  heightFrom?: InputMaybe<Scalars['Int']['input']>;
  heightTo?: InputMaybe<Scalars['Int']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
  since?: InputMaybe<Scalars['Float']['input']>;
  sizeFrom?: InputMaybe<Scalars['Int']['input']>;
  sizeTo?: InputMaybe<Scalars['Int']['input']>;
  types?: InputMaybe<Array<ArtworkImageType>>;
  widthFrom?: InputMaybe<Scalars['Int']['input']>;
  widthTo?: InputMaybe<Scalars['Int']['input']>;
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
  orderDesc?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ArtworkPageQL = {
  items: Array<ArtworkQL>;
  skip?: Maybe<Scalars['Int']['output']>;
  take?: Maybe<Scalars['Int']['output']>;
  total: Scalars['Int']['output'];
};

export type ArtworkQL = {
  createdAt: Scalars['DateTime']['output'];
  fileSize: Scalars['Int']['output'];
  /** Get the Navigation Index for Albums */
  folder: FolderQL;
  format?: Maybe<Scalars['String']['output']>;
  height?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  path: Scalars['String']['output'];
  statCreated: Scalars['DateTime']['output'];
  statModified: Scalars['DateTime']['output'];
  types: Array<ArtworkImageType>;
  updatedAt: Scalars['DateTime']['output'];
  width?: Maybe<Scalars['Int']['output']>;
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
  comment?: InputMaybe<Scalars['String']['input']>;
  episodeIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  query?: InputMaybe<Scalars['String']['input']>;
  since?: InputMaybe<Scalars['Float']['input']>;
  trackIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
  userIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type BookmarkOrderArgsQL = {
  orderBy?: InputMaybe<BookmarkOrderFields>;
  orderDesc?: InputMaybe<Scalars['Boolean']['input']>;
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
  skip?: Maybe<Scalars['Int']['output']>;
  take?: Maybe<Scalars['Int']['output']>;
  total: Scalars['Int']['output'];
};

export type BookmarkQL = {
  comment?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  episode?: Maybe<EpisodeQL>;
  id: Scalars['ID']['output'];
  position: Scalars['Float']['output'];
  track?: Maybe<TrackQL>;
  updatedAt: Scalars['DateTime']['output'];
};

export type ChatQL = {
  created: Scalars['DateTime']['output'];
  message: Scalars['String']['output'];
  userID: Scalars['ID']['output'];
  userName: Scalars['String']['output'];
};

export enum DefaultOrderFields {
  created = 'created',
  default = 'default',
  name = 'name',
  updated = 'updated'
}

export type EpisodeChapterQL = {
  start: Scalars['Float']['output'];
  title: Scalars['String']['output'];
};

export type EpisodeEnclosureQL = {
  length?: Maybe<Scalars['Float']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  url: Scalars['String']['output'];
};

export type EpisodeFilterArgsQL = {
  authors?: InputMaybe<Array<Scalars['String']['input']>>;
  guids?: InputMaybe<Array<Scalars['String']['input']>>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
  podcastIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
  query?: InputMaybe<Scalars['String']['input']>;
  since?: InputMaybe<Scalars['Float']['input']>;
  statuses?: InputMaybe<Array<PodcastStatus>>;
};

export type EpisodeOrderArgsQL = {
  orderBy?: InputMaybe<EpisodeOrderFields>;
  orderDesc?: InputMaybe<Scalars['Boolean']['input']>;
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
  skip?: Maybe<Scalars['Int']['output']>;
  take?: Maybe<Scalars['Int']['output']>;
  total: Scalars['Int']['output'];
};

export type EpisodeQL = {
  author?: Maybe<Scalars['String']['output']>;
  bookmarks: Array<BookmarkQL>;
  bookmarksCount: Scalars['Int']['output'];
  chapters?: Maybe<Array<EpisodeChapterQL>>;
  createdAt: Scalars['DateTime']['output'];
  date: Scalars['DateTime']['output'];
  duration?: Maybe<Scalars['Float']['output']>;
  enclosures?: Maybe<Array<EpisodeEnclosureQL>>;
  error?: Maybe<Scalars['String']['output']>;
  fileCreated?: Maybe<Scalars['DateTime']['output']>;
  fileModified?: Maybe<Scalars['DateTime']['output']>;
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
  updatedAt: Scalars['DateTime']['output'];
  waveform: WaveformQL;
};

export type ExtendedInfoQL = {
  description: Scalars['String']['output'];
  license: Scalars['String']['output'];
  licenseUrl: Scalars['String']['output'];
  source: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type ExtendedInfoResultQL = {
  info?: Maybe<ExtendedInfoQL>;
};

export type FolderFilterArgsQL = {
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
  since?: InputMaybe<Scalars['Float']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  toYear?: InputMaybe<Scalars['Int']['input']>;
  trackIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type FolderIndexGroupQL = {
  items: Array<FolderQL>;
  name: Scalars['String']['output'];
};

export type FolderIndexQL = {
  groups: Array<FolderIndexGroupQL>;
};

export type FolderOrderArgsQL = {
  orderBy?: InputMaybe<FolderOrderFields>;
  orderDesc?: InputMaybe<Scalars['Boolean']['input']>;
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
  skip?: Maybe<Scalars['Int']['output']>;
  take?: Maybe<Scalars['Int']['output']>;
  total: Scalars['Int']['output'];
};

export type FolderQL = {
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
  createdAt: Scalars['DateTime']['output'];
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
  statCreated: Scalars['DateTime']['output'];
  statModified: Scalars['DateTime']['output'];
  state: StateQL;
  title: Scalars['String']['output'];
  tracks?: Maybe<Array<TrackQL>>;
  tracksCount: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
  year?: Maybe<Scalars['Int']['output']>;
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
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
  since?: InputMaybe<Scalars['Float']['input']>;
  trackIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type GenreIndexGroupQL = {
  items: Array<GenreQL>;
  name: Scalars['String']['output'];
};

export type GenreIndexQL = {
  groups: Array<GenreIndexGroupQL>;
};

export type GenreOrderArgsQL = {
  orderBy?: InputMaybe<GenreOrderFields>;
  orderDesc?: InputMaybe<Scalars['Boolean']['input']>;
};

export enum GenreOrderFields {
  created = 'created',
  default = 'default',
  name = 'name',
  updated = 'updated'
}

export type GenrePageQL = {
  items: Array<GenreQL>;
  skip?: Maybe<Scalars['Int']['output']>;
  take?: Maybe<Scalars['Int']['output']>;
  total: Scalars['Int']['output'];
};

export type GenreQL = {
  albumCount: Scalars['Int']['output'];
  albums: AlbumPageQL;
  artistCount: Scalars['Int']['output'];
  artists: ArtistPageQL;
  createdAt: Scalars['DateTime']['output'];
  folderCount: Scalars['Int']['output'];
  folders: Array<FolderQL>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  series: Array<SeriesQL>;
  trackCount: Scalars['Int']['output'];
  tracks: TrackPageQL;
  updatedAt: Scalars['DateTime']['output'];
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
  frames: Scalars['JSON']['output'];
  version: Scalars['String']['output'];
};

export type Mutation = {
  fav: StateQL;
  rate: StateQL;
  scrobble: NowPlayingQL;
};


export type MutationfavArgs = {
  id: Scalars['ID']['input'];
  remove?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationrateArgs = {
  id: Scalars['ID']['input'];
  rating: Scalars['Int']['input'];
};


export type MutationscrobbleArgs = {
  id: Scalars['ID']['input'];
};

export type NowPlayingQL = {
  episode?: Maybe<EpisodeQL>;
  time: Scalars['Float']['output'];
  track?: Maybe<TrackQL>;
  userID: Scalars['ID']['output'];
  userName: Scalars['String']['output'];
};

export type PageArgsQL = {
  /** return items starting from offset position */
  skip?: InputMaybe<Scalars['Int']['input']>;
  /** amount of returned items */
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type PlayQueueEntryQL = {
  createdAt: Scalars['DateTime']['output'];
  episode?: Maybe<EpisodeQL>;
  id: Scalars['ID']['output'];
  playQueue: PlayQueueQL;
  position: Scalars['Int']['output'];
  track?: Maybe<TrackQL>;
  updatedAt: Scalars['DateTime']['output'];
};

export type PlayQueueQL = {
  changedBy: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  current?: Maybe<Scalars['Int']['output']>;
  duration?: Maybe<Scalars['Float']['output']>;
  entries: Array<PlayQueueEntryQL>;
  entriesCount: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  position?: Maybe<Scalars['Float']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type PlaylistEntryQL = {
  createdAt: Scalars['DateTime']['output'];
  episode?: Maybe<EpisodeQL>;
  id: Scalars['ID']['output'];
  playlist: PlaylistQL;
  position: Scalars['Float']['output'];
  track?: Maybe<TrackQL>;
  updatedAt: Scalars['DateTime']['output'];
};

export type PlaylistFilterArgsQL = {
  comment?: InputMaybe<Scalars['String']['input']>;
  durationFrom?: InputMaybe<Scalars['Float']['input']>;
  durationTo?: InputMaybe<Scalars['Float']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  isPublic?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
  since?: InputMaybe<Scalars['Float']['input']>;
  userIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type PlaylistIndexGroupQL = {
  items: Array<PlaylistQL>;
  name: Scalars['String']['output'];
};

export type PlaylistIndexQL = {
  groups: Array<PlaylistIndexGroupQL>;
};

export type PlaylistOrderArgsQL = {
  orderBy?: InputMaybe<DefaultOrderFields>;
  orderDesc?: InputMaybe<Scalars['Boolean']['input']>;
};

export type PlaylistPageQL = {
  items: Array<PlaylistQL>;
  skip?: Maybe<Scalars['Int']['output']>;
  take?: Maybe<Scalars['Int']['output']>;
  total: Scalars['Int']['output'];
};

export type PlaylistQL = {
  comment?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  duration: Scalars['Float']['output'];
  entries: Array<PlaylistEntryQL>;
  entriesCount: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  isPublic: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  state: StateQL;
  updatedAt: Scalars['DateTime']['output'];
  userID: Scalars['ID']['output'];
  userName: Scalars['String']['output'];
};

export type PodcastDiscoverPageQL = {
  items: Array<PodcastDiscoverQL>;
  skip?: Maybe<Scalars['Int']['output']>;
  take?: Maybe<Scalars['Int']['output']>;
  total: Scalars['Int']['output'];
};

export type PodcastDiscoverQL = {
  author: Scalars['String']['output'];
  description: Scalars['String']['output'];
  logo_url: Scalars['String']['output'];
  mygpo_link: Scalars['String']['output'];
  scaled_logo_url: Scalars['String']['output'];
  subscribers: Scalars['Float']['output'];
  subscribers_last_week: Scalars['Float']['output'];
  title: Scalars['String']['output'];
  url: Scalars['String']['output'];
  website: Scalars['String']['output'];
};

export type PodcastDiscoverTagPageQL = {
  items: Array<PodcastDiscoverTagQL>;
  skip?: Maybe<Scalars['Int']['output']>;
  take?: Maybe<Scalars['Int']['output']>;
  total: Scalars['Int']['output'];
};

export type PodcastDiscoverTagQL = {
  tag: Scalars['String']['output'];
  title: Scalars['String']['output'];
  usage: Scalars['Float']['output'];
};

export type PodcastFilterArgsQL = {
  author?: InputMaybe<Scalars['String']['input']>;
  categories?: InputMaybe<Array<Scalars['String']['input']>>;
  description?: InputMaybe<Scalars['String']['input']>;
  episodeIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
  generator?: InputMaybe<Scalars['String']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  lastCheckFrom?: InputMaybe<Scalars['Float']['input']>;
  lastCheckTo?: InputMaybe<Scalars['Float']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
  since?: InputMaybe<Scalars['Float']['input']>;
  statuses?: InputMaybe<Array<PodcastStatus>>;
  title?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type PodcastIndexGroupQL = {
  items: Array<PodcastQL>;
  name: Scalars['String']['output'];
};

export type PodcastIndexQL = {
  groups: Array<PodcastIndexGroupQL>;
};

export type PodcastOrderArgsQL = {
  orderBy?: InputMaybe<PodcastOrderFields>;
  orderDesc?: InputMaybe<Scalars['Boolean']['input']>;
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
  skip?: Maybe<Scalars['Int']['output']>;
  take?: Maybe<Scalars['Int']['output']>;
  total: Scalars['Int']['output'];
};

export type PodcastQL = {
  author?: Maybe<Scalars['String']['output']>;
  categories: Array<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  episodes: Array<EpisodeQL>;
  episodesCount: Scalars['Int']['output'];
  errorMessage?: Maybe<Scalars['String']['output']>;
  generator?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  image?: Maybe<Scalars['String']['output']>;
  language?: Maybe<Scalars['String']['output']>;
  lastCheck: Scalars['DateTime']['output'];
  link?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  state: StateQL;
  status: PodcastStatus;
  title?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  url: Scalars['String']['output'];
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
  version: Scalars['String']['output'];
  waveform: WaveformQL;
};


export type QueryadminQueueArgs = {
  id: Scalars['ID']['input'];
};


export type QueryalbumArgs = {
  id: Scalars['ID']['input'];
};


export type QueryalbumIndexArgs = {
  filter?: InputMaybe<AlbumFilterArgsQL>;
};


export type QueryalbumInfoArgs = {
  id: Scalars['ID']['input'];
};


export type QueryalbumsArgs = {
  filter?: InputMaybe<AlbumFilterArgsQL>;
  list?: InputMaybe<ListType>;
  order?: InputMaybe<Array<AlbumOrderArgsQL>>;
  page?: InputMaybe<PageArgsQL>;
  seed?: InputMaybe<Scalars['String']['input']>;
};


export type QueryartistArgs = {
  id: Scalars['ID']['input'];
};


export type QueryartistIndexArgs = {
  filter?: InputMaybe<ArtistFilterArgsQL>;
};


export type QueryartistInfoArgs = {
  id: Scalars['ID']['input'];
};


export type QueryartistsArgs = {
  filter?: InputMaybe<ArtistFilterArgsQL>;
  list?: InputMaybe<ListType>;
  order?: InputMaybe<Array<ArtistOrderArgsQL>>;
  page?: InputMaybe<PageArgsQL>;
  seed?: InputMaybe<Scalars['String']['input']>;
};


export type QueryartworkArgs = {
  id: Scalars['ID']['input'];
};


export type QueryartworksArgs = {
  filter?: InputMaybe<ArtworkFilterArgsQL>;
  list?: InputMaybe<ListType>;
  order?: InputMaybe<Array<ArtworkOrderArgsQL>>;
  page?: InputMaybe<PageArgsQL>;
  seed?: InputMaybe<Scalars['String']['input']>;
};


export type QuerybookmarkArgs = {
  id: Scalars['ID']['input'];
};


export type QuerybookmarksArgs = {
  filter?: InputMaybe<BookmarkFilterArgsQL>;
  order?: InputMaybe<Array<BookmarkOrderArgsQL>>;
  page?: InputMaybe<PageArgsQL>;
};


export type QuerychatsArgs = {
  since?: InputMaybe<Scalars['Float']['input']>;
};


export type QueryepisodeArgs = {
  id: Scalars['ID']['input'];
};


export type QueryepisodesArgs = {
  filter?: InputMaybe<EpisodeFilterArgsQL>;
  list?: InputMaybe<ListType>;
  order?: InputMaybe<Array<EpisodeOrderArgsQL>>;
  page?: InputMaybe<PageArgsQL>;
  seed?: InputMaybe<Scalars['String']['input']>;
};


export type QueryfolderArgs = {
  id: Scalars['ID']['input'];
};


export type QueryfolderIndexArgs = {
  filter?: InputMaybe<FolderFilterArgsQL>;
};


export type QueryfolderInfoArgs = {
  id: Scalars['ID']['input'];
};


export type QueryfoldersArgs = {
  filter?: InputMaybe<FolderFilterArgsQL>;
  list?: InputMaybe<ListType>;
  order?: InputMaybe<Array<FolderOrderArgsQL>>;
  page?: InputMaybe<PageArgsQL>;
  seed?: InputMaybe<Scalars['String']['input']>;
};


export type QuerygenreArgs = {
  id: Scalars['ID']['input'];
};


export type QuerygenreIndexArgs = {
  filter?: InputMaybe<GenreFilterArgsQL>;
};


export type QuerygenresArgs = {
  filter?: InputMaybe<GenreFilterArgsQL>;
  list?: InputMaybe<ListType>;
  order?: InputMaybe<Array<GenreOrderArgsQL>>;
  page?: InputMaybe<PageArgsQL>;
  seed?: InputMaybe<Scalars['String']['input']>;
};


export type QueryplaylistArgs = {
  id: Scalars['ID']['input'];
};


export type QueryplaylistIndexArgs = {
  filter?: InputMaybe<PlaylistFilterArgsQL>;
};


export type QueryplaylistsArgs = {
  filter?: InputMaybe<PlaylistFilterArgsQL>;
  list?: InputMaybe<ListType>;
  order?: InputMaybe<Array<PlaylistOrderArgsQL>>;
  page?: InputMaybe<PageArgsQL>;
  seed?: InputMaybe<Scalars['String']['input']>;
};


export type QuerypodcastArgs = {
  id: Scalars['ID']['input'];
};


export type QuerypodcastIndexArgs = {
  filter?: InputMaybe<PodcastFilterArgsQL>;
};


export type QuerypodcastsArgs = {
  filter?: InputMaybe<PodcastFilterArgsQL>;
  list?: InputMaybe<ListType>;
  order?: InputMaybe<Array<PodcastOrderArgsQL>>;
  page?: InputMaybe<PageArgsQL>;
  seed?: InputMaybe<Scalars['String']['input']>;
};


export type QuerypodcastsDiscoverArgs = {
  query: Scalars['String']['input'];
};


export type QuerypodcastsDiscoverByTagArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  tag: Scalars['String']['input'];
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerypodcastsDiscoverTagsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerypodcastsDiscoverTopArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryradioArgs = {
  id: Scalars['ID']['input'];
};


export type QueryradioIndexArgs = {
  filter?: InputMaybe<RadioFilterArgsQL>;
};


export type QueryradiosArgs = {
  filter?: InputMaybe<RadioFilterArgsQL>;
  list?: InputMaybe<ListType>;
  order?: InputMaybe<Array<RadioOrderArgsQL>>;
  page?: InputMaybe<PageArgsQL>;
  seed?: InputMaybe<Scalars['String']['input']>;
};


export type QueryrootArgs = {
  id: Scalars['ID']['input'];
};


export type QueryrootsArgs = {
  filter?: InputMaybe<RootFilterArgsQL>;
  list?: InputMaybe<ListType>;
  order?: InputMaybe<Array<RootOrderArgsQL>>;
  page?: InputMaybe<PageArgsQL>;
  seed?: InputMaybe<Scalars['String']['input']>;
};


export type QueryseriesArgs = {
  id: Scalars['ID']['input'];
};


export type QueryseriesIndexArgs = {
  filter?: InputMaybe<SeriesFilterArgsQL>;
};


export type QueryseriesInfoArgs = {
  id: Scalars['ID']['input'];
};


export type QueryseriesesArgs = {
  filter?: InputMaybe<SeriesFilterArgsQL>;
  list?: InputMaybe<ListType>;
  order?: InputMaybe<Array<SeriesOrderArgsQL>>;
  page?: InputMaybe<PageArgsQL>;
  seed?: InputMaybe<Scalars['String']['input']>;
};


export type QuerysessionsArgs = {
  filter?: InputMaybe<SessionFilterArgsQL>;
  order?: InputMaybe<Array<SessionOrderArgsQL>>;
  page?: InputMaybe<PageArgsQL>;
};


export type QuerystateArgs = {
  id: Scalars['ID']['input'];
};


export type QuerystatsArgs = {
  rootID?: InputMaybe<Scalars['ID']['input']>;
};


export type QuerytrackArgs = {
  id: Scalars['ID']['input'];
};


export type QuerytracksArgs = {
  filter?: InputMaybe<TrackFilterArgsQL>;
  list?: InputMaybe<ListType>;
  order?: InputMaybe<Array<TrackOrderArgsQL>>;
  page?: InputMaybe<PageArgsQL>;
  seed?: InputMaybe<Scalars['String']['input']>;
};


export type QueryuserArgs = {
  id: Scalars['ID']['input'];
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
  id: Scalars['ID']['input'];
};

export type RadioFilterArgsQL = {
  disabled?: InputMaybe<Scalars['Boolean']['input']>;
  homepage?: InputMaybe<Scalars['String']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
  since?: InputMaybe<Scalars['Int']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type RadioIndexGroupQL = {
  items: Array<RadioQL>;
  name: Scalars['String']['output'];
};

export type RadioIndexQL = {
  groups: Array<RadioIndexGroupQL>;
};

export type RadioOrderArgsQL = {
  orderBy?: InputMaybe<DefaultOrderFields>;
  orderDesc?: InputMaybe<Scalars['Boolean']['input']>;
};

export type RadioPageQL = {
  items: Array<RadioQL>;
  skip?: Maybe<Scalars['Int']['output']>;
  take?: Maybe<Scalars['Int']['output']>;
  total: Scalars['Int']['output'];
};

export type RadioQL = {
  createdAt: Scalars['DateTime']['output'];
  disabled: Scalars['Boolean']['output'];
  homepage?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  state: StateQL;
  updatedAt: Scalars['DateTime']['output'];
  url: Scalars['String']['output'];
};

export type RootFilterArgsQL = {
  albumIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
  artistIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
  folderIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
  seriesIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
  since?: InputMaybe<Scalars['Float']['input']>;
  strategies: Array<RootScanStrategy>;
  trackIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type RootOrderArgsQL = {
  orderBy?: InputMaybe<DefaultOrderFields>;
  orderDesc?: InputMaybe<Scalars['Boolean']['input']>;
};

export type RootPageQL = {
  items: Array<RootQL>;
  skip?: Maybe<Scalars['Int']['output']>;
  take?: Maybe<Scalars['Int']['output']>;
  total: Scalars['Int']['output'];
};

export type RootQL = {
  albums: Array<AlbumQL>;
  artists: Array<ArtistQL>;
  createdAt: Scalars['DateTime']['output'];
  folders: Array<FolderQL>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  path: Scalars['String']['output'];
  series: Array<SeriesQL>;
  status: RootStatusQL;
  strategy: RootScanStrategy;
  tracks: Array<TrackQL>;
  updatedAt: Scalars['DateTime']['output'];
};

export enum RootScanStrategy {
  artistalbum = 'artistalbum',
  audiobook = 'audiobook',
  auto = 'auto',
  compilation = 'compilation'
}

export type RootStatusQL = {
  error?: Maybe<Scalars['String']['output']>;
  lastScan?: Maybe<Scalars['DateTime']['output']>;
  scanning?: Maybe<Scalars['Boolean']['output']>;
};

export type SeriesFilterArgsQL = {
  albumIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
  albumTypes?: InputMaybe<Array<AlbumType>>;
  artistIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
  folderIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
  genreIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
  rootIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
  since?: InputMaybe<Scalars['Float']['input']>;
  trackIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type SeriesIndexGroupQL = {
  items: Array<SeriesQL>;
  name: Scalars['String']['output'];
};

export type SeriesIndexQL = {
  groups: Array<SeriesIndexGroupQL>;
};

export type SeriesOrderArgsQL = {
  orderBy?: InputMaybe<DefaultOrderFields>;
  orderDesc?: InputMaybe<Scalars['Boolean']['input']>;
};

export type SeriesPageQL = {
  items: Array<SeriesQL>;
  skip?: Maybe<Scalars['Int']['output']>;
  take?: Maybe<Scalars['Int']['output']>;
  total: Scalars['Int']['output'];
};

export type SeriesQL = {
  albumTypes: Array<AlbumType>;
  albums: Array<AlbumQL>;
  albumsCount: Scalars['Int']['output'];
  artist?: Maybe<ArtistQL>;
  createdAt: Scalars['DateTime']['output'];
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
  updatedAt: Scalars['DateTime']['output'];
};

export type SessionFilterArgsQL = {
  agent?: InputMaybe<Scalars['String']['input']>;
  client?: InputMaybe<Scalars['String']['input']>;
  expiresFrom?: InputMaybe<Scalars['Float']['input']>;
  expiresTo?: InputMaybe<Scalars['Float']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  mode?: InputMaybe<SessionMode>;
  since?: InputMaybe<Scalars['Float']['input']>;
  userIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export enum SessionMode {
  browser = 'browser',
  jwt = 'jwt'
}

export type SessionOrderArgsQL = {
  orderBy?: InputMaybe<SessionOrderFields>;
  orderDesc?: InputMaybe<Scalars['Boolean']['input']>;
};

export enum SessionOrderFields {
  default = 'default',
  expires = 'expires'
}

export type SessionPageQL = {
  items: Array<SessionQL>;
  skip?: Maybe<Scalars['Int']['output']>;
  take?: Maybe<Scalars['Int']['output']>;
  total: Scalars['Int']['output'];
};

export type SessionQL = {
  agent: Scalars['String']['output'];
  client: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  expires: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  mode: SessionMode;
  updatedAt: Scalars['DateTime']['output'];
};

export type StateQL = {
  createdAt: Scalars['DateTime']['output'];
  faved?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  lastPlayed?: Maybe<Scalars['DateTime']['output']>;
  played?: Maybe<Scalars['Int']['output']>;
  rated?: Maybe<Scalars['Int']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type StatsAlbumTypesQL = {
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
};

export type StatsQL = {
  album: Scalars['Int']['output'];
  albumTypes: StatsAlbumTypesQL;
  artist: Scalars['Int']['output'];
  artistTypes: StatsAlbumTypesQL;
  folder: Scalars['Int']['output'];
  rootID?: Maybe<Scalars['ID']['output']>;
  series: Scalars['Int']['output'];
  track: Scalars['Int']['output'];
};

export type TagChapterQL = {
  end: Scalars['Float']['output'];
  start: Scalars['Float']['output'];
  title: Scalars['String']['output'];
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
  album?: Maybe<Scalars['String']['output']>;
  albumArtist?: Maybe<Scalars['String']['output']>;
  albumArtistSort?: Maybe<Scalars['String']['output']>;
  albumSort?: Maybe<Scalars['String']['output']>;
  artist?: Maybe<Scalars['String']['output']>;
  artistSort?: Maybe<Scalars['String']['output']>;
  chapters?: Maybe<Array<TagChapterQL>>;
  createdAt: Scalars['DateTime']['output'];
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
  mediaBitRate?: Maybe<Scalars['Float']['output']>;
  mediaChannels?: Maybe<Scalars['Int']['output']>;
  mediaDuration?: Maybe<Scalars['Float']['output']>;
  mediaEncoded?: Maybe<Scalars['String']['output']>;
  mediaFormat?: Maybe<AudioFormatType>;
  mediaMode?: Maybe<Scalars['String']['output']>;
  mediaSampleRate?: Maybe<Scalars['Float']['output']>;
  mediaVersion?: Maybe<Scalars['String']['output']>;
  nrTagImages?: Maybe<Scalars['Int']['output']>;
  series?: Maybe<Scalars['String']['output']>;
  seriesNr?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  titleSort?: Maybe<Scalars['String']['output']>;
  trackNr?: Maybe<Scalars['Int']['output']>;
  trackTotal?: Maybe<Scalars['Int']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  year?: Maybe<Scalars['Int']['output']>;
};

export type TrackFilterArgsQL = {
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
  since?: InputMaybe<Scalars['Float']['input']>;
  toYear?: InputMaybe<Scalars['Int']['input']>;
};

export type TrackLyricsQL = {
  lyrics?: Maybe<Scalars['String']['output']>;
  source?: Maybe<Scalars['String']['output']>;
};

export type TrackOrderArgsQL = {
  orderBy?: InputMaybe<TrackOrderFields>;
  orderDesc?: InputMaybe<Scalars['Boolean']['input']>;
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
  skip?: Maybe<Scalars['Int']['output']>;
  take?: Maybe<Scalars['Int']['output']>;
  total: Scalars['Int']['output'];
};

export type TrackQL = {
  album?: Maybe<AlbumQL>;
  albumArtist?: Maybe<ArtistQL>;
  artist?: Maybe<ArtistQL>;
  bookmarks: Array<BookmarkQL>;
  bookmarksCount: Scalars['Int']['output'];
  createdAt: Scalars['DateTime']['output'];
  fileCreated: Scalars['DateTime']['output'];
  fileModified: Scalars['DateTime']['output'];
  fileName: Scalars['String']['output'];
  fileSize: Scalars['Float']['output'];
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
  updatedAt: Scalars['DateTime']['output'];
  waveform: WaveformQL;
};

export type UserDetailStatsQL = {
  album: Scalars['Int']['output'];
  albumTypes: StatsAlbumTypesQL;
  artist: Scalars['Int']['output'];
  artistTypes: StatsAlbumTypesQL;
  folder: Scalars['Int']['output'];
  series: Scalars['Int']['output'];
  track: Scalars['Int']['output'];
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
  email?: InputMaybe<Scalars['String']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
  roles?: InputMaybe<Array<UserRole>>;
  since?: InputMaybe<Scalars['Float']['input']>;
};

export type UserIndexGroupQL = {
  items: Array<UserQL>;
  name: Scalars['String']['output'];
};

export type UserIndexQL = {
  groups: Array<UserIndexGroupQL>;
};

export type UserOrderArgsQL = {
  orderBy?: InputMaybe<DefaultOrderFields>;
  orderDesc?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UserPageQL = {
  items: Array<UserQL>;
  skip?: Maybe<Scalars['Int']['output']>;
  take?: Maybe<Scalars['Int']['output']>;
  total: Scalars['Int']['output'];
};

export type UserQL = {
  bookmarks: BookmarkPageQL;
  createdAt: Scalars['DateTime']['output'];
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
  updatedAt: Scalars['DateTime']['output'];
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
  bookmark: Scalars['Int']['output'];
  favorite: UserDetailStatsQL;
  played: UserDetailStatsQL;
  playlist: Scalars['Int']['output'];
};

export type WaveformQL = {
  json?: Maybe<Scalars['String']['output']>;
  svg?: Maybe<Scalars['String']['output']>;
};


export type WaveformQLsvgArgs = {
  width: Scalars['Int']['input'];
};
