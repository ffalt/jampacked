/**

	based on https://github.com/rgovindji/react-native-atoz-list

 */
import React, {MutableRefObject, useCallback, useState} from 'react';
import {FlatList, FlatListProps, StyleSheet, View} from 'react-native';
import AtoZPicker from './AtoZPicker';
import {commonItemLayout} from '../utils/list.utils';
import {SearchBar} from './SearchBar';

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
	const Header = (
		<>
			{props.ListHeaderComponent}
			<SearchBar style={styles.searchBar}/>
		</>
	);

	const onScroll = useCallback((event) => {
		const offset = event.nativeEvent.contentOffset.y;
		if (itemHeight) {
			const index = Math.floor(offset / itemHeight);
			const item = (data || [])[index];
			setActiveLetter(item?.letter);
		}
	}, [data, itemHeight]);

	return (
		<View style={styles.container}>
			<FlatList
				ref={containerRef}
				{...props}
				ListHeaderComponent={Header}
				getItemLayout={getItemLayout}
				onScroll={onScroll}
			/>
			<AtoZPicker
				data={data}
				activeLetter={activeLetter}
				onTouchLetter={onTouchLetter}
			/>
		</View>
	);

};
