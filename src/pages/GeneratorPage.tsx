import { useState, useRef } from 'react';
import { Sparkles, Download, Copy, Check, RefreshCw, Settings, ChevronDown } from 'lucide-react';
import DOMPurify from 'dompurify';
import { toPng } from 'html-to-image';
import { useSettings, MODELS } from '../hooks/useSettings';
import { downloadBlob, downloadBinaryBlob, MIME_TYPES } from '../utils/download';

interface GeneratedMetaphor {
  svg: string;
  title?: string;
  titleEn?: string;
  elapsed?: number;
  model?: string;
}

const sanitizeSvg = (svg: string): string => {
  return DOMPurify.sanitize(svg, {
    USE_PROFILES: { svg: true, svgFilters: true },
    ADD_TAGS: ['use', 'feGaussianBlur', 'feOffset', 'feMerge', 'feMergeNode', 'feBlend', 'animate'],
    ADD_ATTR: ['xlink:href', 'href', 'clip-path', 'fill-opacity', 'stroke-opacity'],
  });
};

export default function GeneratorPage() {
  const { settings, updateSettings, hasCustomKey } = useSettings();
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GeneratedMetaphor | null>(null);
  const [copied, setCopied] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    if (!prompt.trim() || prompt.length < 3) {
      setError('Enter at least 3 characters');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const body: Record<string, string> = {
        text: prompt,
        style: settings.style,
        model: settings.model,
      };

      // If user has custom key, send it
      if (hasCustomKey) {
        body.apiKey = settings.openRouterKey;
      }

      const response = await fetch('/.netlify/functions/generate-metaphor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      // Read response as text first to handle empty responses
      const text = await response.text();

      if (!text) {
        throw new Error('Empty response from server');
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(`Invalid response: ${text.slice(0, 100)}`);
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate');
      }

      setResult({
        svg: data.svg,
        title: data.title,
        titleEn: data.titleEn,
        elapsed: data.elapsed,
        model: data.model,
      });
    } catch (err) {
      console.error('Generate error:', err);
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

    try {
      const dataUrl = await toPng(previewRef.current, {
        pixelRatio: 4,
        backgroundColor: settings.style === 'dark' ? '#0a0a0a' : '#FFFFFF',
      });

      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const filename = result.titleEn
        ? `${result.titleEn.toLowerCase().replace(/\s+/g, '-')}.png`
        : 'metaphor.png';
      downloadBinaryBlob(blob, filename);
    } catch (err) {
      console.error('Failed to export PNG:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="font-mono text-2xl font-bold text-[#171717] uppercase tracking-tight">
            Generator
          </h1>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 border transition-all ${
              showSettings
                ? 'bg-[#171717] text-white border-[#171717]'
                : 'text-[#525252] border-[#e5e7eb] hover:border-[#DC2626] hover:text-[#DC2626]'
            }`}
          >
            <Settings size={16} />
          </button>
        </div>
        <p className="text-[#525252] text-sm">
          Generate custom Swiss Design visual metaphors using AI
        </p>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="mb-6 p-4 border border-[#e5e7eb] bg-[#fafafa]">
          <div className="space-y-4">
            {/* API Key */}
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-[#525252] mb-2">
                OpenRouter API Key (optional)
              </label>
              <input
                type="password"
                value={settings.openRouterKey}
                onChange={(e) => updateSettings({ openRouterKey: e.target.value })}
                placeholder="sk-or-v1-..."
                className="w-full px-3 py-2 font-mono text-sm border border-[#e5e7eb] bg-white focus:outline-none focus:border-[#DC2626]"
              />
              <p className="mt-1 text-[10px] text-[#a3a3a3]">
                Leave empty to use default key. Get your key at openrouter.ai
              </p>
            </div>

            {/* Model Selection */}
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-[#525252] mb-2">
                Model
              </label>
              <div className="relative">
                <select
                  value={settings.model}
                  onChange={(e) => updateSettings({ model: e.target.value as typeof settings.model })}
                  className="w-full px-3 py-2 font-mono text-sm border border-[#e5e7eb] bg-white focus:outline-none focus:border-[#DC2626] appearance-none cursor-pointer"
                >
                  {MODELS.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name} — {model.description}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a3a3a3] pointer-events-none" />
              </div>
            </div>

            {/* Style */}
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-[#525252] mb-2">
                Style
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => updateSettings({ style: 'light' })}
                  className={`flex-1 px-3 py-2 font-mono text-xs uppercase border transition-all ${
                    settings.style === 'light'
                      ? 'bg-[#171717] text-white border-[#171717]'
                      : 'bg-white text-[#525252] border-[#e5e7eb] hover:border-[#DC2626]'
                  }`}
                >
                  Light
                </button>
                <button
                  onClick={() => updateSettings({ style: 'dark' })}
                  className={`flex-1 px-3 py-2 font-mono text-xs uppercase border transition-all ${
                    settings.style === 'dark'
                      ? 'bg-[#171717] text-white border-[#171717]'
                      : 'bg-white text-[#525252] border-[#e5e7eb] hover:border-[#DC2626]'
                  }`}
                >
                  Dark
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Generator Form */}
      <div className="mb-8">
        <div className="space-y-4">
          {/* Prompt */}
          <div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your concept... e.g., Knowledge flowing through neural networks"
              className="w-full px-4 py-3 font-mono text-sm border border-[#e5e7eb] bg-white text-[#171717] placeholder:text-[#a3a3a3] focus:outline-none focus:border-[#DC2626] resize-none"
              rows={3}
              maxLength={1000}
            />
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-[#a3a3a3]">{prompt.length}/1000</span>
              {hasCustomKey && (
                <span className="text-[10px] text-[#22c55e]">Using custom API key</span>
              )}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 border border-[#DC2626] bg-[#fef2f2] text-sm text-[#DC2626]">
              {error}
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim()}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 font-mono text-sm uppercase tracking-wider bg-[#171717] text-white hover:bg-[#DC2626] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Generate
              </>
            )}
          </button>
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className="border border-[#e5e7eb]">
          {/* Preview */}
          <div className={`p-8 ${settings.style === 'dark' ? 'bg-[#0a0a0a]' : 'bg-[#fafafa]'}`}>
            <div
              ref={previewRef}
              className={`aspect-square max-w-md mx-auto ${settings.style === 'dark' ? 'bg-[#0a0a0a]' : 'bg-white'}`}
              dangerouslySetInnerHTML={{ __html: sanitizeSvg(result.svg) }}
            />
          </div>

          {/* Info & Actions */}
          <div className="p-4 border-t border-[#e5e7eb]">
            <div className="flex items-center justify-between mb-4">
              <div>
                {result.titleEn && (
                  <span className="font-mono text-sm font-bold uppercase">{result.titleEn}</span>
                )}
                {result.elapsed && (
                  <span className="ml-2 font-mono text-[10px] text-[#a3a3a3]">
                    {(result.elapsed / 1000).toFixed(1)}s
                  </span>
                )}
              </div>
              {result.model && (
                <span className="font-mono text-[10px] text-[#a3a3a3]">
                  {result.model.split('/').pop()}
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className={`flex items-center gap-1.5 px-3 py-2 font-mono text-[10px] uppercase border transition-all ${
                  copied
                    ? 'bg-[#22c55e] text-white border-[#22c55e]'
                    : 'bg-white text-[#525252] border-[#e5e7eb] hover:border-[#DC2626] hover:text-[#DC2626]'
                }`}
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? 'Copied' : 'Copy SVG'}
              </button>

              <button
                onClick={handleDownloadSvg}
                className="flex items-center gap-1.5 px-3 py-2 font-mono text-[10px] uppercase border border-[#e5e7eb] bg-white text-[#525252] hover:border-[#DC2626] hover:text-[#DC2626] transition-all"
              >
                <Download size={12} />
                SVG
              </button>

              <button
                onClick={handleDownloadPng}
                className="flex items-center gap-1.5 px-3 py-2 font-mono text-[10px] uppercase bg-[#171717] text-white hover:bg-[#DC2626] transition-colors"
              >
                <Download size={12} />
                PNG 4x
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Prompt used */}
      {result && prompt && (
        <div className="mt-4 p-3 border border-[#e5e7eb] bg-[#fafafa]">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#a3a3a3]">Prompt:</span>
          <p className="mt-1 font-mono text-xs text-[#525252]">{prompt}</p>
        </div>
      )}
    </div>
  );
}
