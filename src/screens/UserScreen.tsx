import React, {useCallback, useEffect} from 'react';
import {Button, RefreshControl, ScrollView, StyleSheet, View} from 'react-native';
import {BottomTabProps, BottomTabRoute} from '../navigators/Routing';
import {ThemedText} from '../components/ThemedText';
import {staticTheme, useTheme} from '../style/theming';
import {JamImage} from '../components/JamImage';
import {useAuth} from '../services/auth';
import {ThemedIcon} from '../components/ThemedIcon';
import dataService from '../services/data';
import {Stats} from '../components/Stats';
import {ErrorView} from '../components/ErrorView';
import {useLazyUserDataQuery} from '../services/queries/user.hook';

const styles = StyleSheet.create({
	container: {
		paddingTop: staticTheme.statusBarOffset,
		paddingBottom: staticTheme.padding,
		paddingHorizontal: staticTheme.padding,
		flex: 1
	},
	userSection: {
		flexDirection: 'row'
	},
	userImage: {
		marginRight: staticTheme.margin
	},
	permission: {
		flexDirection: 'row'
	},
	permissionText: {
		paddingHorizontal: staticTheme.paddingSmall
	},
	section: {
		paddingVertical: staticTheme.padding,
		letterSpacing: 2,
		textTransform: 'uppercase',
		fontSize: staticTheme.fontSizeSmall,
		fontWeight: 'bold',
		marginTop: staticTheme.margin,
		borderBottomColor: 'rgba(0,0,0,0.7)',
		borderBottomWidth: 1,
		marginBottom: staticTheme.marginSmall
	}
});

export const UserPermission: React.FC<{ text: string }> = ({text}) => {
	return (
		<View style={styles.permission}>
			<ThemedIcon name="checkmark"/>
			<ThemedText style={styles.permissionText}>{text}</ThemedText>
		</View>
	);
};

export const UserScreen: React.FC<BottomTabProps<BottomTabRoute.SETTINGS>> = () => {
	const auth = useAuth();
	const theme = useTheme();
	const [getUserData, {loading, error, called, userData}] = useLazyUserDataQuery();

	useEffect(() => {
		if (!called) {
			getUserData();
		}
	}, [getUserData, called]);

	useEffect(() => {
		const subscription = dataService.homeDataUpdate.subscribe(() => {
			getUserData();
		});
		return (): void => subscription.unsubscribe();
	}, [getUserData]);

	const reload = useCallback((): void => {
		getUserData(true);
	}, [getUserData]);

	const logout = useCallback((): void => {
		auth.logout()
			.catch(e => {
				console.error(e);
			});
	}, [auth]);


	if (error) {
		return (<ErrorView error={error} onRetry={reload}/>);
	}

	return (
		<ScrollView
			refreshControl={(
				<RefreshControl
					refreshing={loading}
					onRefresh={reload}
					progressViewOffset={70}
					progressBackgroundColor={theme.refreshCtrlBackground}
					colors={theme.refreshCtrlColors}
				/>
			)}
		>
			<View style={styles.container}>
				<ThemedText style={styles.section}>User</ThemedText>
				<View style={styles.userSection}>
					<JamImage id={auth.currentUserID()} size={staticTheme.thumbMedium} style={styles.userImage}/>
					<View>
						<View>
							<ThemedText>{auth.currentUserName()}</ThemedText>
							<Button title="Logout" onPress={logout}/>
						</View>
					</View>
				</View>
				<ThemedText style={styles.section}>Permissions</ThemedText>
				{auth?.user?.roles.stream && <UserPermission text="Stream Audio"/>}
				{auth?.user?.roles.podcast && <UserPermission text="Manage Podcasts"/>}
				{auth?.user?.roles.upload && <UserPermission text="Upload Audio"/>}
				{auth?.user?.roles.admin && <UserPermission text="Server Administration"/>}
			</View>
			{userData?.stats && <Stats stats={userData.stats} label="Library"/>}
			{userData?.favorites && <Stats stats={userData.favorites} label="Favorites"/>}
			{userData?.played && <Stats stats={userData.played} label="Played"/>}
		</ScrollView>
	);
};
