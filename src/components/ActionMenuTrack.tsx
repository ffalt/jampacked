import { JamPlayer } from '../services/player.service.ts';
import { NavigationService } from '../navigators/navigation';
import { TrackEntry } from '../types/track.ts';
import { JamObjectType } from '../services/jam';

export const executeTrackMenuAction = async (selection: Array<TrackEntry>, name?: string): Promise<boolean> => {
	if (selection.length > 0) {
		switch (name) {
			case 'bt_clear': {
				return true;
			}
			case 'bt_m_play': {
				await JamPlayer.playTracks(selection);
				return true;
			}
			case 'bt_m_queue': {
				await JamPlayer.addTracksToQueue(selection);
				return true;
			}
			case 'bt_s_play': {
				await JamPlayer.playTrack(selection[0]);
				return true;
			}
			case 'bt_s_queue': {
				await JamPlayer.addTrackToQueue(selection[0]);
				return true;
			}
			case 'bt_s_open': {
				NavigationService.navigateObj(JamObjectType.track, selection[0].id, selection[0].title);
				break;
			}
			// No default
		}
	}
	return false;
};
