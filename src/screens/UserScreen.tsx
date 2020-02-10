import React from 'react';
import {Button, StyleSheet, View} from 'react-native';
import {AuthContext, BottomTabProps, BottomTabRoute} from '../navigators/Routing';
import {ThemesView} from '../components/ThemesView';
import ThemedText from '../components/ThemedText';
import {staticTheme} from '../style/theming';
import JamImage from '../components/JamImage';
import dataService from '../services/data';
import DataCachingView from '../components/DataCachingView';

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
	},
	userName: {
		flex: 1
	}
});

class UserScreen extends React.PureComponent<BottomTabProps<BottomTabRoute.SETTINGS>> {
	static contextType = AuthContext;

	private logout = (): void => {
		const auth = this.context;
		auth.logout()
			.catch((e: any) => {
				console.error(e);
			});
	};

	render(): React.ReactElement {
		return (
			<View style={styles.container}>
				<ThemedText style={styles.section}>Theme</ThemedText>
				<ThemesView/>
				<ThemedText style={styles.section}>Cache</ThemedText>
				<DataCachingView />
				<ThemedText style={styles.section}>Account</ThemedText>
				<View style={styles.userSection}>
					<JamImage id={dataService.currentUserID} size={80} style={styles.userImage}/>
					<View style={styles.userName}>
						<ThemedText>{dataService.currentUserName}</ThemedText>
						<Button title="Logout" onPress={this.logout}/>
					</View>
				</View>
			</View>
		);
	}
}

export default UserScreen;
