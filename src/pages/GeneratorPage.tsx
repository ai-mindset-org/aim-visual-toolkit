import { useState, useRef } from 'react';
import { Sparkles, Download, Copy, Check, RefreshCw, Settings, ChevronDown, Bookmark, BookmarkCheck, Globe, Loader2 } from 'lucide-react';
import DOMPurify from 'dompurify';
import { toPng } from 'html-to-image';
import { useSettings, MODELS } from '../hooks/useSettings';
import { downloadBlob, downloadBinaryBlob, MIME_TYPES } from '../utils/download';
import { useSavedMetaphors } from '../hooks/useSavedMetaphors';

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
  const { addGeneratedMetaphor, isGeneratedSaved } = useSavedMetaphors();
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GeneratedMetaphor | null>(null);
  const [copied, setCopied] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [saved, setSaved] = useState(false);
  const [communitySaving, setCommunitySaving] = useState(false);
  const [communitySaved, setCommunitySaved] = useState(false);
  const [communityError, setCommunityError] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    if (!prompt.trim() || prompt.length < 3) {
      setError('Enter at least 3 characters');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSaved(false);
    setCommunitySaved(false);
    setCommunityError(null);

    try {
      const body: Record<string, string> = {
        text: prompt,
        style: settings.style,
        model: settings.model,
      };

      if (hasCustomKey) {
        body.apiKey = settings.openRouterKey;
      }

      const response = await fetch('/.netlify/functions/generate-metaphor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

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

  const handleSave = () => {
    if (!result) return;

    addGeneratedMetaphor({
      svg: result.svg,
      title: result.title,
      titleEn: result.titleEn,
      prompt: prompt,
      model: result.model,
      style: settings.style,
    });
    setSaved(true);
  };

  const handleSaveToCommunity = async () => {
    if (!result || !result.title || !result.titleEn) {
      setCommunityError('Missing title information');
      return;
    }

    setCommunitySaving(true);
    setCommunityError(null);

    try {
      const response = await fetch('/.netlify/functions/save-community-metaphor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          svg: result.svg,
          title: result.title,
          titleEn: result.titleEn,
          prompt: prompt,
          author: 'community', // Simple implementation - no auth
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save to community');
      }

      setCommunitySaved(true);
    } catch (err) {
      console.error('Community save error:', err);
      setCommunityError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setCommunitySaving(false);
    }
  };

  const isSavedAlready = result ? isGeneratedSaved(result.svg) : false;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-neutral-900">
            Generator
          </h1>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-lg transition-all ${
              showSettings
                ? 'bg-neutral-900 text-white'
                : 'text-neutral-500 bg-neutral-100 hover:bg-neutral-200'
            }`}
          >
            <Settings size={16} />
          </button>
        </div>
        <p className="text-neutral-500 text-sm">
          Generate custom Swiss Design visual metaphors using AI
        </p>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="mb-6 p-4 border border-neutral-200 bg-neutral-50 rounded-xl">
          <div className="space-y-4">
            {/* API Key */}
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-neutral-500 mb-2">
                OpenRouter API Key (optional)
              </label>
              <input
                type="password"
                value={settings.openRouterKey}
                onChange={(e) => updateSettings({ openRouterKey: e.target.value })}
                placeholder="sk-or-v1-..."
                className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg bg-white focus:outline-none focus:border-[#DC2626]"
              />
              <p className="mt-1 text-[10px] text-neutral-400">
                Leave empty to use default key. Get yours at openrouter.ai
              </p>
            </div>

            {/* Model Selection */}
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-neutral-500 mb-2">
                Model
              </label>
              <div className="relative">
                <select
                  value={settings.model}
                  onChange={(e) => updateSettings({ model: e.target.value as typeof settings.model })}
                  className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg bg-white focus:outline-none focus:border-[#DC2626] appearance-none cursor-pointer"
                >
                  {MODELS.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name} — {model.description}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
              </div>
            </div>

            {/* Style */}
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-neutral-500 mb-2">
                Style
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => updateSettings({ style: 'light' })}
                  className={`flex-1 px-3 py-2 text-sm rounded-lg transition-all ${
                    settings.style === 'light'
                      ? 'bg-white border-2 border-neutral-900 text-neutral-900'
                      : 'bg-neutral-100 border-2 border-transparent text-neutral-500 hover:bg-neutral-200'
                  }`}
                >
                  Light
                </button>
                <button
                  onClick={() => updateSettings({ style: 'dark' })}
                  className={`flex-1 px-3 py-2 text-sm rounded-lg transition-all ${
                    settings.style === 'dark'
                      ? 'bg-neutral-900 border-2 border-neutral-900 text-white'
                      : 'bg-neutral-100 border-2 border-transparent text-neutral-500 hover:bg-neutral-200'
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
              className="w-full px-4 py-3 text-sm border border-neutral-200 rounded-lg bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#DC2626] resize-none"
              rows={3}
              maxLength={1000}
            />
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-neutral-400">{prompt.length}/1000</span>
              {hasCustomKey && (
                <span className="text-[10px] text-emerald-500">Using custom API key</span>
              )}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 border border-red-200 bg-red-50 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim()}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium rounded-lg bg-neutral-900 text-white hover:bg-[#DC2626] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
        <div className="border border-neutral-200 rounded-xl overflow-hidden">
          {/* Preview with frame */}
          <div className="p-8 bg-neutral-100">
            <div
              ref={previewRef}
              className={`aspect-square max-w-md mx-auto border border-neutral-200 rounded-lg p-6 overflow-hidden ${
                settings.style === 'dark' ? 'bg-neutral-900' : 'bg-white'
              }`}
            >
              <div
                className="w-full h-full flex items-center justify-center [&>svg]:max-w-full [&>svg]:max-h-full [&>svg]:w-auto [&>svg]:h-auto"
                dangerouslySetInnerHTML={{ __html: sanitizeSvg(result.svg) }}
              />
            </div>
          </div>

          {/* Info & Actions */}
          <div className="p-4 border-t border-neutral-200 bg-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                {result.titleEn && (
                  <span className="font-mono text-sm font-bold uppercase">{result.titleEn}</span>
                )}
                {result.elapsed && (
                  <span className="ml-2 font-mono text-[10px] text-neutral-400">
                    {(result.elapsed / 1000).toFixed(1)}s
                  </span>
                )}
              </div>
              {result.model && (
                <span className="font-mono text-[10px] text-neutral-400">
                  {result.model.split('/').pop()}
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={handleSave}
                disabled={saved || isSavedAlready}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg transition-all ${
                  saved || isSavedAlready
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-[#DC2626] text-white hover:bg-[#b91c1c]'
                }`}
              >
                {saved || isSavedAlready ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
                {saved || isSavedAlready ? 'Saved' : 'Save'}
              </button>

              <button
                onClick={handleSaveToCommunity}
                disabled={communitySaving || communitySaved}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg transition-all ${
                  communitySaved
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50'
                }`}
                title="Share to community gallery on AIM LMS"
              >
                {communitySaving ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : communitySaved ? (
                  <Check size={14} />
                ) : (
                  <Globe size={14} />
                )}
                {communitySaving ? 'Saving...' : communitySaved ? 'Shared' : 'Share'}
              </button>

              <button
                onClick={handleCopy}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg transition-all ${
                  copied
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy SVG'}
              </button>

              <button
                onClick={handleDownloadSvg}
                className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-all"
              >
                <Download size={14} />
                SVG
              </button>

              <button
                onClick={handleDownloadPng}
                className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg bg-neutral-900 text-white hover:bg-[#DC2626] transition-colors"
              >
                <Download size={14} />
                Download PNG
              </button>
            </div>

            {/* Community save error */}
            {communityError && (
              <div className="mt-3 p-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg">
                {communityError}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Prompt used */}
      {result && prompt && (
        <div className="mt-4 p-3 border border-neutral-200 bg-neutral-50 rounded-lg">
          <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">Prompt:</span>
          <p className="mt-1 text-xs text-neutral-600">{prompt}</p>
        </div>
      )}
    </div>
  );
}
