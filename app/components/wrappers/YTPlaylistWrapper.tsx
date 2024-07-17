import { sourcesData } from '@/app/lib/data';
import { PlaylistInfo } from 'youtube-ext';
import Image from 'next/image';

export default function YTPlaylistWrapper({ data }: { data: PlaylistInfo }) {
	return (
		<div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
			<div className='flex flex-row items-center text-center gap-2 gap-1 p-2 bg-gray-300 border border-2 border-black rounded rounded-md max-w-sm'>
				<Image
					src={data.thumbnails.sort((a, b) => b.width - a.width)[0].url}
					height={180}
					width={180}
					alt='Cover image'
				/>
				<div className='w-fit'>
					<div className='capitalize'>Playlist name:</div>
					<a
						href={data.url}
						className='text-blue-700 my-1'
						target='_blank'
						rel='noreferrer'
					>
						<div>{data.title}</div>
					</a>
					<div className='capitalize'>
						{data.videos.length} {data.videos.length === 1 ? 'track' : 'tracks'}
					</div>
				</div>
			</div>
			{data.videos.map((item, i) => (
				<div
					key={item.id + i}
					className='flex flex-col justify-between gap-1 p-2 bg-gray-300 border border-2 border-black rounded rounded-md max-w-sm capitalize'
				>
					<div className='flex flex-col gap-1'>
						<div className='flex flex-row justify-between'>
							<div>Track No.{i + 1}</div>
							<div>{item.duration.pretty}</div>
						</div>
						<div className='flex justify-between gap-2'>
							<a
								href={item.url}
								className='text-blue-700'
								target='_blank'
								rel='noreferrer'
							>
								<div>{item.title}</div>
							</a>
						</div>
					</div>
					<div className='grid grid-cols-2 gap-1 mt-2'>
						{sourcesData.map((source) => (
							<div key={source.name}>
								<a
									href={source.url + item.title + source.urlOption}
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
