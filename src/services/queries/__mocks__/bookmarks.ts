const actual = jest.requireActual<typeof import('../bookmarks')>('../bookmarks');

export const BookmarksQuery = actual.BookmarksQuery;
const mockGetBookmarks = jest.fn();
export const useLazyBookmarksQuery = jest.fn(() => [mockGetBookmarks, { loading: false, called: false }]);
