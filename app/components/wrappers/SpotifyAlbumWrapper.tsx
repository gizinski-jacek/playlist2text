import { sourcesData } from '@/app/lib/data';
import { SpotifyAlbumResponse } from '@/app/lib/types';
import { convertMsToDuration } from '@/app/lib/utils';
import Image from 'next/image';
import ExternalLink from '../ExternalLink';

export default function SpotifyAlbumWrapper({
	data: album,
}: {
	data: SpotifyAlbumResponse;
}) {
	return (
		<div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
			<div className='flex flex-row items-center text-center gap-2 gap-1 p-2 bg-gray-300 border border-2 border-black rounded rounded-md max-w-sm'>
				<Image
					src={album.images[0].url}
					height={180}
					width={180}
					alt='Cover image'
				/>
				<div className='w-fit'>
					<div className='capitalize'>Playlist name:</div>
					<a
						href={album.external_urls.spotify}
						className='text-blue-700 my-1'
						target='_blank'
						rel='noreferrer'
					>
						<div>{album.name}</div>
					</a>
					<div className='capitalize'>
						{album.tracks.items.length}{' '}
						{album.tracks.items.length === 1 ? 'track' : 'tracks'}
					</div>
				</div>
			</div>
			{album.tracks.items.map((track, i) => (
				<div
					key={track.id + i}
					className='flex flex-col justify-between gap-1 p-2 bg-gray-300 border border-2 border-black rounded rounded-md max-w-sm capitalize'
				>
					<div className='flex flex-col gap-1'>
						<div className='flex flex-row justify-between'>
							<div>Track No.{i + 1}</div>
							<div>Length: {convertMsToDuration(track.duration_ms)}</div>
						</div>
						<div className='flex justify-between gap-2'>
							<a
								href={track.external_urls.spotify}
								className='text-blue-700'
								target='_blank'
								rel='noreferrer'
							>
								<div>{track.name}</div>
							</a>
						</div>
					</div>
					<div className='grid grid-cols-[minmax(0, 1fr)] grid-cols-[auto_1fr] gap-1'>
						<div className='me-2'>Album:</div>
						<div className='w-fit'>
							<a
								href={track.external_urls.spotify}
								className='text-blue-700'
								target='_blank'
								rel='noreferrer'
							>
								<div>{track.name}</div>
							</a>
						</div>
						<div className='me-2'>
							{track.artists.length === 1 ? 'Artist:' : 'Artists:'}
						</div>
						<div className='flex flex-row gap-1 flex-wrap'>
							{track.artists.map((artist) => (
								<div key={artist.id}>
									<a
										href={artist.external_urls.spotify}
										className='text-blue-700'
										target='_blank'
										rel='noreferrer'
									>
										<div>{artist.name}</div>
									</a>
								</div>
							))}
						</div>
					</div>
					<div className='grid grid-cols-2 gap-1 mt-2'>
						{sourcesData.map((source) => {
							if (source.name === 'spotify-album') {
								return;
							}
							return (
								<ExternalLink
									key={source.name}
									source={source}
									url={
										track.name +
										track.artists.map((artist) => ' ' + artist.name)
									}
								/>
							);
						})}
					</div>
				</div>
			))}
		</div>
	);
}
