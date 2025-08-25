import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { JamObjectType } from '../services/jam';
import { useFavMutation, useLazyFavQuery } from '../services/queries/fav';
import { snackSuccess } from '../services/snack';
import dataService from '../services/data';
import { ClickIcon } from './ClickIcon';

export const FavIcon: React.FC<{ id?: string; objType: JamObjectType; style?: StyleProp<ViewStyle>; fontSize?: number }> = ({ id, style, fontSize }) => {
	const [isFaved, setIsFaved] = useState<boolean>(false);
	const [getFaved, { faved, loading, setFav }] = useLazyFavQuery();
	const [toggleFav] = useFavMutation();
	const isUnmountedReference = useRef(true);

	useEffect(() => {
		isUnmountedReference.current = false;
		return () => {
			isUnmountedReference.current = true;
		};
	}, []);

	useEffect(() => {
		if (id && !isUnmountedReference.current) {
			getFaved(id);
		}
	}, [getFaved, id]);

	useEffect(() => {
		if (loading) {
			return;
		}
		if (faved) {
			if (isUnmountedReference.current) {
				return;
			}
			setIsFaved((faved?.timestamp ?? 0) > 0);
		}
	}, [faved, loading]);

	const handleToggleFav = useCallback((): void => {
		if (!loading && id) {
			toggleFav({ variables: { id, remove: isFaved } })
				.then(result => {
					if (isUnmountedReference.current) {
						return;
					}
					const fav = { timestamp: result.data?.fav?.faved ? (new Date(result.data.fav.faved)).valueOf() : undefined };
					setIsFaved((fav?.timestamp ?? 0) > 0);
					setFav(fav);
					snackSuccess(isFaved ? 'Removed from Favorites' : 'Added to Favorites');
					dataService.cache.updateHomeData().catch(console.error);
				})
				.catch(console.error);
		}
	}, [loading, id, toggleFav, isFaved, setFav]);

	const iconName = isFaved ? 'heart-full' : 'heart-empty';
	return (
		<ClickIcon
			style={style}
			fontSize={fontSize}
			iconName={iconName}
			onPress={handleToggleFav}
			muted={(loading || !faved)}
		/>
	);
};
