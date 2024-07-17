import { fetchErrorFormat } from '@/app/lib/utils';
import { NextResponse, type NextRequest } from 'next/server';
import { PlaylistInfo, playlistInfo } from 'youtube-ext';

export async function POST(req: NextRequest) {
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
		const id = body.playlist.includes('list=')
			? body.playlist.slice(body.playlist.indexOf('list=') + 5)
			: body.playlist;
		const results: PlaylistInfo = await playlistInfo(id);
		return Response.json(results, { status: 200 });
	} catch (error: unknown) {
		fetchErrorFormat(error);
	}
}
