import axios, { AxiosError, AxiosResponse } from 'axios';
import { NextResponse, type NextRequest } from 'next/server';
import querystring from 'querystring';
import YTMusic, { VideoDetailed } from 'ytmusic-api';

export async function GET(req: NextRequest) {
	try {
		if (!process.env.YOUTUBE_MUSIC_API_URI || !process.env.YOUTUBE_API_KEY) {
			console.error(
				'Provide YOUTUBE_MUSIC_API_URI, YOUTUBE_API_KEY env variable.'
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
			'https://music.youtube.com/playlist?list=',
			''
		);
		const query = querystring.stringify({
			id: cleanId,
			key: process.env.YOUTUBE_API_KEY,
			part: 'id',
		});
		const res: AxiosResponse = await axios.get(
			process.env.YOUTUBE_MUSIC_API_URI + '?' + query,
			{ timeout: 10000 }
		);
		const ytmusic = new YTMusic();
		await ytmusic.initialize();
		const results: VideoDetailed[] = await ytmusic.getPlaylistVideos(
			res.data.items[0].id
		);
		return Response.json(results, { status: 200 });
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
