import { useState } from 'react';
import { useHanaStore } from '@/store/useHanaStore';
import { Download, Upload, Trash2 } from 'lucide-react';

export default function SettingsPage() {
  const [importData, setImportData] = useState('');
  const [showImport, setShowImport] = useState(false);
  const [message, setMessage] = useState('');

  const exportData = useHanaStore((s) => s.exportData);
  const importDataFn = useHanaStore((s) => s.importData);
  const resetAll = useHanaStore((s) => s.resetAll);
  const updateSettings = useHanaStore((s) => s.updateSettings);
  const settings = useHanaStore((s) => s.settings);

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hana-os-backup.json';
    a.click();
    setMessage('Exported successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleImport = () => {
    const success = importDataFn(importData);
    setMessage(success ? 'Imported successfully!' : 'Invalid data.');
    setTimeout(() => setMessage(''), 3000);
    if (success) setShowImport(false);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Settings</h2>

      {message && (
        <div className="hana-card p-3 mb-4 text-sm text-center" style={{ backgroundColor: 'var(--primary)', color: 'var(--bg)' }}>
          {message}
        </div>
      )}

      <div className="space-y-4">
        <div className="hana-card p-4">
          <h3 className="font-medium mb-2">Accessibility</h3>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.reducedMotion}
              onChange={(e) => updateSettings({ reducedMotion: e.target.checked })}
              className="w-5 h-5"
            />
            <span className="text-sm">Reduced motion</span>
          </label>
        </div>

        <div className="hana-card p-4">
          <h3 className="font-medium mb-2">Easter Eggs</h3>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.showEasterEggs}
              onChange={(e) => updateSettings({ showEasterEggs: e.target.checked })}
              className="w-5 h-5"
            />
            <span className="text-sm">Show easter eggs</span>
          </label>
          {settings.easterEggsFound.length > 0 && (
            <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
              Found: {settings.easterEggsFound.join(', ')}
            </p>
          )}
        </div>

        <div className="hana-card p-4">
          <h3 className="font-medium mb-2">Privacy</h3>
          <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>
            Your data stays on this device. Nothing is sent to any server.
          </p>
        </div>

        <div className="hana-card p-4">
          <h3 className="font-medium mb-3">Data</h3>
          <div className="flex gap-2 mb-3">
            <button onClick={handleExport} className="hana-btn text-sm py-2 px-3 flex-1">
              <Download size={14} /> Export
            </button>
            <button onClick={() => setShowImport(!showImport)} className="hana-btn hana-btn-outline text-sm py-2 px-3 flex-1">
              <Upload size={14} /> Import
            </button>
          </div>
          {showImport && (
            <div className="space-y-2">
              <textarea
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                placeholder="Paste your HANA OS data here..."
                className="hana-input text-sm h-24"
              />
              <button onClick={handleImport} className="hana-btn text-sm py-2 w-full">
                Load Data
              </button>
            </div>
          )}
          <button
            onClick={() => {
              if (confirm('Are you sure? This will erase everything.')) resetAll();
            }}
            className="w-full py-2 text-sm rounded-lg mt-2 flex items-center justify-center gap-2"
            style={{ backgroundColor: 'rgba(220, 38, 38, 0.1)', color: '#ef4444' }}
          >
            <Trash2 size={14} /> Reset Everything
          </button>
        </div>
      </div>
    </div>
  );
}
