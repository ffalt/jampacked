import {SectionListData} from 'react-native';
import FastImage from 'react-native-fast-image';
import {BehaviorSubject, Observable} from 'rxjs';
import {Database} from './db';
import {AlbumType, Jam, JamObjectType, JamService} from './jam';
import {formatDuration} from '../utils/duration.utils';
import {JamConfigurationService} from './jam-configuration';
import {getTypeByAlbumType} from './jam-lists';
import {HomeRoute} from '../navigators/Routing';
import {Caching} from './caching';
import {snackSuccess} from './snack';

export interface Navig {
	route: string;
	params?: {
		id?: string;
		name?: string;
		albumTypeID?: string;
	};
}

export interface HomeEntry {
	obj: Jam.Base;
	route: string;
}

export interface HomeData {
	artistsRecent?: Array<HomeEntry>;
	artistsFaved?: Array<HomeEntry>;
	albumsFaved?: Array<HomeEntry>;
	albumsRecent?: Array<HomeEntry>;
}

export interface Doc<T> {
	key: string;
	version: number;
	date: number;
	data: T;
}

export interface BaseEntry {
	id: string;
	title: string;
	desc: string;
	objType: string;
}

export interface IndexEntry extends BaseEntry {
	letter: string;
}

export interface TrackEntry {
	id: string;
	duration: string;
	durationMS: number;
	trackNr: string;
	title: string;
	artist: string;
	album: string;
	seriesID?: string;
	albumID?: string;
	artistID?: string;
	genre?: string;
}

export interface ArtistData {
	artist: Jam.Artist;
	albums: Array<SectionListData<BaseEntry>>;
}

export interface AlbumData {
	album: Jam.Album;
	tracks: Array<TrackEntry>;
}

export interface FolderData {
	folder: Jam.Folder;
	tracks: Array<TrackEntry>;
}

export interface SeriesData {
	series: Jam.Series,
	albums: Array<SectionListData<BaseEntry>>;
}

export interface AutoCompleteEntryData extends Jam.AutoCompleteEntry {
	route: string;
}

export type Index = Array<IndexEntry>;
export type HomeStatData = { text: string, link: Navig, value: number };
export type HomeStatsData = Array<HomeStatData>;
export type AutoCompleteData = Array<SectionListData<AutoCompleteEntryData>>;

class DataService {
	db?: Database;
	version = 9;
	lastLyrics?: { id: string, data: Jam.TrackLyrics };
	lastWaveform?: { id: string, data: Jam.WaveFormData };
	dataCaching = new Caching(
		(caller) => this.fillCache(caller),
		(caller) => this.clearCache(caller)
	);
	private homeDataCaching = new BehaviorSubject<HomeData | undefined>(undefined);
	homeData: Observable<HomeData | undefined> = this.homeDataCaching.asObservable();

	constructor(public jam: JamService) {
		this.open();
	}

	// db

	async open(): Promise<void> {
		this.db = await Database.getInstance();
		await this.check();
	}

	async check(): Promise<void> {
		if (!this.db) {
			return;
		}
		const createTableScript = 'CREATE TABLE if not exists jam(_id INTEGER PRIMARY KEY AUTOINCREMENT, key TEXT, data TEXT, date integer, version integer)';
		await this.db.query(createTableScript);
	}

	async close(): Promise<void> {
		if (this.db) {
			await this.db.disconnect();
		}
		this.db = undefined;
	}

	private async getDoc<T>(id: string): Promise<Doc<T> | undefined> {
		if (!this.db) {
			return;
		}
		try {
			const results = await this.db.query('SELECT * FROM jam WHERE key=?', [id]);
			const result = results.rows.item(0);
			if (result && result.version === this.version) {
				return {
					key: result.key,
					version: result.version,
					date: result.date,
					data: JSON.parse(result.data)
				};
			}
		} catch (e) {
			console.error(e);
		}
	}

	async get<T>(forceRefresh: boolean, id: string, build: () => Promise<T>): Promise<T> {
		if (!forceRefresh) {
			const doc = await this.getDoc<T>(id);
			if (doc) {
				return doc.data;
			}
		}
		const result = await build();
		if (!this.db) {
			return result;
		}
		await this.db.delete('jam', {key: id});
		await this.db.insert('jam', ['data', 'key', 'date', 'version'], [JSON.stringify(result), id, Date.now(), this.version]);
		return result;
	}

	// auth

	get currentUserName(): string {
		return (this.jam.auth?.user?.name || '');
	}

	get currentUserID(): string {
		return (this.jam.auth?.user?.id || '');
	}

	get currentUserToken(): string | undefined {
		return this.jam.auth?.auth?.token;
	}

	// data

	private buildTrackEntry(track: Jam.Track): TrackEntry {
		return {
			// entry: track,
			id: track.id,
			title: track.tag?.title || track.name,
			artist: track.tag?.artist || '?',
			genre: track.tag?.genre,
			album: track.tag?.album || '?',
			albumID: track.albumID,
			artistID: track.albumID,
			seriesID: track.seriesID,
			trackNr: (track.tag?.disc ? `${track.tag?.disc}-` : '') + (track.tag?.trackNr || ''),
			durationMS: track.duration,
			duration: formatDuration(track.duration)
		};
	}

	async refreshHomeData(): Promise<void> {
		const result: HomeData = {};
		const pack = (objs: Array<Jam.Base>, route: string): Array<HomeEntry> => objs.map(obj => ({obj, route}));
		result.artistsFaved = pack((await this.jam.artist.list({list: 'faved', amount: 5})).items, HomeRoute.ARTIST);
		result.albumsFaved = pack((await this.jam.album.list({list: 'faved', amount: 5})).items, HomeRoute.ALBUM);
		result.artistsRecent = pack((await this.jam.artist.list({list: 'recent', amount: 5})).items, HomeRoute.ARTIST);
		result.albumsRecent = pack((await this.jam.album.list({list: 'recent', amount: 5})).items, HomeRoute.ALBUM);
		this.homeDataCaching.next(result);
	}

	async albumIndex(albumType: Jam.AlbumType, forceRefresh: boolean = false): Promise<Index> {
		return this.get<Index>(forceRefresh, `${this.jam.auth.auth?.server}/albumIndex/${albumType}`, async () => {
			const data = await this.jam.album.index({albumType});
			const result: Index = [];
			data.groups.forEach(group => {
				group.entries.forEach(entry => {
					result.push({
						id: entry.id,
						objType: JamObjectType.album,
						desc: entry.artist,
						title: entry.name,
						letter: group.name
					});
				});
			});
			return result;
		});
	}

	async artistIndex(albumType: Jam.AlbumType, forceRefresh: boolean = false): Promise<Index> {
		return this.get<Index>(forceRefresh, `${this.jam.auth.auth?.server}/artistIndex/${albumType}`, async () => {
			const data = await this.jam.artist.index({albumType});
			const result: Index = [];
			data.groups.forEach(group => {
				group.entries.forEach(entry => {
					result.push({
						id: entry.artistID,
						desc: `Albums: ${entry.albumCount}`,
						objType: JamObjectType.artist,
						title: entry.name,
						letter: group.name
					});
				});
			});
			return result;
		});
	}

	async folderIndex(forceRefresh: boolean = false): Promise<Index> {
		return this.get<Index>(forceRefresh, `${this.jam.auth.auth?.server}/folderIndex`, async () => {
			const data = await this.jam.folder.index({level: 1});
			const result: Index = [];
			data.groups.forEach(group => {
				group.entries.forEach(entry => {
					result.push({
						id: entry.folderID,
						objType: JamObjectType.folder,
						desc: `Tracks: ${entry.trackCount}`,
						title: entry.name,
						letter: group.name
					});
				});
			});
			return result;
		});
	}

	async seriesIndex(forceRefresh: boolean = false): Promise<Index> {
		return this.get<Index>(forceRefresh, `${this.jam.auth.auth?.server}/seriesIndex`, async () => {
			const data = await this.jam.series.index({});
			const result: Index = [];
			data.groups.forEach(group => {
				group.entries.forEach(entry => {
					result.push({
						id: entry.seriesID,
						desc: `Episodes: ${entry.albumCount}`,
						objType: JamObjectType.series,
						title: entry.name,
						letter: group.name
					});
				});
			});
			return result;
		});
	}

	async stats(forceRefresh: boolean = false): Promise<HomeStatsData> {
		return this.get<HomeStatsData>(forceRefresh, `${this.jam.auth.auth?.server}/stats`, async () => {
			const stat = await this.jam.various.stats({});
			const result: HomeStatsData = [
				{
					text: 'Artists',
					link: {route: HomeRoute.ARTISTS},
					value: stat.artistTypes.album
				},
				...[
					{type: getTypeByAlbumType(AlbumType.album), value: stat.albumTypes.album},
					{type: getTypeByAlbumType(AlbumType.compilation), value: stat.albumTypes.compilation}
				].map(t => ({
					text: t.type?.text || '',
					link: {route: HomeRoute.ALBUMS, params: {albumTypeID: t.type?.id || ''}},
					value: t.value
				})),
				{
					text: 'Series',
					link: {route: HomeRoute.SERIES},
					value: stat.series
				},
				...[
					{type: getTypeByAlbumType(AlbumType.audiobook), value: stat.albumTypes.audiobook},
					{type: getTypeByAlbumType(AlbumType.soundtrack), value: stat.albumTypes.soundtrack},
					{type: getTypeByAlbumType(AlbumType.live), value: stat.albumTypes.live},
					{type: getTypeByAlbumType(AlbumType.bootleg), value: stat.albumTypes.bootleg},
					{type: getTypeByAlbumType(AlbumType.ep), value: stat.albumTypes.ep},
					{type: getTypeByAlbumType(AlbumType.single), value: stat.albumTypes.single}
				].map(t => ({
					text: t.type?.text || '',
					link: {route: HomeRoute.ALBUMS, params: {albumTypeID: t.type?.id || ''}},
					value: t.value
				})),
				{
					text: 'Folders',
					link: {route: HomeRoute.FOLDERS},
					value: stat.folder
				},
				{
					text: 'Tracks',
					link: {route: HomeRoute.TRACKS},
					value: stat.track
				}
			].filter(t => t.value > 0);
			return result;
		});
	}

	async artist(id: string, forceRefresh: boolean = false): Promise<ArtistData> {
		return this.get<ArtistData>(forceRefresh, `${this.jam.auth.auth?.server}/artist/${id}`, async () => {
			const artist = await this.jam.artist.id({id, artistAlbums: true});
			const albums: Array<SectionListData<BaseEntry>> = [];
			(artist.albums || []).forEach(album => {
				let section = albums.find(s => s.key === album.albumType);
				if (!section) {
					section = {
						key: album.albumType,
						title: album.albumType,
						data: []
					};
					albums.push(section);
				}
				let desc = '';
				if (album.seriesNr) {
					desc = `Episode ${album.seriesNr}`;
				} else if (album.year) {
					desc = `${album.year}`;
				}
				section.data = section.data.concat([{
					objType: JamObjectType.album,
					id: album.id,
					title: album.name,
					desc
				}]);
			});
			return {artist, albums};
		});
	}

	async album(id: string, forceRefresh: boolean = false): Promise<AlbumData> {
		return this.get<AlbumData>(forceRefresh, `${this.jam.auth.auth?.server}/album/${id}`, async () => {
			const result: AlbumData = {
				album: await this.jam.album.id({id, albumTracks: true, trackTag: true}),
				tracks: []
			};
			if (result.album && result.album.tracks) {
				result.tracks = result.album.tracks.map(track => this.buildTrackEntry(track));
			}
			return result;
		});
	}

	async folder(id: string, forceRefresh: boolean = false): Promise<FolderData> {
		return this.get<FolderData>(forceRefresh, `${this.jam.auth.auth?.server}/folder/${id}`, async () => {
			const result: FolderData = {
				folder: await this.jam.folder.id({id, folderTag: true, folderChildren: true, trackTag: true}),
				tracks: []
			};
			if (result.folder && result.folder.tracks) {
				result.tracks = result.folder.tracks.map(track => this.buildTrackEntry(track));
			}
			return result;
		});
	}

	async series(id: string, forceRefresh: boolean = false): Promise<SeriesData> {
		return this.get<SeriesData>(forceRefresh, `${this.jam.auth.auth?.server}/series/${id}`, async () => {
			const series = await this.jam.series.id({id, seriesAlbums: true});
			const albums: Array<SectionListData<BaseEntry>> = [];
			(series.albums || []).forEach((album: Jam.Album) => {
				let section = albums.find(s => s.key === album.albumType);
				if (!section) {
					section = {
						key: album.albumType,
						title: album.albumType,
						data: []
					};
					albums.push(section);
				}
				section.data = section.data.concat([{
					// obj: album,
					objType: JamObjectType.album,
					id: album.id,
					title: album.name,
					desc: `Episode ${album.seriesNr}`
				}]);
			});
			return {series, albums};
		});
	}

	async lyrics(id: string): Promise<Jam.TrackLyrics> {
		if (this.lastLyrics && this.lastLyrics.id === id) {
			return this.lastLyrics.data;
		}
		const data = await this.jam.track.lyrics({id});
		this.lastLyrics = {id, data};
		return data;
	}

	async waveform(id: string): Promise<Jam.WaveFormData> {
		if (this.lastWaveform && this.lastWaveform.id === id) {
			return this.lastWaveform.data;
		}
		const data = await this.jam.media.waveform_json({id});
		this.lastWaveform = {id, data};
		return data;
	}

	async autocomplete(query: string): Promise<AutoCompleteData> {
		const result = await this.jam.various.autocomplete(
			{query, album: 5, artist: 5, playlist: 5, podcast: 5, track: 5, episode: 5, series: 5}
		);
		const sections: AutoCompleteData = [];
		if (result) {
			if (result.albums && result.albums.length > 0) {
				sections.push({
					key: 'Albums',
					data: result.albums.map(entry => ({...entry, route: HomeRoute.ALBUM}))
				});
			}
			if (result.artists && result.artists.length > 0) {
				sections.push({
					key: 'Artists',
					data: result.artists.map(entry => ({...entry, route: HomeRoute.ARTIST}))
				});
			}
			if (result.tracks && result.tracks.length > 0) {
				sections.push({
					key: 'Tracks',
					data: result.tracks.map(entry => ({...entry, route: HomeRoute.TRACK}))
				});
			}
			if (result.folders && result.folders.length > 0) {
				sections.push({
					key: 'Folders',
					data: result.folders.map(entry => ({...entry, route: HomeRoute.FOLDER}))
				});
			}
			if (result.podcasts && result.podcasts.length > 0) {
				sections.push({
					key: 'Podcasts',
					data: result.podcasts.map(entry => ({...entry, route: HomeRoute.PODCAST}))
				});
			}
			if (result.episodes && result.episodes.length > 0) {
				sections.push({
					key: 'Podcast Episodes',
					data: result.episodes.map(entry => ({...entry, route: HomeRoute.EPISODE}))
				});
			}
			if (result.playlists && result.playlists.length > 0) {
				sections.push({
					key: 'Playlists',
					data: result.playlists.map(entry => ({...entry, route: HomeRoute.PLAYLIST}))
				});
			}
			if (result.series && result.series.length > 0) {
				sections.push({
					key: 'Series',
					data: result.series.map(entry => ({...entry, route: HomeRoute.SERIESITEM}))
				});
			}
		}
		return sections;
	}

	// action

	async toggleFav(objType: string, id: string, jamState: Jam.State): Promise<Jam.State> {
		const remove = jamState.faved ? true : undefined;
		const result = await this.jam.base.fav(objType, {id, remove});
		snackSuccess(result.faved ? 'Added to Favorites' : 'Removed from Favorites');
		this.refreshHomeData().catch(e => console.error(e));
		return result;
	}

	// caching

	private async clearCache(caller: Caching): Promise<void> {
		if (!this.db) {
			return;
		}
		caller.updateText('1/2 Clearing Image Cache');
		FastImage.clearDiskCache();
		FastImage.clearMemoryCache();
		caller.updateText('2/2 Clearing Data Cache');
		const dropTableScript = 'DROP TABLE IF EXISTS jam';
		await this.db.query(dropTableScript);
		await this.check();
		snackSuccess('Cache cleared');
	}

	private async fillCache(caller: Caching): Promise<void> {
		let artistIDs: Array<string> = [];
		let albumIDs: Array<string> = [];
		let seriesIDs: Array<string> = [];
		const forceRefresh = false;
		const tasks: Array<() => Promise<void>> = [
			async (): Promise<void> => {
				await this.stats(forceRefresh);
			},
			async (): Promise<void> => {
				const index = await this.artistIndex(AlbumType.album, forceRefresh);
				artistIDs = artistIDs.concat(index.map(o => o.id));
			},
			...[
				AlbumType.album, AlbumType.live, AlbumType.compilation, AlbumType.soundtrack, AlbumType.audiobook,
				AlbumType.series, AlbumType.bootleg, AlbumType.ep, AlbumType.single
			].map(albumType => async (): Promise<void> => {
				const index = await this.albumIndex(albumType, forceRefresh);
				albumIDs = albumIDs.concat(index.map(o => o.id));
			}),
			async (): Promise<void> => {
				await this.folderIndex(forceRefresh);
			},
			async (): Promise<void> => {
				const index = await this.seriesIndex(forceRefresh);
				seriesIDs = seriesIDs.concat(index.map(o => o.id));
			}
		];
		const total = 5;
		let i = 0;
		for (const task of tasks) {
			i += 1;
			caller.updateText(`1/${total} Caching Index ${i}/${tasks.length}`);
			await task();
			if (!caller.cachingData.running) {
				return;
			}
		}
		i = 0;
		for (const id of seriesIDs) {
			i += 1;
			caller.updateText(`2/${total} Caching Series ${i}/${seriesIDs.length}`);
			await this.series(id, forceRefresh);
			if (!caller.cachingData.running) {
				return;
			}
		}
		i = 0;
		for (const id of artistIDs) {
			i += 1;
			caller.updateText(`3/${total} Caching Artist ${i}/${artistIDs.length}`);
			await this.artist(id, forceRefresh);
			if (!caller.cachingData.running) {
				return;
			}
		}
		i = 0;
		for (const id of albumIDs) {
			i += 1;
			caller.updateText(`4/${total} Caching Albums ${i}/${albumIDs.length}`);
			await this.album(id, forceRefresh);
			if (!caller.cachingData.running) {
				return;
			}
		}
		const headers = this.currentUserToken ? {Authorization: `Bearer ${this.currentUserToken}`} : undefined;
		const ids = seriesIDs.concat(artistIDs).concat(albumIDs);
		const images = ids.map(id => (
			{
				uri: this.jam.image.url(id, 80, undefined, !headers),
				headers
			}
		)).concat(
			ids.map(id => (
				{
					uri: this.jam.image.url(id, 300, undefined, !headers),
					headers
				}
			))
		);
		i = 0;
		for (const image of images) {
			if (!caller.cachingData.running) {
				return;
			}
			i += 1;
			caller.updateText(`5/${total} Caching Image ${i}/${images.length}`);
			await new Promise<void>(resolve => {
				FastImage.preload([image],
					(/* loaded, total */) => {
					},
					(/* loaded, failed */) => {
						resolve();
					});
			});
		}
		snackSuccess('Cache optimized');
	}

}

const configuration = new JamConfigurationService();
const dataService = new DataService(new JamService(configuration));
export default dataService;
