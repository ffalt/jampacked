import React from 'react';
import {StyleProp, Text, TextStyle} from 'react-native';
import {useTheme} from '../style/theming';

export const ThemedText: React.FC<{ numberOfLines?: number; style?: StyleProp<TextStyle> }> = ({children, style, numberOfLines}) => {
	const theme = useTheme();
	return (
		<Text numberOfLines={numberOfLines} style={[{color: theme.textColor}, style]}>{children}</Text>
	);
};

