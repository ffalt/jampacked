import React from 'react';
import {useTheme} from '../style/theming';
import {FontelloIcon} from './FontelloIcon';

interface ThemedIconProps {
	name: string;
	color?: string;
	size?: number;
}

export const ThemedIcon: React.FC<ThemedIconProps> = React.memo(({name, size, color}) => {
	const theme = useTheme();
	const iconStyle = [{color: color || theme.textColor, fontSize: size}];
	return (
		<FontelloIcon name={name} style={iconStyle}/>
	);
});

interface TabBarIconProps {
	focused: boolean;
	color: string;
	size: number;
}

type TabBarIconFunc = (props: TabBarIconProps) => JSX.Element;

export function getTabBarIcon(name: string): TabBarIconFunc {
	return (props: TabBarIconProps): JSX.Element => {
		const {focused, color} = props;
		const size = focused ? 26 : 22;
		return (
			<FontelloIcon name={name} size={size} color={color}/>
		);
	};
}
