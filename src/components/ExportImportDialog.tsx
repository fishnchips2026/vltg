import { useState, useRef } from 'react';
import { Download, Upload, Lock, X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

type Mode = 'export' | 'import' | null;

interface ExportImportDialogProps {
  open: boolean;
  onClose: () => void;
  onExport: (password: string) => Promise<void>;
  onImport: (file: File, password: string, merge?: boolean) => Promise<void>;
}

export function ExportImportDialog({ open, onClose, onExport, onImport }: ExportImportDialogProps) {
  const [mode, setMode] = useState<Mode>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [confirmStep, setConfirmStep] = useState(false);

  const reset = () => {
    setMode(null);
    setPassword('');
    setConfirmPassword('');
    setError('');
    setFile(null);
    setLoading(false);
    setConfirmStep(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleExport = async () => {
    if (password.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await onExport(password);
      handleClose();
    } catch {
      setError('Export failed');
    } finally {
      setLoading(false);
    }
  };

  const handleImportCheck = () => {
    if (!file) {
      setError('Select a file first');
      return;
    }
    if (!password) {
      setError('Enter the password used to encrypt the backup');
      return;
    }
    setError('');
    setConfirmStep(true);
  };

  const handleImportConfirmed = async (merge: boolean) => {
    setLoading(true);
    setError('');
    try {
      await onImport(file!, password, merge);
      handleClose();
    } catch {
      setConfirmStep(false);
      setError('Decryption failed — wrong password or corrupted file');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-card border border-border rounded-lg w-full max-w-md mx-4 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-primary" />
            <h2 className="font-heading font-semibold text-foreground">
              {mode === 'export' ? 'Export Backup' : mode === 'import' ? 'Import Backup' : 'Backup & Restore'}
            </h2>
          </div>
          <button onClick={handleClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5">
          {!mode && (
            <div className="flex flex-col gap-3">
              <p className="text-xs font-mono text-muted-foreground mb-2">
                Notes are encrypted with AES-256-GCM before export. Your password never leaves this device.
              </p>
              <Button
                variant="energy"
                className="w-full font-mono text-xs justify-start gap-3"
                onClick={() => setMode('export')}
              >
                <Download className="w-4 h-4" />
                Export encrypted backup
              </Button>
              <Button
                variant="stealth"
                className="w-full font-mono text-xs justify-start gap-3"
                onClick={() => setMode('import')}
              >
                <Upload className="w-4 h-4" />
                Import from backup file
              </Button>
            </div>
          )}

          {mode === 'export' && (
            <div className="flex flex-col gap-3">
              <p className="text-xs font-mono text-muted-foreground">
                Choose an encryption password. You'll need it to restore the backup.
              </p>
              <Input
                type="password"
                placeholder="Encryption password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="font-mono text-sm bg-surface-2 border-border"
              />
              <Input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="font-mono text-sm bg-surface-2 border-border"
              />
              {error && (
                <p className="text-xs font-mono text-destructive flex items-center gap-1.5">
                  <AlertTriangle className="w-3 h-3" /> {error}
                </p>
              )}
              <div className="flex gap-2 mt-1">
                <Button variant="stealth" size="sm" className="font-mono text-xs" onClick={reset}>
                  Back
                </Button>
                <Button
                  variant="energy"
                  size="sm"
                  className="font-mono text-xs flex-1"
                  onClick={handleExport}
                  disabled={loading}
                >
                  {loading ? 'Encrypting...' : 'Download Backup'}
                </Button>
              </div>
            </div>
          )}

          {mode === 'import' && !confirmStep && (
            <div className="flex flex-col gap-3">
              <p className="text-xs font-mono text-muted-foreground">
                Select your encrypted backup file and enter the password.
              </p>
              <label
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-md border border-dashed cursor-pointer transition-colors font-mono text-xs',
                  file
                    ? 'border-primary/50 bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground hover:border-primary/30 hover:bg-surface-2'
                )}
              >
                <Upload className="w-3.5 h-3.5" />
                {file ? file.name : 'Choose .vltg file'}
                <input
                  type="file"
                  accept=".vltg,.json"
                  className="hidden"
                  onChange={e => setFile(e.target.files?.[0] ?? null)}
                />
              </label>
              <Input
                type="password"
                placeholder="Decryption password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="font-mono text-sm bg-surface-2 border-border"
              />
              {error && (
                <p className="text-xs font-mono text-destructive flex items-center gap-1.5">
                  <AlertTriangle className="w-3 h-3" /> {error}
                </p>
              )}
              <div className="flex gap-2 mt-1">
                <Button variant="stealth" size="sm" className="font-mono text-xs" onClick={reset}>
                  Back
                </Button>
                <Button
                  variant="energy"
                  size="sm"
                  className="font-mono text-xs flex-1"
                  onClick={handleImportCheck}
                >
                  Restore Notes
                </Button>
              </div>
            </div>
          )}

          {mode === 'import' && confirmStep && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="w-4 h-4" />
                <p className="text-sm font-heading font-semibold">How should we import?</p>
              </div>
              <p className="text-xs font-mono text-muted-foreground">
                Choose whether to merge new notes with your existing ones or replace everything.
              </p>
              {error && (
                <p className="text-xs font-mono text-destructive flex items-center gap-1.5">
                  <AlertTriangle className="w-3 h-3" /> {error}
                </p>
              )}
              <div className="flex flex-col gap-2 mt-1">
                <Button
                  variant="energy"
                  size="sm"
                  className="font-mono text-xs w-full"
                  onClick={() => handleImportConfirmed(true)}
                  disabled={loading}
                >
                  {loading ? 'Importing...' : 'Merge — keep existing + add new'}
                </Button>
                <Button
                  variant="stealth"
                  size="sm"
                  className="font-mono text-xs w-full text-destructive hover:text-destructive"
                  onClick={() => handleImportConfirmed(false)}
                  disabled={loading}
                >
                  Replace all — overwrite current notes
                </Button>
                <Button variant="ghost" size="sm" className="font-mono text-xs" onClick={() => setConfirmStep(false)}>
                  Cancel
                </Button>
              </div>
            </div>
        </div>
        </div>
      </motion.div>
    </div>
  );
}
