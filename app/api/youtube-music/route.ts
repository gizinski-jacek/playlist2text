// Google API documentation
// https://developers.google.com/youtube/v3/docs/playlists/list

import { YTMusicPlaylistResponse } from '@/app/lib/types';
import { formatFetchError } from '@/app/lib/utils';
import axios, { AxiosResponse } from 'axios';
import { NextResponse, type NextRequest } from 'next/server';
import querystring from 'querystring';
import YTMusic from 'ytmusic-api';

export async function POST(
	req: NextRequest
): Promise<NextResponse<YTMusicPlaylistResponse | { error: string }>> {
	try {
		if (!process.env.YOUTUBE_API_KEY) {
			console.error('Provide YOUTUBE_API_KEY env variable');
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
		const id = body.playlist.replace(
			'https://music.youtube.com/playlist?list=',
			''
		);
		const query = querystring.stringify({
			id: id,
			key: process.env.YOUTUBE_API_KEY,
			part: 'id',
		});
		const res: AxiosResponse = await axios.get(
			'https://www.googleapis.com/youtube/v3/playlists?' + query,
			{ timeout: 10000 }
		);
		const ytmusic = new YTMusic();
		await ytmusic.initialize();
		const results: YTMusicPlaylistResponse = await ytmusic.getPlaylistVideos(
			res.data.items[0].id
		);
		return NextResponse.json(results, { status: 200 });
	} catch (error: unknown) {
		return formatFetchError(error);
	}
}
