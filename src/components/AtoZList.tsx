/**

	based on https://github.com/rgovindji/react-native-atoz-list

 */
import React, {MutableRefObject, useCallback, useEffect, useState} from 'react';
import {FlatList, FlatListProps, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, View} from 'react-native';
import {AtoZPicker} from './AtoZPicker';
import {commonItemLayout} from '../utils/list.utils';

interface AtoZListProps<T> extends FlatListProps<T> {
	itemHeight?: number;
}

interface SectionItem {
	letter: string;
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	searchBar: {
		paddingRight: 30
	}
});

export const AtoZList: React.FC<AtoZListProps<any>> = <T extends SectionItem, >(props: AtoZListProps<T>) => {
	const containerRef: MutableRefObject<FlatList<T> | null> = React.useRef<FlatList<T>>(null);
	const {itemHeight, data, numColumns} = props;
	const [activeLetter, setActiveLetter] = useState<string | undefined>();
	const [letters, setLetters] = useState<Array<string>>([]);

	const onTouchLetter = useCallback((letter: string): void => {
		if (containerRef.current) {
			const index = ((data as Array<T>) || []).findIndex(d => d.letter === letter);
			if (index >= 0) {
				const scrollIndex = Math.floor(index / (numColumns || 1));
				containerRef.current.scrollToIndex({index: scrollIndex});
			}
		}
	}, [data, numColumns]);

	const getItemLayout = React.useMemo(() => commonItemLayout(itemHeight), [itemHeight]);

	const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
		const offset = event.nativeEvent.contentOffset.y;
		if (itemHeight) {
			const index = Math.floor(offset / itemHeight);
			const item = (data || [])[index];
			setActiveLetter(item?.letter);
		}
	}, [data, itemHeight]);

	useEffect(() => {
		const list: Array<string> = [];
		const items = (data || []);
		if (items.length > 20) {
			(items as Array<T>).forEach(item => {
				if (!list.includes(item.letter)) {
					list.push(item.letter);
				}
			});
		}
		setLetters(list);
	}, [data]);

	return (
		<View style={styles.container}>
			<FlatList
				ref={containerRef}
				{...props}
				getItemLayout={getItemLayout}
				onScroll={onScroll}
			/>
			<AtoZPicker
				letters={letters}
				activeLetter={activeLetter}
				onTouchLetter={onTouchLetter}
			/>
		</View>
	);

};
