import React, { useEffect, useRef, useState } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { JamObjectType } from '../services/jam';
import { snackSuccess } from '../services/snack';
import dataService from '../services/data';
import { ClickIcon } from './ClickIcon';
import { useLazyRateQuery, useRateMutation } from '../services/queries/rate';
import { staticTheme } from '../style/theming';

const styles = StyleSheet.create({
	view: {
		flex: 0,
		flexDirection: 'row',
		justifyContent: 'flex-end',
		columnGap: staticTheme.paddingLarge,
		flexGrow: 1
	},
	star: {
	}
});

export const Rating: React.FC<{ id?: string; objType: JamObjectType; style?: StyleProp<ViewStyle>, fontSize?: number }> = ({ id, style, fontSize }) => {
	const [rate, setRate] = useState<number>(0);
	const [getRating, { rating, loading }] = useLazyRateQuery();
	const [setRatingMutation] = useRateMutation();
	const isUnmountedRef = useRef(true);

	useEffect(() => {
		isUnmountedRef.current = false;
		return () => {
			isUnmountedRef.current = true;
		};
	}, []);

	useEffect(() => {
		if (id && !isUnmountedRef.current) {
			getRating(id);
		}
	}, [getRating, id]);

	useEffect(() => {
		if (loading) {
			return;
		}
		if (rating) {
			if (isUnmountedRef.current) {
				return;
			}
			setRate(rating.rated === undefined ? -1 : rating.rated);
		}
	}, [rating, loading]);

	const handleRate = (r: number): void => {
		if (!loading && id) {
			const destRating = r === rate ? r - 1 : r;
			setRatingMutation({ variables: { id, rating: destRating } })
				.then(result => {
					if (isUnmountedRef.current) {
						return;
					}
					const resultRating = result.data?.rate?.rated;
					const newRate = resultRating === undefined || resultRating === null ? 0 : resultRating;
					setRate(newRate)
					snackSuccess(`Rated with ${newRate}`);
					dataService.cache.updateHomeData().catch(console.error);
				});
		}
	};

	const iconName1 = rate < 1 ? 'star-empty' : 'star-full';
	const iconName2 = rate < 2 ? 'star-empty' : 'star-full';
	const iconName3 = rate < 3 ? 'star-empty' : 'star-full';
	const iconName4 = rate < 4 ? 'star-empty' : 'star-full';
	const iconName5 = rate < 5 ? 'star-empty' : 'star-full';
	return (
		<View style={[styles.view, style]}>
			<ClickIcon
				style={styles.star}
				fontSize={fontSize}
				iconName={iconName1}
				onPress={() => handleRate(1)}
				muted={(loading || rate < 1)}
			/>
			<ClickIcon
				style={styles.star}
				fontSize={fontSize}
				iconName={iconName2}
				onPress={() => handleRate(2)}
				muted={(loading || rate < 2)}
			/>
			<ClickIcon
				style={styles.star}
				fontSize={fontSize}
				iconName={iconName3}
				onPress={() => handleRate(3)}
				muted={(loading || rate < 3)}
			/>
			<ClickIcon
				style={styles.star}
				fontSize={fontSize}
				iconName={iconName4}
				onPress={() => handleRate(4)}
				muted={(loading || rate < 4)}
			/>
			<ClickIcon
				style={styles.star}
				fontSize={fontSize}
				iconName={iconName5}
				onPress={() => handleRate(5)}
				muted={(loading || rate < 5)}
			/>
		</View>
	);
};
