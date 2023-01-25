import React from 'react';
import {StyleProp, TextStyle, TouchableOpacity, ViewStyle} from 'react-native';
import {useTheme} from '../style/theming';
import {ThemedIcon} from './ThemedIcon';
import {ThemedText} from './ThemedText';

export const ClickLabelIcon: React.FC<{ label: string; iconName: string, style?: StyleProp<ViewStyle>, labelStyle?: StyleProp<TextStyle>, fontSize?: number, color?: string, disabled?: boolean, muted?: boolean, clickThrough?: boolean, onPress: () => void }> =
	({label, iconName, clickThrough, style, labelStyle, fontSize, disabled, color, muted, onPress}) => {
		const theme = useTheme();
		const iconColor = color || (muted ? theme.muted : undefined);

		return (
			<TouchableOpacity style={style} onPress={(e): void => {
				onPress();
				if (!clickThrough) {
					e.preventDefault();
					e.stopPropagation();
				}
			}} disabled={disabled}>
				<ThemedIcon name={iconName} size={fontSize} color={iconColor}/>
				<ThemedText style={labelStyle}>{label}</ThemedText>
			</TouchableOpacity>
		);

	};
