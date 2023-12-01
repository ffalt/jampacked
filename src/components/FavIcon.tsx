import React, {useCallback, useEffect, useState} from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {JamObjectType} from '../services/jam';
import {useFavMutation, useLazyFavQuery} from '../services/queries/fav';
import {snackSuccess} from '../services/snack';
import dataService from '../services/data';
import {ClickIcon} from './ClickIcon';

function transformState(faved?: { timestamp?: number }): { isFaved: boolean, iconName: string } {
	const isFaved = (faved?.timestamp || 0) > 0;
	const iconName = isFaved ? 'heart-full' : 'heart-empty';
	return {isFaved, iconName};
}

export const FavIcon: React.FC<{ id?: string; objType: JamObjectType; style?: StyleProp<ViewStyle>, fontSize?:number }> = ({id, style,fontSize}) => {
	const [state, setState] = useState<{ id?: string, isFaved: boolean, iconName: string }>(transformState());
	const [getFaved, {faved, loading, setFav}] = useLazyFavQuery();
	const [toggleFav] = useFavMutation();

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
		if (!loading && id && faved) {
			const isFaved = (faved.timestamp || 0) > 0;
			toggleFav({variables: {id, remove: isFaved}})
				.then(result => {
					const fav = {timestamp: result.data?.fav?.faved ? (new Date(result.data.fav.faved)).valueOf() : undefined};
					setState({id, ...transformState(fav)});
					setFav(fav);
					snackSuccess(!isFaved ? 'Added to Favorites' : 'Removed from Favorites');
					dataService.cache.updateHomeData().catch(console.error);
				});
		}
	}, [id, setFav, loading, faved, toggleFav]);

	return (<ClickIcon style={style} fontSize={fontSize} iconName={state.iconName} onPress={handleToggleFav} muted={(loading || !faved)}/>);
};
