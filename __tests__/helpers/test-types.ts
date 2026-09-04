import type { StyleProp, ViewStyle } from 'react-native';

export interface IndexState {
	loading: boolean;
	error?: Error;
	called: boolean;
	index?: unknown;
}

export interface IndexListProps {
	index?: unknown;
	title: string;
	refreshing?: boolean;
	onRefresh?: () => void;
}

export interface ErrorViewProps {
	error: unknown;
	onRetry: () => void;
}

export interface ClickIconProps {
	iconName: string;
	disabled?: boolean;
	style?: StyleProp<ViewStyle>;
	onPress: () => void;
}
