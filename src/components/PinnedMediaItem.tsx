import React from 'react';
import {View} from 'react-native';
import {staticTheme} from '../style/theming';
import {ThemedText} from '../components/ThemedText';
import {JamImage} from './JamImage';
import {PinMedia} from '../services/types';
import {sharedStyles} from '../style/shared';
import {titleCase} from '../utils/format.utils';

export const PinnedMediaItem: React.FC<{ item: PinMedia }> = React.memo(({item}) => {
	return (
		<View style={sharedStyles.item}>
			<JamImage id={item.id} size={staticTheme.thumb} style={sharedStyles.itemSectionLeft}/>
			<View style={sharedStyles.itemContent}>
				<ThemedText style={sharedStyles.itemText} numberOfLines={2}>{item.name}</ThemedText>
				<View style={sharedStyles.itemFooter}>
					<ThemedText style={sharedStyles.itemFooterText}>{titleCase(item.objType)}</ThemedText>
					<ThemedText style={sharedStyles.itemFooterText}>Tracks: {item.tracks.length}</ThemedText>
				</View>
			</View>
		</View>
	);
});
