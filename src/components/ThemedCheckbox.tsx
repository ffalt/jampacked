import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../style/theming';

const styles = StyleSheet.create({
	container: {
		width: 20,
		height: 20,
		borderWidth: 2,
		borderRadius: 3,
		alignItems: 'center',
		justifyContent: 'center'
	},
	checkmark: {
		width: 10,
		height: 6,
		borderLeftWidth: 2,
		borderBottomWidth: 2,
		marginTop: -2,
		transform: [{ rotate: '-45deg' }]
	}
});

export const ThemedCheckbox: React.FC<{ isSelected?: boolean; style?: StyleProp<ViewStyle> }> = ({ style, isSelected }) => {
	const theme = useTheme();
	const checked = isSelected ?? false;
	const tintColor = checked ? theme.checkbox.checked : theme.checkbox.unchecked;
	const checkStyle = { borderColor: tintColor, backgroundColor: checked ? tintColor : 'transparent' };
	return (
		<View
			accessible={true}
			accessibilityRole="checkbox"
			accessibilityState={{ checked }}
			style={[styles.container, checkStyle, style]}
		>
			{checked && <View style={[styles.checkmark, { borderColor: theme.background }]} />}
		</View>
	);
};
