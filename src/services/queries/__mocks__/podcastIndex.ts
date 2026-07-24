const actual = jest.requireActual<typeof import('../podcastIndex')>('../podcastIndex');

export const PodcastIndexQuery = actual.PodcastIndexQuery;
const mockGetPodcastIndex = jest.fn();
export const useLazyPodcastIndexQuery = jest.fn(() => [mockGetPodcastIndex, { loading: false, called: false }]);
