import type { Config } from 'tailwindcss';

const config: Config = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic':
					'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
			},
			colors: {
				'custom-primary': 'rgb(var(--color-primary) / <alpha-value>)',
				'custom-secondary': 'rgb(var(--color-secondary) / <alpha-value>)',
			},
		},
	},
	plugins: [],
	safelist: [
		'text-green-600',
		'text-orange-600',
		'text-red-500',
		'text-red-600',
		'text-red-700',
		'accent-green-600',
		'accent-orange-600',
		'accent-red-500',
		'accent-red-600',
		'accent-red-700',
		'decoration-green-600',
		'decoration-orange-600',
		'decoration-red-500',
		'decoration-red-600',
		'decoration-red-700',
	],
};
export default config;
