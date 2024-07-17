import { sourcesData } from '@/app/lib/data';
import { VideoDetailed } from 'ytmusic-api';
import Image from 'next/image';

export default function YTMusicPlaylistWrapper({
	data,
}: {
	data: VideoDetailed[];
}) {
	return (
		<div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
			{data.map((item, i) => (
				<div
					key={item.videoId + i}
					className='flex flex-col justify-between gap-1 p-2 bg-gray-300 border border-2 border-black rounded rounded-md max-w-sm capitalize'
				>
					<div className='flex flex-col gap-1'>
						<div className='flex flex-row justify-between'>
							<div>Track No.{i + 1}</div>
							{item.duration && <div>{item.duration}</div>}
						</div>
						<div className='flex justify-between gap-2'>
							<a
								href={'https://music.youtube.com/watch?v=' + item.videoId}
								className='text-blue-700'
								target='_blank'
								rel='noreferrer'
							>
								<div>{item.name}</div>
							</a>
						</div>
					</div>
					<div className='grid grid-cols-[minmax(0, 1fr)] grid-cols-[auto_1fr] gap-1'>
						<div className='me-2'>Artist:</div>
						<div className='flex flex-row gap-1 flex-wrap'>
							<a
								href={
									'https://music.youtube.com/channel/' + item.artist.artistId
								}
								className='text-blue-700'
								target='_blank'
								rel='noreferrer'
							>
								<div>{item.artist.name}</div>
							</a>
						</div>
					</div>
					<div className='grid grid-cols-2 gap-1 mt-2'>
						{sourcesData.map((source) => {
							if (source.name === 'spotify-album') {
								return;
							}
							return (
								<div key={source.name}>
									<a
										href={
											source.url +
											item.name +
											item.artist.name +
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
							);
						})}
					</div>
				</div>
			))}
		</div>
	);
}
