import { describe, it, expect } from '@jest/globals';
import { executeTrackMenuAction } from '../../../src/components/ActionMenuTrack';
import { JamPlayer } from '../../../src/services/player.service';
import { NavigationService } from '../../../src/navigators/navigation';
import { JamObjectType } from '../../../src/services/jam';
import { TrackEntry } from '../../../src/types/track';

jest.mock('../../../src/services/player.service.ts', () => require('../../../__mocks__/services/player.service.ts'));

jest.mock('../../../src/navigators/navigation', () => require('../../../__mocks__/navigators/navigation.ts'));

function makeTrack(id: string): TrackEntry {
	return { id, duration: '3:00', durationMS: 180_000, trackNr: '1', title: `Title ${id}`, artist: 'Artist', album: 'Album' };
}

describe('executeTrackMenuAction', () => {
	it('plays all selected tracks for bt_m_play', async () => {
		const selection = [makeTrack('1'), makeTrack('2')];
		const result = await executeTrackMenuAction(selection, 'bt_m_play');
		expect(jest.mocked(JamPlayer.playTracks)).toHaveBeenCalledWith(selection);
		expect(result).toBe(true);
	});

	it('queues all selected tracks for bt_m_queue', async () => {
		const selection = [makeTrack('1'), makeTrack('2')];
		const result = await executeTrackMenuAction(selection, 'bt_m_queue');
		expect(jest.mocked(JamPlayer.addTracksToQueue)).toHaveBeenCalledWith(selection);
		expect(result).toBe(true);
	});

	it('plays the single track for bt_s_play', async () => {
		const selection = [makeTrack('1')];
		const result = await executeTrackMenuAction(selection, 'bt_s_play');
		expect(jest.mocked(JamPlayer.playTrack)).toHaveBeenCalledWith(selection[0]);
		expect(result).toBe(true);
	});

	it('queues the single track for bt_s_queue', async () => {
		const selection = [makeTrack('1')];
		const result = await executeTrackMenuAction(selection, 'bt_s_queue');
		expect(jest.mocked(JamPlayer.addTrackToQueue)).toHaveBeenCalledWith(selection[0]);
		expect(result).toBe(true);
	});

	it('navigates to the track details for bt_s_open (and returns false)', async () => {
		const selection = [makeTrack('7')];
		const result = await executeTrackMenuAction(selection, 'bt_s_open');
		expect(jest.mocked(NavigationService.navigateObj)).toHaveBeenCalledWith(JamObjectType.track, '7', 'Title 7');
		expect(result).toBe(false);
	});

	it('returns true for bt_clear without touching the player', async () => {
		const result = await executeTrackMenuAction([makeTrack('1')], 'bt_clear');
		expect(result).toBe(true);
		expect(jest.mocked(JamPlayer.playTracks)).not.toHaveBeenCalled();
	});

	it('ignores an unknown action name', async () => {
		const result = await executeTrackMenuAction([makeTrack('1')], 'nope');
		expect(result).toBe(false);
	});

	it('does nothing for an empty selection', async () => {
		const result = await executeTrackMenuAction([], 'bt_m_play');
		expect(result).toBe(false);
		expect(jest.mocked(JamPlayer.playTracks)).not.toHaveBeenCalled();
	});
});
