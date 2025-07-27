import React from 'react';
import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native';
import { useTheme } from '../style/theming';
import { ThemedIcon } from './ThemedIcon';

interface ClickIconParameters {
	iconName: string;
	style?: StyleProp<ViewStyle>;
	fontSize?: number;
	color?: string;
	disabled?: boolean;
	muted?: boolean;
	clickThrough?: boolean;
	onPress: () => void;
}

export const ClickIcon: React.FC<ClickIconParameters> =
	({ iconName, clickThrough, style, fontSize, disabled, color, muted, onPress }) => {
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
				disabled={disabled}
			>
				<ThemedIcon name={iconName} size={fontSize} color={iconColor} />
			</TouchableOpacity>
		);
	};
