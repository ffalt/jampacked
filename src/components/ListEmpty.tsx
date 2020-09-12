import React, {useEffect, useState} from 'react';
import {ThemedText} from './ThemedText';
import {StyleSheet, View} from 'react-native';
import {useTheme} from '../style/theming';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 0,
		marginTop: 80,
		alignItems: 'center',
		justifyContent: 'center'
	},
	empty: {
		letterSpacing: 2
	}
});

export const ListEmpty: React.FC<{ list?: Array<any> }> = ({list}) => {
	const [text, setText] = useState('');
	const theme = useTheme();

	useEffect(() => {
		let isSubscribed = false;
		let delayDebounceFn: any;
		if (!list) {
			isSubscribed = true;
			setText('');
			delayDebounceFn = setTimeout(() => {
				if (isSubscribed) {
					setText('Loading');
				}
			}, 700);
		} else {
			setText((list.length ? '' : 'No entries'));
		}
		return (): void => {
			if (isSubscribed) {
				isSubscribed = false;
				clearTimeout(delayDebounceFn);
			}
		};
	}, [list]);

	return (
		<View style={styles.container}>
			<ThemedText style={[styles.empty, {color: theme.muted}]}>{text}</ThemedText>
		</View>
	);
};
