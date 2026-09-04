import type { TransformsStyle, ViewStyle } from 'react-native';

// React Native 0.87 promoted the generated ("strict") type definitions to the default
// `types` export condition, and those no longer export FlexStyle or ShadowStyleIOS.
// @d11/react-native-fast-image still imports both to build its ImageStyle, so declare
// them here in terms of the style types 0.87 does export.
declare module 'react-native' {
	export type ShadowStyleIOS = Pick<ViewStyle, 'shadowColor' | 'shadowOffset' | 'shadowOpacity' | 'shadowRadius'>;
	export type FlexStyle = Omit<ViewStyle, keyof ShadowStyleIOS | keyof TransformsStyle>;
}
