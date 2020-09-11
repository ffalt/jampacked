import React, {useCallback} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {useTheme} from '../style/theming';
import {ThemedText} from './ThemedText';
import {useAuth} from '../services/auth';
import {JamImage} from './JamImage';
import {NavigationService} from '../services/navigation';
import {HomeRoute} from '../navigators/Routing';

const styles = StyleSheet.create({
	drawer: {
		flex: 1,
		paddingHorizontal: 10
	},
	drawerHeader: {
		marginVertical: 40,
		alignItems: 'center',
		flexDirection: 'row'
	},
	userImage: {
		marginRight: 10
	},
	drawerRow: {
		height: 35
	},
	userHeaderText: {}
});

export const AppDrawerLink: React.FC<{ title: string; route: string, params?: any }> = ({title, route, params}) => {
	const theme = useTheme();
	const goToRoute = useCallback((): void => {
		NavigationService.closeSideBar();
		NavigationService.navigate(route, params || {});
	}, [route, params]);

	return (
		<TouchableOpacity style={[styles.drawerRow, {borderColor: theme.separator}]} onPress={goToRoute}>
			<ThemedText>{title}</ThemedText>
		</TouchableOpacity>
	);
};

export const AppDrawer: React.FC = () => {
	const theme = useTheme();
	const auth = useAuth();
	const userId = auth.currentUserID();
	const userName = auth.currentUserName();

	const goToUser = useCallback((): void => {
		NavigationService.closeSideBar();
		NavigationService.navigate(HomeRoute.USER, {});
	}, []);

	return (
		<ScrollView style={[styles.drawer, {backgroundColor: theme.control}]}>
			<SafeAreaView>
				<TouchableOpacity style={styles.drawerHeader} onPress={goToUser}>
					<JamImage id={userId} size={40} style={styles.userImage}/>
					<ThemedText style={styles.userHeaderText} numberOfLines={2}>{userName}</ThemedText>
				</TouchableOpacity>
				<AppDrawerLink title="Start" route={HomeRoute.START}/>
				<AppDrawerLink title="Downloads" route={HomeRoute.DOWNLOADS}/>
				<AppDrawerLink title="Artists" route={HomeRoute.ARTISTS}/>
				<AppDrawerLink title="Series" route={HomeRoute.SERIES}/>
			</SafeAreaView>
		</ScrollView>
	);
};
