import { useState, useRef } from 'react';
import { Sparkles, Download, Copy, Check, Image, RefreshCw } from 'lucide-react';
import DOMPurify from 'dompurify';
import { toPng } from 'html-to-image';
import { Button } from '../components/ui';
import { downloadBlob, downloadBinaryBlob, MIME_TYPES } from '../utils/download';

type Style = 'light' | 'dark';

interface GeneratedMetaphor {
  svg: string;
  title?: string;
  titleEn?: string;
  elapsed?: number;
}

// Sanitize SVG for safe rendering
const sanitizeSvg = (svg: string): string => {
  return DOMPurify.sanitize(svg, {
    USE_PROFILES: { svg: true, svgFilters: true },
    ADD_TAGS: ['use', 'feGaussianBlur', 'feOffset', 'feMerge', 'feMergeNode', 'feBlend', 'animate'],
    ADD_ATTR: ['xlink:href', 'href', 'clip-path', 'fill-opacity', 'stroke-opacity'],
  });
};

export default function GeneratorPage() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState<Style>('light');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GeneratedMetaphor | null>(null);
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    if (!prompt.trim() || prompt.length < 3) {
      setError('Please enter at least 3 characters');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/.netlify/functions/generate-metaphor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: prompt, style }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to generate metaphor');
      }

      const data = await response.json();
      setResult({
        svg: data.svg,
        title: data.title,
        titleEn: data.titleEn,
        elapsed: data.elapsed,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.svg);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownloadSvg = () => {
    if (!result) return;
    const filename = result.titleEn
      ? `${result.titleEn.toLowerCase().replace(/\s+/g, '-')}.svg`
      : 'metaphor.svg';
    downloadBlob(result.svg, filename, MIME_TYPES.SVG);
  };

  const handleDownloadPng = async () => {
    if (!previewRef.current || !result) return;

    setExporting(true);
    try {
      const dataUrl = await toPng(previewRef.current, {
        pixelRatio: 4,
        backgroundColor: style === 'dark' ? '#0a0a0a' : '#FFFFFF',
      });

      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const filename = result.titleEn
        ? `${result.titleEn.toLowerCase().replace(/\s+/g, '-')}.png`
        : 'metaphor.png';
      downloadBinaryBlob(blob, filename);
    } catch (err) {
      console.error('Failed to export PNG:', err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-aim-black mb-2">AI Metaphor Generator</h1>
        <p className="text-aim-gray-600">
          Generate custom Swiss Design visual metaphors using AI
        </p>
      </div>

      {/* Generator Form */}
      <div className="bg-white border border-aim-gray-200 rounded-xl p-6 mb-8">
        <div className="space-y-4">
          {/* Prompt Input */}
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-aim-gray-700 mb-2">
              Describe your concept
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Knowledge flowing through neural networks, Human-AI collaboration..."
              className="w-full px-4 py-3 border border-aim-gray-200 rounded-lg bg-white text-aim-black placeholder:text-aim-gray-400 focus:outline-none focus:ring-2 focus:ring-aim-red focus:border-transparent resize-none"
              rows={3}
              maxLength={1000}
            />
            <p className="text-xs text-aim-gray-400 mt-1">{prompt.length}/1000 characters</p>
          </div>

          {/* Style Selector */}
          <div>
            <label className="block text-sm font-medium text-aim-gray-700 mb-2">Style</label>
            <div className="flex gap-2">
              <button
                onClick={() => setStyle('light')}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  style === 'light'
                    ? 'bg-aim-black text-white'
                    : 'bg-aim-gray-100 text-aim-gray-600 hover:bg-aim-gray-200'
                }`}
              >
                Light
              </button>
              <button
                onClick={() => setStyle('dark')}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  style === 'dark'
                    ? 'bg-aim-black text-white'
                    : 'bg-aim-gray-100 text-aim-gray-600 hover:bg-aim-gray-200'
                }`}
              >
                Dark
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim()}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <RefreshCw size={18} className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Generate Metaphor
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className="bg-white border border-aim-gray-200 rounded-xl overflow-hidden animate-fade-in">
          {/* Preview */}
          <div className={`p-8 ${style === 'dark' ? 'bg-[#0a0a0a]' : 'bg-aim-gray-50'}`}>
            <div
              ref={previewRef}
              className={`aspect-square max-w-lg mx-auto rounded-lg p-4 ${
                style === 'dark' ? 'bg-[#0a0a0a]' : 'bg-white'
              }`}
              dangerouslySetInnerHTML={{ __html: sanitizeSvg(result.svg) }}
            />
          </div>

          {/* Info & Actions */}
          <div className="p-6 border-t border-aim-gray-100">
            {(result.title || result.titleEn) && (
              <div className="text-center mb-4">
                {result.title && <h3 className="text-xl font-bold">{result.title}</h3>}
                {result.titleEn && (
                  <p className="text-sm text-aim-gray-500 font-mono">{result.titleEn}</p>
                )}
              </div>
            )}

            {result.elapsed && (
              <p className="text-xs text-aim-gray-400 text-center mb-4">
                Generated in {(result.elapsed / 1000).toFixed(1)}s
              </p>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={handleCopy}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  copied
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-aim-gray-100 text-aim-gray-700 hover:bg-aim-gray-200'
                }`}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copied!' : 'Copy SVG'}
              </button>

              <button
                onClick={handleDownloadSvg}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-aim-gray-100 text-aim-gray-700 hover:bg-aim-gray-200 transition-all"
              >
                <Download size={16} />
                Download SVG
              </button>

              <button
                onClick={handleDownloadPng}
                disabled={exporting}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-aim-black text-white hover:bg-aim-gray-800 transition-all disabled:opacity-50"
              >
                <Image size={16} />
                {exporting ? 'Exporting...' : 'Download PNG (4x)'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
