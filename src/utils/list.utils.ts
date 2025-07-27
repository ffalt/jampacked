import { sharedStyles } from '../style/shared';

type commonItemLayoutFunction = (data: unknown, index: number) => { length: number; offset: number; index: number };

export function commonItemLayout(itemHeight?: number): commonItemLayoutFunction | undefined {
	if (!itemHeight) {
		return;
	}
	return (_data: unknown, index: number): { length: number; offset: number; index: number } => ({
		length: itemHeight,
		offset: itemHeight * index,
		index
	});
}

export const defaultItemLayout = commonItemLayout(sharedStyles.item.height);

export const defaultKeyExtractor = (item: { id: string }): string => item.id;
