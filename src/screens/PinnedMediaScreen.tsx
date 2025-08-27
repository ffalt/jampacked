import React, { useCallback, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { PinnedMediaItem } from '../components/PinnedMediaItem';
import { usePinnedMedia } from '../services/pin.hooks.ts';
import { DownloadsRoute, DownloadsRouteProps } from '../navigators/Routing';
import { SectionListData, TouchableOpacity } from 'react-native';
import { TrackDisplay, TrackItem } from '../components/TrackItem';
import { DefaultSectionList } from '../components/DefaultSectionList.tsx';
import { Separator } from '../components/Separator';
import { downloadStateToString, useTrackPlayerDownloadCached } from '../services/player.api.ts';
import { useTheme } from '../style/theming';
import { TrackEntry } from '../types/track.ts';
import { PinMedia } from '../types/pin.ts';
import pinService from '../services/pin.service.ts';

export const PinnedTrackItem: React.FC<{ track: TrackEntry }> = React.memo(({ track }) => {
	const download = useTrackPlayerDownloadCached(track.id, pinService.manager);
	const trackDisplay = (t: TrackEntry): TrackDisplay => ({
		column1: t.trackNr,
		column2title: t.title,
		column2sub: download ? downloadStateToString(download.state) : 'Not downloaded',
		column3: t.duration
	});
	return (
		<TrackItem
			track={track}
			showCheck={false}
			displayFunc={trackDisplay}
		/>
	);
});

interface PinListSection {
	pin: PinMedia;
	collapsed: boolean;
	data: Array<TrackEntry>;
}

export const PinnedMediaScreen: React.FC<DownloadsRouteProps<DownloadsRoute.PINNED>> = () => {
	const { media, loading } = usePinnedMedia();
	const theme = useTheme();
	const [expandedSections, setExpandedSections] = useState(new Set());

	const ListHeaderComponent = (<PageHeader title="Media" subtitle="Pinned" />);
	const reload = useCallback(() => {
		// TODO reload pinned download list
	}, []);

	const list: Array<SectionListData<TrackEntry, PinListSection>> = media.map(p => ({
		pin: p,
		collapsed: true,
		data: p.tracks
	}));

	const renderItem = ({ section, item }: { section: PinListSection; item: TrackEntry }): React.JSX.Element | null => {
		const isExpanded = expandedSections.has(section.pin.id);
		if (!isExpanded) {
			return null;
		}
		return (
			<>
				<PinnedTrackItem track={item} />
				<Separator />
			</>
		);
	};

	const handleToggle = (id: string): void => {
		setExpandedSections(current => {
			const next = new Set(current);
			if (next.has(id)) {
				next.delete(id);
			} else {
				next.add(id);
			}
			return next;
		});
	};

	const renderSection = ({ section }: { section: PinListSection }): React.JSX.Element => {
		const isExpanded = expandedSections.has(section.pin.id);
		return (
			<>
				<Separator />
				<TouchableOpacity
					style={{ backgroundColor: isExpanded ? theme.activeBackgroundColor : undefined }}
					onPress={(): void => handleToggle(section.pin.id)}>
					<PinnedMediaItem item={section.pin} />
				</TouchableOpacity>
				<Separator />
			</>
		);
	};

	return (
		<DefaultSectionList<TrackEntry, PinListSection>
			sections={list}
			extraData={expandedSections}
			ListHeaderComponent={ListHeaderComponent}
			ItemSeparatorComponent={null}
			SectionSeparatorComponent={null}
			renderSectionHeader={info => renderSection(info)}
			renderItem={info => renderItem(info)}
			loading={loading}
			reload={reload}
		/>
	);
};
