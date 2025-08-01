// @generated
// This file was automatically generated and should not be edited.

import { JamAuthService } from './jam.auth.service';
import { JamHttpService } from './jam.http.service';

export class JamBaseService {
	constructor(private readonly http: JamHttpService, private readonly authService: JamAuthService) {
	}

	buildRequest(view: string, params: any, forDOM: boolean): { url: string; parameters: any } {
		const buildParams = params || {};
		if (forDOM && this.authService.auth?.token) {
			buildParams.bearer = this.authService.auth?.token;
		}
		return { url: this.authService.auth?.server + JamAuthService.apiPrefix + view, parameters: buildParams };
	}

	static flattenParams(params: any): string {
		const result: Array<string> = [];
		for (const key of Object.keys(params)) {
			const value = params[key];
			if (value !== undefined) {
				switch (typeof value) {
					case 'number': {
						result.push(`${key}=${value}`);
						break;
					}
					case 'string': {
						result.push(`${key}=${encodeURIComponent(value)}`);
						break;
					}
					case 'boolean': {
						result.push(`${key}=${value ? 'true' : 'false'}`);
						break;
					}
					case 'object': {
						if (Array.isArray(value)) {
							for (const v of value) {
								result.push(`${key}=${encodeURIComponent(v)}`);
							}
						}
						break;
					}
					default: {
						break;
					}
				}
			}
		}
		if (result.length > 0) {
			return `${result.join('&')}`;
		}
		return '';
	}

	buildUrl(view: string, params: any, forDOM: boolean): string {
		const { url, parameters } = this.buildRequest(view, params, forDOM);
		const flat = JamBaseService.flattenParams(parameters);
		return url + (flat ? `?${flat}` : '');
	}

	async raw(view: string, params: any): Promise<{ buffer: ArrayBuffer; contentType: string }> {
		const { url, parameters } = this.buildRequest(view, params, false);
		return this.http.raw(url, { ...this.authService.getHTTPOptions(), params: parameters });
	}

	async get<T>(view: string, params: any): Promise<T> {
		const { url, parameters } = this.buildRequest(view, params, false);
		return this.http.get(url, { ...this.authService.getHTTPOptions(), params: parameters });
	}

	async post<T>(view: string, params: any, body: any): Promise<T> {
		return this.http.post<T>(this.buildUrl(view, params, false), body, this.authService.getHTTPOptions());
	}

	async requestData<T>(path: string, params: any): Promise<T> {
		if (this.authService.isLoggedIn()) {
			return this.get<T>(path, params);
		}
		return Promise.reject(new Error('Not logged in'));
	}

	async requestPostData<T>(path: string, params: any): Promise<T> {
		if (this.authService.isLoggedIn()) {
			return this.post<T>(path, {}, params);
		}
		return Promise.reject(new Error('Not logged in'));
	}

	async requestPostDataOK(path: string, params: any): Promise<void> {
		await this.requestPostData<{}>(path, params);
	}

	async requestOK(path: string, params: any): Promise<void> {
		await this.requestData<{}>(path, params);
	}

	buildRequestUrl(view: string, params?: any, forDom: boolean = true): string {
		return this.buildUrl(view, params, forDom);
	}

	async binary(path: string, params?: any): Promise<{ buffer: ArrayBuffer; contentType: string }> {
		if (this.authService.isLoggedIn()) {
			return this.raw(path, params);
		}
		return Promise.reject(new Error('Not logged in'));
	}

	async upload<T>(path: string, params: any, name: string, file: any, onUploadProgress: (progressEvent: any) => void): Promise<T> {
		const formData = new FormData();
		for (const key of Object.keys(params)) {
			formData.append(key, params[key]);
		}
		formData.append(name, file);
		const url = this.buildUrl(path, {}, false);
		const options = this.authService.getHTTPOptions();
		options.reportProgress = true;
		return this.http.postObserve<T>(url, formData, options, onUploadProgress);
	}
}
