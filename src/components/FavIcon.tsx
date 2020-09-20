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

function transformState(faved?: { timestamp?: number }): { isFaved: boolean, iconName: string } {
	const isFaved = (faved?.timestamp || 0) > 0;
	const iconName = isFaved ? 'heart-full' : 'heart-empty';
	return {isFaved, iconName};
}

export const FavIcon: React.FC<{ id?: string; objType: JamObjectType; style?: StyleProp<ViewStyle> }> = ({id, style}) => {
	const [state, setState] = useState<{ id?: string, isFaved: boolean, iconName: string }>(transformState());
	const [getFaved, {faved, loading, setFav}] = useLazyFavQuery();
	const [toggleFav] = useFavMutation();
	const theme = useTheme();

	useEffect(() => {
		if (id) {
			setState(prev => {
				if (prev.id !== id) {
					getFaved(id);
					return {id, ...transformState()};
				}
				return prev;
			});
		}
	}, [getFaved, id]);

	useEffect(() => {
		if (faved) {
			setState(prev => {
				return {id: prev.id, ...transformState(faved)};
			});
		}
	}, [faved]);

	const handleToggleFav = useCallback((): void => {
		if (!loading && id) {
			const isFaved = (faved?.timestamp || 0) > 0;
			toggleFav({variables: {id, remove: isFaved}})
				.then(result => {
					const fav = {timestamp: result.data?.fav?.faved ? (new Date(result.data.fav.faved)).valueOf() : undefined};
					setState({id, ...transformState(fav)});
					setFav(fav);
					snackSuccess(!isFaved ? 'Added to Favorites' : 'Removed from Favorites');
					dataService.cache.updateHomeData();
				});
		}
	}, [id, setFav, loading, faved, toggleFav]);

	if (loading || !faved) {
		return (
			<View style={[styles.button, style]}>
				<ThemedIcon name={state.iconName} size={styles.buttonIcon.fontSize} color={theme.muted}/>
			</View>
		);
	}
	return (
		<TouchableOpacity style={[styles.button, style]} onPress={handleToggleFav}>
			<ThemedIcon name={state.iconName} size={styles.buttonIcon.fontSize}/>
		</TouchableOpacity>
	);

};
