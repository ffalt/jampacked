import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { ArtistScreen } from '../screens/ArtistScreen';
import { HomeRoute, HomeRouteParameterList } from './Routing';
import { SeriesScreen } from '../screens/SeriesScreen';
import { FolderScreen } from '../screens/FolderScreen';
import { PodcastIndexScreen } from '../screens/PodcastIndexScreen';
import { PodcastScreen } from '../screens/PodcastScreen';
import { TrackScreen } from '../screens/TrackScreen';
import { PlaylistScreen } from '../screens/PlaylistScreen';
import { PlaylistIndexScreen } from '../screens/PlaylistIndexScreen';
import { ArtistsNavigator } from './ArtistsNavigator';
import { AlbumsNavigator } from './AlbumsNavigator';
import { SeriesNavigator } from './SeriesNavigator';
import { FoldersNavigator } from './FoldersNavigator';
import { DownloadsNavigator } from './DownloadsNavigator';
import { GenresNavigator } from './GenresNavigator';
import { TracksNavigator } from './TracksNavigator';
import { GenreNavigator } from './GenreNavigator';
import { AlbumNavigator } from './AlbumNavigator';
import { BookmarksScreen } from '../screens/BookmarksScreen.tsx';

const Stack = createNativeStackNavigator<HomeRouteParameterList>();

export const HomeStackNavigator: React.FC = () => (
	<Stack.Navigator screenOptions={{ headerShown: false }}>
		<Stack.Screen name={HomeRoute.START} component={HomeScreen} />
		<Stack.Screen name={HomeRoute.ARTISTS} component={ArtistsNavigator} />
		<Stack.Screen name={HomeRoute.ALBUMS} component={AlbumsNavigator} />
		<Stack.Screen name={HomeRoute.SERIES} component={SeriesNavigator} />
		<Stack.Screen name={HomeRoute.FOLDERS} component={FoldersNavigator} />
		<Stack.Screen name={HomeRoute.SERIE} component={SeriesScreen} />
		<Stack.Screen name={HomeRoute.FOLDER} component={FolderScreen} />
		<Stack.Screen name={HomeRoute.PLAYLIST} component={PlaylistScreen} />
		<Stack.Screen name={HomeRoute.PLAYLISTS} component={PlaylistIndexScreen} />
		<Stack.Screen name={HomeRoute.BOOKMARKS} component={BookmarksScreen} />
		<Stack.Screen name={HomeRoute.PODCASTS} component={PodcastIndexScreen} />
		<Stack.Screen name={HomeRoute.PODCAST} component={PodcastScreen} />
		<Stack.Screen name={HomeRoute.TRACKS} component={TracksNavigator} />
		<Stack.Screen name={HomeRoute.TRACK} component={TrackScreen} />
		<Stack.Screen name={HomeRoute.ARTIST} component={ArtistScreen} />
		<Stack.Screen name={HomeRoute.ALBUM} component={AlbumNavigator} />
		<Stack.Screen name={HomeRoute.PINNED} component={DownloadsNavigator} />
		<Stack.Screen name={HomeRoute.GENRES} component={GenresNavigator} />
		<Stack.Screen name={HomeRoute.GENRE} component={GenreNavigator} />
	</Stack.Navigator>
);
