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

	constructor(private fillCacheFunc: (caller: Caching) => Promise<void>) {
	}

	startCaching(): void {
		if (!this.cachingData.running) {
			this.fillCacheFunc(this)
				.then(() => {
					this.stopCaching();
				})
				.catch(e => {
					console.error(e);
					this.stopCaching();
				});
		}
		this.cachingData.running = true;
		this.subjectCaching.next(this.cachingData);
	}

	stopCaching(): void {
		this.cachingData.running = false;
		this.subjectCaching.next(this.cachingData);
	}

	updateText(s: string): void {
		this.cachingData.current = s;
		this.subjectCaching.next(this.cachingData);
	}
}
