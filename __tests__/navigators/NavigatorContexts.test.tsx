import 'react-native';
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { AlbumTabNavigatorContext } from '../../src/navigators/AlbumNavigatorContext';
import { AlbumsTabNavigatorContext } from '../../src/navigators/AlbumsNavigatorContext';
import { FoldersTabNavigatorContext } from '../../src/navigators/FoldersNavigatorContext';
import { GenreTabNavigatorContext } from '../../src/navigators/GenreNavigatorContext';

describe('Navigator Contexts', () => {
	it('each context exposes the expected default value', async () => {
		const captured: Array<unknown> = [];
		const capture = (value: unknown): null => {
			captured.push(value);
			return null;
		};
		await render(
			<>
				<AlbumTabNavigatorContext.Consumer>{capture}</AlbumTabNavigatorContext.Consumer>
				<AlbumsTabNavigatorContext.Consumer>{capture}</AlbumsTabNavigatorContext.Consumer>
				<FoldersTabNavigatorContext.Consumer>{capture}</FoldersTabNavigatorContext.Consumer>
				<GenreTabNavigatorContext.Consumer>{capture}</GenreTabNavigatorContext.Consumer>
			</>
		);
		expect(captured).toHaveLength(4);
		for (const value of captured) {
			expect(value).toEqual({});
		}
	});

	it('a provider passes its value to a consumer', async () => {
		let albumValue: { id?: string; name?: string } | undefined;
		let genreValue: { id?: string; name?: string } | undefined;
		await render(
			<>
				<AlbumTabNavigatorContext.Provider value={{ id: 'a1', name: 'Album One' }}>
					<AlbumTabNavigatorContext.Consumer>
						{(value): null => {
							albumValue = value;
							return null;
						}}
					</AlbumTabNavigatorContext.Consumer>
				</AlbumTabNavigatorContext.Provider>
				<GenreTabNavigatorContext.Provider value={{ id: 'g1', name: 'Rock' }}>
					<GenreTabNavigatorContext.Consumer>
						{(value): null => {
							genreValue = value;
							return null;
						}}
					</GenreTabNavigatorContext.Consumer>
				</GenreTabNavigatorContext.Provider>
			</>
		);
		expect(albumValue).toEqual({ id: 'a1', name: 'Album One' });
		expect(genreValue).toEqual({ id: 'g1', name: 'Rock' });
	});
});
