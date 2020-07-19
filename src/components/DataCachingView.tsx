import React from 'react';
import dataService from '../services/data';
import {CachingView} from './CachingView';

export const DataCachingView: React.FC = () => (
	<CachingView cache={dataService.dataCaching} title="Data & Image Cache"/>
);
