import { NextResponse } from 'next/server';
import {
	SpotifyAlbumTrack,
	SpotifyPlaylistTrack,
	YTMusicPlaylistResponse,
} from './types';
import { PlaylistVideo } from 'youtube-ext';
import { AxiosError } from 'axios';

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

export function formatSpotifyPlaylist(
	exportType: 'txt' | 'csv',
	fields: string[],
	trackList: SpotifyPlaylistTrack[]
): string[] {
	const data = trackList.map((data): string => {
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
				case 'album release date':
					array.push(data.track.album.release_date);
					break;
				default:
					break;
			}
		});
		if (exportType === 'txt') {
			return array.join(' - ');
		} else if (exportType === 'csv') {
			return '"' + array.join('","') + '"';
		}
		return '';
	});
	if (exportType === 'txt') {
		const txtFields = fields.join(' - ');
		return [txtFields, ...data];
	} else if (exportType === 'csv') {
		const csvFields = '"' + fields.join('","') + '"';
		return [csvFields, ...data];
	}
	return [''];
}

export function formatSpotifyAlbum(
	exportType: 'txt' | 'csv',
	fields: string[],
	albumName: string,
	releaseDate: string,
	trackList: SpotifyAlbumTrack[]
): string[] {
	const data = trackList.map((data): string => {
		const array: string[] = [];
		fields.forEach((field) => {
			switch (field.toLocaleLowerCase()) {
				case 'track name':
					array.push(data.name);
					break;
				case 'duration':
					array.push(convertMsToDuration(data.duration_ms));
					break;
				case 'album name':
					array.push(albumName);
					break;
				case 'artists':
					array.push(data.artists.map((artist) => artist.name).join(', '));
					break;
				case 'album release date':
					array.push(releaseDate);
					break;
				default:
					break;
			}
		});
		if (exportType === 'txt') {
			return array.join(' - ');
		} else if (exportType === 'csv') {
			return '"' + array.join('","') + '"';
		}
		return '';
	});
	if (exportType === 'txt') {
		const txtFields = fields.join(' - ');
		return [txtFields, ...data];
	} else if (exportType === 'csv') {
		const csvFields = '"' + fields.join('","') + '"';
		return [csvFields, ...data];
	}
	return [''];
}

export function formatYTPlaylist(
	exportType: 'txt' | 'csv',
	fields: string[],
	trackList: PlaylistVideo[]
): string[] {
	const data = trackList.map((data): string => {
		const array: string[] = [];
		fields.forEach((field) => {
			switch (field.toLocaleLowerCase()) {
				case 'track name':
					array.push(data.title);
					break;
				case 'duration':
					array.push(data.duration.pretty);
					break;
				default:
					break;
			}
		});
		if (exportType === 'txt') {
			return array.join(' - ');
		} else if (exportType === 'csv') {
			return '"' + array.join('","') + '"';
		}
		return '';
	});
	if (exportType === 'txt') {
		const txtFields = fields.join(' - ');
		return [txtFields, ...data];
	} else if (exportType === 'csv') {
		const csvFields = '"' + fields.join('","') + '"';
		return [csvFields, ...data];
	}
	return [''];
}

export function formatYTMusicPlaylist(
	exportType: 'txt' | 'csv',
	fields: string[],
	trackList: YTMusicPlaylistResponse
): string[] {
	const data = trackList.map((data): string => {
		const array: string[] = [];
		fields.forEach((field) => {
			switch (field.toLocaleLowerCase()) {
				case 'track name':
					array.push(data.name);
					break;
				default:
					break;
			}
		});
		if (exportType === 'txt') {
			return array.join(' - ');
		} else if (exportType === 'csv') {
			return '"' + array.join('","') + '"';
		}
		return '';
	});
	if (exportType === 'txt') {
		const txtFields = fields.join(' - ');
		return [txtFields, ...data];
	} else if (exportType === 'csv') {
		const csvFields = '"' + fields.join('","') + '"';
		return [csvFields, ...data];
	}
	return [''];
}

export function formatFetchError(error: unknown): NextResponse<{
	error: string;
}> {
	if (error instanceof AxiosError) {
		return NextResponse.json(
			{ error: error.response?.data.error || 'Unknown server error' },
			{ status: error.status || 500 }
		);
	} else {
		return NextResponse.json(
			{ error: 'Unknown server error' },
			{ status: 500 }
		);
	}
}
