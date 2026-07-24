import { describe, it, expect } from '@jest/globals';
import { JamRouteLinks } from '../../src/navigators/Routes';
import { ListType, AlbumType } from '../../src/services/jam';
import { HomeRoute, BottomTabRoute, AlbumsRoute, ArtistsRoute, GenreRoute } from '../../src/navigators/Routing';
import { getAlbumTypeInfos } from '../../src/utils/jam-lists';

jest.mock('../../src/utils/jam-lists.ts', () => require('../../__mocks__/utils/jam-lists.ts'));

describe('JamRouteLinks', () => {
	it('static links (artists/albums/folders/series/tracks/pinned) return the right title/icon/route', () => {
		expect(JamRouteLinks.artists()).toEqual({ title: 'Artists', icon: 'artist', navig: { route: HomeRoute.ARTISTS } });
		expect(JamRouteLinks.albums()).toEqual({ title: 'Albums', icon: 'album', navig: { route: HomeRoute.ALBUMS, params: { albumType: undefined } } });
		expect(JamRouteLinks.folders()).toEqual({ title: 'Folders', icon: 'folder', navig: { route: HomeRoute.FOLDERS, params: { albumType: undefined } } });
		expect(JamRouteLinks.series()).toEqual({ title: 'Series', icon: 'series', navig: { route: HomeRoute.SERIES } });
		expect(JamRouteLinks.tracks()).toEqual({ title: 'Tracks', icon: 'track', navig: { route: HomeRoute.TRACKS } });
		expect(JamRouteLinks.pinned()).toEqual({ title: 'Pinned', icon: 'download', navig: { route: HomeRoute.PINNED } });
		expect(JamRouteLinks.settings()).toEqual({ title: 'Settings', icon: 'settings', navig: { route: BottomTabRoute.SETTINGS } });
	});

	it('albumlist/artistlist build the route from the ListType', () => {
		expect(JamRouteLinks.albumlist(ListType.faved).navig.route).toBe(AlbumsRoute.FAV);
		expect(JamRouteLinks.albumlist(ListType.highest).navig.route).toBe(AlbumsRoute.HIGHEST);
		expect(JamRouteLinks.albumlist(ListType.random).navig.route).toBe(AlbumsRoute.RANDOM);
		expect(JamRouteLinks.artistlist(ListType.recent).navig.route).toBe(ArtistsRoute.RECENT);
		expect(JamRouteLinks.artistlist(ListType.avghighest).navig.route).toBe(ArtistsRoute.AVGHIGHEST);
	});

	it('album-type-aware links carry the albumType param', () => {
		const albums = JamRouteLinks.albums(AlbumType.ep);
		expect(albums.title).toBe(getAlbumTypeInfos(AlbumType.ep).title);
		expect(albums.navig.params?.albumType).toBe(AlbumType.ep);

		expect(JamRouteLinks.folders(AlbumType.live).navig.params?.albumType).toBe(AlbumType.live);
		expect(JamRouteLinks.folderlist(ListType.faved, AlbumType.audiobook).navig.params?.albumType).toBe(AlbumType.audiobook);
		expect(JamRouteLinks.albumlist(ListType.faved, AlbumType.compilation).navig.params?.albumType).toBe(AlbumType.compilation);
	});

	it('genre links target the genre routes', () => {
		expect(JamRouteLinks.genrealbums().navig.route).toBe(GenreRoute.ALBUMS);
		expect(JamRouteLinks.genreartists().navig.route).toBe(GenreRoute.ARTISTS);
		expect(JamRouteLinks.genretracks().navig.route).toBe(GenreRoute.TRACKS);
	});
});
