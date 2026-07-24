const actual = jest.requireActual<typeof import('../podcast')>('../podcast');

export const PodcastQuery = actual.PodcastQuery;
export const transformPodcastEpisode = actual.transformPodcastEpisode;
const mockGetPodcast = jest.fn();
export const useLazyPodcastQuery = jest.fn(() => [mockGetPodcast, { loading: false, called: false }]);
