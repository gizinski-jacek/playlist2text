import axios, { AxiosError, AxiosResponse } from 'axios';
import { type NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
	try {
		if (
			!process.env.SPOTIFY_AUTH_URI ||
			!process.env.SPOTIFY_CLIENT_ID ||
			!process.env.SPOTIFY_CLIENT_SECRET ||
			!process.env.SPOTIFY_API_URI
		) {
			console.error(
				'Provide SPOTIFY_AUTH_URI, SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_API_URI env variables.'
			);
			return Response.json(
				{ success: false },
				{ status: 400, statusText: 'Unknown server error.' }
			);
		}
		const { searchParams } = new URL(req.url);
		const playlistId = searchParams.get('playlistId');
		if (!playlistId)
			return Response.json(
				{ success: false },
				{ status: 400, statusText: 'Provide id' }
			);
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
		const res = await axios.get(
			process.env.SPOTIFY_API_URI +
				playlistId.replace('https://open.spotify.com/playlist/', ''),
			{
				headers: {
					Authorization: 'Bearer ' + token,
				},
				timeout: 10000,
			}
		);
		return Response.json(res.data, { status: 200 });
	} catch (error: any) {
		if (error instanceof Response) {
			return Response.json(
				{ success: false },
				{
					status: error.status || 400,
					statusText: error.statusText || 'Unknown error.',
				}
			);
		} else if (error instanceof AxiosError) {
			return Response.json(
				{ success: false },
				{
					status: error.status || 400,
					statusText: error.message || 'Unknown error.',
				}
			);
		} else {
			return Response.json(
				{ success: false },
				{ status: 400, statusText: 'Unknown error.' }
			);
		}
	}
}
