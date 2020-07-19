export function padTime(val: number): string {
	return (val <= 9) ? `0${val}` : val.toString();
}

function splitTime(value: number): { days: number; hours: number; minutes: number; seconds: number } {
	const duration = {
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0
	};
	let delta = value;
	duration.days = Math.floor(delta / 86400);
	delta -= duration.days * 86400;
	// calculate (and subtract) whole hours
	duration.hours = Math.floor(delta / 3600) % 24;
	delta -= duration.hours * 3600;
	// calculate (and subtract) whole minutes
	duration.minutes = Math.floor(delta / 60) % 60;
	delta -= duration.minutes * 60;
	// what's left is seconds
	duration.seconds = Math.round(delta % 60);
	return duration;
}

export function formatDuration(val?: number): string {
	if (val === undefined) {
		return '';
	}
	const time = splitTime(val / 1000);
	const duration: Array<string> = [];
	if (time.days > 0) {
		duration.push(`${time.days}d `);
	}
	if (time.hours > 0) {
		if (duration.length > 0) {
			duration.push(`${padTime(time.hours)}:`);
		} else {
			duration.push(`${time.hours}:`);
		}
	}
	duration.push(padTime(time.minutes));
	duration.push(`:${padTime(time.seconds)}`);
	return duration.join('');
}
