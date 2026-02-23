import { useState, useEffect } from 'react'
import { CONFIG, MARKETS } from '../config.js'
import { SECTION_KEYS, extractTopLevelKey } from '../streaming.js'
import { buildMessages } from '../prompts.js'
import { generateTagline } from '../helpers.js'
import { UploadZone } from './UploadZone.jsx'
import { LoadingState } from './LoadingState.jsx'
import { ErrorState } from './ErrorState.jsx'
import { ResultsDashboard } from './ResultsDashboard.jsx'

export const App = () => {
  const [screen, setScreen]       = useState('upload');   // upload | loading | results | error
  const [market, setMarket]       = useState(MARKETS[0]); // default: India
  const [sections, setSections]   = useState({});
  const [streaming, setStreaming] = useState(false);
  const [error, setError]         = useState('');
  const [charCount, setCharCount] = useState(0);
  const [loadStep, setLoadStep]   = useState('Reading PDF…');
  const [tagline, setTagline]     = useState('');

  // Set PDF.js worker
  useEffect(() => {
    const set = () => {
      if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      }
    };
    set();
    const id = setInterval(() => { if (window.pdfjsLib) { set(); clearInterval(id); } }, 200);
    return () => clearInterval(id);
  }, []);

  const extractText = async file => {
    const buf = await file.arrayBuffer();
    const pdf = await window.pdfjsLib.getDocument({ data: buf }).promise;
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map(x => x.str).join(' ') + '\n';
    }
    return text;
  };

  const run = async (file, roles = []) => {
    setTagline(generateTagline(file));
    setScreen('loading');
    setSections({});
    setStreaming(false);
    setError('');

    try {
      // Step 1: Parse PDF
      setLoadStep('Reading PDF and extracting text…');
      let raw;
      try { raw = await extractText(file); }
      catch { throw new Error('Could not parse the PDF file. Make sure it is a valid PDF.'); }

      const cleaned = raw.replace(/\s+/g, ' ').trim();
      if (cleaned.length < 60) throw new Error(
        'This PDF appears to be image-based or contains no extractable text. Please upload a text-based PDF (not a scanned document).'
      );

      const truncated = cleaned.slice(0, 4000);
      setCharCount(cleaned.length);

      // Step 2: Fetch with streaming + retry on 504
      const MAX_RETRIES = 3;
      let res, attempt = 0;
      while (true) {
        attempt++;
        const retryLabel = attempt > 1 ? ` (retry ${attempt - 1}/${MAX_RETRIES - 1})…` : '…';
        setLoadStep(`Analyzing against ${market.name} market standards${retryLabel}`);
        res = await fetch(CONFIG.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${CONFIG.apiKey}`,
            'Accept-Language': 'en-US,en',
          },
          body: JSON.stringify({
            model:       CONFIG.model,
            messages:    buildMessages(truncated, market, roles),
            max_tokens:  CONFIG.maxTokens,
            temperature: CONFIG.temperature,
            stream:      true,
          }),
        });
        if (res.status === 504 && attempt < MAX_RETRIES) {
          await new Promise(r => setTimeout(r, 2000 * attempt));
          continue;
        }
        break;
      }

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody?.error?.message || `API error ${res.status} — please try again.`);
      }

      // Step 3: Switch to results screen immediately, stream sections in
      setScreen('results');
      setStreaming(true);

      const reader      = res.body.getReader();
      const decoder     = new TextDecoder();
      const parsedKeys  = new Set();
      let accumulated   = '';
      let buffer        = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data: ')) continue;
          const data = trimmed.slice(6).trim();
          if (data === '[DONE]') continue;
          try {
            const msg   = JSON.parse(data);
            const delta = msg.choices?.[0]?.delta?.content ?? '';
            accumulated += delta;

            for (const key of SECTION_KEYS) {
              if (parsedKeys.has(key)) continue;
              const section = extractTopLevelKey(accumulated, key);
              if (section) {
                parsedKeys.add(key);
                setSections(prev => ({ ...prev, [key]: section }));
              }
            }
          } catch { /* ignore malformed SSE lines */ }
        }
      }

      // Fallback: if stream ended with missing sections, try parsing full accumulated string
      if (parsedKeys.size < SECTION_KEYS.length) {
        try {
          const match = accumulated.match(/\{[\s\S]*\}/);
          if (match) setSections(JSON.parse(match[0]));
        } catch { /* best effort */ }
      }

      setStreaming(false);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
      setScreen('error');
      setStreaming(false);
    }
  };

  const reset = () => {
    setScreen('upload');
    setSections({});
    setStreaming(false);
    setError('');
    setCharCount(0);
    setTagline('');
  };

  return (
    <>
      {screen === 'upload'  && <UploadZone onFile={run} market={market} setMarket={setMarket} />}
      {screen === 'loading' && <LoadingState step={loadStep} tagline={tagline} />}
      {screen === 'error'   && <ErrorState message={error} onRetry={reset} />}
      {screen === 'results' && (
        <ResultsDashboard sections={sections} streaming={streaming} charCount={charCount} market={market} onReset={reset} />
      )}
    </>
  );
};
