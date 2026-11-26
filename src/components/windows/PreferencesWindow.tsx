/** Preferences: appearance, text size, motion and desktop options. Changes apply instantly. */
import { useStore } from '@nanostores/react';
import { useEffect, useState, type ReactNode } from 'react';
import {
  $prefs, BACKGROUNDS, DATE_FORMATS, FONT_SIZES, TITLE_COLORS, WALLPAPERS, getCustomImage, removeCustomImage, resetPrefs, saveCustomImage, setPref,
  type BackgroundKey, type DateFormatKey, type FontSizeKey, type MotionPref, type TitleKey, type WallpaperKey,
} from '../../stores/preferencesStore';

function Group({ legend, children }: { legend: string; children: ReactNode }) {
  return (
    <fieldset className="field98 m-0 min-w-0 !bg-transparent !p-3">
      <legend className="bg-face px-1">{legend}</legend>
      {children}
    </fieldset>
  );
}

/** Native radio inputs, visually replaced by a label so keyboard + screen readers just work. */
function Swatches<K extends string>({ name, value, options, onChange }: {
  name: string;
  value: K;
  options: { key: K; label: string; color: string }[];
  onChange: (k: K) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <label
          key={o.key}
          title={o.label}
          className="flex cursor-pointer flex-col items-center gap-1 p-1 has-[:checked]:bg-select has-[:checked]:text-white has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-dotted has-[:focus-visible]:outline-dark"
        >
          <input type="radio" name={name} value={o.key} checked={value === o.key} onChange={() => onChange(o.key)} className="sr-only" />
          <span aria-hidden="true" className="block h-6 w-10 border-2 border-dark" style={{ background: o.color }} />
          <span>{o.label}</span>
        </label>
      ))}
    </div>
  );
}

function Check({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children: ReactNode }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 py-0.5">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-[#000080]" />
      {children}
    </label>
  );
}

/** Downscale to at most 1600px and re-encode as JPEG so it fits in localStorage. */
async function toDataUrl(file: File): Promise<string> {
  const objectUrl = URL.createObjectURL(file);
  try {
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('decode'));
      img.src = objectUrl;
    });
    const scale = Math.min(1, 1600 / Math.max(img.naturalWidth, img.naturalHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
    canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.8);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

/** Small preview of a background type, drawn with the same CSS variables as the real wallpaper. */
function previewStyle(key: BackgroundKey, color: string, image: string | null) {
  const base = { backgroundColor: color } as const;
  if (key === 'solid') return base;
  if (key === 'custom') return { ...base, backgroundImage: image ? `url("${image}")` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' };
  const size = { clouds: '64px 48px', stars: '48px 48px', grid: '16px 16px', checker: '16px 16px' }[key];
  return { ...base, backgroundImage: `var(--wp-${key})`, backgroundSize: size };
}

const MOTION: { key: MotionPref; label: string }[] = [
  { key: 'system', label: 'Follow system setting' },
  { key: 'reduce', label: 'Reduce motion' },
  { key: 'full', label: 'Always animate' },
];

export default function PreferencesWindow() {
  const p = useStore($prefs);
  const [image, setImage] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setImage(getCustomImage());
  }, []);

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) return setMessage('File harus berupa gambar.');
    try {
      const dataUrl = await toDataUrl(file);
      if (saveCustomImage(dataUrl)) {
        setImage(dataUrl);
        setPref('background', 'custom');
        setMessage('Gambar dipasang sebagai background.');
      } else {
        setMessage('Gambar terlalu besar untuk disimpan di browser. Coba gambar lain.');
      }
    } catch {
      setMessage('Gambar tidak dapat dibaca.');
    }
  };

  const removeImage = () => {
    removeCustomImage();
    setImage(null);
    if (p.background === 'custom') setPref('background', 'solid');
    setMessage('Gambar dihapus.');
  };

  const wallColor = WALLPAPERS[p.wallpaper].color;

  return (
    <div className="flex h-full flex-col gap-2 p-2">
      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-auto">
        <Group legend="Background">
          <div role="radiogroup" aria-label="Background type" className="flex flex-wrap gap-2">
            {(Object.keys(BACKGROUNDS) as BackgroundKey[]).map((k) => (
              <label
                key={k}
                className={`flex flex-col items-center gap-1 p-1 has-[:checked]:bg-select has-[:checked]:text-white has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-dotted has-[:focus-visible]:outline-dark ${k === 'custom' && !image ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
              >
                <input type="radio" name="background" value={k} checked={p.background === k} disabled={k === 'custom' && !image} onChange={() => setPref('background', k)} className="sr-only" />
                <span aria-hidden="true" className="block h-8 w-14 border-2 border-dark" style={previewStyle(k, wallColor, image)} />
                <span>{BACKGROUNDS[k]}</span>
              </label>
            ))}
          </div>

          <p className="mb-1 mt-3">Base color</p>
          <Swatches<WallpaperKey>
            name="wallpaper"
            value={p.wallpaper}
            options={(Object.keys(WALLPAPERS) as WallpaperKey[]).map((k) => ({ key: k, ...WALLPAPERS[k] }))}
            onChange={(v) => setPref('wallpaper', v)}
          />
          <div className="mt-2">
            <label className={`flex items-center gap-2 py-0.5 ${p.background === 'solid' ? 'cursor-pointer' : 'opacity-60'}`}>
              <input type="checkbox" disabled={p.background !== 'solid'} checked={p.pattern} onChange={(e) => setPref('pattern', e.target.checked)} className="h-4 w-4 accent-[#000080]" />
              Pixel texture (solid color only)
            </label>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <label className="btn98 cursor-pointer has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-dotted has-[:focus-visible]:outline-dark">
              Upload picture…
              <input type="file" accept="image/*" className="sr-only" onChange={(e) => { onFile(e.target.files?.[0]); e.target.value = ''; }} />
            </label>
            <button type="button" className="btn98" disabled={!image} onClick={removeImage}>Remove picture</button>
          </div>
          <p role="status" className="m-0 mt-1 min-h-[1.2em] text-muted">{message}</p>
        </Group>

        <Group legend="Window title bar">
          <Swatches<TitleKey>
            name="title"
            value={p.titleColor}
            options={(Object.keys(TITLE_COLORS) as TitleKey[]).map((k) => ({ key: k, ...TITLE_COLORS[k] }))}
            onChange={(v) => setPref('titleColor', v)}
          />
        </Group>

        <Group legend="Text size">
          <div role="radiogroup" aria-label="Text size" className="flex flex-wrap gap-3">
            {(Object.keys(FONT_SIZES) as FontSizeKey[]).map((k) => (
              <label key={k} className="flex cursor-pointer items-center gap-2">
                <input type="radio" name="fontsize" checked={p.fontSize === k} onChange={() => setPref('fontSize', k)} />
                <span className="capitalize">{k}</span>
              </label>
            ))}
          </div>
        </Group>

        <Group legend="Motion and pointer">
          <label className="flex items-center gap-2">
            Animations
            <select className="field98 !py-0.5" value={p.motion} onChange={(e) => setPref('motion', e.target.value as MotionPref)}>
              {MOTION.map((m) => (
                <option key={m.key} value={m.key}>{m.label}</option>
              ))}
            </select>
          </label>
          <div className="mt-1">
            <Check checked={p.customCursor} onChange={(v) => setPref('customCursor', v)}>Pixel mouse cursor</Check>
          </div>
        </Group>

        <Group legend="Desktop">
          <Check checked={p.clippy} onChange={(v) => setPref('clippy', v)}>Show Clippy assistant</Check>
          <Check checked={p.clock24} onChange={(v) => setPref('clock24', v)}>24-hour clock</Check>
          <label className="mt-1 flex items-center gap-2">
            Taskbar date
            <select className="field98 !py-0.5" value={p.dateFormat} onChange={(e) => setPref('dateFormat', e.target.value as DateFormatKey)}>
              {(Object.keys(DATE_FORMATS) as DateFormatKey[]).map((k) => (
                <option key={k} value={k}>{DATE_FORMATS[k].label}</option>
              ))}
            </select>
          </label>
        </Group>
      </div>

      <div className="flex items-center justify-between gap-2">
        <span className="text-muted">Saved automatically in this browser.</span>
        <button type="button" className="btn98" onClick={resetPrefs}>Reset to defaults</button>
      </div>
    </div>
  );
}
