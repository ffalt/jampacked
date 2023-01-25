import React from 'react';
import {useTheme} from '../style/theming';
import {RefreshControl, SectionList, SectionListData, SectionListRenderItem, StyleProp, ViewStyle} from 'react-native';
import {ListEmpty} from './ListEmpty';
import {Separator} from './Separator';
import {defaultKeyExtractor} from '../utils/list.utils';
import {ErrorView} from './ErrorView';

interface DefaultSectionListParams<T> {
	style?: StyleProp<ViewStyle>;
	error?: Error;
	ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
	ItemSeparatorComponent?: React.ComponentType<any> | null;
	SectionSeparatorComponent?: React.ComponentType<any> | null;
	renderItem?: SectionListRenderItem<T>;
	renderSectionHeader?: (info: { section: SectionListData<T> }) => React.ReactElement | null;
	sections?: Array<SectionListData<T>>;
	reload: () => void;
	loading: boolean;
	extraData?: any;
}

export const DefaultSectionList: React.FC<DefaultSectionListParams<any>> = (
	{
		sections, error, reload, renderItem, extraData, loading, style,
		renderSectionHeader,
		SectionSeparatorComponent,
		ListHeaderComponent,
		ItemSeparatorComponent
	}
) => {
	const theme = useTheme();
	if (error) {
		return (<ErrorView error={error} onRetry={reload}/>);
	}
	return (
		<SectionList
			style={style}
			sections={sections || []}
			extraData={extraData}
			ListHeaderComponent={ListHeaderComponent}
			ListEmptyComponent={<ListEmpty list={sections}/>}
			renderSectionHeader={renderSectionHeader}
			ItemSeparatorComponent={ItemSeparatorComponent || (ItemSeparatorComponent === null) ? ItemSeparatorComponent : Separator}
			SectionSeparatorComponent={SectionSeparatorComponent || (SectionSeparatorComponent === null) ? SectionSeparatorComponent : Separator}
			keyExtractor={defaultKeyExtractor}
			renderItem={renderItem}
			refreshControl={(
				<RefreshControl
					refreshing={loading}
					onRefresh={reload}
					progressViewOffset={90}
					progressBackgroundColor={theme.refreshCtrlBackground}
					colors={theme.refreshCtrlColors}
				/>
			)}
		/>
	);
};
