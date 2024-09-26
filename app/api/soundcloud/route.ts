// // SoundCloud API documentation
// // https://developers.soundcloud.com/docs/api/guide#uploading

// ! Soundcloud developer APP registrations are temporarily closed.
// ! Code below is a placeholder text for now.

// import { formatFetchError } from '@/app/lib/utils';
// import axios, { AxiosResponse } from 'axios';
// import { NextResponse, type NextRequest } from 'next/server';

// export async function POST(
// 	req: NextRequest
// ): Promise<NextResponse<SoundCloudPlaylistResponse | { error: string }>> {
// 	try {
// 		if (
// 			!process.env.SOUNDCLOUD_CLIENT_ID ||
// 			!process.env.SOUNDCLOUD_CLIENT_SECRET
// 		) {
// 			console.error(
// 				'Provide SOUNDCLOUD_CLIENT_ID, SOUNDCLOUD_CLIENT_SECRET env variable'
// 			);
// 			return NextResponse.json(
// 				{ error: 'Unknown server error' },
// 				{ status: 500 }
// 			);
// 		}
// 		const { body } = await req.json();
// 		if (!body.playlist)
// 			return NextResponse.json(
// 				{ error: 'Provide playlist embed code' },
// 				{ status: 400 }
// 			);
// 		const id = body.playlist.slice(
// 			body.playlist.indexOf('/playlists/') + 11,
// 			body.playlist.indexOf('&')
// 		);
// 		if (!Number(id)) {
// 			return NextResponse.json(
// 				{ error: 'Provide playlist embed code' },
// 				{ status: 400 }
// 			);
// 		}
// 		const options = {
// 			url: 'https://secure.soundcloud.com/oauth/token',
// 			method: 'POST',
// 			headers: {
// 				Authorization:
// 					'Basic ' +
// 					Buffer.from(
// 						process.env.SOUNDCLOUD_CLIENT_ID +
// 							':' +
// 							process.env.SOUNDCLOUD_CLIENT_SECRET
// 					).toString('base64'),
// 			},
// 			params: {
// 				grant_type: 'client_credentials',
// 			},
// 		};
// 		const resAuth: AxiosResponse = await axios(options);
// 		const token = resAuth.data.access_token;
// 		const res = await axios.get('https://api.soundcloud.com/playlists/' + id, {
// 			headers: {
// 				Authorization: 'OAuth ' + token,
// 			},
// 			timeout: 10000,
// 		});
// 		return NextResponse.json(res.data, { status: 200 });
// 	} catch (error: unknown) {
// 		return formatFetchError(error);
// 	}
// }
