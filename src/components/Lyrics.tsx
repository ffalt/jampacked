import {ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {staticTheme, useTheme} from '../style/theming';
import {ThemedText} from './ThemedText';
import {useLazyTrackLyricsQuery} from '../services/queries/lyrics';
import {ThemedIcon} from './ThemedIcon';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		borderBottomWidth: 1
	},
	containerLoading: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		borderBottomWidth: 1
	},
	none: {
		fontSize: staticTheme.fontSizeSmall,
		textAlign: 'center'
	},
	button: {
		borderWidth: 1,
		marginTop: staticTheme.marginLarge,
		padding: staticTheme.paddingLarge,
		flexDirection: 'column',
		alignItems: 'center',
		alignSelf: 'center',
		maxWidth: 100
	},
	buttonText: {},
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
			setText('');
			getLyrics(id);
		}
	}, [getLyrics, id]);

	useEffect(() => {
		if (lyrics) {
			setText(lyrics.lyrics || '[No lyrics available]');
		} else {
			setText('');
		}
	}, [lyrics]);


	const refresh = useCallback((): void => {
		if (id) {
			getLyrics(id);
		}
	}, [getLyrics, id]);


	if (!lyrics) {
		return (
			<View key="nolyrics" style={[styles.containerLoading, {borderColor: theme.separator}]}>
				{id && !error && !loading && <ThemedText style={styles.none}>{text}</ThemedText>}
				{loading && <ActivityIndicator size="small" color={theme.textColor}/>}
				{error && !loading && (
					<View>
						<ThemedText style={styles.none}>{error.message}</ThemedText>
						<TouchableOpacity style={[styles.button, {borderColor: theme.separator}]} onPress={refresh}>
							<ThemedIcon name="reload"/>
							<ThemedText style={styles.buttonText}>Refresh</ThemedText>
						</TouchableOpacity>
					</View>
				)}
			</View>
		);
	}
	return (
		<ScrollView key="lyrics" style={[styles.container, {borderColor: theme.separator}]}>
			<ThemedText style={styles.lyrics}>{text}</ThemedText>
		</ScrollView>
	);
};
