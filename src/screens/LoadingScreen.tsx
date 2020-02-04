import React from 'react';
import {StyleSheet, View} from 'react-native';
import {withTheme} from '../style/theming';
import {AppStackProps, Routing} from '../navigators/Routing';
import Logo from '../components/Logo';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	}
});

class LoadingScreen extends React.PureComponent<AppStackProps<Routing.LOAD>> {
	render(): React.ReactElement {
		return (
			<View style={styles.container}>
				<Logo size={94}/>
			</View>
		);
	}
}

export default withTheme(LoadingScreen);
