import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {HomeScreen} from '../screens/HomeScreen';
import {ArtistScreen} from '../screens/ArtistScreen';
import {AlbumScreen} from '../screens/AlbumScreen';
import {HomeRoute, HomeRouteParamList} from './Routing';
import {SeriesScreen} from '../screens/SeriesScreen';
import {FolderScreen} from '../screens/FolderScreen';
import {PodcastIndexScreen} from '../screens/PodcastIndexScreen';
import {PodcastScreen} from '../screens/PodcastScreen';
import {TrackScreen} from '../screens/TrackScreen';
import {PlaylistScreen} from '../screens/PlaylistScreen';
import {PlaylistIndexScreen} from '../screens/PlaylistIndexScreen';
import {UserScreen} from '../screens/UserScreen';
import {ArtistsNavigator} from './ArtistsNavigator';
import {AlbumsNavigator} from './AlbumsNavigator';
import {SeriesNavigator} from './SeriesNavigator';
import {FoldersNavigator} from './FoldersNavigator';
import {DownloadsNavigator} from './DownloadsNavigator';
import {GenresNavigator} from './GenresNavigator';
import {TracksNavigator} from './TracksNavigator';

const Stack = createStackNavigator<HomeRouteParamList>();

export const HomeStackNavigator: React.FC = () => (
	<Stack.Navigator screenOptions={{headerShown: false}}>
		<Stack.Screen name={HomeRoute.START} component={HomeScreen}/>
		<Stack.Screen name={HomeRoute.ARTISTS} component={ArtistsNavigator}/>
		<Stack.Screen name={HomeRoute.ALBUMS} component={AlbumsNavigator}/>
		<Stack.Screen name={HomeRoute.SERIES} component={SeriesNavigator}/>
		<Stack.Screen name={HomeRoute.FOLDERS} component={FoldersNavigator}/>
		<Stack.Screen name={HomeRoute.SERIE} component={SeriesScreen}/>
		<Stack.Screen name={HomeRoute.FOLDER} component={FolderScreen}/>
		<Stack.Screen name={HomeRoute.PLAYLIST} component={PlaylistScreen}/>
		<Stack.Screen name={HomeRoute.PLAYLISTS} component={PlaylistIndexScreen}/>
		<Stack.Screen name={HomeRoute.PODCASTS} component={PodcastIndexScreen}/>
		<Stack.Screen name={HomeRoute.PODCAST} component={PodcastScreen}/>
		<Stack.Screen name={HomeRoute.TRACKS} component={TracksNavigator}/>
		<Stack.Screen name={HomeRoute.TRACK} component={TrackScreen}/>
		<Stack.Screen name={HomeRoute.ARTIST} component={ArtistScreen}/>
		<Stack.Screen name={HomeRoute.ALBUM} component={AlbumScreen}/>
		<Stack.Screen name={HomeRoute.USER} component={UserScreen}/>
		<Stack.Screen name={HomeRoute.DOWNLOADS} component={DownloadsNavigator}/>
		<Stack.Screen name={HomeRoute.GENRES} component={GenresNavigator}/>
	</Stack.Navigator>
);
