const actual = jest.requireActual<typeof import('../folder')>('../folder');

export const FolderQuery = actual.FolderQuery;
const mockGetFolder = jest.fn();
export const useLazyFolderQuery = jest.fn(() => [mockGetFolder, { loading: false, called: false }]);
