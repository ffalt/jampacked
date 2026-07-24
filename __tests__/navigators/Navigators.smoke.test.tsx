import 'react-native';
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react-native';

const mockRegistered: Array<string> = [];

function mockMakeNavigator(): { Navigator: React.FC<{ children?: React.ReactNode }>; Screen: React.FC<{ name: string }> } {
	const ReactLocal = require('react') as typeof import('react');
	return {
		Navigator: (properties: { children?: React.ReactNode }): React.ReactNode => ReactLocal.createElement(ReactLocal.Fragment, null, properties.children),
		Screen: (properties: { name: string }): null => {
			mockRegistered.push(properties.name);
			return null;
		}
	};
}

jest.mock('@react-navigation/material-top-tabs', () => ({ createMaterialTopTabNavigator: () => mockMakeNavigator() }));
jest.mock('@react-navigation/stack', () => ({ createStackNavigator: () => mockMakeNavigator() }));
jest.mock('@react-navigation/bottom-tabs', () => ({ createBottomTabNavigator: () => mockMakeNavigator(), BottomTabBar: (): null => null }));
jest.mock('@react-navigation/native-stack', () => ({ createNativeStackNavigator: () => mockMakeNavigator() }));

import { ModalNavigator } from '../../src/navigators/ModalNavigator';
import { BottomTabNavigator } from '../../src/navigators/BottomTabNavigator';
import { HomeStackNavigator } from '../../src/navigators/HomeStackNavigator';
import { AlbumsNavigator } from '../../src/navigators/AlbumsNavigator';
import { ArtistsNavigator } from '../../src/navigators/ArtistsNavigator';
import { SeriesNavigator } from '../../src/navigators/SeriesNavigator';
import { FoldersNavigator } from '../../src/navigators/FoldersNavigator';
import { TracksNavigator } from '../../src/navigators/TracksNavigator';
import { GenresNavigator } from '../../src/navigators/GenresNavigator';
import { GenreNavigator } from '../../src/navigators/GenreNavigator';
import { AlbumNavigator } from '../../src/navigators/AlbumNavigator';
import { DownloadsNavigator } from '../../src/navigators/DownloadsNavigator';
import { routeProps, screenProps } from '../../__mocks__/screen-props.ts';
import {
	ModalRouting, BottomTabRoute, HomeRoute, AlbumsRoute, ArtistsRoute, SeriesRoute, FoldersRoute, TracksRoute, GenresRoute, GenreRoute, AlbumRoute, DownloadsRoute
} from '../../src/navigators/Routing';

interface Case {
	name: string;
	element: React.ReactElement;
	initial: string;
}

const cases: Array<Case> = [
	{ name: 'ModalNavigator', element: <ModalNavigator />, initial: ModalRouting.MAIN },
	{ name: 'BottomTabNavigator', element: <BottomTabNavigator {...screenProps(BottomTabNavigator)} />, initial: BottomTabRoute.HOME },
	{ name: 'HomeStackNavigator', element: <HomeStackNavigator />, initial: HomeRoute.START },
	{ name: 'AlbumsNavigator', element: <AlbumsNavigator {...routeProps(AlbumsNavigator, { albumType: undefined })} />, initial: AlbumsRoute.INDEX },
	{ name: 'ArtistsNavigator', element: <ArtistsNavigator />, initial: ArtistsRoute.INDEX },
	{ name: 'SeriesNavigator', element: <SeriesNavigator {...screenProps(SeriesNavigator)} />, initial: SeriesRoute.INDEX },
	{ name: 'FoldersNavigator', element: <FoldersNavigator {...routeProps(FoldersNavigator, {})} />, initial: FoldersRoute.INDEX },
	{ name: 'TracksNavigator', element: <TracksNavigator />, initial: TracksRoute.FAV },
	{ name: 'GenresNavigator', element: <GenresNavigator {...screenProps(GenresNavigator)} />, initial: GenresRoute.INDEX },
	{ name: 'GenreNavigator', element: <GenreNavigator {...routeProps(GenreNavigator, { id: 'g1', name: 'Rock' })} />, initial: GenreRoute.ARTISTS },
	{ name: 'AlbumNavigator', element: <AlbumNavigator {...routeProps(AlbumNavigator, { id: 'a1', name: 'Album One' })} />, initial: AlbumRoute.MAIN },
	{ name: 'DownloadsNavigator', element: <DownloadsNavigator />, initial: DownloadsRoute.PINNED }
];

describe('Navigator wiring (smoke)', () => {
	beforeEach(() => {
		mockRegistered.length = 0;
	});

	it.each(cases)('$name mounts without crashing and registers its initial route', async ({ element, initial }) => {
		await render(element);
		expect(mockRegistered).toContain(initial);
	});
});
