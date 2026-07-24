import 'react-native';
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { TrackItem, defaultShowArtistTrackDisplay } from '../../../src/components/TrackItem';
import { TrackEntry } from '../../../src/types/track';
import { ThemedCheckbox } from '../../../src/components/ThemedCheckbox';

const mockCheckbox = jest.mocked(ThemedCheckbox);

jest.mock('../../../src/components/ThemedCheckbox', () => require('../../../__mocks__/components/ThemedCheckbox.tsx'));

interface TapHandlerProps {
	numberOfTaps?: number;
	onHandlerStateChange?: (event: { nativeEvent: { state: number } }) => void;
	children: React.ReactNode;
}

const mockTapHandlers: Array<TapHandlerProps> = [];
const ACTIVE = 4;

jest.mock('react-native-gesture-handler', () => ({
	State: { ACTIVE: 4 },
	TapGestureHandler: (properties: TapHandlerProps): React.ReactNode => {
		mockTapHandlers.push(properties);
		return properties.children;
	}
}));

function makeTrack(overrides: Partial<TrackEntry> = {}): TrackEntry {
	return { id: 't1', duration: '3:00', durationMS: 180_000, trackNr: '7', title: 'Song', artist: 'Artist', album: 'Album', ...overrides };
}

function singleTapHandler(): TapHandlerProps {
	return mockTapHandlers.find(handler => handler.numberOfTaps === undefined)!;
}

function doubleTapHandler(): TapHandlerProps {
	return mockTapHandlers.find(handler => handler.numberOfTaps === 2)!;
}

describe('TrackItem', () => {
	beforeEach(() => {
		mockTapHandlers.length = 0;
	});

	it('shows the track number, title and duration by default', async () => {
		const screen = await render(<TrackItem track={makeTrack({ trackNr: '7', title: 'Song', duration: '3:00' })} />);
		expect(screen.getByText('7')).toBeTruthy();
		expect(screen.getByText('Song')).toBeTruthy();
		expect(screen.getByText('3:00')).toBeTruthy();
	});

	it('shows the artist subtitle with the show-artist display function', async () => {
		const screen = await render(<TrackItem track={makeTrack({ artist: 'Abba' })} displayFunc={defaultShowArtistTrackDisplay} />);
		expect(screen.getByText('Abba')).toBeTruthy();
	});

	it('uses a custom display function', async () => {
		const screen = await render(<TrackItem track={makeTrack()} displayFunc={() => ({ column2title: 'Custom title', column3: '9:99' })} />);
		expect(screen.getByText('Custom title')).toBeTruthy();
		expect(screen.getByText('9:99')).toBeTruthy();
	});

	it('shows a checkbox reflecting the selected state when checks are enabled', async () => {
		await render(<TrackItem track={makeTrack()} showCheck={true} isSelected={true} />);
		expect(mockCheckbox.mock.calls[0][0].isSelected).toBe(true);
	});

	it('does not render a checkbox when checks are disabled', async () => {
		await render(<TrackItem track={makeTrack()} showCheck={false} />);
		expect(mockCheckbox).not.toHaveBeenCalled();
	});

	it('selects the track on a single tap', async () => {
		const setSelected = jest.fn();
		const track = makeTrack();
		await render(<TrackItem track={track} setSelected={setSelected} />);
		singleTapHandler().onHandlerStateChange!({ nativeEvent: { state: ACTIVE } });
		expect(setSelected).toHaveBeenCalledWith(track);
	});

	it('triggers the double-tap action on a double tap', async () => {
		const doubleTab = jest.fn();
		const track = makeTrack();
		await render(<TrackItem track={track} doubleTab={doubleTab} />);
		doubleTapHandler().onHandlerStateChange!({ nativeEvent: { state: ACTIVE } });
		expect(doubleTab).toHaveBeenCalledWith(track);
	});
});
