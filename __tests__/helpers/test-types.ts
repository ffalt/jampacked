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
	style?: unknown;
	onPress: () => void;
}
