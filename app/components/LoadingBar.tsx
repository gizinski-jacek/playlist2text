import style from '../styles/LoadingBar.module.scss';

export default function LoadingBar({
	margin,
	width,
}: {
	margin?: string;
	width?: string;
}) {
	return (
		<div
			className={style.loading_bar_container}
			style={{ margin: margin || 'auto', width: width || 'auto' }}
		>
			<div className={style.loading_bar}></div>
		</div>
	);
}
