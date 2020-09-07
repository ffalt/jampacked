/**

	based on https://github.com/rgovindji/react-native-atoz-list

 */
import React, {MutableRefObject, useCallback} from 'react';
import {FlatList, FlatListProps, StyleSheet, View} from 'react-native';
import AtoZPicker from './AtoZPicker';

type commonItemLayoutFunc = (data: unknown, index: number) => { length: number, offset: number, index: number };

export function commonItemLayout(itemHeight?: number): commonItemLayoutFunc | undefined {
	if (!itemHeight) {
		return;
	}
	return (data: unknown, index: number): { length: number, offset: number, index: number } => ({
		length: itemHeight,
		offset: itemHeight * index,
		index
	});
}

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
	const containerRef: MutableRefObject<FlatList<T> | null> = React.useRef<FlatList<T>>(null);
	const {itemHeight, data, numColumns} = props;

	const onTouchLetter = useCallback((letter: string): void => {
		if (containerRef.current) {
			const index = (data || []).findIndex(d => d.letter === letter);
			if (index >= 0) {
				const scrollIndex = Math.floor(index / (numColumns || 1));
				containerRef.current.scrollToIndex({index: scrollIndex});
			}
		}
	}, [data, numColumns]);

	const getItemLayout = React.useMemo(() => commonItemLayout(itemHeight), [itemHeight]);

	return (
		<View style={styles.container}>
			<FlatList
				ref={containerRef}
				{...props}
				getItemLayout={getItemLayout}
			/>
			<AtoZPicker
				data={data}
				onTouchLetter={onTouchLetter}
			/>
		</View>
	);

};
