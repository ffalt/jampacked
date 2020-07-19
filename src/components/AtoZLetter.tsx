import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {useTheme} from '../style/theming';

const styles = StyleSheet.create({
	letter: {
		fontSize: 12,
		fontWeight: 'bold',
		textAlign: 'center'
	}
});

export const AtoZLetter: React.FC<{ letter: string }> = ({letter}) => {
	const theme = useTheme();
	return <Text style={[styles.letter, {color: theme.overlayText}]}>{letter}</Text>;
};

