import { SpotifyTrack } from './types';

export function padNumber(x: number): string {
	return x.toString().padStart(2, '0');
}

export function convertMsToDuration(value: number): string {
	const ms = value % 1000;
	value = (value - ms) / 1000;
	const secs = value % 60;
	value = (value - secs) / 60;
	const mins = value % 60;

	return padNumber(mins) + ':' + padNumber(secs);
}

export function formatPlaylistToTXT(
	fields: string[],
	trackList: SpotifyTrack[]
) {
	const txtFields = fields.join(' - ');
	const txtData = trackList.map((data) => {
		const array: string[] = [];
		fields.forEach((field) => {
			switch (field.toLocaleLowerCase()) {
				case 'track name':
					array.push(data.track.name);
					break;
				case 'duration':
					array.push(convertMsToDuration(data.track.duration_ms));
					break;
				case 'album name':
					array.push(data.track.album.name);
					break;
				case 'artists':
					array.push(
						data.track.album.artists.map((artist) => artist.name).join(', ')
					);
					break;
				case 'album release':
					array.push(data.track.album.release_date);
					break;
				default:
					break;
			}
		});
		return array.join(' - ');
	});
	return [txtFields, ...txtData];
}

export function formatPlaylistToCSV(
	fields: string[],
	trackList: SpotifyTrack[]
) {
	const csvFields = '"' + fields.join('","') + '"';
	const csvData = trackList.map((data) => {
		const array: string[] = [];
		fields.forEach((field) => {
			switch (field.toLocaleLowerCase()) {
				case 'track name':
					array.push(data.track.name);
					break;
				case 'duration':
					array.push(convertMsToDuration(data.track.duration_ms));
					break;
				case 'album name':
					array.push(data.track.album.name);
					break;
				case 'artists':
					array.push(
						data.track.album.artists.map((artist) => artist.name).join(', ')
					);
					break;
				case 'album release':
					array.push(data.track.album.release_date);
					break;
				default:
					break;
			}
		});
		return '"' + array.join('","') + '"';
	});
	return [csvFields, ...csvData];
}
