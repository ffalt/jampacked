import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import ArtistsScreen from '../screens/ArtistsScreen';
import ArtistScreen from '../screens/ArtistScreen';
import AlbumScreen from '../screens/AlbumScreen';
import {HomeRoute, HomeStackNavigatorParamList} from './Routing';
import AlbumsScreen from '../screens/AlbumsScreen';
import SeriesScreen from '../screens/SeriesScreen';
import SeriesItemScreen from '../screens/SeriesItemScreen';
import FoldersScreen from '../screens/FoldersScreen';
import FolderScreen from '../screens/FolderScreen';
import TracksScreen from '../screens/TracksScreen';
import PodcastsScreen from '../screens/PodcastsScreen';
import PodcastScreen from '../screens/PodcastScreen';
import TrackScreen from '../screens/TrackScreen';
import PlaylistScreen from '../screens/PlaylistScreen';
import PlaylistsScreen from '../screens/PlaylistsScreen';

const Stack = createStackNavigator<HomeStackNavigatorParamList>();

const HomeStackNavigator: React.FC = () => (
	<Stack.Navigator screenOptions={{headerShown: false}}>
		<Stack.Screen name={HomeRoute.START} component={HomeScreen}/>
		<Stack.Screen name={HomeRoute.SERIES} component={SeriesScreen}/>
		<Stack.Screen name={HomeRoute.SERIESITEM} component={SeriesItemScreen}/>
		<Stack.Screen name={HomeRoute.FOLDERS} component={FoldersScreen}/>
		<Stack.Screen name={HomeRoute.FOLDER} component={FolderScreen}/>
		<Stack.Screen name={HomeRoute.PLAYLIST} component={PlaylistScreen}/>
		<Stack.Screen name={HomeRoute.PLAYLISTS} component={PlaylistsScreen}/>
		<Stack.Screen name={HomeRoute.PODCASTS} component={PodcastsScreen}/>
		<Stack.Screen name={HomeRoute.PODCAST} component={PodcastScreen}/>
		<Stack.Screen name={HomeRoute.TRACKS} component={TracksScreen}/>
		<Stack.Screen name={HomeRoute.TRACK} component={TrackScreen}/>
		<Stack.Screen name={HomeRoute.ARTISTS} component={ArtistsScreen}/>
		<Stack.Screen name={HomeRoute.ARTIST} component={ArtistScreen}/>
		<Stack.Screen name={HomeRoute.ALBUM} component={AlbumScreen}/>
		<Stack.Screen name={HomeRoute.ALBUMS} component={AlbumsScreen}/>
	</Stack.Navigator>
);

export default HomeStackNavigator;
