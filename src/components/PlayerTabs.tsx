import React, {useCallback} from 'react';
import {ActivityIndicator, StyleSheet, TouchableOpacity, View} from 'react-native';
import {SceneMap, TabView} from 'react-native-tab-view';
import {ThemedText} from './ThemedText';
import {ThemedIcon} from './ThemedIcon';
import {Queue} from './Queue';
import {staticTheme, useTheme} from '../style/theming';
import {PlayerLyrics} from './PlayerLyrics';
import {PlayerCover} from './PlayerCover';
import {useWindowWidth} from '../utils/dimension.hook';
import {useNavigation} from '@react-navigation/native';
import {getStatusBarHeight} from 'react-native-status-bar-height';

const styles = StyleSheet.create({
	// container: {
	// 	paddingTop: staticTheme.statusBarOffset
	// },
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

const LazyPlaceholder: React.FC = () => {
	const theme = useTheme();
	return (
		<View style={styles.scene}>
			<ActivityIndicator size="large" color={theme.textColor}/>
		</View>
	);
};

const renderScene = SceneMap({
	cover: () => (<PlayerCover/>),
	lyrics: () => (<PlayerLyrics/>),
	queue: () => (<Queue/>)
});

const renderLazyPlaceholder: React.FC<{ route: { title: string } }> = () => <LazyPlaceholder/>;

interface PlayerTabsProps {
	toQueue?: boolean;
}

const routes = [
	{key: 'cover', title: 'Cover'},
	{key: 'lyrics', title: 'Lyrics'},
	{key: 'queue', title: 'Queue'}
];


export const PlayerTabs: React.FC<PlayerTabsProps> = ({toQueue}: PlayerTabsProps) => {
	const initialLayout = {width: useWindowWidth()};
	const [index, setIndex] = React.useState(toQueue ? 2 : 0);
	const navigation = useNavigation();
	const theme = useTheme();
	const statusBarHeight = getStatusBarHeight();

	const close = useCallback((): void => {
		navigation.goBack();
	}, [navigation]);

	const renderTabBar = useCallback((tabBarProps: any): JSX.Element => {
		const buttons = tabBarProps.navigationState.routes.map((route: { title: string }, i: number) => {
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
					<ThemedIcon name="down-open-big" size={styles.icon.fontSize}/>
				</TouchableOpacity>
				{buttons}
			</View>
		);
	}, [close, index, theme]);

	return (
		<TabView
			lazy={true}
			style={[{paddingTop:statusBarHeight}]}
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
