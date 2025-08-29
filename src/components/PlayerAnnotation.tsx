import { StyleSheet, View } from 'react-native';
import React from 'react';
import { staticTheme } from '../style/theming';
import { FavIcon } from './FavIcon';
import { objectHeaderStyles } from './ObjectHeader.tsx';
import { JamObjectType } from '../services/jam';
import { Rating } from './Rating';
import { useTrackPlayerCurrentTrack } from 'react-native-track-player';

const styles = StyleSheet.create({
	annotation: {
		paddingTop: staticTheme.paddingLarge,
		flexDirection: 'row',
		alignContent: 'space-between',
		justifyContent: 'space-between',
		top: 0
	},
	rating: {
		justifyContent: 'flex-end'
	}
});

export const PlayerAnnotation: React.FC = () => {
	const currentTrack = useTrackPlayerCurrentTrack();
	return (
		<View style={styles.annotation}>
			<FavIcon
				style={objectHeaderStyles.button}
				fontSize={objectHeaderStyles.buttonIcon.fontSize}
				objType={JamObjectType.track}
				id={currentTrack?.id} />
			<Rating
				style={[objectHeaderStyles.button, styles.rating]}
				fontSize={objectHeaderStyles.buttonIcon.fontSize}
				id={currentTrack?.id}
				objType={JamObjectType.track}>
			</Rating>
		</View>
	);
};
