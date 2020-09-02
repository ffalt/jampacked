import {ActivityIndicator, ScrollView, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {staticTheme, useTheme} from '../style/theming';
import {ThemedText} from './ThemedText';
import {useLazyTrackLyricsQuery} from '../services/queries/lyrics';
import {snackError} from '../services/snack';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		borderBottomWidth: 1,
		marginBottom: 32
	},
	lyrics: {
		fontSize: staticTheme.fontSize,
		lineHeight: staticTheme.fontSize * 1.5,
		marginHorizontal: staticTheme.marginLarge,
		marginVertical: staticTheme.margin,
		paddingHorizontal: staticTheme.padding
	}
});

export const Lyrics: React.FC<{ id?: string | null }> = ({id}) => {
	const [text, setText] = useState<string>('');
	const theme = useTheme();
	const [getLyrics, {lyrics, loading, error}] = useLazyTrackLyricsQuery();

	useEffect(() => {
		if (id) {
			getLyrics(id);
		}
	}, [getLyrics, id]);

	useEffect(() => {
		if (loading) {
			setText('[Loading lyrics]');
		} else if (lyrics?.lyrics) {
			setText(lyrics.lyrics);
		} else {
			setText(error ? error.toString() : '[No lyrics found]');
		}
	}, [lyrics, loading, error]);

	if (loading) {
		return (<ActivityIndicator size="large"/>);
	}

	if (error) {
		snackError(error);
	}

	return (
		<ScrollView style={[styles.container, {borderColor: theme.separator}]}>
			<ThemedText style={styles.lyrics}>{text}</ThemedText>
		</ScrollView>
	);
};
