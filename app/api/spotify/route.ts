// Spotify API documentation
// https://developer.spotify.com/documentation/web-api/reference/get-playlist

import { SpotifyPlaylistResponse, SpotifyTracksData } from '@/app/lib/types';
import { formatFetchError } from '@/app/lib/utils';
import axios, { AxiosResponse } from 'axios';
import { NextResponse, type NextRequest } from 'next/server';

export async function POST(
	req: NextRequest
): Promise<NextResponse<SpotifyPlaylistResponse | { error: string }>> {
	try {
		if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
			console.error(
				'Provide SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET env variables'
			);
			return NextResponse.json(
				{ error: 'Unknown server error' },
				{ status: 500 }
			);
		}
		const { body } = await req.json();
		if (!body.playlist)
			return NextResponse.json(
				{ error: 'Provide playlist link or Id' },
				{ status: 400 }
			);
		const id = body.playlist.replace('https://open.spotify.com/playlist/', '');
		const options = {
			url: 'https://accounts.spotify.com/api/token',
			method: 'POST',
			headers: {
				Authorization:
					'Basic ' +
					Buffer.from(
						process.env.SPOTIFY_CLIENT_ID +
							':' +
							process.env.SPOTIFY_CLIENT_SECRET
					).toString('base64'),
			},
			params: {
				grant_type: 'client_credentials',
			},
		};
		const resAuth: AxiosResponse = await axios(options);
		const token = resAuth.data.access_token;
		const res: AxiosResponse<SpotifyPlaylistResponse> = await axios.get(
			'https://api.spotify.com/v1/playlists/' + id,
			{
				headers: {
					Authorization: 'Bearer ' + token,
				},
				timeout: 10000,
			}
		);
		let nextPage: string | null = res.data.tracks.next;
		while (nextPage && res.data.tracks.items.length < res.data.tracks.total) {
			const nextRes: AxiosResponse<SpotifyTracksData> = await axios.get(
				nextPage,
				{
					headers: {
						Authorization: 'Bearer ' + token,
					},
					timeout: 10000,
				}
			);
			nextPage = nextRes.data.next;
			res.data.tracks.items = [...res.data.tracks.items, ...nextRes.data.items];
		}
		return NextResponse.json(res.data, { status: 200 });
	} catch (error: unknown) {
		return formatFetchError(error);
	}
}
