import React, {useCallback} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {ThemedText} from './ThemedText';
import {staticTheme, useTheme} from '../style/theming';
import {JamImage} from './JamImage';
import {NavigationService} from '../navigators/navigation';
import {SwipeableListItem} from './SwipeItem';
import {BaseEntry} from '../services/types';
import {FavIcon} from './FavIcon';

const styles = StyleSheet.create({
	item: {
		paddingHorizontal: staticTheme.padding,
		flexDirection: 'row',
		alignItems: 'center'
	},
	itemContent: {
		alignSelf: 'stretch',
		paddingLeft: staticTheme.padding,
		justifyContent: 'center',
		flexDirection: 'column',
		flex: 1
	},
	itemFooter: {
		fontSize: staticTheme.fontSizeSmall
	},
	itemText: {
		fontSize: staticTheme.fontSize
	},
	buttonText: {
		fontSize: staticTheme.fontSizeHuge
	}
});

export const Item: React.FC<{ item: BaseEntry }> = React.memo(({item}) => {
	const theme = useTheme();

	const handlePress = useCallback((): void => {
		NavigationService.navigateObj(item.objType, item.id, item.title);
	}, [item]);

	const leftItem = useCallback((): JSX.Element => {
		return (<View><FavIcon id={item.id} objType={item.objType}/></View>);
	}, [item]);

	const handleLeftPress = useCallback((): void => {
		//
	}, []);

	return (
		<SwipeableListItem
			height={64}
			left={leftItem}
			leftWidth={64}
			rightWidth={0}
			onPressLeft={handleLeftPress}
		>
			<TouchableOpacity onPress={handlePress} style={[styles.item, {backgroundColor: theme.background}]}>
				<JamImage id={item.id} size={46}/>
				<View style={styles.itemContent}>
					<ThemedText style={styles.itemText} numberOfLines={2}>{item.title}</ThemedText>
					<ThemedText style={styles.itemFooter} numberOfLines={1}>{item.desc}</ThemedText>
				</View>
			</TouchableOpacity>
		</SwipeableListItem>
	);
});
