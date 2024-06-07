import { AxiosError } from 'axios';
import { NextResponse, type NextRequest } from 'next/server';
import { PlaylistInfo, playlistInfo } from 'youtube-ext';

export async function GET(req: NextRequest) {
	try {
		if (!process.env.YOUTUBE_API_KEY) {
			console.error('Provide YOUTUBE_API_KEY env variable.');
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
		const results: PlaylistInfo = await playlistInfo(playlistId);
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
