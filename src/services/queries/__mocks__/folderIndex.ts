const actual = jest.requireActual<typeof import('../folderIndex')>('../folderIndex');

export const FolderIndexQuery = actual.FolderIndexQuery;
const mockGetFolderIndex = jest.fn();
export const useLazyFolderIndexQuery = jest.fn(() => [mockGetFolderIndex, { loading: false, called: false }]);
