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
	userHeaderText: {}
});

export const AppDrawer: React.FC<{ handleClose: () => void}> = (
	{handleClose}) => {
	const theme = useTheme();
	const auth = useAuth();
	const userId = auth.currentUserID();
	const userName = auth.currentUserName();

	const goToUser = useCallback((): void => {
		NavigationService.navigate(HomeRoute.USER, {});
		handleClose();
	}, [handleClose]);

	return (
		<ScrollView style={[styles.drawer, {backgroundColor: theme.control}]}>
			<SafeAreaView>
				<TouchableOpacity style={styles.drawerHeader} onPress={goToUser}>
					<JamImage id={userId} size={40} style={styles.userImage}/>
					<ThemedText style={styles.userHeaderText} numberOfLines={2}>{userName}</ThemedText>
				</TouchableOpacity>
				<ThemedText>HI</ThemedText>
			</SafeAreaView>
		</ScrollView>
	);
};
