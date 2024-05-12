'use client';

import axios, { AxiosError, AxiosResponse } from 'axios';
import { useState } from 'react';
import { SpotifyPlaylistsResponse } from './lib/types';
import SpotifyPlaylistWrapper from './components/wrappers/SpotifyPlaylistWrapper';
import { sourcesData } from './lib/data';

export default function Home() {
	const [data, setData] = useState<SpotifyPlaylistsResponse | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [selectedSource, setSelectedSource] = useState<string | null>(null);
	const [userInput, setUserInput] = useState('');
	const [formError, setFormError] = useState<string | null>(null);

	async function fetchData(e: React.MouseEvent<HTMLButtonElement>) {
		try {
			e.preventDefault();
			if (!selectedSource) {
				setFormError('Selected source');
			}
			if (!userInput) {
				setFormError('Provide id');
			}
			const res: AxiosResponse = await axios.get(
				`/api/${selectedSource}?playlistId=${userInput}`
			);
			setData(res.data);
		} catch (error: any) {
			if (error instanceof Response) {
				setError(error.statusText || 'Unknown error.');
			} else if (error instanceof AxiosError) {
				setError(error.message || 'Unknown error.');
			} else {
				setError((error as Error).message || 'Unknown error.');
			}
		}
	}

	function handleSourceChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { value } = e.target as { value: string };
		setSelectedSource(value);
	}

	function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { value } = e.target;
		setUserInput(value);
	}

	return (
		<main className='min-h-screen flex flex-col gap-8 items-center p-8'>
			<form className='flex flex-col gap-4'>
				<div className='flex flex-col md:flex-row gap-4'>
					<fieldset className='grid grid-cols-2 xl:grid-cols-auto gap-4 p-3 px-5 border border-2 border-blue-700 rounded'>
						<legend className='px-1 font-semibold capitalize'>
							Select source
						</legend>
						{sourcesData.map((source) => (
							<div
								key={source.name}
								className='flex flex-row items-center gap-2'
							>
								<input
									className={`h-4 w-4 accent-${source.color}`}
									type='radio'
									name='source'
									id={source.name}
									value={source.name}
									checked={source.name === selectedSource}
									onChange={handleSourceChange}
								/>
								<label htmlFor={source.name} className='capitalize'>
									{source.name.replace('-', ' ')}
								</label>
							</div>
						))}
					</fieldset>
				</div>
				<div className='flex flex-col gap-4'>
					<div className='flex flex-col md:flex-1'>
						<label htmlFor='userInput'>Provide playlist link or ID</label>
						<input
							className='border border-1 border-blue-500 rounded p-1'
							type='text'
							minLength={8}
							maxLength={128}
							id='userInput'
							name='userInput'
							value={userInput}
							onChange={handleInputChange}
						/>
					</div>
					<button
						className='mx-auto uppercase font-bold text-white p-2 rounded-lg bg-blue-700 '
						type='button'
						onClick={fetchData}
					>
						Get Data
					</button>
				</div>
			</form>
			{data && (
				<SpotifyPlaylistWrapper data={data as SpotifyPlaylistsResponse} />
			)}
		</main>
	);
}
