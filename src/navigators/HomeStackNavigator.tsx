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

const Stack = createStackNavigator<HomeStackNavigatorParamList>();

const HomeStackNavigator: React.FC = () => (
	<Stack.Navigator screenOptions={{headerShown: false}}>
		<Stack.Screen name={HomeRoute.START} component={HomeScreen}/>
		<Stack.Screen name={HomeRoute.SERIES} component={SeriesScreen}/>
		<Stack.Screen name={HomeRoute.SERIESITEM} component={SeriesItemScreen}/>
		<Stack.Screen name={HomeRoute.ARTISTS} component={ArtistsScreen}/>
		<Stack.Screen name={HomeRoute.ARTIST} component={ArtistScreen}/>
		<Stack.Screen name={HomeRoute.ALBUM} component={AlbumScreen}/>
		<Stack.Screen name={HomeRoute.ALBUMS} component={AlbumsScreen}/>
	</Stack.Navigator>
);

export default HomeStackNavigator;
