import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {ThemedText} from './ThemedText';
import {staticTheme, useTheme} from '../style/theming';

export interface RadioButtonEntry {
	key: string;
	label: string;
}

const styles = StyleSheet.create({
	buttonContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: 42
	},
	circle: {
		height: 20,
		width: 20,
		borderRadius: 10,
		borderWidth: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	checkedCircle: {
		width: 14,
		height: 14,
		borderRadius: 7
	},
	text: {
		paddingLeft: staticTheme.paddingSmall
	}
});

export const RadioButtons: React.FC<{
	options: Array<RadioButtonEntry>;
	value?: string;
	onChange: (value: string) => void;
}> = ({options, value, onChange}) => {
	const theme = useTheme();

	const select = (item: RadioButtonEntry): void => {
		if (onChange) {
			onChange(item.key);
		}
	};

	return (
		<View>
			{options.map(item => (
				<TouchableOpacity key={item.key} style={styles.buttonContainer} onPress={(): void => select(item)}>
					<ThemedText style={styles.text}>{item.label}</ThemedText>
					<View style={[styles.circle, {borderColor: theme.textColor}]}>
						{value === item.key && <View style={[styles.checkedCircle, {backgroundColor: theme.navigation.colors.primary}]}/>}
					</View>
				</TouchableOpacity>
			))}
		</View>
	);
};
