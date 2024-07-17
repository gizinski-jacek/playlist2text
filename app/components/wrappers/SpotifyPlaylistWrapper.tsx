import { sourcesData } from '@/app/lib/data';
import { SpotifyPlaylistResponse } from '@/app/lib/types';
import { convertMsToDuration } from '@/app/lib/utils';
import Image from 'next/image';

export default function SpotifyPlaylistWrapper({
	data,
}: {
	data: SpotifyPlaylistResponse;
}) {
	return (
		<div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
			<div className='flex flex-row items-center text-center gap-2 gap-1 p-2 bg-gray-300 border border-2 border-black rounded rounded-md max-w-sm'>
				<Image
					src={data.images[0].url}
					height={180}
					width={180}
					alt='Cover image'
				/>
				<div className='w-fit'>
					<div className='capitalize'>Playlist name:</div>
					<a
						href={data.external_urls.spotify}
						className='text-blue-700 my-1'
						target='_blank'
						rel='noreferrer'
					>
						<div>{data.name}</div>
					</a>
					<div className='capitalize'>
						{data.tracks.total} {data.tracks.total === 1 ? 'track' : 'tracks'}
					</div>
				</div>
			</div>
			{data.tracks.items.map((item, i) => (
				<div
					key={item.track.id + i}
					className='flex flex-col justify-between gap-1 p-2 bg-gray-300 border border-2 border-black rounded rounded-md max-w-sm capitalize'
				>
					<div className='flex flex-col gap-1'>
						<div className='flex flex-row justify-between'>
							<div>Track No.{i + 1}</div>
							<div>{convertMsToDuration(item.track.duration_ms)}</div>
						</div>
						<div className='flex justify-between gap-2'>
							<a
								href={item.track.external_urls.spotify}
								className='text-blue-700'
								target='_blank'
								rel='noreferrer'
							>
								<div>{item.track.name}</div>
							</a>
						</div>
					</div>
					<div className='grid grid-cols-[minmax(0, 1fr)] grid-cols-[auto_1fr] gap-1'>
						<div className='me-2'>Album:</div>
						<div className='w-fit'>
							<a
								href={item.track.album.external_urls.spotify}
								className='text-blue-700'
								target='_blank'
								rel='noreferrer'
							>
								<div>{item.track.album.name}</div>
							</a>
						</div>
						<div className='me-2'>
							{item.track.artists.length === 1 ? 'Artist:' : 'Artists:'}
						</div>
						<div className='flex flex-row gap-1 flex-wrap'>
							{item.track.artists.map((artist) => (
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
						{sourcesData.map((source) => (
							<div key={source.name}>
								<a
									href={
										source.url +
										item.track.name +
										item.track.artists.map((artist) => ' ' + artist.name) +
										source.urlOption
									}
									className={`w-fit flex flex-row decoration-${source.color} text-${source.color}`}
									target='_blank'
									rel='noreferrer'
								>
									<Image
										src={`/${source.name}.svg`}
										alt={source.name}
										width={20}
										height={20}
									/>
									<div className={`ps-2 capitalize`}>{source.name}</div>
								</a>
							</div>
						))}
					</div>
				</div>
			))}
		</div>
	);
}
