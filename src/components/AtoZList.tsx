import React, {PureComponent, RefObject} from 'react';
import {FlatList, FlatListProps, StyleProp, StyleSheet, View, ViewProps} from 'react-native';
import AtoZPicker from './AtoZPicker';

type commonItemLayoutFunc = (data: any, index: number) => { length: number, offset: number, index: number };

export function commonItemLayout(itemHeight: number = 60): commonItemLayoutFunc {
	return (data: any, index: number): { length: number, offset: number, index: number } => ({
		length: itemHeight,
		offset: itemHeight * index,
		index
	});
}

interface AtoZListProps<T> extends FlatListProps<T> {
	itemHeight: number;
}

interface SectionItem {
	letter: string;
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

export default class AtoZList<T extends SectionItem> extends PureComponent<AtoZListProps<T>> {
	containerRef: RefObject<FlatList<T>> = React.createRef();

	private onTouchLetter = (letter: string): void => {
		if (this.containerRef.current) {
			const index = (this.props.data || []).findIndex(d => d.letter === letter);
			if (index >= 0) {
				this.containerRef.current.scrollToIndex({index});
			}
		}
	};

	render(): JSX.Element {
		return (
			<View style={styles.container}>
				<FlatList
					ref={this.containerRef}
					{...this.props}
					getItemLayout={commonItemLayout(this.props.itemHeight)}
				/>
				<AtoZPicker
					data={this.props.data}
					onTouchLetter={this.onTouchLetter}
				/>
			</View>
		);
	}

}
