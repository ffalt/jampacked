import React, {useCallback, useEffect, useState} from 'react';
import {StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle} from 'react-native';
import {staticTheme, useTheme} from '../style/theming';
import {ThemedIcon} from './ThemedIcon';
import {JamObjectType} from '../services/jam';
import {useFavMutation, useLazyFavQuery} from '../services/queries/fav';
import {snackSuccess} from '../services/snack';
import dataService from '../services/data';

const styles = StyleSheet.create({
	button: {
		marginLeft: staticTheme.margin
	},
	buttonIcon: {
		fontSize: 26
	}
});

export const FavIcon: React.FC<{ id?: string; objType: JamObjectType; style?: StyleProp<ViewStyle> }> = ({id, style}) => {
	const [fav, setFav] = useState<{ timestamp?: number } | undefined>();
	const [getFaved, {faved, loading}] = useLazyFavQuery();
	const [toggleFav] = useFavMutation();
	const theme = useTheme();

	useEffect(() => {
		if (id) {
			getFaved(id);
		}
	}, [getFaved, id]);

	useEffect(() => {
		setFav(faved);
	}, [faved]);

	const isFaved = (fav?.timestamp || 0) > 0;
	const iconName = isFaved ? 'heart-full' : 'heart-empty';

	const handleToggleFav = useCallback((): void => {
		if (id && fav) {
			toggleFav({variables: {id, remove: isFaved}})
				.then(result => {
					setFav({timestamp: result.data?.fav?.faved ? (new Date(result.data.fav.faved)).valueOf() : undefined});
					snackSuccess(result.data?.fav?.faved ? 'Added to Favorites' : 'Removed from Favorites');
					dataService.notifyHomeDataChange().catch(e => console.error(e));
				});
		}
	}, [id, fav, toggleFav, isFaved]);

	if (loading || !fav) {
		return (
			<View style={[styles.button, style]}>
				<ThemedIcon name={iconName} size={styles.buttonIcon.fontSize} color={theme.muted}/>
			</View>
		);
	}
	return (
		<TouchableOpacity style={[styles.button, style]} onPress={handleToggleFav}>
			<ThemedIcon name={iconName} size={styles.buttonIcon.fontSize}/>
		</TouchableOpacity>
	);

};
