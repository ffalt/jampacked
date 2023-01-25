import React, {useCallback} from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {JamObjectType} from '../services/jam';
import dataService from '../services/data';
import {usePinState} from '../services/pin-hooks';
import {ClickIcon} from './ClickIcon';

export const PinIcon: React.FC<{ id?: string; objType: JamObjectType; style?: StyleProp<ViewStyle>, fontSize?: number }> = ({id, objType, fontSize, style}) => {
	const pinned = usePinState(id);

	const handleTogglePin = useCallback((): void => {
		if (pinned && id && objType) {
			if (pinned.pinned) {
				dataService.pin.unpin(id).catch(console.error);
			} else {
				dataService.pin.pin(id, objType).catch(console.error);
			}
		}
	}, [pinned, id, objType]);

	const iconName = pinned?.pinned ? 'pin' : 'pin-outline';
	return (<ClickIcon fontSize={fontSize} iconName={iconName} onPress={handleTogglePin} disabled={(pinned === undefined)} style={style}></ClickIcon>);
};
