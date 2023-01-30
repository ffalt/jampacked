import React, {useCallback} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {ThemedText} from './ThemedText';
import {staticTheme} from '../style/theming';
import {JamImage} from './JamImage';
import {NavigationService} from '../navigators/navigation';
import {BaseEntry} from '../services/types';
import {sharedStyles} from '../style/shared';
// import {SwipeableItem} from './SwipeableItem';
// import {PinIcon} from './PinIcon';
// import {FavIcon} from './FavIcon';

export const Item: React.FC<{ item: BaseEntry }> = ({item}) => {

	const handlePress = useCallback((): void => {
		NavigationService.navigateObj(item.objType, item.id, item.title);
	}, [item]);
	//
	// const buttons = (<>
	// 	<PinIcon style={sharedStyles.itemButton} fontSize={sharedStyles.itemButtonIcon.fontSize} objType={item.objType} id={item.id}/>
	// 	<FavIcon style={sharedStyles.itemButton} fontSize={sharedStyles.itemButtonIcon.fontSize} objType={item.objType} id={item.id}/>
	// </>);

	return (
		// <SwipeableItem buttons={buttons}>
		<TouchableOpacity onPress={handlePress} style={sharedStyles.item}>
			<JamImage id={item.id} size={staticTheme.thumb} style={sharedStyles.itemSectionLeft}/>
			<View style={sharedStyles.itemContent}>
				<ThemedText style={sharedStyles.itemText} numberOfLines={2}>{item.title}</ThemedText>
				<ThemedText style={sharedStyles.itemFooterText} numberOfLines={1}>{item.desc}</ThemedText>
			</View>
		</TouchableOpacity>
		// </SwipeableItem>
	);
};
