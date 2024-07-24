import { SourceList } from './types';

export const sourcesData: SourceList = [
	{
		name: 'spotify',
		color: 'green-600',
		url: 'https://open.spotify.com/search/',
		urlOption: '/tracks',
		iconPath: '/spotify.svg',
	},
	{
		name: 'spotify-album',
		color: 'green-600',
		url: 'https://open.spotify.com/search/',
		urlOption: '/tracks',
		iconPath: '/spotify.svg',
	},
	{
		name: 'soundcloud',
		color: 'orange-600',
		url: 'https://soundcloud.com/search?q=',
		urlOption: '',
		iconPath: '/soundcloud.svg',
	},
	{
		name: 'youtube',
		color: 'red-700',
		url: 'https://www.youtube.com/results?search_query=',
		urlOption: '',
		iconPath: '/youtube.svg',
	},
	{
		name: 'youtube-music',
		color: 'red-600',
		url: 'https://music.youtube.com/search?q=',
		urlOption: '',
		iconPath: '/youtube-music.svg',
	},
	{
		name: 'apple-music',
		color: 'red-500',
		url: 'https://music.apple.com/us/search?term=',
		urlOption: '',
		iconPath: '/apple-music.svg',
	},
];

export const spotifyFieldNames: string[] = [
	'Track Name',
	'Duration',
	'Album Name',
	'Artists',
	'Album Release Date',
];
