import { sourcesData } from '@/app/lib/data';
import { SpotifyPlaylistsResponse } from '@/app/lib/types';
import { convertMsToCountdown } from '@/app/lib/utils';
import Image from 'next/image';

export default function SpotifyPlaylistWrapper({
	data,
}: {
	data: SpotifyPlaylistsResponse;
}) {
	return (
		<div className='flex flex-col gap-4'>
			<div className='flex flex-col md:flex-row items-center text-center gap-2 mx-auto max-w-[50%]'>
				<Image
					src={data.images[0].url}
					height={200}
					width={200}
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
			<div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
				{data.tracks.items.map((item) => (
					<div
						key={item.track.id}
						className='flex flex-col gap-1 p-2 bg-gray-300 border border-2 border-black rounded rounded-md max-w-sm'
					>
						<div className='flex justify-between gap-2'>
							<a
								href={item.track.external_urls.spotify}
								className='text-blue-700'
								target='_blank'
								rel='noreferrer'
							>
								<div>{item.track.name}</div>
							</a>
							<div>{convertMsToCountdown(item.track.duration_ms)}</div>
						</div>
						<div className='grid grid-cols-[minmax(0, 1fr)] grid-cols-[auto_1fr] gap-1'>
							<div className='me-2'>Album:</div>
							<a
								href={item.track.album.external_urls.spotify}
								className='text-blue-700'
								target='_blank'
								rel='noreferrer'
							>
								<div>{item.track.album.name}</div>
							</a>
							<div className='me-2'>
								{item.track.artists.length === 1 ? 'Artist:' : 'Artists:'}
							</div>
							<div className='flex flex-row gap-3'>
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
						<div className='grid grid-cols-2 gap-2 mt-2'>
							{sourcesData.map((source) => (
								<a
									key={source.name}
									href={
										source.url +
										item.track.name +
										item.track.artists.map((artist) => ' ' + artist.name) +
										source.urlOption
									}
									className={`flex flex-row gap-2`}
									target='_blank'
									rel='noreferrer'
								>
									<Image
										src={`/${source.name}.svg`}
										alt={source.name}
										width={20}
										height={20}
									/>
									<div
										className={`capitalize decoration-${source.color} text-${source.color}`}
									>
										{source.name}
									</div>
								</a>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
