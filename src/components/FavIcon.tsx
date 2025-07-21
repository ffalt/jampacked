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
	const isUnmountedRef = useRef(true);

	useEffect(() => {
		isUnmountedRef.current = false;
		return () => {
			isUnmountedRef.current = true;
		};
	}, []);

	useEffect(() => {
		if (id && !isUnmountedRef.current) {
			getFaved(id);
		}
	}, [getFaved, id]);

	useEffect(() => {
		if (loading) {
			return;
		}
		if (faved) {
			if (isUnmountedRef.current) {
				return;
			}
			setIsFaved((faved?.timestamp || 0) > 0);
		}
	}, [faved, loading]);

	const handleToggleFav = useCallback((): void => {
		if (!loading && id) {
			toggleFav({ variables: { id, remove: isFaved } })
				.then((result) => {
					if (isUnmountedRef.current) {
						return;
					}
					const fav = { timestamp: result.data?.fav?.faved ? (new Date(result.data.fav.faved)).valueOf() : undefined };
					setIsFaved((fav?.timestamp || 0) > 0);
					setFav(fav);
					snackSuccess(!isFaved ? 'Added to Favorites' : 'Removed from Favorites');
					dataService.cache.updateHomeData().catch(console.error);
				});
		}
	}, [loading, id, toggleFav, isFaved, setFav]);

	const iconName = isFaved ? 'heart-full' : 'heart-empty';
	return (<ClickIcon
		style={style}
		fontSize={fontSize}
		iconName={iconName}
		onPress={handleToggleFav}
		muted={(loading || !faved)}
	/>);
};
