import React from 'react';
import {Dimensions, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Route, SceneMap, TabView} from 'react-native-tab-view';
import {useNavigation} from '@react-navigation/core';
import ThemedText from './ThemedText';
import ThemedIcon from './ThemedIcon';
import Queue from './Queue';
import {staticTheme, useTheme} from '../style/theming';
import PlayerLyrics from './PlayerLyrics';
import PlayerCover from './PlayerCover';

const styles = StyleSheet.create({
	container: {
		paddingTop: staticTheme.statusBarOffset
	},
	scene: {
		flex: 1
	},
	header: {
		flex: 1,
		flexDirection: 'row'
	},
	icon: {
		fontSize: 20
	},
	tabBar: {
		flexDirection: 'row'
	},
	tabItem: {
		alignItems: 'center',
		paddingTop: staticTheme.padding,
		paddingBottom: staticTheme.padding,
		paddingLeft: 16,
		paddingRight: 16
	},
	tabItemActive: {
		borderBottomWidth: 1
	}
});

interface LazyPlaceholderProps {
	route: Route;
}

const LazyPlaceholder: React.FC<LazyPlaceholderProps> = ({route}: LazyPlaceholderProps) => {
	const title = `Loading ${route.title}…`;
	return (
		<View style={styles.scene}>
			<ThemedText>{title}</ThemedText>
		</View>
	);
};

const initialLayout = {width: Dimensions.get('window').width};

const renderScene = SceneMap({
	cover: () => (<PlayerCover/>),
	lyrics: () => (<PlayerLyrics/>),
	queue: () => (<Queue/>)
});

const renderLazyPlaceholder: React.FC<LazyPlaceholderProps> = ({route}: LazyPlaceholderProps) => <LazyPlaceholder route={route}/>;

interface PlayerTabsProps {
	toQueue?: boolean;
}

const PlayerTabs: React.FC<PlayerTabsProps> = ({toQueue}: PlayerTabsProps) => {
	const [index, setIndex] = React.useState(toQueue ? 2 : 0);
	const [routes] = React.useState([
		{key: 'cover', title: 'Cover'},
		{key: 'lyrics', title: 'Lyrics'},
		{key: 'queue', title: 'Queue'}
	]);
	const navigation = useNavigation();
	const theme = useTheme();

	const close = (): void => {
		navigation.goBack();
	};

	const renderTabBar = (tabBarProps: any): JSX.Element => {
		const buttons = tabBarProps.navigationState.routes.map((route: Route, i: number) => {
			const style = [styles.tabItem,
				i === index && styles.tabItemActive,
				i === index && {borderBottomColor: theme.textColor}
			];
			const toIndex = (): void => {
				setIndex(i);
			};
			return (
				<TouchableOpacity key={route.title} style={style} onPress={toIndex}>
					<ThemedText>{route.title}</ThemedText>
				</TouchableOpacity>
			);
		});
		return (
			<View style={styles.tabBar}>
				<TouchableOpacity style={styles.tabItem} onPress={close}>
					<ThemedIcon name="down-open-big" style={styles.icon}/>
				</TouchableOpacity>
				{buttons}
			</View>
		);
	};

	return (
		<TabView
			lazy={true}
			style={styles.container}
			swipeEnabled={true}
			renderLazyPlaceholder={renderLazyPlaceholder}
			renderTabBar={renderTabBar}
			navigationState={{index, routes}}
			renderScene={renderScene}
			onIndexChange={setIndex}
			initialLayout={initialLayout}
		/>
	);
};

export default PlayerTabs;
