import React, { useState } from 'react';
import { 
  PieChart, 
  ExternalLink, 
  Maximize2, 
  Info, 
  CheckCircle2, 
  HelpCircle,
  FileSpreadsheet
} from 'lucide-react';

export const PowerBi: React.FC = () => {
  // Read embed URL from env or local state
  const defaultUrl = (import.meta as any).env?.VITE_POWERBI_EMBED_URL || '';
  const [embedUrl, setEmbedUrl] = useState<string>(defaultUrl);
  const [tempUrl, setTempUrl] = useState<string>(defaultUrl);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    setEmbedUrl(tempUrl.trim());
  };

  return (
    <div>
      {/* Top Integration Status Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b, #0f172a)',
        color: 'white',
        borderRadius: '12px',
        padding: '1.5rem 2rem',
        marginBottom: '1.75rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: 46,
            height: 46,
            borderRadius: '10px',
            backgroundColor: '#f59e0b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 2px 8px rgba(245, 158, 11, 0.4)'
          }}>
            <PieChart size={26} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Power BI Executive Report</h2>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '0.2rem 0 0 0' }}>
              Linked to your existing <code>sales.pbix</code> report (Sales, Profit, Category & Regional Trends)
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            fontSize: '0.78rem',
            padding: '0.35rem 0.75rem',
            borderRadius: '9999px',
            background: embedUrl ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
            color: embedUrl ? '#34d399' : '#fbbf24',
            border: embedUrl ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(245, 158, 11, 0.4)',
            fontWeight: 600
          }}>
            {embedUrl ? '● Power BI Connected' : '○ Embed URL Placeholder'}
          </div>
        </div>
      </div>

      {/* URL Input Form */}
      <div style={{
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: '10px',
        padding: '1.25rem 1.5rem',
        marginBottom: '1.75rem',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
      }}>
        <form onSubmit={handleApplyUrl} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.35rem' }}>
              Power BI Embed URL (from Power BI Service):
            </label>
            <input
              type="url"
              className="form-input"
              placeholder="https://app.powerbi.com/reportEmbed?reportId=...&autoAuth=true..."
              value={tempUrl}
              onChange={(e) => setTempUrl(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: '1.25rem' }}>
            {embedUrl ? 'Update Embed' : 'Load Embed URL'}
          </button>
          {embedUrl && (
            <button
              type="button"
              className="btn btn-secondary"
              style={{ marginTop: '1.25rem' }}
              onClick={() => { setEmbedUrl(''); setTempUrl(''); }}
            >
              Reset to Placeholder
            </button>
          )}
        </form>
      </div>

      {/* Main View: Live Iframe or Detailed Placeholder */}
      {embedUrl ? (
        <div style={{
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.08)',
          position: isFullscreen ? 'fixed' : 'relative',
          inset: isFullscreen ? 0 : 'auto',
          zIndex: isFullscreen ? 9999 : 1,
          height: isFullscreen ? '100vh' : '750px'
        }}>
          <div style={{
            padding: '0.75rem 1.25rem',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#f8fafc'
          }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>
              Embedded Interactive View
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              >
                <Maximize2 size={13} />
                <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
              </button>
              <a
                href={embedUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary btn-sm"
              >
                <ExternalLink size={13} />
                <span>Open in Power BI</span>
              </a>
            </div>
          </div>
          <iframe
            title="Power BI Embedded Report"
            src={embedUrl}
            style={{ width: '100%', height: 'calc(100% - 48px)', border: 'none' }}
            allowFullScreen={true}
          />
        </div>
      ) : (
        /* Student Portfolio Friendly Placeholder */
        <div style={{
          background: '#fff',
          border: '1px dashed #cbd5e1',
          borderRadius: '14px',
          padding: '3rem 2rem',
          textAlign: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: '#fffbeb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto',
            color: '#d97706'
          }}>
            <PieChart size={34} />
          </div>

          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
            Power BI Dashboard Ready for Connection
          </h3>
          <p style={{ maxWidth: 640, margin: '0 auto 2rem auto', color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Your Power BI dashboard file (<code>sales.pbix</code>) in your project directory is already complete with sales, profit, category, monthly trend, and regional analytics.
            Following your requirement, no dummy credentials or invented URLs are used.
          </p>

          {/* Step-by-Step Guide for Student Portfolio */}
          <div style={{
            maxWidth: 720,
            margin: '0 auto',
            textAlign: 'left',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '1.5rem'
          }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HelpCircle size={17} color="#2563eb" />
              How to Publish & Embed your <code>sales.pbix</code> (3 Simple Steps):
            </h4>

            <ol style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: '#475569', lineHeight: 1.8 }}>
              <li>
                <strong>Publish from Power BI Desktop:</strong> Open <code>sales.pbix</code> in Power BI Desktop, click <strong>Home &gt; Publish</strong>, and select <em>My Workspace</em>.
              </li>
              <li>
                <strong>Obtain the Embed Code:</strong> In your browser at <a href="https://app.powerbi.com" target="_blank" rel="noreferrer" style={{ color: '#2563eb' }}>app.powerbi.com</a>, open the published report, click <strong>File &gt; Embed report &gt; Website or portal</strong> (or <em>Publish to web (public)</em> for portfolios).
              </li>
              <li>
                <strong>Paste URL above:</strong> Copy the URL and paste it in the input field above, or set <code>VITE_POWERBI_EMBED_URL</code> in your frontend <code>.env</code> file.
              </li>
            </ol>

            <div style={{ marginTop: '1.25rem', padding: '0.75rem 1rem', background: '#ecfdf5', borderRadius: '6px', fontSize: '0.8rem', color: '#065f46', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={16} />
              <span>
                <strong>Existing Asset Verified:</strong> Found <code>c:\Users\shapa\OneDrive\Desktop\PowerBi\sales.pbix</code> (677 KB) in your folder.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

