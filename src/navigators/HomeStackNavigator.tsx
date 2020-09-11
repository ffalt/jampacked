import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {HomeScreen} from '../screens/HomeScreen';
import {ArtistIndexScreen} from '../screens/ArtistIndexScreen';
import {AlbumIndexScreen} from '../screens/AlbumIndexScreen';
import {ArtistScreen} from '../screens/ArtistScreen';
import {AlbumScreen} from '../screens/AlbumScreen';
import {FolderIndexScreen} from '../screens/FolderIndexScreen';
import {HomeRoute, HomeStackNavigatorParamList} from './Routing';
import {SeriesIndexScreen} from '../screens/SeriesIndexScreen';
import {SeriesScreen} from '../screens/SeriesScreen';
import {FolderScreen} from '../screens/FolderScreen';
import {TracksScreen} from '../screens/TracksScreen';
import {PodcastIndexScreen} from '../screens/PodcastIndexScreen';
import {PodcastScreen} from '../screens/PodcastScreen';
import {TrackScreen} from '../screens/TrackScreen';
import {PlaylistScreen} from '../screens/PlaylistScreen';
import {PlaylistIndexScreen} from '../screens/PlaylistIndexScreen';
import {UserScreen} from '../screens/UserScreen';
import {AlbumListScreen} from '../screens/AlbumListScreen';
import {ArtistListScreen} from '../screens/ArtistListScreen';
import {SeriesListScreen} from '../screens/SeriesListScreen';
import {FolderListScreen} from '../screens/FolderListScreen';
import {DownloadsScreen} from '../screens/DownloadsScreen';

const Stack = createStackNavigator<HomeStackNavigatorParamList>();

export const HomeStackNavigator: React.FC = () => (
	<Stack.Navigator screenOptions={{headerShown: false}}>
		<Stack.Screen name={HomeRoute.START} component={HomeScreen}/>
		<Stack.Screen name={HomeRoute.SERIES} component={SeriesIndexScreen}/>
		<Stack.Screen name={HomeRoute.SERIESITEM} component={SeriesScreen}/>
		<Stack.Screen name={HomeRoute.FOLDERS} component={FolderIndexScreen}/>
		<Stack.Screen name={HomeRoute.FOLDER} component={FolderScreen}/>
		<Stack.Screen name={HomeRoute.PLAYLIST} component={PlaylistScreen}/>
		<Stack.Screen name={HomeRoute.PLAYLISTS} component={PlaylistIndexScreen}/>
		<Stack.Screen name={HomeRoute.PODCASTS} component={PodcastIndexScreen}/>
		<Stack.Screen name={HomeRoute.PODCAST} component={PodcastScreen}/>
		<Stack.Screen name={HomeRoute.TRACKS} component={TracksScreen}/>
		<Stack.Screen name={HomeRoute.TRACK} component={TrackScreen}/>
		<Stack.Screen name={HomeRoute.ARTISTS} component={ArtistIndexScreen}/>
		<Stack.Screen name={HomeRoute.ARTIST} component={ArtistScreen}/>
		<Stack.Screen name={HomeRoute.ALBUM} component={AlbumScreen}/>
		<Stack.Screen name={HomeRoute.ALBUMS} component={AlbumIndexScreen}/>
		<Stack.Screen name={HomeRoute.USER} component={UserScreen}/>
		<Stack.Screen name={HomeRoute.ALBUMLIST} component={AlbumListScreen}/>
		<Stack.Screen name={HomeRoute.ARTISTLIST} component={ArtistListScreen}/>
		<Stack.Screen name={HomeRoute.SERIESLIST} component={SeriesListScreen}/>
		<Stack.Screen name={HomeRoute.FOLDERLIST} component={FolderListScreen}/>
		<Stack.Screen name={HomeRoute.DOWNLOADS} component={DownloadsScreen}/>
	</Stack.Navigator>
);
