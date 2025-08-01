// @generated
// This file was automatically generated and should not be edited.

import { JamConfiguration } from './jam.configuration';
import { HttpHeaders, HTTPOptions, JamHttpService } from './jam.http.service';
import { Jam } from './model/jam-rest-data';
import { Auth } from './model/jam-auth';

export class JamAuthService {
	static readonly version = '0.2.1';
	static readonly apiPrefix = '/jam/v1';
	user?: Jam.SessionUser = undefined;
	auth?: Auth = undefined;
	checked: boolean = false;
	loaded: boolean = false;

	constructor(private readonly http: JamHttpService, private readonly configuration: JamConfiguration) {
	}

	async load(): Promise<void> {
		const o = await this.configuration.fromStorage();
		this.user = o ? o.user : undefined;
		this.auth = o ? o.auth : undefined;
		if (this.user) {
			await this.configuration.userChangeNotify(this.user);
		}
		this.loaded = true;
	}

	async check(): Promise<void> {
		this.checked = true;
		if (!this.auth?.server) {
			return;
		}
		try {
			const data = await this.http.get<Jam.Session>(`${this.auth.server}${JamAuthService.apiPrefix}/session`, this.getHTTPOptions());
			if (data.user) {
				this.user = data.user;
				this.auth.version = data.version;
				await this.configuration.toStorage({ auth: this.auth, user: this.user });
			} else {
				this.user = undefined;
			}
		} catch (error) {
			throw (error || new Error('Server error'));
		}
	}

	async canUseSession(server: string): Promise<boolean> {
		const data = await this.http.get<Jam.Session>(`${server}${JamAuthService.apiPrefix}/session`, { withCredentials: false });
		return (data.allowedCookieDomains || []).includes(this.configuration.domain());
	}

	async login(server: string, username: string, password: string, storePassword?: boolean): Promise<void> {
		const canUseSession = await this.canUseSession(server);
		try {
			const data = await this.http.post<Jam.Session>(`${server}${JamAuthService.apiPrefix}/auth/login`, {
				client: this.configuration.clientName,
				username,
				password,
				jwt: !canUseSession
			}, { withCredentials: canUseSession });
			this.user = data.user;
			if (!this.user) {
				return Promise.reject(new Error('Invalid Server Response'));
			}
			this.auth = {
				server,
				username: this.user.name,
				session: canUseSession,
				token: canUseSession ? undefined : data.jwt,
				version: data.version,
				password: storePassword ? password : undefined
			};
			await this.configuration.toStorage({ auth: this.auth, user: this.user });
			await this.configuration.userChangeNotify(this.user);
		} catch (error: any) {
			console.error(error);
			await this.clear();
			if (error.error?.error) {
				throw new Error(error.error.error);
			}
			if (error.statusText) {
				throw new Error(error.statusText);
			}
			throw new Error('Server Error');
		}
	}

	getHTTPHeaders(): HttpHeaders | undefined {
		if (this.auth?.token) {
			return { Authorization: `Bearer ${this.auth.token}` };
		}
		return;
	}

	getHTTPOptions(): HTTPOptions {
		if (this.auth?.token) {
			return { withCredentials: false, headers: this.getHTTPHeaders() };
		}
		return { withCredentials: true };
	}

	async logout(): Promise<void> {
		if (this.auth) {
			const url = `${this.auth.server}${JamAuthService.apiPrefix}/auth/logout`;
			const options = this.getHTTPOptions();
			await this.clear();
			await this.http.post(url, {}, options);
		} else {
			await this.clear();
		}
	}

	async clear(): Promise<void> {
		await this.configuration.toStorage(undefined);
		await this.configuration.userChangeNotify(undefined);
		this.user = undefined;
		this.auth = undefined;
	}

	isLoggedIn(): boolean {
		return !!(this.user && this.auth);
	}
}
