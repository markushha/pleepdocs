'use client';

import { useState, useCallback, type ReactNode } from 'react';

type Recipient = { phone: string; params: string };

const L = {
  ru: {
    auth: 'Авторизация',
    apiKeyPh: 'pk_live_...',
    body: 'Тело запроса',
    botIdPh: 'UUID бота',
    templateIdPh: 'welcome_template',
    to: 'Получатели',
    phonePh: '+77001234567',
    paramsPh: 'Иван, 25.03.2026',
    addRecipient: 'Добавить получателя',
    send: 'Отправить',
    sending: 'Отправка...',
    response: 'Ответ',
    noResp: '// Ответ появится здесь после отправки запроса',
    netErr: 'Ошибка сети',
    required: 'Заполните API-ключ, bot_id и template_id',
    copied: 'Скопировано!',
    copy: 'cURL',
  },
  en: {
    auth: 'Authorization',
    apiKeyPh: 'pk_live_...',
    body: 'Request body',
    botIdPh: 'Bot UUID',
    templateIdPh: 'welcome_template',
    to: 'Recipients',
    phonePh: '+77001234567',
    paramsPh: 'John, 25.03.2026',
    addRecipient: 'Add recipient',
    send: 'Send',
    sending: 'Sending...',
    response: 'Response',
    noResp: '// Response will appear here after sending',
    netErr: 'Network error',
    required: 'Fill in API key, bot_id, and template_id',
    copied: 'Copied!',
    copy: 'cURL',
  },
  kk: {
    auth: 'Авторизация',
    apiKeyPh: 'pk_live_...',
    body: 'Сұраным денесі',
    botIdPh: 'Бот UUID',
    templateIdPh: 'welcome_template',
    to: 'Алушылар',
    phonePh: '+77001234567',
    paramsPh: 'Иван, 25.03.2026',
    addRecipient: 'Алушы қосу',
    send: 'Жіберу',
    sending: 'Жіберілуде...',
    response: 'Жауап',
    noResp: '// Жауап сұраным жіберілгеннен кейін пайда болады',
    netErr: 'Желі қатесі',
    required: 'API кілтін, bot_id және template_id толтырыңыз',
    copied: 'Көшірілді!',
    copy: 'cURL',
  },
} as Record<string, Record<string, string>>;

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-fd-muted-foreground/60 mb-3">
      {children}
    </div>
  );
}

function FieldRow({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="group flex items-center gap-3">
      <label className="text-[13px] font-mono text-fd-muted-foreground w-32 shrink-0 flex items-center gap-0.5">
        {label}
        {required && <span className="text-red-500 dark:text-red-400">*</span>}
      </label>
      {children}
    </div>
  );
}

const INPUT =
  'w-full rounded-lg border border-fd-border bg-fd-background px-3 py-2 text-[13px] font-mono text-fd-foreground placeholder:text-fd-muted-foreground/40 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-fd-primary/30 focus:border-fd-primary hover:border-fd-muted-foreground/30';

const SELECT =
  'w-full rounded-lg border border-fd-border bg-fd-background px-3 py-2 text-[13px] font-mono text-fd-foreground transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-fd-primary/30 focus:border-fd-primary hover:border-fd-muted-foreground/30 appearance-none cursor-pointer';

export function ApiPlayground({ lang = 'ru' }: { lang?: string }) {
  const t = L[lang] || L.en;

  const [apiKey, setApiKey] = useState('');
  const [botId, setBotId] = useState('');
  const [channel, setChannel] = useState('waba_coexistence');
  const [templateId, setTemplateId] = useState('');
  const [templateLang, setTemplateLang] = useState('ru');
  const [recipients, setRecipients] = useState<Recipient[]>([
    { phone: '', params: '' },
  ]);
  const [response, setResponse] = useState<string | null>(null);
  const [status, setStatus] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const updateR = (i: number, f: keyof Recipient, v: string) => {
    const u = [...recipients];
    u[i] = { ...u[i], [f]: v };
    setRecipients(u);
  };

  const body = useCallback(() => {
    const to = recipients.map((r) => {
      const o: { phone: string; params?: string[] } = {
        phone: r.phone || '+77001234567',
      };
      if (r.params.trim())
        o.params = r.params.split(',').map((p) => p.trim());
      return o;
    });
    const b: Record<string, unknown> = {
      bot_id: botId || 'your-bot-id',
      channel,
      to: to.length === 1 ? to[0] : to,
      template_id: templateId || 'welcome_template',
    };
    if (templateLang) b.template_language = templateLang;
    return b;
  }, [botId, channel, recipients, templateId, templateLang]);

  const send = async () => {
    if (!apiKey || !botId || !templateId) {
      setResponse(JSON.stringify({ error: t.required }, null, 2));
      setStatus(400);
      return;
    }
    setLoading(true);
    setResponse(null);
    setStatus(null);
    try {
      const r = await fetch(
        'https://microservice.pleep.app/api/v1/messages/send-template',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-API-Key': apiKey },
          body: JSON.stringify(body()),
        }
      );
      const data = await r.json();
      // Use the body's status/ok field if present, since the server may wrap errors in 2xx
      const realStatus = data?.error?.status ?? (data?.ok === false ? 400 : r.status);
      setStatus(realStatus);
      setResponse(JSON.stringify(data, null, 2));
    } catch {
      setStatus(0);
      setResponse(JSON.stringify({ error: t.netErr }, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const curl = () => {
    const c = `curl -X POST https://microservice.pleep.app/api/v1/messages/send-template \\\n  -H "Content-Type: application/json" \\\n  -H "X-API-Key: ${apiKey || 'YOUR_API_KEY'}" \\\n  -d '${JSON.stringify(body())}'`;
    navigator.clipboard.writeText(c);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const json = JSON.stringify(body(), null, 2);

  // Syntax highlight JSON for dark panel
  const highlightJson = (src: string) =>
    src.split('\n').map((line, i) => {
      const parts: ReactNode[] = [];
      let rest = line;
      // Match key
      const keyMatch = rest.match(/^(\s*)"([^"]+)"(:)/);
      if (keyMatch) {
        parts.push(<span key={`${i}s`}>{keyMatch[1]}</span>);
        parts.push(
          <span key={`${i}k`} className="text-sky-300">
            &quot;{keyMatch[2]}&quot;
          </span>
        );
        parts.push(
          <span key={`${i}c`} className="text-zinc-500">
            {keyMatch[3]}
          </span>
        );
        rest = rest.slice(keyMatch[0].length);
      }
      // Match string value
      const strMatch = rest.match(/^(\s*)"([^"]*)"/);
      if (strMatch) {
        parts.push(<span key={`${i}ss`}>{strMatch[1]}</span>);
        parts.push(
          <span key={`${i}v`} className="text-emerald-300">
            &quot;{strMatch[2]}&quot;
          </span>
        );
        rest = rest.slice(strMatch[0].length);
      }
      // Match number
      const numMatch = rest.match(/^(\s*)(\d+)/);
      if (numMatch && parts.length > 0) {
        parts.push(<span key={`${i}ns`}>{numMatch[1]}</span>);
        parts.push(
          <span key={`${i}n`} className="text-amber-300">
            {numMatch[2]}
          </span>
        );
        rest = rest.slice(numMatch[0].length);
      }
      if (rest) {
        parts.push(
          <span key={`${i}r`} className="text-zinc-400">
            {rest}
          </span>
        );
      }
      return (
        <span key={i}>
          {parts.length > 0 ? parts : <span className="text-zinc-400">{line}</span>}
          {'\n'}
        </span>
      );
    });

  const ok = status !== null && status >= 200 && status < 300;

  return (
    <div className="not-prose my-8 rounded-2xl border border-fd-border overflow-hidden shadow-sm bg-fd-card">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-fd-border bg-fd-card">
        <div className="flex items-center gap-3">
          <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 tracking-wide font-mono">
            POST
          </span>
          <code className="text-[13px] text-fd-muted-foreground font-mono hidden sm:inline">
            /api/v1/messages/send-template
          </code>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={curl}
            className="rounded-lg border border-fd-border px-3 py-1.5 text-[12px] font-medium text-fd-muted-foreground hover:text-fd-foreground hover:bg-fd-accent transition-all duration-150"
          >
            {copied ? '✓ ' : ''}
            {copied ? t.copied : t.copy}
          </button>
          <button
            onClick={send}
            disabled={loading}
            className="rounded-lg bg-fd-primary px-4 py-1.5 text-[12px] font-semibold text-fd-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 flex items-center gap-1.5"
          >
            {loading && (
              <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            {loading ? t.sending : t.send}
          </button>
        </div>
      </div>

      {/* Two panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left — inputs */}
        <div className="border-r border-fd-border overflow-y-auto max-h-[600px]">
          {/* Auth */}
          <div className="px-5 pt-4 pb-3 border-b border-fd-border">
            <SectionLabel>{t.auth}</SectionLabel>
            <FieldRow label="X-API-Key" required>
              <input
                type="password"
                className={INPUT}
                placeholder={t.apiKeyPh}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </FieldRow>
          </div>

          {/* Body */}
          <div className="px-5 pt-4 pb-2 border-b border-fd-border space-y-3">
            <SectionLabel>{t.body}</SectionLabel>
            <FieldRow label="bot_id" required>
              <input
                type="text"
                className={INPUT}
                placeholder={t.botIdPh}
                value={botId}
                onChange={(e) => setBotId(e.target.value)}
              />
            </FieldRow>
            <FieldRow label="channel" required>
              <div className="relative w-full">
                <select
                  className={SELECT}
                  value={channel}
                  onChange={(e) => setChannel(e.target.value)}
                >
                  <option value="waba_coexistence">waba_coexistence</option>
                  <option value="waba">waba</option>
                </select>
                <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-fd-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </FieldRow>
            <FieldRow label="template_id" required>
              <input
                type="text"
                className={INPUT}
                placeholder={t.templateIdPh}
                value={templateId}
                onChange={(e) => setTemplateId(e.target.value)}
              />
            </FieldRow>
            <FieldRow label="template_language">
              <div className="relative w-full">
                <select
                  className={SELECT}
                  value={templateLang}
                  onChange={(e) => setTemplateLang(e.target.value)}
                >
                  <option value="ru">ru</option>
                  <option value="en">en</option>
                  <option value="kk">kk</option>
                </select>
                <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-fd-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </FieldRow>
          </div>

          {/* Recipients */}
          <div className="px-5 pt-4 pb-4 space-y-3">
            <SectionLabel>{t.to}</SectionLabel>
            {recipients.map((r, i) => (
              <div
                key={i}
                className="rounded-xl border border-fd-border bg-fd-secondary/30 p-3.5 space-y-2.5"
              >
                <FieldRow label="phone" required>
                  <input
                    type="text"
                    className={INPUT}
                    placeholder={t.phonePh}
                    value={r.phone}
                    onChange={(e) => updateR(i, 'phone', e.target.value)}
                  />
                </FieldRow>
                <FieldRow label="params">
                  <input
                    type="text"
                    className={INPUT}
                    placeholder={t.paramsPh}
                    value={r.params}
                    onChange={(e) => updateR(i, 'params', e.target.value)}
                  />
                </FieldRow>
                {recipients.length > 1 && (
                  <button
                    onClick={() => setRecipients(recipients.filter((_, j) => j !== i))}
                    className="text-[11px] text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium transition-colors ml-[8.5rem]"
                  >
                    ✕ Remove
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => setRecipients([...recipients, { phone: '', params: '' }])}
              className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-fd-border px-3 py-1.5 text-[12px] font-medium text-fd-muted-foreground hover:text-fd-foreground hover:border-fd-muted-foreground/50 hover:bg-fd-accent/50 transition-all duration-150"
            >
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
              {t.addRecipient}
            </button>
          </div>
        </div>

        {/* Right — code */}
        <div className="bg-zinc-950 dark:bg-zinc-900/80 flex flex-col min-h-[480px]">
          {/* Request */}
          <div className="flex-1 flex flex-col">
            <div className="px-4 py-2.5 border-b border-white/[0.06] flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
              </div>
              <span className="text-[11px] font-mono text-zinc-500 ml-2">
                request.json
              </span>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <pre className="text-[12.5px] leading-[1.7] font-mono select-all">
                <span className="text-zinc-600">{'// '}</span>
                <span className="text-zinc-500">POST /api/v1/messages/send-template</span>
                {'\n'}
                <span className="text-zinc-600">{'// '}</span>
                <span className="text-zinc-600">X-API-Key: </span>
                <span className="text-zinc-500">
                  {apiKey ? '••••••••' : 'YOUR_API_KEY'}
                </span>
                {'\n\n'}
                {highlightJson(json)}
              </pre>
            </div>
          </div>

          {/* Response */}
          <div className="border-t border-white/[0.06]">
            <div className="px-4 py-2.5 border-b border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-zinc-500">
                  {t.response}
                </span>
                {status !== null && (
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-mono font-bold ${
                      ok
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : 'bg-red-500/15 text-red-400'
                    }`}
                  >
                    {status === 0 ? 'ERR' : status}
                  </span>
                )}
              </div>
              {status !== null && (
                <span
                  className={`h-2 w-2 rounded-full ${
                    ok ? 'bg-emerald-400 shadow-[0_0_6px] shadow-emerald-400/50' : 'bg-red-400 shadow-[0_0_6px] shadow-red-400/50'
                  }`}
                />
              )}
            </div>
            <div className="overflow-auto max-h-48 p-4">
              <pre className="text-[12.5px] leading-[1.7] font-mono text-zinc-500 select-all">
                {response
                  ? highlightJson(response)
                  : t.noResp}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
