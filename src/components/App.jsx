import { useState, useEffect } from 'react'
import { CONFIG, MARKETS } from '../config.js'
import { SECTION_KEYS_A, SECTION_KEYS_B, SECTION_KEYS_C, extractTopLevelKey } from '../streaming.js'
import { buildMessagesA, buildMessagesB, buildMessagesC } from '../prompts.js'
import { generateTagline, checkResumeHeuristic } from '../helpers.js'
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

  // Stream one API call; fires onSection(key, data) for each completed section
  const streamCall = async (buildFn, sectionKeys, text, market, roles, onSection, attempt = 1) => {
    const res = await fetch(CONFIG.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CONFIG.apiKey}`,
        'Accept-Language': 'en-US,en',
      },
      body: JSON.stringify({
        model:       CONFIG.model,
        messages:    buildFn(text, market, roles),
        max_tokens:  CONFIG.maxTokens,
        temperature: CONFIG.temperature,
        stream:      true,
      }),
    });

    if (res.status === 504 && attempt < 3) {
      await new Promise(r => setTimeout(r, 2000 * attempt));
      return streamCall(buildFn, sectionKeys, text, market, roles, onSection, attempt + 1);
    }

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody?.error?.message || `API error ${res.status} — please try again.`);
    }

    const reader     = res.body.getReader();
    const decoder    = new TextDecoder();
    const parsedKeys = new Set();
    let accumulated  = '';
    let buffer       = '';

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

          for (const key of sectionKeys) {
            if (parsedKeys.has(key)) continue;
            const section = extractTopLevelKey(accumulated, key);
            if (section) {
              parsedKeys.add(key);
              onSection(key, section);
            }
          }
        } catch { /* ignore malformed SSE lines */ }
      }
    }

    // Fallback: parse full accumulated string if any sections are missing
    if (parsedKeys.size < sectionKeys.length) {
      try {
        const match = accumulated.match(/\{[\s\S]*\}/);
        if (match) {
          const parsed = JSON.parse(match[0]);
          for (const key of sectionKeys) {
            if (!parsedKeys.has(key) && parsed[key]) {
              onSection(key, parsed[key]);
            }
          }
        }
      } catch { /* best effort */ }
    }
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

      // Step 2: Verify it's a resume using client-side heuristic (instant, no API call)
      const check = checkResumeHeuristic(truncated);
      if (!check.is_resume) {
        throw Object.assign(
          new Error('This document does not appear to be a resume or CV. Please upload a resume that includes your name, job role, work experience, or location.'),
          { notResume: true }
        );
      }

      // Step 3: Switch to results screen, fire 3 parallel API calls
      setScreen('results');
      setStreaming(true);

      // Call B and C buffer their results until Call A is fully done
      const callBBuffer = {};
      const callCBuffer = {};
      let callAComplete = false;

      const flushBuffer = buf => {
        if (Object.keys(buf).length > 0)
          setSections(prev => ({ ...prev, ...buf }));
      };

      const gatedHandler = (buf) => (key, data) => {
        if (callAComplete) {
          setSections(prev => ({ ...prev, [key]: data }));
        } else {
          buf[key] = data;
        }
      };

      await Promise.all([
        // Call A — renders immediately as sections arrive
        streamCall(
          buildMessagesA, SECTION_KEYS_A, truncated, market, roles,
          (key, data) => setSections(prev => ({ ...prev, [key]: data }))
        ).then(() => {
          callAComplete = true;
          flushBuffer(callBBuffer);
          flushBuffer(callCBuffer);
        }),

        // Call B — improvement plan only
        streamCall(buildMessagesB, SECTION_KEYS_B, truncated, market, roles, gatedHandler(callBBuffer)),

        // Call C — salary + market sections
        streamCall(buildMessagesC, SECTION_KEYS_C, truncated, market, roles, gatedHandler(callCBuffer)),
      ]);

      setStreaming(false);
    } catch (err) {
      setError(
        err.notResume
          ? { message: err.message, title: "That doesn't look like a resume", icon: '📄' }
          : { message: err.message || 'An unexpected error occurred.' }
      );
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
      {screen === 'error'   && (
        <ErrorState
          message={typeof error === 'object' ? error.message : error}
          title={typeof error === 'object' ? error.title : undefined}
          icon={typeof error === 'object' ? error.icon : undefined}
          onRetry={reset}
        />
      )}
      {screen === 'results' && (
        <ResultsDashboard sections={sections} streaming={streaming} charCount={charCount} market={market} onReset={reset} />
      )}
    </>
  );
};
