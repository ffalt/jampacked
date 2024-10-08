import { StyleSheet, View } from 'react-native';
import React from 'react';
import { staticTheme } from '../style/theming';
import { FavIcon } from './FavIcon';
import { objHeaderStyles } from './ObjHeader';
import { JamObjectType } from '../services/jam';
import { Rating } from './Rating';
import { useTrackPlayerCurrentTrack } from '../services/player-api';

const styles = StyleSheet.create({
	annotation: {
		paddingTop: staticTheme.paddingLarge,
		flexDirection: 'row',
		alignContent: 'space-between',
		justifyContent: 'space-between',
		top: 0
	}
});

export const PlayerAnnotation: React.FC = () => {
	const currentTrack = useTrackPlayerCurrentTrack();
	return (
		<View style={styles.annotation}>
			<FavIcon style={objHeaderStyles.button} fontSize={objHeaderStyles.buttonIcon.fontSize} objType={JamObjectType.track} id={currentTrack?.id}/>
			<Rating style={objHeaderStyles.button} fontSize={objHeaderStyles.buttonIcon.fontSize} id={currentTrack?.id} objType={JamObjectType.track}></Rating>
		</View>
	);
};
