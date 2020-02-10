import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {ITheme, withTheme} from '../style/theming';

const styles = StyleSheet.create({
	letter: {
		fontSize: 12,
		fontWeight: 'bold',
		textAlign: 'center'
	}
});

class AtoZLetter extends React.PureComponent<{ letter: string; theme: ITheme }> {
	render(): React.ReactElement {
		const {letter, theme} = this.props;
		return <Text style={[styles.letter, {color: theme.overlayText}]}>{letter}</Text>;
	}
}

export default withTheme(AtoZLetter);
