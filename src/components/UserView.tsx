import React, {useCallback} from 'react';
import {staticTheme} from '../style/theming';
import {Button, StyleSheet, View} from 'react-native';
import {ThemedIcon} from './ThemedIcon';
import {ThemedText} from './ThemedText';
import {useAuth} from '../services/auth';
import {JamImage} from './JamImage';

const styles = StyleSheet.create({
	permissionSection: {
		paddingTop: staticTheme.padding
	},
	permission: {
		flexDirection: 'row'
	},
	permissionText: {
		fontSize: 12,
		paddingHorizontal: staticTheme.paddingSmall
	},
	userSection: {
		flexDirection: 'row',
		paddingTop: staticTheme.padding,
		paddingBottom: staticTheme.paddingLarge
	},
	userImage: {
		marginRight: staticTheme.margin
	},
	flex1: {
		flex: 1
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

export const UserView: React.FC = () => {
	const auth = useAuth();

	const logout = useCallback((): void => {
		auth.logout()
			.catch(e => {
				console.error(e);
			});
	}, [auth]);

	return (
		<>
			<View style={styles.userSection}>
				<View>
					<JamImage id={auth.currentUserID()} size={staticTheme.thumbMedium} style={styles.userImage}/>
				</View>
				<View style={styles.flex1}>
					<ThemedText>{auth.currentUserName()}</ThemedText>
					{auth?.user?.roles.stream && <UserPermission text="Stream Audio"/>}
					{auth?.user?.roles.podcast && <UserPermission text="Manage Podcasts"/>}
					{auth?.user?.roles.upload && <UserPermission text="Upload Audio"/>}
					{auth?.user?.roles.admin && <UserPermission text="Server Administration"/>}
				</View>
				<View>
					<Button title="Logout" onPress={logout}/>
				</View>
			</View>
		</>
	);
};
