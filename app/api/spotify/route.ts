import axios, { AxiosError, AxiosResponse } from 'axios';
import { NextResponse, type NextRequest } from 'next/server';

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
			return NextResponse.json(
				{ error: 'Unknown server error.' },
				{ status: 500 }
			);
		}
		const { searchParams } = new URL(req.url);
		const playlistId = searchParams.get('playlistId');
		if (!playlistId)
			return NextResponse.json(
				{ error: 'Provide playlist link or Id.' },
				{ status: 400 }
			);
		const cleanId = playlistId.replace(
			'https://open.spotify.com/playlist/',
			''
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
		const res = await axios.get(process.env.SPOTIFY_API_URI + cleanId, {
			headers: {
				Authorization: 'Bearer ' + token,
			},
			timeout: 10000,
		});
		return NextResponse.json(res.data, { status: 200 });
	} catch (error: any) {
		if (error instanceof Response) {
			return NextResponse.json(
				{ error: error.statusText || 'Unknown server error.' },
				{ status: error.status || 500 }
			);
		} else if (error instanceof AxiosError) {
			return NextResponse.json(
				{ error: error.message || 'Unknown server error.' },
				{ status: error.status || 500 }
			);
		} else {
			return NextResponse.json(
				{ error: 'Unknown server error.' },
				{ status: 500 }
			);
		}
	}
}
