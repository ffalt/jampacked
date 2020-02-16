// Type definitions for react-native-background-timer 2.0
// Project: https://github.com/likern/react-native-enhanced-popup-menu#readme
// Definitions by: Tjark Smalla <https://github.com/chillkroeteTTS>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

import React, {ReactNode} from 'react';
import {StyleProp, TextStyle, ViewStyle} from 'react-native';

export declare enum Position {
	TOP_LEFT = 'TOP_LEFT',
	TOP_RIGHT = 'TOP_RIGHT',
	TOP_CENTER = 'TOP_CENTER',
	BOTTOM_LEFT = 'BOTTOM_LEFT',
	BOTTOM_RIGHT = 'BOTTOM_RIGHT',
	BOTTOM_CENTER = 'BOTTOM_CENTER'
}

export declare class MenuItem extends React.PureComponent<{
	children?: ReactNode | Array<ReactNode>;
	style?: StyleProp<ViewStyle>;
	textStyle?: StyleProp<TextStyle>;
	disabled?: boolean;
	disabledTextColor?: string;
	underlayColor?: string;
	onPress?: () => void;
}> {
}

export declare class MenuDivider extends React.PureComponent<{
	color?: string;
}> {
}

export interface Offset {
	left: number;
	right: number;
	top: number;
	bottom: number;
}

export type ComputeOffsetFunc = (left: number, top: number, width: number, height: number) => Offset;

export declare class Menu extends React.Component<{
	children?: ReactNode | Array<ReactNode>;
	style?: StyleProp<ViewStyle>;
	onHidden?: () => void;
}> {
	show(ref: any, stickTo?: Position, extraOffset?: Offset, computeOffset?: ComputeOffsetFunc): void;

	hide(): void;
}

export default Menu;
