import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { JamObjectType } from '../services/jam';
import { useFavMutation, useLazyFavQuery } from '../services/queries/fav';
import { snackSuccess } from '../utils/snack.ts';
import { ClickIcon } from './ClickIcon';
import cacheService from '../services/cache.service.ts';

export const FavIcon: React.FC<{ id?: string; objType: JamObjectType; style?: StyleProp<ViewStyle>; fontSize?: number }> = ({ id, style, fontSize }) => {
	// optimistic local state only for immediate UI feedback; null means no override
	const [optimistic, setOptimistic] = useState<boolean | null>(null);
	const [getFaved, { faved, loading, setFav }] = useLazyFavQuery();
	const [toggleFav] = useFavMutation();
	const isUnmountedReference = useRef(true);
	const defaultFaved = (faved?.timestamp ?? 0) > 0;
	const isFaved = optimistic ?? defaultFaved;

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

	const handleToggleFav = useCallback((): void => {
		if (!loading && id) {
			// optimistic flip: if no optimistic override, use opposite of defaultFaved
			setOptimistic(previous => (previous === null ? (defaultFaved ? false : true) : (previous ? false : true)));
			toggleFav({ variables: { id, remove: isFaved } })
				.then(result => {
					if (isUnmountedReference.current) {
						return;
					}
					const fav = { timestamp: result.data?.fav?.faved ? (new Date(result.data.fav.faved)).valueOf() : undefined };
					// clear optimistic override and rely on query state (setFav updates query cache)
					setOptimistic(null);
					setFav(fav);
					snackSuccess(isFaved ? 'Removed from Favorites' : 'Added to Favorites');
					cacheService.updateHomeData().catch(console.error);
				})
				.catch(error => {
					// on error, clear optimistic state and log
					setOptimistic(null);
					console.error(error);
				});
		}
	}, [loading, id, toggleFav, isFaved, setFav, defaultFaved]);

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
