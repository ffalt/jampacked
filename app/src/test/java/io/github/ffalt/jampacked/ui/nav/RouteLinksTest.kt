package io.github.ffalt.jampacked.ui.nav

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Test

class RouteLinksTest {
    @Test
    fun `plain library keys`() {
        assertEquals(Route.ArtistList(null), routeForKey("artists"))
        assertEquals(Route.SeriesList(null), routeForKey("series"))
        assertEquals(Route.FolderList(null), routeForKey("folders"))
        assertEquals(Route.TrackList(null), routeForKey("tracks"))
        assertEquals(Route.GenreList, routeForKey("genres"))
        assertEquals(Route.PodcastList, routeForKey("podcasts"))
        assertEquals(Route.PlaylistList, routeForKey("playlists"))
        assertEquals(Route.Bookmarks, routeForKey("bookmarks"))
        assertEquals(Route.PinnedMedia, routeForKey("pinned"))
    }

    @Test
    fun `album keys carry their album type`() {
        assertEquals(Route.AlbumList("album", null), routeForKey("albums:album"))
        assertEquals(Route.AlbumList("compilation", null), routeForKey("albums:compilation"))
        assertEquals(Route.AlbumList("audiobook", null), routeForKey("albums:audiobook"))
    }

    @Test
    fun `list type is carried for the favorites and played sections`() {
        assertEquals(Route.ArtistList("faved"), routeForKey("artists:faved"))
        assertEquals(Route.TrackList("recent"), routeForKey("tracks:recent"))
        assertEquals(Route.AlbumList("album", "faved"), routeForKey("albums:album:faved"))
        assertEquals(Route.AlbumList("album", "recent"), routeForKey("albums:album:recent"))
    }

    @Test
    fun `unknown keys resolve to nothing rather than crashing`() {
        assertNull(routeForKey("nonsense"))
        assertNull(routeForKey(""))
    }

    @Test
    fun `object types map to detail routes`() {
        assertEquals(Route.Album("1", "A"), routeForObject("album", "1", "A"))
        assertEquals(Route.Artist("1", "A"), routeForObject("artist", "1", "A"))
        assertEquals(Route.Folder("1", "A"), routeForObject("folder", "1", "A"))
        assertEquals(Route.Track("1", "A"), routeForObject("track", "1", "A"))
        assertEquals(Route.Episode("1", "A"), routeForObject("episode", "1", "A"))
        assertNull(routeForObject("unknown", "1", "A"))
    }
}
