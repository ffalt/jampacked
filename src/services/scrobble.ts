import {TrackPlayer, Event, TrackPlayerPlaybackState, State, TrackPlayerTrack} from './player-api';
import EventEmitter from 'react-native/Libraries/vendor/emitter/EventEmitter';
import {EventSubscription} from 'react-native';

export type ScrobbleListener = (track: TrackPlayerTrack) => void;

export class Scrobble {
	subscriptions = new EventEmitter();
	scrobbleTrackID?: string;
	scrobbleTrigger: number = -1;
	scrobbleDuration: number = 0;
	isPlaying: boolean = false;
	scrobbleDone: boolean = false;
	timeout: any;

	constructor() {
		this.register();
	}

	static addScrobbleListener = (listener: ScrobbleListener): EventSubscription => scrobble.addListener(listener);

	addListener(listener: ScrobbleListener): EventSubscription {
		return this.subscriptions.addListener('scrobble', listener);
	}

	stopScrobble(): void {
		clearTimeout(this.timeout);
	}

	reset(): void {
		this.scrobbleDone = false;
		this.scrobbleTrackID = undefined;
		this.scrobbleTrigger = -1;
		this.scrobbleDuration = 0;
	}

	async checkScrobbleTrack(): Promise<void> {
		const track = await TrackPlayer.getActiveTrack();
		if (!track?.id) {
			return;
		}
		if (this.scrobbleTrackID !== track.id) {
			this.reset();
			const progress = await TrackPlayer.getProgress();
			if (progress.duration <= 0) {
				return;
			}
			this.scrobbleTrackID = track.id;
			this.scrobbleTrigger = Math.min(progress.duration / 2, 4 * 60);
		}
		if (this.scrobbleDone) {
			return;
		}
		if (this.scrobbleTrigger > 0 &&
			this.scrobbleDuration > 0 &&
			this.scrobbleDuration > this.scrobbleTrigger) {
			this.scrobbleDone = true;
			this.emit(track);
		} else {
			this.scrobbleDuration += 1;
		}
	}

	checkScrobble(): void {
		this.stopScrobble();
		this.checkScrobbleTrack()
			.then(() => {
				if (this.isPlaying) {
					this.startScrobbleCheck();
				}
			});
	}

	startScrobbleCheck(): void {
		this.stopScrobble();
		this.timeout = setTimeout(() => this.checkScrobble(), 1000);
	}

	register(): void {
		TrackPlayer.addEventListener(Event.PlaybackState, (state: TrackPlayerPlaybackState) => {
			switch (state.state) {
				case State.Playing:
					this.isPlaying = true;
					this.startScrobbleCheck();
					break;
				default:
					this.stopScrobble();
					this.isPlaying = false;
			}
		});
	}

	emit(track: TrackPlayerTrack): void {
		this.subscriptions.emit('scrobble', track);
	}
}

const scrobble = new Scrobble();
