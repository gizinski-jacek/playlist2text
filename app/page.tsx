'use client';

import axios, { AxiosError, AxiosResponse } from 'axios';
import { useState } from 'react';
import {
	SourceName,
	SpotifyAlbumResponse,
	SpotifyPlaylistResponse,
	YoutubePlaylistResponse,
	YTMusicPlaylistResponse,
} from './lib/types';
import SpotifyPlaylistWrapper from './components/wrappers/SpotifyPlaylistWrapper';
import SpotifyAlbumWrapper from './components/wrappers/SpotifyAlbumWrapper';
import YTPlaylistWrapper from './components/wrappers/YTPlaylistWrapper';
import YTMusicPlaylistWrapper from './components/wrappers/YTMusicPlaylistWrapper';
import { spotifyFieldNames, sourcesData } from './lib/data';
import {
	formatSpotifyPlaylist,
	formatSpotifyAlbum,
	formatYTPlaylist,
	formatYTMusicPlaylist,
} from './lib/utils';
import LoadingBar from './components/LoadingBar';
import ScrollToTop from './components/ScrollToTop';
import { NextResponse } from 'next/server';

export default function Home() {
	const [fetching, setFetching] = useState(false);
	const [tracksData, setTracksData] = useState<
		| SpotifyPlaylistResponse
		| SpotifyAlbumResponse
		| YoutubePlaylistResponse
		| YTMusicPlaylistResponse
		| null
	>(null);
	const [fetchingError, setFetchingError] = useState<string | null>(null);
	const [selectedSource, setSelectedSource] = useState<SourceName | null>(null);
	const [renderedSource, setRenderedSource] = useState<SourceName | null>(null);
	const [playlistInput, setPlaylistInput] = useState('');
	const [formError, setFormError] = useState<string | null>(null);
	const [exportFields, setExportFields] = useState<
		{ name: string; checked: boolean }[]
	>(() =>
		spotifyFieldNames.map((field) => ({
			name: field,
			checked: false,
		}))
	);
	const [fieldsError, setFieldsError] = useState<string | null>(null);

	async function fetchData(e: React.MouseEvent<HTMLButtonElement>) {
		try {
			e.preventDefault();
			dismissErrors();
			setTracksData(null);
			setFetching(true);
			if (!selectedSource) {
				setFormError('Select playlist source');
			}
			if (!playlistInput) {
				if (selectedSource === 'soundcloud') {
					setFormError('Provide playlist embed code');
				}
				if (selectedSource === 'spotify-album') {
					setFormError('Provide album link or Id');
				} else {
					setFormError('Provide playlist link or Id');
				}
			}
			if (!playlistInput) {
				if (selectedSource === 'soundcloud' && playlistInput.length > 1024) {
					setFormError('Provided playlist embed code is too long');
				} else if (playlistInput.length > 128) {
					setFormError('Provided playlist link or Id is too long');
				}
			}
			const res: AxiosResponse = await axios.post(`/api/${selectedSource}`, {
				body: { playlist: playlistInput },
				timeout: 10000,
			});
			setRenderedSource(selectedSource);
			setTracksData(res.data);
			setFetching(false);
		} catch (error: unknown) {
			if (error instanceof AxiosError) {
				setFetchingError(
					error.response?.status !== 500
						? error.response?.data.error ||
								'Unknown fetching error. Make sure you selected correct source.'
						: 'Unknown fetching error. Make sure you selected correct source.'
				);
			} else if (error instanceof NextResponse) {
				setFetchingError(
					error.status !== 500
						? error.statusText ||
								'Unknown fetching error. Make sure you selected correct source.'
						: 'Unknown fetching error. Make sure you selected correct source.'
				);
			} else {
				setFetchingError(
					'Unknown fetching error. Make sure you selected correct source.'
				);
			}
			setRenderedSource(null);
			setTracksData(null);
			setFetching(false);
		}
	}

	function handleSourceChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { value } = e.target as { value: SourceName };
		dismissErrors();
		setSelectedSource(value);
	}

	function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { value } = e.target;
		dismissErrors();
		setPlaylistInput(value);
	}

	function handleFieldToggle(e: React.ChangeEvent<HTMLInputElement>) {
		const { value, checked } = e.target as { value: string; checked: boolean };
		setFieldsError(null);
		if (value === 'checkAll') {
			setExportFields((prevState) =>
				prevState.map((field) => {
					return { name: field.name, checked: checked };
				})
			);
		} else {
			setExportFields((prevState) =>
				prevState.map((field) =>
					field.name === value ? { name: field.name, checked: checked } : field
				)
			);
		}
	}

	function exportToFile(
		e: React.MouseEvent<HTMLButtonElement>,
		exportType: 'txt' | 'csv'
	) {
		e.preventDefault();
		if (!tracksData || !renderedSource) {
			setFieldsError('No playlist data to export');
			return;
		}
		let exportData: string[] = [];
		if (renderedSource === 'spotify') {
			if (!exportFields.some((field) => field.checked)) {
				setFieldsError('Must select at least one field to export');
				return;
			}
			const fields: string[] = [];
			exportFields.forEach((field) => {
				if (field.checked) {
					fields.push(field.name);
				}
			});
			exportData = formatSpotifyPlaylist(
				exportType,
				fields,
				(tracksData as SpotifyPlaylistResponse).tracks.items
			);
		}
		if (renderedSource === 'spotify-album') {
			if (!exportFields.some((field) => field.checked)) {
				setFieldsError('Must select at least one field to export');
				return;
			}
			const fields: string[] = [];
			exportFields.forEach((field) => {
				if (field.checked) {
					fields.push(field.name);
				}
			});
			tracksData as SpotifyAlbumResponse;
			exportData = formatSpotifyAlbum(
				exportType,
				fields,
				(tracksData as SpotifyAlbumResponse).name,
				(tracksData as SpotifyAlbumResponse).release_date,
				(tracksData as SpotifyAlbumResponse).tracks.items
			);
		} else if (renderedSource === 'youtube') {
			exportData = formatYTPlaylist(
				exportType,
				['Track Name', 'Duration'],
				(tracksData as YoutubePlaylistResponse).videos
			);
		} else if (renderedSource === 'youtube-music') {
			exportData = formatYTMusicPlaylist(
				exportType,
				['Track Name'],
				tracksData as YTMusicPlaylistResponse
			);
		}
		if (exportType === 'txt') {
			const linebreaks = exportData.join('\r\n');
			const blob = new Blob([linebreaks], {
				type: 'text/plain;charset=utf-8',
			});
			const url = URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.download = 'tracks-data.txt';
			link.href = url;
			link.click();
			link.remove();
		} else if (exportType === 'csv') {
			const linebreaks = exportData.join('\r\n');
			const blob = new Blob([linebreaks], {
				type: 'text/csv;charset=UTF-8',
			});
			const url = URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.download = 'tracks-data.csv';
			link.href = url;
			link.click();
			link.remove();
		}
	}

	function dismissErrors() {
		setFormError(null);
		setFieldsError(null);
		setFetchingError(null);
	}

	return (
		<main className='min-h-screen flex flex-col gap-4 items-center p-8'>
			<form className='flex flex-col gap-2'>
				<div className='flex flex-col md:flex-row gap-4'>
					<fieldset className='grid grid-cols-2 xl:grid-cols-4 gap-4 p-3 px-5 border border-2 border-blue-600 rounded'>
						<legend className='px-1 font-semibold capitalize'>
							Select source
						</legend>
						{sourcesData.map((source) => {
							// ! Skip hosts without access to API.
							if (
								source.name === 'soundcloud' ||
								source.name === 'apple-music'
							) {
								return;
							}
							return (
								<div key={source.name} className='flex flex-row items-center'>
									<input
										className={`h-4 w-4 accent-${source.color}`}
										type='radio'
										name='source'
										id={source.name}
										value={source.name}
										checked={source.name === selectedSource}
										onChange={handleSourceChange}
										disabled={fetching}
									/>
									<label htmlFor={source.name} className='ps-1 capitalize'>
										{source.name.replace('-', ' ')}
									</label>
								</div>
							);
						})}
					</fieldset>
				</div>
				<fieldset className='flex flex-col md:flex-1'>
					<label htmlFor='playlistInput'>
						{selectedSource === 'soundcloud'
							? 'Provide playlist Embed code'
							: selectedSource === 'spotify-album'
							? 'Provide album link or Id'
							: 'Provide playlist link or Id'}
					</label>
					<input
						className='border border-2 border-blue-600 rounded p-1'
						type='text'
						minLength={8}
						maxLength={selectedSource === 'soundcloud' ? 1024 : 128}
						id='playlistInput'
						name='playlistInput'
						value={playlistInput}
						onChange={handleInputChange}
					/>
				</fieldset>
				{formError && (
					<div className='text-xl font-semibold text-red-600 self-center underline'>
						{formError}
					</div>
				)}
				<button
					className='my-2 mx-auto uppercase font-bold text-white p-2 rounded-lg bg-blue-600 '
					type='button'
					onClick={fetchData}
					disabled={
						fetching || !!formError || !selectedSource || !playlistInput
					}
				>
					Get Data
				</button>
			</form>
			{fetching && <LoadingBar margin='1rem' width='50%' />}
			{!fetching && fetchingError && (
				<div className='w-1/3 text-center text-xl font-semibold self-center p-2 bg-gray-800 text-white border border-[3px] border-red-600 rounded'>
					{fetchingError}
				</div>
			)}
			{tracksData ? (
				renderedSource === 'spotify' || renderedSource === 'spotify-album' ? (
					<form className='flex flex-col gap-4 relative'>
						<fieldset className='grid grid-cols-2 md:grid-cols-3 gap-4 p-3 px-5 border border-2 border-orange-700 rounded'>
							<legend className='px-1 font-semibold capitalize'>
								Select fields to export
							</legend>
							<div className='flex flex-row items-center absolute top-0 right-5 px-1 bg-custom-primary'>
								<input
									className={`h-4 w-4 accent-orange-700`}
									type='checkbox'
									name='field'
									id='checkAll'
									value='checkAll'
									checked={exportFields.every((field) => field.checked)}
									onChange={handleFieldToggle}
									disabled={fetching}
								/>
								<label
									htmlFor='checkAll'
									className='ps-1 font-semibold capitalize'
								>
									Check all
								</label>
							</div>
							{exportFields.map((field) => (
								<div key={field.name} className='flex flex-row items-center'>
									<input
										className={`h-4 w-4 accent-orange-700`}
										type='checkbox'
										name='field'
										id={field.name}
										value={field.name}
										checked={field.checked}
										onChange={handleFieldToggle}
										disabled={fetching}
									/>
									<label htmlFor={field.name} className='ps-1 capitalize'>
										{field.name}
									</label>
								</div>
							))}
						</fieldset>
						{fieldsError && (
							<div className='text-xl font-semibold text-red-600 self-center underline'>
								{fieldsError}
							</div>
						)}
						<div className='flex flex-col md:flex-row gap-4 mx-auto'>
							<button
								className='font-bold text-white p-2 rounded-lg bg-orange-700 '
								type='button'
								onClick={(e) => exportToFile(e, 'txt')}
								disabled={
									fetching ||
									!!fieldsError ||
									!exportFields.some((field) => field.checked)
								}
							>
								Download as TXT file
							</button>
							<button
								className='font-bold text-white p-2 rounded-lg bg-orange-700'
								type='button'
								onClick={(e) => exportToFile(e, 'csv')}
								disabled={
									fetching ||
									!!fieldsError ||
									!exportFields.some((field) => field.checked)
								}
							>
								Download as CSV file
							</button>
						</div>
					</form>
				) : (
					<div className='flex flex-col md:flex-row gap-4 mx-auto'>
						<button
							className='font-bold text-white p-2 rounded-lg bg-orange-700 '
							type='button'
							onClick={(e) => exportToFile(e, 'txt')}
							disabled={fetching}
						>
							Download as TXT file
						</button>
						<button
							className='font-bold text-white p-2 rounded-lg bg-orange-700'
							type='button'
							onClick={(e) => exportToFile(e, 'csv')}
							disabled={fetching}
						>
							Download as CSV file
						</button>
					</div>
				)
			) : null}
			{tracksData ? (
				renderedSource === 'spotify' ? (
					<SpotifyPlaylistWrapper
						data={tracksData as SpotifyPlaylistResponse}
					/>
				) : renderedSource === 'spotify-album' ? (
					<SpotifyAlbumWrapper data={tracksData as SpotifyAlbumResponse} />
				) : renderedSource === 'youtube' ? (
					<YTPlaylistWrapper data={tracksData as YoutubePlaylistResponse} />
				) : renderedSource === 'youtube-music' ? (
					<YTMusicPlaylistWrapper
						data={tracksData as YTMusicPlaylistResponse}
					/>
				) : null
			) : null}
			<ScrollToTop />
		</main>
	);
}
