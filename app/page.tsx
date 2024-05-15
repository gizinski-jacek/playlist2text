'use client';

import axios, { AxiosError, AxiosResponse } from 'axios';
import { useState } from 'react';
import { SpotifyPlaylistsResponse } from './lib/types';
import SpotifyPlaylistWrapper from './components/wrappers/SpotifyPlaylistWrapper';
import { fieldNames, sourcesData } from './lib/data';
import { formatPlaylistToCSV, formatPlaylistToTXT } from './lib/utils';
import LoadingBar from './components/LoadingBar';

export default function Home() {
	const [fetching, setFetching] = useState(false);
	const [playlistData, setPlaylistData] =
		useState<SpotifyPlaylistsResponse | null>(null);
	const [fetchingError, setFetchingError] = useState<string | null>(null);
	const [selectedSource, setSelectedSource] = useState<string | null>(null);
	const [playlistInput, setPlaylistInput] = useState('');
	const [formError, setFormError] = useState<string | null>(null);
	const [exportFields, setExportFields] = useState<
		{ name: string; checked: boolean }[]
	>(() =>
		fieldNames.map((field) => ({
			name: field,
			checked: false,
		}))
	);
	const [fieldsError, setFieldsError] = useState<string | null>(null);

	async function fetchData(e: React.MouseEvent<HTMLButtonElement>) {
		try {
			e.preventDefault();
			setFormError(null);
			setFieldsError(null);
			setPlaylistData(null);
			setFetching(true);
			if (!selectedSource) {
				setFormError('Select playlist source!');
			}
			if (!playlistInput) {
				setFormError('Provide playlist link or id!');
			}
			const res: AxiosResponse = await axios.get(
				`/api/${selectedSource}?playlistId=${playlistInput}`,
				{ timeout: 10000 }
			);
			setPlaylistData(res.data);
			setFetching(false);
		} catch (error: any) {
			if (error instanceof Response) {
				setFetchingError(error.statusText || 'Unknown fetching error.');
			} else if (error instanceof AxiosError) {
				setFetchingError(error.message || 'Unknown fetching error.');
			} else {
				setFetchingError((error as Error).message || 'Unknown fetching error.');
			}
			setFetching(false);
		}
	}

	function handleSourceChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { value } = e.target as { value: string };
		setFormError(null);
		setSelectedSource(value);
	}

	function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { value } = e.target;
		setFormError(null);
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

	function exportToTXTFile(e: React.MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		if (!playlistData) {
			setFieldsError('No playlist data to export!');
			return;
		}
		if (!exportFields.some((field) => field.checked)) {
			setFieldsError('Must select at least one field to export!');
			return;
		}
		const fields: string[] = [];
		exportFields.forEach((field) => {
			if (field.checked) {
				fields.push(field.name);
			}
		});
		const data = formatPlaylistToTXT(fields, playlistData.tracks.items);
		const linebreaks = data.join('\r\n');
		const blob = new Blob([linebreaks], {
			type: 'text/plain;charset=utf-8',
		});
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.download = 'playlist-data.txt';
		link.href = url;
		link.click();
		link.remove();
	}

	function exportToCSVFile(e: React.MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		if (!playlistData) {
			setFieldsError('No playlist data to export!');
			return;
		}
		if (!exportFields.some((field) => field.checked)) {
			setFieldsError('Must select at least one field to export!');
			return;
		}
		const fields: string[] = [];
		exportFields.forEach((field) => {
			if (field.checked) {
				fields.push(field.name);
			}
		});
		const data = formatPlaylistToCSV(fields, playlistData.tracks.items);
		const linebreaks = data.join('\r\n');
		const blob = new Blob([linebreaks], {
			type: 'text/csv;charset=UTF-8',
		});
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.download = 'playlist-data.csv';
		link.href = url;
		link.click();
		link.remove();
	}

	return (
		<main className='min-h-screen flex flex-col gap-4 items-center p-8'>
			<form className='flex flex-col gap-2'>
				<div className='flex flex-col md:flex-row gap-4'>
					<fieldset className='grid grid-cols-2 xl:grid-cols-4 gap-4 p-3 px-5 border border-2 border-blue-600 rounded'>
						<legend className='px-1 font-semibold capitalize'>
							Select playlist source
						</legend>
						{sourcesData.map((source) => (
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
						))}
					</fieldset>
				</div>
				<fieldset className='flex flex-col md:flex-1'>
					<label htmlFor='playlistInput'>Provide playlist link or Id</label>
					<input
						className='border border-2 border-blue-600 rounded p-1'
						type='text'
						minLength={8}
						maxLength={128}
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
				<div className='text-xl font-semibold text-red-600 self-center underline'>
					{fetchingError}
				</div>
			)}
			{playlistData && (
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
							onClick={exportToTXTFile}
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
							onClick={exportToCSVFile}
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
			)}
			{playlistData && <SpotifyPlaylistWrapper data={playlistData} />}
		</main>
	);
}
