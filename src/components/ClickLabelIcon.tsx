import React from 'react';
import { StyleProp, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import { useTheme } from '../style/theming';
import { ThemedIcon } from './ThemedIcon';
import { ThemedText } from './ThemedText';

interface ClickLabelIconParameters {
	label: string;
	iconName: string;
	style?: StyleProp<ViewStyle>;
	labelStyle?: StyleProp<TextStyle>;
	fontSize?: number;
	color?: string;
	disabled?: boolean;
	muted?: boolean;
	clickThrough?: boolean;
	onPress: () => void;
}

export const ClickLabelIcon: React.FC<ClickLabelIconParameters> =
	({ label, iconName, clickThrough, style, labelStyle, fontSize, disabled, color, muted, onPress }) => {
		const theme = useTheme();
		const iconColor = color || (muted ? theme.muted : undefined);

		return (
			<TouchableOpacity
				style={style}
				onPress={(event): void => {
					onPress();
					if (!clickThrough) {
						event.preventDefault();
						event.stopPropagation();
					}
				}}
				disabled={disabled}>
				<ThemedIcon name={iconName} size={fontSize} color={iconColor} />
				<ThemedText style={labelStyle}>{label}</ThemedText>
			</TouchableOpacity>
		);
	};
