import { RouteLink } from '../navigators/Routes.ts';

export interface HomeStatData {
	link: RouteLink;
	value: number;
}

export type HomeStatsData = Array<HomeStatData>;
