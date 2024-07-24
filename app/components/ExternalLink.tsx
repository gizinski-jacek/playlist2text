import Image from 'next/image';
import { SourcesData } from '../lib/types';

export default function ExternalLink({
	source,
	url,
}: {
	source: SourcesData;
	url: string;
}) {
	return (
		<div key={source.name}>
			<a
				href={source.url + url + source.urlOption}
				className={`w-fit flex flex-row decoration-${source.color} text-${source.color}`}
				target='_blank'
				rel='noreferrer'
			>
				<Image src={source.iconPath} alt={source.name} width={20} height={20} />
				<div className={`ps-2 capitalize`}>{source.name.replace('-', ' ')}</div>
			</a>
		</div>
	);
}
