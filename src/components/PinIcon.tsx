import React, {useCallback} from 'react';
import {StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle} from 'react-native';
import {staticTheme, useTheme} from '../style/theming';
import {ThemedIcon} from './ThemedIcon';
import {JamObjectType} from '../services/jam';
import dataService from '../services/data';
import {usePinState} from '../services/pin-hooks';

const styles = StyleSheet.create({
	button: {
		marginLeft: staticTheme.margin
	},
	buttonIcon: {
		fontSize: 26
	}
});

export const PinIcon: React.FC<{ id?: string; objType: JamObjectType; style?: StyleProp<ViewStyle> }> =
	({id, objType, style}) => {
		const pinned = usePinState(id, objType);
		const theme = useTheme();

		const handleTogglePin = useCallback((): void => {
			if (pinned && id && objType) {
				if (pinned.pinned) {
					dataService.pin.unpin(id);
				} else {
					dataService.pin.pin(id, objType);
				}
			}
		}, [pinned, id, objType]);

		if (pinned === undefined) {
			return (
				<View style={[styles.button, style]}>
					<ThemedIcon name="pin-outline" size={styles.buttonIcon.fontSize} color={theme.muted}/>
				</View>
			);
		}
		if (pinned.active) {
			return (
				<View style={[styles.button, style]}>
					<ThemedIcon name="pin" size={styles.buttonIcon.fontSize} color={theme.muted}/>
				</View>
			);
		}
		const iconName = pinned?.pinned ? 'pin' : 'pin-outline';
		return (
			<TouchableOpacity style={[styles.button, style]} onPress={handleTogglePin}>
				<ThemedIcon name={iconName} size={styles.buttonIcon.fontSize}/>
			</TouchableOpacity>
		);

	};
