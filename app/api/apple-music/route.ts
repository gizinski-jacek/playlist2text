// // Apple Music API documentation
// // https://developer.apple.com/documentation/applemusicapi/get_a_library_playlist

// ! Apple Music developer registrations are temporarily non functional.
// ! Code below is a placeholder text for now.

// import { formatFetchError } from '@/app/lib/utils';
// import axios, { AxiosResponse } from 'axios';
// import { NextResponse, type NextRequest } from 'next/server';

// export async function POST(
// 	req: NextRequest
// ): Promise<NextResponse<AppleMusicPlaylistResponse | { error: string }>> {
// 	try {
// 		if (!process.env.APPLE_API_KEY) {
// 			console.error('Provide APPLE_API_KEY env variables');
// 			return NextResponse.json(
// 				{ error: 'Unknown server error' },
// 				{ status: 500 }
// 			);
// 		}
// 		const { body } = await req.json();
// 		if (!body.id)
// 			return NextResponse.json(
// 				{ error: 'Provide playlist link or Id' },
// 				{ status: 400 }
// 			);

// 		// const res: AxiosResponse = await axios.get(
// 		// 	APPLE_API_URI + body.id,
// 		// 	{ timeout: 10000 }
// 		// );

// 		return NextResponse.json(res.data, { status: 200 });
// 	} catch (error: unknown) {
// 		return formatFetchError(error);
// 	}
// }
