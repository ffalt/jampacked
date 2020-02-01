import {SectionListData} from 'react-native';
import {Database} from './db';
import {AlbumType, Jam, JamService} from './jam';
import {formatDuration} from '../utils/duration.utils';
import {JamConfigurationService} from './jam-configuration';
import {getTypeByAlbumType} from './jam-lists';
import {HomeRoute} from '../navigators/Routing';

const createTableScript = 'CREATE TABLE if not exists jam(_id INTEGER PRIMARY KEY AUTOINCREMENT, key TEXT, data TEXT, date integer, version integer)';

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

export interface ItemData<T> {
	id: string;
	title: string;
	desc: string;
	obj: T;
	link: Navig;
}

export interface TrackEntry {
	entry: Jam.Track;
	duration: string;
	trackNr: string;
	title: string;
}

export interface ArtistData {
	artist: Jam.Artist;
	sections: Array<SectionListData<ItemData<Jam.Album>>>;
}

export interface AlbumData {
	album: Jam.Album;
	tracks: Array<TrackEntry>;
}

export interface IndexEntry {
	id: string;
	title: string;
	desc: string;
	letter: string;
	link: Navig;
}

export interface SeriesData {
	series: Jam.Series,
	sections: Array<SectionListData<ItemData<Jam.Album>>>;
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
	version = 1;
	lastWaveform?: { id: string, data: Jam.WaveFormData };

	constructor(public jam: JamService) {
		this.open();
	}

	async open(): Promise<void> {
		this.db = await Database.getInstance();
		await this.check();
	}

	async check(): Promise<void> {
		if (!this.db) {
			return;
		}
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

	async get<T>(id: string, build: () => Promise<T>): Promise<T> {
		const doc = await this.getDoc<T>(id);
		if (doc) {
			return doc.data;
		}
		const result = await build();
		if (!this.db) {
			return result;
		}
		await this.db.insert('jam', ['data', 'key', 'date'], [JSON.stringify(result), id, Date.now()]);
		return result;
	}

	async albumIndex(albumType: Jam.AlbumType): Promise<Index> {
		return this.get<Index>(`${this.jam.auth.auth?.server}/albumIndex/${albumType}`, async () => {
			const data = await this.jam.album.index({albumType});
			const result: Index = [];
			data.groups.forEach(group => {
				group.entries.forEach(entry => {
					result.push({
						id: entry.id,
						desc: entry.artist,
						title: entry.name,
						letter: group.name,
						link: {
							route: HomeRoute.ALBUM,
							params: {id: entry.id, name: entry.name}
						}
					});
				});
			});
			return result;
		});
	}

	async artistIndex(albumType: Jam.AlbumType): Promise<Index> {
		return this.get<Index>(`${this.jam.auth.auth?.server}/artistIndex/${albumType}`, async () => {
			const data = await this.jam.artist.index({albumType});
			const result: Index = [];
			data.groups.forEach(group => {
				group.entries.forEach(entry => {
					result.push({
						id: entry.artistID,
						desc: `Albums: ${entry.albumCount}`,
						title: entry.name,
						letter: group.name,
						link: {
							route: HomeRoute.ARTIST,
							params: {id: entry.artistID, name: entry.name}
						}
					});
				});
			});
			return result;
		});
	}

	async seriesIndex(): Promise<Index> {
		return this.get<Index>(`${this.jam.auth.auth?.server}/seriesIndex`, async () => {
			const data = await this.jam.series.index({});
			const result: Index = [];
			data.groups.forEach(group => {
				group.entries.forEach(entry => {
					result.push({
						id: entry.seriesID,
						desc: `Episodes: ${entry.albumCount}`,
						title: entry.name,
						letter: group.name,
						link: {
							route: HomeRoute.SERIESITEM,
							params: {id: entry.seriesID, name: entry.name}
						}
					});
				});
			});
			return result;
		});
	}

	async stats(): Promise<HomeStatsData> {
		return this.get<HomeStatsData>(`${this.jam.auth.auth?.server}/stats`, async () => {
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

	async album(id: string): Promise<AlbumData> {
		return this.get<AlbumData>(`${this.jam.auth.auth?.server}/album/${id}`, async () => {
			const result: AlbumData = {
				album: await this.jam.album.id({id, albumTracks: true, trackTag: true}),
				tracks: []
			};
			if (result.album && result.album.tracks) {
				result.tracks = result.album.tracks.map(track => ({
					entry: track,
					title: track.tag?.title || track.name,
					trackNr: (track.tag?.disc ? `${track.tag?.disc}-` : '') + (track.tag?.trackNr || ''),
					duration: formatDuration(track.duration)
				}));
			}
			return result;
		});
	}

	async artist(id: string): Promise<ArtistData> {
		return this.get<ArtistData>(`${this.jam.auth.auth?.server}/artist/${id}`, async () => {
			const artist = await this.jam.artist.id({id, artistAlbums: true});
			const sections: Array<SectionListData<ItemData<Jam.Album>>> = [];
			(artist.albums || []).forEach(album => {
				let section = sections.find(s => s.key === album.albumType);
				if (!section) {
					section = {
						key: album.albumType,
						title: album.albumType,
						data: []
					};
					sections.push(section);
				}
				section.data = section.data.concat([{
					obj: album,
					id: album.id,
					title: album.name,
					desc: `${album.year}`,
					link: {
						route: HomeRoute.ALBUM,
						params: {id: album.id, name: album.name}
					}
				}]);
			});
			return {artist, sections};
		});
	}

	get currentUserName(): string {
		return (this.jam.auth?.user?.name || '');
	}

	get currentUserID(): string {
		return (this.jam.auth?.user?.id || '');
	}

	get currentUserToken(): string | undefined {
		return this.jam.auth?.auth?.token;
	}

	async lyrics(id: string): Promise<Jam.TrackLyrics> {
		return this.jam.track.lyrics({id});
	}

	async waveform(id: string): Promise<Jam.WaveFormData> {
		if (this.lastWaveform && this.lastWaveform.id === id) {
			return this.lastWaveform.data;
		}
		const data = await this.jam.media.waveform_json({id});
		this.lastWaveform = {id, data};
		return data;
	}

	async home(): Promise<HomeData> {
		const result: HomeData = {};

		const pack = (objs: Array<Jam.Base>, route: string): Array<HomeEntry> => objs.map(obj => ({obj, route}));

		result.artistsRecent = pack((await this.jam.artist.list({list: 'recent', amount: 5})).items, HomeRoute.ARTIST);
		result.artistsFaved = pack((await this.jam.artist.list({list: 'faved', amount: 5})).items, HomeRoute.ARTIST);
		result.albumsFaved = pack((await this.jam.album.list({list: 'faved', amount: 5})).items, HomeRoute.ALBUM);
		result.albumsRecent = pack((await this.jam.album.list({list: 'recent', amount: 5})).items, HomeRoute.ALBUM);
		return result;
	}

	async autocomplete(query: string): Promise<AutoCompleteData> {
		const result = await this.jam.various.autocomplete({query, album: 5, artist: 5, playlist: 5, podcast: 5, track: 5, episode: 5});
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
		}
		return sections;
	}

	public async series(id: string): Promise<SeriesData> {
		const series = await this.jam.series.id({id, seriesAlbums: true});
		const sections: Array<SectionListData<ItemData<Jam.Album>>> = [];
		(series.albums || []).forEach((album: Jam.Album) => {
			let section = sections.find(s => s.key === album.albumType);
			if (!section) {
				section = {
					key: album.albumType,
					title: album.albumType,
					data: []
				};
				sections.push(section);
			}
			section.data = section.data.concat([{
				obj: album,
				id: album.id,
				title: album.name,
				desc: `Episode ${album.seriesNr}`,
				link: {route: HomeRoute.ALBUM, params: {id: album.id, name: album.name}}
			}]);
		});
		return {series, sections};
	}
}

const configuration = new JamConfigurationService();
const dataService = new DataService(new JamService(configuration));
export default dataService;
