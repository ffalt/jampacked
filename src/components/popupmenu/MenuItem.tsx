import React, {ReactNode} from 'react';
import {Platform, StyleProp, StyleSheet, Text, TextStyle, TouchableHighlight, ViewStyle} from 'react-native';

const styles = StyleSheet.create({
	container: {
		height: 48,
		justifyContent: 'center',
		maxWidth: 248,
		minWidth: 124
	},
	title: {
		fontSize: 14,
		fontWeight: '400',
		paddingHorizontal: 16
	}
});

interface MenuItemProps {
	children?: ReactNode | Array<ReactNode>;
	style?: StyleProp<ViewStyle>;
	textStyle?: StyleProp<TextStyle>;
	disabled?: boolean;
	disabledTextColor?: string;
	underlayColor?: string;
	onPress?: () => void;
}

export const MenuItem: React.FC<MenuItemProps> = (props: MenuItemProps) => {
	const {
		children,
		disabled,
		disabledTextColor,
		onPress,
		style,
		textStyle,
		underlayColor
	} = props;
	return (
		<TouchableHighlight
			disabled={disabled}
			onPress={onPress}
			style={[styles.container, style]}
			underlayColor={underlayColor || '#E0E0E0'}
		>
			<Text
				ellipsizeMode={Platform.OS === 'ios' ? 'clip' : 'tail'}
				numberOfLines={1}
				style={[
					styles.title,
					disabled && {color: disabledTextColor || '#BDBDBD'},
					textStyle,
				]}
			>
				{children}
			</Text>
		</TouchableHighlight>
	);
};

export default MenuItem;
