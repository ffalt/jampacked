// THIS FILE IS GENERATED, DO NOT EDIT MANUALLY

import {JamAuthService} from './jam.auth.service';
import {JamBaseService} from './jam.base.service';
import {JamConfiguration} from './jam.configuration';
import {JamHttpService} from './jam.http.service';

import {JamAccessService} from './jam.access.service';
import {JamAdminService} from './jam.admin.service';
import {JamAlbumService} from './jam.album.service';
import {JamArtistService} from './jam.artist.service';
import {JamBookmarkService} from './jam.bookmark.service';
import {JamChatService} from './jam.chat.service';
import {JamEpisodeService} from './jam.episode.service';
import {JamFolderService} from './jam.folder.service';
import {JamImageService} from './jam.image.service';
import {JamMediaService} from './jam.media.service';
import {JamMetadataService} from './jam.metadata.service';
import {JamPlaylistService} from './jam.playlist.service';
import {JamPlayqueueService} from './jam.playqueue.service';
import {JamPodcastService} from './jam.podcast.service';
import {JamRadioService} from './jam.radio.service';
import {JamRootService} from './jam.root.service';
import {JamSeriesService} from './jam.series.service';
import {JamTrackService} from './jam.track.service';
import {JamUserService} from './jam.user.service';
import {JamVariousService} from './jam.various.service';

export class JamService {
	http = new JamHttpService();
	auth: JamAuthService;
	base: JamBaseService;
	access: JamAccessService;
	admin: JamAdminService;
	album: JamAlbumService;
	artist: JamArtistService;
	bookmark: JamBookmarkService;
	chat: JamChatService;
	episode: JamEpisodeService;
	folder: JamFolderService;
	image: JamImageService;
	media: JamMediaService;
	metadata: JamMetadataService;
	playlist: JamPlaylistService;
	playqueue: JamPlayqueueService;
	podcast: JamPodcastService;
	radio: JamRadioService;
	root: JamRootService;
	series: JamSeriesService;
	track: JamTrackService;
	user: JamUserService;
	various: JamVariousService;

	constructor(public configuration: JamConfiguration) {
		this.auth = new JamAuthService(this.http, configuration);
		this.base = new JamBaseService(this.http, this.auth);
		this.access = new JamAccessService(this.base);
		this.admin = new JamAdminService(this.base);
		this.album = new JamAlbumService(this.base);
		this.artist = new JamArtistService(this.base);
		this.bookmark = new JamBookmarkService(this.base);
		this.chat = new JamChatService(this.base);
		this.episode = new JamEpisodeService(this.base);
		this.folder = new JamFolderService(this.base);
		this.image = new JamImageService(this.base);
		this.media = new JamMediaService(this.base);
		this.metadata = new JamMetadataService(this.base);
		this.playlist = new JamPlaylistService(this.base);
		this.playqueue = new JamPlayqueueService(this.base);
		this.podcast = new JamPodcastService(this.base);
		this.radio = new JamRadioService(this.base);
		this.root = new JamRootService(this.base);
		this.series = new JamSeriesService(this.base);
		this.track = new JamTrackService(this.base);
		this.user = new JamUserService(this.base);
		this.various = new JamVariousService(this.base);
	}

}
