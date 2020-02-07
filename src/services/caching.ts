import {Observable, Subject} from 'rxjs';

export interface CachingState {
	running: boolean;
	current: string;
}

export class Caching {
	private subjectCaching = new Subject<CachingState>();
	cachingChange: Observable<CachingState> = this.subjectCaching.asObservable();
	cachingData = {
		running: false,
		current: ''
	};

	constructor(
		private fillCacheFunc: (caller: Caching) => Promise<void>,
		private clearCacheFunc: (caller: Caching) => Promise<void>
	) {
	}

	startClearing(): void {
		if (!this.cachingData.running) {
			this.cachingData.current = 'Clearing...';
			this.cachingData.running = true;
			this.subjectCaching.next(this.cachingData);
			this.clearCacheFunc(this)
				.then(() => {
					this.stop();
				})
				.catch(e => {
					console.error(e);
					this.stop();
				});
		}
	}

	startCaching(): void {
		if (!this.cachingData.running) {
			this.cachingData.current = 'Starting...';
			this.cachingData.running = true;
			this.subjectCaching.next(this.cachingData);
			this.fillCacheFunc(this)
				.then(() => {
					this.stop();
				})
				.catch(e => {
					console.error(e);
					this.stop();
				});
		}
	}

	stop(): void {
		this.cachingData.current = '';
		this.cachingData.running = false;
		this.subjectCaching.next(this.cachingData);
	}

	updateText(s: string): void {
		this.cachingData.current = s;
		this.subjectCaching.next(this.cachingData);
	}
}
