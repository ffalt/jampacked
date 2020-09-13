import {useEffect, useState} from 'react';
import dataService, {PinState} from './data';
import {JamObjectType} from './jam';

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
			dataService.subscribePinChangeUpdates(id, update);
			dataService.getPinState(id).then(update);
		}
		return (): void => {
			isSubscribed = false;
			if (id) {
				dataService.unsubscribePinChangeUpdates(id, update);
			}
		};
	}, [id, objType]);

	return stat;
}

