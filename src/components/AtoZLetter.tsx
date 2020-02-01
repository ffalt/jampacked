import React from 'react';
import {StyleSheet} from 'react-native';
import ThemedText from './ThemedText';

const styles = StyleSheet.create({
	letter: {
		fontSize: 12,
		fontWeight: 'bold'
	}
});

export class AtoZLetter extends React.PureComponent<{ letter: string }> {
	render(): JSX.Element {
		return <ThemedText style={styles.letter}>{this.props.letter}</ThemedText>;
	}
}
