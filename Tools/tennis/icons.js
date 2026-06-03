/* Inline-SVG shims for the few lucide-react icons the scorer uses,
   so no icon package / bundler is needed. Each is a React component
   that accepts { size, color, style } like lucide-react. */
(function () {
    function makeIcon(inner) {
        return function (props) {
            props = props || {};
            var size = props.size == null ? 24 : props.size;
            return React.createElement('svg', {
                width: size,
                height: size,
                viewBox: '0 0 24 24',
                fill: 'none',
                stroke: props.color || 'currentColor',
                strokeWidth: 2,
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
                style: props.style,
                dangerouslySetInnerHTML: { __html: inner }
            });
        };
    }

    window.RotateCcw = makeIcon('<path d="M3 2v6h6"/><path d="M3 8a9 9 0 1 0 2.83-2.83L3 8"/>');
    window.RefreshCw = makeIcon('<path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/>');
    window.Trophy = makeIcon('<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>');
    window.Settings2 = makeIcon('<path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/>');
})();
