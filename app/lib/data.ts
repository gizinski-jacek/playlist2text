import { SourcesData } from './types';

export const sourcesData: SourcesData = [
	{
		name: 'spotify',
		color: 'green-600',
		url: 'https://open.spotify.com/search/',
		urlOption: '/tracks',
	},
	{
		name: 'soundcloud',
		color: 'orange-600',
		url: 'https://soundcloud.com/search?q=',
		urlOption: '',
	},
	{
		name: 'youtube',
		color: 'red-700',
		url: 'https://www.youtube.com/results?search_query=',
		urlOption: '',
	},
	{
		name: 'youtube-music',
		color: 'red-600',
		url: 'https://music.youtube.com/search?q=',
		urlOption: '',
	},
	{
		name: 'apple-music',
		color: 'red-500',
		url: 'https://music.apple.com/us/search?term=',
		urlOption: '',
	},
];

export const spotifyFieldNames: string[] = [
	'Track Name',
	'Duration',
	'Album Name',
	'Artists',
	'Album Release',
];
