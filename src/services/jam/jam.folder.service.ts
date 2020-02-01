// THIS FILE IS GENERATED, DO NOT EDIT MANUALLY

import {JamBaseService} from './jam.base.service';
import {Jam} from './model/jam-rest-data';
import {JamParameters} from './model/jam-rest-params';

export class JamFolderService {

	constructor(private base: JamBaseService) {
	}

	/**
	 * get the navigation index for folders
	 */
	async index(params: JamParameters.FolderIndex): Promise<Jam.FolderIndex> {
		return this.base.requestData<Jam.FolderIndex>('folder/index', params);
	}

	/**
	 * get a folder by id
	 */
	async id(params: JamParameters.Folder): Promise<Jam.Folder> {
		return this.base.requestData<Jam.Folder>('folder/id', params);
	}

	/**
	 * get folders by ids
	 */
	async ids(params: JamParameters.Folders): Promise<Array<Jam.Folder>> {
		return this.base.requestData<Array<Jam.Folder>>('folder/ids', params);
	}

	/**
	 * get tracks of a folder by id
	 */
	async tracks(params: JamParameters.FolderTracks): Promise<Jam.TrackList> {
		return this.base.requestData<Jam.TrackList>('folder/tracks', params);
	}

	/**
	 * get sub folders of a folder by id
	 */
	async subfolders(params: JamParameters.FolderSubFolders): Promise<Jam.FolderList> {
		return this.base.requestData<Jam.FolderList>('folder/subfolders', params);
	}

	/**
	 * get similar artist folders of a folder by id
	 */
	async artist_similar(params: JamParameters.SimilarFolders): Promise<Jam.FolderList> {
		return this.base.requestData<Jam.FolderList>('folder/artist/similar', params);
	}

	/**
	 * get external artist description of a folder by id
	 */
	async artist_info(params: JamParameters.ID): Promise<Jam.Info> {
		return this.base.requestData<Jam.Info>('folder/artist/info', params);
	}

	/**
	 * get external album description of a folder by id
	 */
	async album_info(params: JamParameters.ID): Promise<Jam.Info> {
		return this.base.requestData<Jam.Info>('folder/album/info', params);
	}

	/**
	 * get a list of folders by list type
	 */
	async list(params: JamParameters.FolderList): Promise<Jam.FolderList> {
		return this.base.requestData<Jam.FolderList>('folder/list', params);
	}

	/**
	 * search folders
	 */
	async search(params: JamParameters.FolderSearch): Promise<Jam.FolderList> {
		return this.base.requestData<Jam.FolderList>('folder/search', params);
	}

	/**
	 * list of folders with health issues // Rights needed: admin
	 */
	async health(params: JamParameters.FolderHealth): Promise<Array<Jam.FolderHealth>> {
		return this.base.requestData<Array<Jam.FolderHealth>>('folder/health', params);
	}

	/**
	 * get the user state (fav/rating) by folder id
	 */
	async state(params: JamParameters.ID): Promise<Jam.State> {
		return this.base.requestData<Jam.State>('folder/state', params);
	}

	/**
	 * get the user states (fav/rating) by folders ids
	 */
	async states(params: JamParameters.IDs): Promise<Jam.States> {
		return this.base.requestData<Jam.States>('folder/states', params);
	}

	/**
	 * get similar tracks of a/by artist folder id
	 */
	async artist_similar_tracks(params: JamParameters.SimilarTracks): Promise<Jam.TrackList> {
		return this.base.requestData<Jam.TrackList>('folder/artist/similar/tracks', params);
	}

	/**
	 * get the artwork list by folder id
	 */
	async artworks(params: JamParameters.ID): Promise<Array<Jam.ArtworkImage>> {
		return this.base.requestData<Array<Jam.ArtworkImage>>('folder/artworks', params);
	}

	/**
	 * download folder as binary archive // Rights needed: stream
	 */
	download_url(params: JamParameters.Download): string {
		return this.base.buildRequestUrl('folder/download', params);
	}

	/**
	 * download folder as binary archive // Rights needed: stream
	 */
	async download_binary(params: JamParameters.Download): Promise<ArrayBuffer> {
		return this.base.binary('folder/download', params);
	}

	/**
	 * download default image as binary
	 */
	image_url(params: JamParameters.Image): string {
		return this.base.buildRequestUrl('folder/image', params);
	}

	/**
	 * download default image as binary
	 */
	async image_binary(params: JamParameters.Image): Promise<ArrayBuffer> {
		return this.base.binary('folder/image', params);
	}

	/**
	 * download artwork image as binary
	 */
	artwork_image_url(params: JamParameters.Image): string {
		return this.base.buildRequestUrl('folder/artwork/image', params);
	}

	/**
	 * download artwork image as binary
	 */
	async artwork_image_binary(params: JamParameters.Image): Promise<ArrayBuffer> {
		return this.base.binary('folder/artwork/image', params);
	}

	/**
	 * create an artwork by url // Rights needed: admin
	 */
	async artwork_create(params: JamParameters.FolderArtworkNew): Promise<Jam.AdminChangeQueueInfo> {
		return this.base.requestPostData<Jam.AdminChangeQueueInfo>('folder/artwork/create', params);
	}

	/**
	 * delete an artwork // Rights needed: admin
	 */
	async artwork_delete(params: JamParameters.ID): Promise<Jam.AdminChangeQueueInfo> {
		return this.base.requestPostData<Jam.AdminChangeQueueInfo>('folder/artwork/delete', params);
	}

	/**
	 * rename an artwork // Rights needed: admin
	 */
	async artwork_name_update(params: JamParameters.FolderArtworkEditName): Promise<Jam.AdminChangeQueueInfo> {
		return this.base.requestPostData<Jam.AdminChangeQueueInfo>('folder/artwork/name/update', params);
	}

	/**
	 * create an artwork by upload // Rights needed: admin
	 */
	async artworkUpload_create(params: JamParameters.FolderArtworkUpload, file: any, onUploadProgress: (progressEvent: any) => void): Promise<Jam.AdminChangeQueueInfo> {
		return this.base.upload<Jam.AdminChangeQueueInfo>('folder/artworkUpload/create', params, 'image', file, onUploadProgress);
	}

	/**
	 * update an artwork by upload // Rights needed: admin
	 */
	async artworkUpload_update(params: JamParameters.ID, file: any, onUploadProgress: (progressEvent: any) => void): Promise<Jam.AdminChangeQueueInfo> {
		return this.base.upload<Jam.AdminChangeQueueInfo>('folder/artworkUpload/update', params, 'image', file, onUploadProgress);
	}

	/**
	 * rename a folder // Rights needed: admin
	 */
	async name_update(params: JamParameters.FolderEditName): Promise<Jam.AdminChangeQueueInfo> {
		return this.base.requestPostData<Jam.AdminChangeQueueInfo>('folder/name/update', params);
	}

	/**
	 * fav/unfav a folder
	 */
	async fav_update(params: JamParameters.Fav): Promise<void> {
		return this.base.requestPostDataOK('folder/fav/update', params);
	}

	/**
	 * rate a folder
	 */
	async rate_update(params: JamParameters.Rate): Promise<void> {
		return this.base.requestPostDataOK('folder/rate/update', params);
	}

	/**
	 * move a folder to a new parent folder // Rights needed: admin
	 */
	async parent_update(params: JamParameters.FolderMoveParent): Promise<Jam.AdminChangeQueueInfo> {
		return this.base.requestPostData<Jam.AdminChangeQueueInfo>('folder/parent/update', params);
	}

	/**
	 * delete a folder // Rights needed: admin
	 */
	async delete(params: JamParameters.ID): Promise<Jam.AdminChangeQueueInfo> {
		return this.base.requestPostData<Jam.AdminChangeQueueInfo>('folder/delete', params);
	}

	/**
	 * create a folder // Rights needed: admin
	 */
	async create(params: JamParameters.FolderCreate): Promise<Jam.AdminChangeQueueInfo> {
		return this.base.requestPostData<Jam.AdminChangeQueueInfo>('folder/create', params);
	}

}
