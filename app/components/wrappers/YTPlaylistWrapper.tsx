import { sourcesData } from '@/app/lib/data';
import { YoutubePlaylistResponse } from '@/app/lib/types';
import Image from 'next/image';
import ExternalLink from '../ExternalLink';

export default function YTPlaylistWrapper({
	data: playlist,
}: {
	data: YoutubePlaylistResponse;
}) {
	return (
		<div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
			<div className='flex flex-row items-center text-center gap-2 gap-1 p-2 bg-gray-300 border border-2 border-black rounded rounded-md max-w-sm'>
				<Image
					src={playlist.thumbnails.sort((a, b) => b.width - a.width)[0].url}
					height={180}
					width={180}
					alt='Cover image'
				/>
				<div className='w-fit'>
					<div className='capitalize'>Playlist name:</div>
					<a
						href={playlist.url}
						className='text-blue-700 my-1'
						target='_blank'
						rel='noreferrer'
					>
						<div>{playlist.title}</div>
					</a>
					<div className='capitalize'>
						{playlist.videos.length}{' '}
						{playlist.videos.length === 1 ? 'track' : 'tracks'}
					</div>
				</div>
			</div>
			{playlist.videos.map((track, i) => (
				<div
					key={track.id + i}
					className='flex flex-col justify-between gap-1 p-2 bg-gray-300 border border-2 border-black rounded rounded-md max-w-sm capitalize'
				>
					<div className='flex flex-col gap-1'>
						<div className='flex flex-row justify-between'>
							<div>Track No.{i + 1}</div>
							<div>Length: {track.duration.pretty}</div>
						</div>
						<div className='flex justify-between gap-2'>
							<a
								href={track.url}
								className='text-blue-700'
								target='_blank'
								rel='noreferrer'
							>
								<div>{track.title}</div>
							</a>
						</div>
					</div>
					<div className='grid grid-cols-2 gap-1 mt-2'>
						{sourcesData.map((source) => {
							if (
								source.name === 'youtube' ||
								source.name === 'spotify-album'
							) {
								return;
							}
							return (
								<ExternalLink
									key={source.name}
									source={source}
									url={track.title}
								/>
							);
						})}
					</div>
				</div>
			))}
		</div>
	);
}
