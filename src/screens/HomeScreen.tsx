import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { HomeRoute, HomeRouteProps } from '../navigators/Routing';
import { ThemedText } from '../components/ThemedText';
import { JamImage } from '../components/JamImage';
import { staticTheme } from '../style/theming';
import { Logo } from '../components/Logo';
import { useAuth } from '../services/auth';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { SearchBar } from '../components/SearchBar';
import { SearchResults } from '../components/SearchResults';
import { HomeMain } from '../components/HomeMain';

const styles = StyleSheet.create({
	container: {
		padding: staticTheme.padding,
		flex: 1
	},
	header: {
		flexDirection: 'column',
		paddingLeft: staticTheme.padding,
		paddingRight: staticTheme.padding
	},
	userHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingLeft: staticTheme.padding,
		paddingRight: staticTheme.padding,
		paddingBottom: staticTheme.padding,
		paddingTop: staticTheme.padding * 2
	},
	userHeaderText: {
		paddingLeft: staticTheme.padding,
		paddingRight: staticTheme.padding,
		fontSize: staticTheme.fontSizeLarge,
		textAlign: 'center',
		flex: 1,
		flexWrap: 'wrap'
	},
	userImage: {
		borderRadius: 20
	}
});

export const HomeScreen: React.FC<HomeRouteProps<HomeRoute.START>> = () => {
	const auth = useAuth();
	const [search, setSearch] = useState<string | undefined>();
	const statusBarHeight = getStatusBarHeight();
	const userName = `Welcome, ${auth.currentUserName()}`;
	const userId = auth.currentUserID();
	const content = search ? (<SearchResults search={search} />) : (<HomeMain />);

	return (
		<View style={[styles.container, { paddingTop: statusBarHeight }]}>
			<View style={styles.header}>
				<View style={styles.userHeader}>
					<Logo size={staticTheme.userImage} />
					<ThemedText style={styles.userHeaderText} numberOfLines={2}>{userName}</ThemedText>
					<JamImage id={userId} size={staticTheme.userImage} style={styles.userImage} />
				</View>
				<SearchBar searchQueryChange={setSearch} />
			</View>
			{content}
		</View>
	);
};
