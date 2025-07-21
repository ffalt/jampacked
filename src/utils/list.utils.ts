import { sharedStyles } from '../style/shared';

type commonItemLayoutFunc = (data: unknown, index: number) => { length: number; offset: number; index: number };

export function commonItemLayout(itemHeight?: number): commonItemLayoutFunc | undefined {
	if (!itemHeight) {
		return;
	}
	return (data: unknown, index: number): { length: number; offset: number; index: number } => ({
		length: itemHeight,
		offset: itemHeight * index,
		index
	});
}

export const defaultItemLayout = commonItemLayout(sharedStyles.item.height);

export const defaultKeyExtractor = (item: { id: string }): string => item.id;
