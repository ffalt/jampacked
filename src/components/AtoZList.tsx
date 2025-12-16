/**

	based on https://github.com/rgovindji/react-native-atoz-list

 */
import React, { RefObject, useCallback, useMemo, useState } from 'react';
import { FlatList, FlatListProps, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, View } from 'react-native';
import { AtoZPicker } from './AtoZPicker';
import { commonItemLayout } from '../utils/list.utils';

interface AtoZListProps<T> extends FlatListProps<T> {
	itemHeight?: number;
}

interface SectionItem {
	letter: string;
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

export const AtoZList: React.FC<AtoZListProps<any>> = <T extends SectionItem, >(props: AtoZListProps<T>) => {
	const containerReference: RefObject<FlatList<T> | null> = React.useRef<FlatList<T>>(null);
	const { itemHeight, data, numColumns } = props;
	const [activeLetter, setActiveLetter] = useState<string | undefined>();

	const onTouchLetter = useCallback((letter: string): void => {
		if (containerReference.current) {
			const index = ((data as Array<T>) ?? []).findIndex(d => d.letter === letter);
			if (index !== -1) {
				const scrollIndex = Math.floor(index / (numColumns ?? 1));
				containerReference.current.scrollToIndex({ index: scrollIndex });
			}
		}
	}, [data, numColumns]);

	const getItemLayout = React.useMemo(() => commonItemLayout(itemHeight), [itemHeight]);

	const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
		const offset = event.nativeEvent.contentOffset.y;
		if (itemHeight) {
			const index = Math.floor(offset / itemHeight);
			const item = (data ?? [])[index];
			setActiveLetter(item?.letter);
		}
	}, [data, itemHeight]);

	const letters = useMemo(() => {
		const list: Array<string> = [];
		const items = (data ?? []);
		if (items.length > 20) {
			for (const item of (items as Array<T>)) {
				if (!list.includes(item.letter)) {
					list.push(item.letter);
				}
			}
		}
		return list;
	}, [data]);

	return (
		<View style={styles.container}>
			<FlatList
				ref={containerReference}
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
