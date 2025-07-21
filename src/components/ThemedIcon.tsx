import React from 'react';
import { useTheme } from '../style/theming';
import { FontelloIcon } from './FontelloIcon';
import { StyleProp, StyleSheet } from 'react-native';

interface ThemedIconProps {
	name: string;
	color?: string;
	size?: number;
	style?: StyleProp<{
		color?: string;
		size?: number;
		fontSize?: number;
	}>;
}

const styles = StyleSheet.create({
	icon: {
		textAlign: 'center'
	}
});

export const ThemedIcon: React.FC<ThemedIconProps> = React.memo(({ name, size, color, style }) => {
	const theme = useTheme();
	return (
		<FontelloIcon name={name} style={[styles.icon, { color: color || theme.textColor, fontSize: size }, style]}/>
	);
});

interface TabBarIconProps {
	focused: boolean;
	color: string;
	size: number;
}

type TabBarIconFunc = (props: TabBarIconProps) => React.JSX.Element;

export function getTabBarIcon(name: string): TabBarIconFunc {
	return (props: TabBarIconProps): React.JSX.Element => {
		const { focused, color } = props;
		const size = focused ? 26 : 22;
		return (
			<FontelloIcon name={name} size={size} color={color}/>
		);
	};
}
