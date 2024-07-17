export type SourcesData = {
	name: string;
	color: string;
	url: string;
	urlOption: string;
}[];

export type Sources =
	| 'spotify'
	| 'soundcloud'
	| 'apple-music'
	| 'youtube'
	| 'youtube-music';

export interface SpotifyPlaylistResponse {
	collaborative: false;
	description: string;
	external_urls: {
		spotify: string;
	};
	followers: {
		href: string;
		total: number;
	};
	href: string;
	id: string;
	images: {
		url: string;
		height: number;
		width: number;
	}[];
	name: string;
	owner: {
		external_urls: {
			spotify: string;
		};
		followers: {
			href: string;
			total: number;
		};
		href: string;
		id: string;
		type: string;
		uri: string;
		display_name: string;
	};
	public: false;
	snapshot_id: string;
	tracks: {
		href: string;
		limit: number;
		next: string;
		offset: number;
		previous: string;
		total: number;
		items: SpotifyTrack[];
	};
	type: string;
	uri: string;
}

export interface SpotifyTrack {
	added_at: string;
	added_by: {
		external_urls: {
			spotify: string;
		};
		followers: {
			href: string;
			total: number;
		};
		href: string;
		id: string;
		type: string;
		uri: string;
	};
	is_local: false;
	track: {
		album: {
			album_type: string;
			total_tracks: 9;
			available_markets: string[];
			external_urls: {
				spotify: string;
			};
			href: string;
			id: string;
			images: {
				url: string;
				height: number;
				width: number;
			}[];
			name: string;
			release_date: string;
			release_date_precision: string;
			restrictions: {
				reason: string;
			};
			type: string;
			uri: string;
			artists: {
				external_urls: {
					spotify: string;
				};
				href: string;
				id: string;
				name: string;
				type: string;
				uri: string;
			}[];
		};
		artists: {
			external_urls: {
				spotify: string;
			};
			followers: {
				href: string;
				total: number;
			};
			genres: string[];
			href: string;
			id: string;
			images: [
				{
					url: string;
					height: number;
					width: number;
				}
			];
			name: string;
			popularity: number;
			type: string;
			uri: string;
		}[];
		available_markets: string[];
		disc_number: number;
		duration_ms: number;
		explicit: false;
		external_ids: {
			isrc: string;
			ean: string;
			upc: string;
		};
		external_urls: {
			spotify: string;
		};
		href: string;
		id: string;
		is_playable: false;
		linked_from: {};
		restrictions: {
			reason: string;
		};
		name: string;
		popularity: number;
		preview_url: string;
		track_number: number;
		type: string;
		uri: string;
		is_local: false;
	};
}
