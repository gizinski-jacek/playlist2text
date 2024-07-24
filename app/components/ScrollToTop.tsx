import { useEffect, useState } from 'react';

export default function ScrollToTop() {
	const [showBtn, setShowBtn] = useState(false);

	useEffect(() => {
		function toggleShowBtn() {
			setShowBtn(document.documentElement.scrollTop > 400);
		}

		window.addEventListener('scroll', toggleShowBtn);

		return () => window.removeEventListener('scroll', toggleShowBtn);
	}, []);

	function scrollToTop() {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
	}

	return (
		<button
			className={`fixed right-0 bottom-0 m-4 hover:bg-black/25 rounded-xl 
			${showBtn ? 'block' : 'hidden'}`}
			onClick={scrollToTop}
		>
			<svg width='64px' height='64px' viewBox='0 0 32 32' fill='#000000'>
				<g strokeWidth='0'></g>
				<g strokeLinecap='round' strokeLinejoin='round'></g>
				<g>
					<g stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
						<g transform='translate(-516.000000, -983.000000)' fill='#000000'>
							<path d='M546,1011 C546,1012.1 545.104,1013 544,1013 L520,1013 C518.896,1013 518,1012.1 518,1011 L518,987 C518,985.896 518.896,985 520,985 L544,985 C545.104,985 546,985.896 546,987 L546,1011 L546,1011 Z M544,983 L520,983 C517.791,983 516,984.791 516,987 L516,1011 C516,1013.21 517.791,1015 520,1015 L544,1015 C546.209,1015 548,1013.21 548,1011 L548,987 C548,984.791 546.209,983 544,983 L544,983 Z M532.879,991.465 C532.639,991.225 532.311,991.15 532,991.205 C531.689,991.15 531.361,991.225 531.121,991.465 L525.465,997.121 C525.074,997.512 525.074,998.146 525.465,998.535 C525.854,998.926 526.488,998.926 526.879,998.535 L531,994.414 L531,1005 C531,1005.55 531.447,1006 532,1006 C532.552,1006 533,1005.55 533,1005 L533,994.414 L537.121,998.535 C537.512,998.926 538.145,998.926 538.535,998.535 C538.926,998.146 538.926,997.512 538.535,997.121 L532.879,991.465 L532.879,991.465 Z'></path>
						</g>
					</g>
				</g>
			</svg>
		</button>
	);
}
