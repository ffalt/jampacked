import {useEffect, useState} from 'react';
import dataService from './data';
import {JamObjectType} from './jam';
import {PinState} from './types';

export function usePinState(id?: string, objType?: JamObjectType): PinState | undefined {
	const [stat, setStat] = useState<PinState | undefined>();

	useEffect(() => {
		let isSubscribed = true;

		const update = (state: PinState): void => {
			if (isSubscribed) {
				setStat(state);
			}
		};

		if (id && objType) {
			dataService.pin.subscribePinChangeUpdates(id, update);
			dataService.pin.getPinState(id).then(update);
		}
		return (): void => {
			isSubscribed = false;
			if (id) {
				dataService.pin.unsubscribePinChangeUpdates(id, update);
			}
		};
	}, [id, objType]);

	return stat;
}

