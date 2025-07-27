import React from 'react';
import { BottomTabProps, BottomTabRoute } from '../navigators/Routing';
import { PageHeader } from '../components/PageHeader';
import { Queue } from '../components/Queue';

export const QueueScreen: React.FC<BottomTabProps<BottomTabRoute.QUEUE>> = () => (
	<>
		<PageHeader title="Queue" />
		<Queue />
	</>
);
