import React from 'react';
import {StyleProp, TextStyle} from 'react-native';
import {useTheme} from '../style/theming';
import {FontelloIcon} from './FontelloIcon';

interface ThemedIconProps {
	name: string,
	style?: StyleProp<TextStyle> | Array<StyleProp<TextStyle> | undefined | false>;
}

const ThemedIcon: React.FC<ThemedIconProps> = (props?: ThemedIconProps) => {
	const theme = useTheme();
	return (
		<FontelloIcon name={props?.name} style={[{color: theme.textColor}, props?.style]}/>
	);
};

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

export default ThemedIcon;
