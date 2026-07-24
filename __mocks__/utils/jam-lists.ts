const actual = jest.requireActual<typeof import('../../src/utils/jam-lists.ts')>('../../src/utils/jam-lists.ts');

export const ListTypeName = actual.ListTypeName;
export const getAlbumTypeInfos = jest.fn(actual.getAlbumTypeInfos);
