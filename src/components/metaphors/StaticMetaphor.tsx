import { useEffect, useState, useRef } from 'react';

interface StaticMetaphorProps {
  name: string;
  className?: string;
  style?: React.CSSProperties;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  variant?: 'inline' | 'cover';
  ariaLabel?: string;
}

// Global SVG cache to prevent repeated fetches
const svgCache = new Map<string, string>();

const SIZE_MAP: Record<NonNullable<StaticMetaphorProps['size']>, number> = {
  sm: 32,
  md: 48,
  lg: 80,
  xl: 120,
  '2xl': 160,
  '3xl': 200,
};

export default function StaticMetaphor({
  name,
  className = '',
  style,
  size,
  variant = 'inline',
  ariaLabel,
}: StaticMetaphorProps) {
  const [svgContent, setSvgContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // If the name doesn't end with .svg, append it
  const fileName = name.endsWith('.svg') ? name : `${name}.svg`;

  useEffect(() => {
    // Check cache first
    if (svgCache.has(fileName)) {
      setSvgContent(svgCache.get(fileName)!);
      setIsLoading(false);
      setError(false);
      return;
    }

    const abortController = new AbortController();
    let isMounted = true;

    const loadSVG = async () => {
      try {
        setIsLoading(true);
        setError(false);

        const response = await fetch(`/metaphors/${fileName}`, {
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error(`Failed to load SVG: ${response.statusText}`);
        }

        const svgText = await response.text();

        // Cache the result
        svgCache.set(fileName, svgText);

        // Only update state if still mounted
        if (isMounted) {
          setSvgContent(svgText);
          setIsLoading(false);
        }
      } catch (err) {
        // Ignore abort errors
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        console.error('Error loading metaphor SVG:', err);
        if (isMounted) {
          setError(true);
          setIsLoading(false);
        }
      }
    };

    loadSVG();

    // Cleanup function
    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [fileName]);

  const sizeStyle =
    size && variant !== 'cover' ? { width: SIZE_MAP[size], height: SIZE_MAP[size] } : undefined;

  const mergedStyle =
    variant === 'cover' ? { width: '100%', height: '100%', ...style } : { ...sizeStyle, ...style };

  if (isLoading) {
    return (
      <div
        className={`metaphor-container flex items-center justify-center ${variant === 'cover' ? 'metaphor-cover' : ''} ${className}`}
        style={mergedStyle}
        role="img"
        aria-label={ariaLabel || fileName.replace(/\.svg$/i, '')}
      >
        <div className="animate-pulse text-aim-gray-400 font-mono text-sm">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`metaphor-container flex items-center justify-center ${variant === 'cover' ? 'metaphor-cover' : ''} ${className}`}
        style={mergedStyle}
        role="img"
        aria-label={ariaLabel || fileName.replace(/\.svg$/i, '')}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full opacity-20">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="8 4"
          />
          <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="50" cy="50" r="4" fill="currentColor" />
        </svg>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`metaphor-container ${variant === 'cover' ? 'metaphor-cover' : ''} relative group ${className}`}
      style={mergedStyle}
      role="img"
      aria-label={ariaLabel || fileName.replace(/\.svg$/i, '')}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}
