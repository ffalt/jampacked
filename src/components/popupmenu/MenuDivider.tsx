import React from 'react';
import {StyleSheet, View} from 'react-native';

const styles = StyleSheet.create({
	divider: {
		flex: 1,
		borderBottomWidth: StyleSheet.hairlineWidth
	}
});

export const MenuDivider: React.FC<{ color?: string }> = React.memo(({color}: { color?: string }) => (
	<View style={[styles.divider, {borderBottomColor: color || 'rgba(0,0,0,0.12)'}]}/>
));
