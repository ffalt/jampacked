import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../style/theming';
import CheckBox from '@react-native-community/checkbox';

export const ThemedCheckbox: React.FC<{ isSelected?: boolean; style?: StyleProp<ViewStyle> }> = ({ style, isSelected }) => {
	const theme = useTheme();
	return (
		<CheckBox
			value={isSelected}
			tintColors={{ true: theme.checkbox.checked, false: theme.checkbox.unchecked }}
			style={style}
		/>
	);
};
