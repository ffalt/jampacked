import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import React, { useCallback, useEffect, useMemo } from 'react';
import { staticTheme, useTheme } from '../style/theming';
import { ThemedText } from './ThemedText';
import { useLazyTrackLyricsQuery } from '../services/queries/lyrics';
import { ClickLabelIcon } from './ClickLabelIcon';

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	containerLoading: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
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

export const Lyrics: React.FC<{ id?: string | null }> = ({ id }) => {
	const theme = useTheme();
	const [getLyrics, { lyrics, loading, error }] = useLazyTrackLyricsQuery();

	useEffect(() => {
		if (id) {
			getLyrics(id);
		}
	}, [getLyrics, id]);

	const displayText = useMemo(() => {
		if (lyrics) {
			return lyrics.lyrics ?? '[No lyrics available]';
		}
		if (!lyrics && !loading && id) {
			return '';
		}
		return '';
	}, [lyrics, loading, id]);

	const refresh = useCallback((): void => {
		if (id) {
			getLyrics(id);
		}
	}, [getLyrics, id]);

	if (!lyrics) {
		return (
			<View key="nolyrics" style={[styles.containerLoading, { borderColor: theme.separator }]}>
				{id && !error && !loading && <ThemedText style={styles.none}>{displayText}</ThemedText>}
				{loading && (
					<View>
						<ActivityIndicator size="small" color={theme.textColor} />
						<ThemedText
							style={styles.none}>
							Searching Lyrics
						</ThemedText>
					</View>
				)}
				{error && !loading && (
					<View>
						<ThemedText style={styles.none}>{error.message}</ThemedText>
						<ClickLabelIcon
							style={[styles.button, { borderColor: theme.separator }]}
							onPress={refresh}
							iconName="reload"
							label="Refresh"
							labelStyle={styles.buttonText} />
					</View>
				)}
			</View>
		);
	}
	return (
		<ScrollView key="lyrics" style={[styles.container, { borderColor: theme.separator }]}>
			<ThemedText style={styles.lyrics}>{displayText}</ThemedText>
		</ScrollView>
	);
};
