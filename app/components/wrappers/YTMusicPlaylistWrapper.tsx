import { sourcesData } from '@/app/lib/data';
import { YTMusicPlaylistResponse } from '@/app/lib/types';
import ExternalLink from '../ExternalLink';

export default function YTMusicPlaylistWrapper({
	data: playlist,
}: {
	data: YTMusicPlaylistResponse;
}) {
	return (
		<div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
			{playlist.map((track, i) => (
				<div
					key={track.videoId + i}
					className='flex flex-col justify-between gap-1 p-2 bg-gray-300 border border-2 border-black rounded rounded-md max-w-sm capitalize'
				>
					<div className='flex flex-col gap-1'>
						<div className='flex flex-row justify-between'>
							<div>Track No.{i + 1}</div>
							{track.duration && <div>Length: {track.duration}</div>}
						</div>
						<div className='flex justify-between gap-2'>
							<a
								href={'https://music.youtube.com/watch?v=' + track.videoId}
								className='text-blue-700'
								target='_blank'
								rel='noreferrer'
							>
								<div>{track.name}</div>
							</a>
						</div>
					</div>
					<div className='grid grid-cols-[minmax(0, 1fr)] grid-cols-[auto_1fr] gap-1'>
						<div className='me-2'>Artist:</div>
						<div className='flex flex-row gap-1 flex-wrap'>
							<a
								href={
									'https://music.youtube.com/channel/' + track.artist.artistId
								}
								className='text-blue-700'
								target='_blank'
								rel='noreferrer'
							>
								<div>{track.artist.name}</div>
							</a>
						</div>
					</div>
					<div className='grid grid-cols-2 gap-1 mt-2'>
						{sourcesData.map((source) => {
							if (
								source.name === 'youtube-music' ||
								source.name === 'spotify-album'
							) {
								return;
							}
							return (
								<ExternalLink
									key={source.name}
									source={source}
									url={track.name + track.artist.name}
								/>
							);
						})}
					</div>
				</div>
			))}
		</div>
	);
}
