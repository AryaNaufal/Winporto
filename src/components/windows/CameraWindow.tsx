/** Webcam viewer using getUserMedia, with SNAP and photo download. */
import { useCallback, useEffect, useRef, useState } from 'react';

type Status = 'starting' | 'active' | 'error';

function describeError(err: unknown): string {
  const name = err instanceof DOMException ? err.name : '';
  if (name === 'NotAllowedError' || name === 'SecurityError') return 'Camera permission was denied. Allow camera access in your browser, then press Retry.';
  if (name === 'NotFoundError' || name === 'OverconstrainedError') return 'No camera was found on this device.';
  if (name === 'NotReadableError') return 'The camera is being used by another application.';
  return 'Could not start the camera.';
}

export default function CameraWindow() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState<Status>('starting');
  const [error, setError] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [flash, setFlash] = useState(false);

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const start = useCallback(async () => {
    setStatus('starting');
    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Camera is not supported here (a secure https:// or localhost page is required).');
      setStatus('error');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setStatus('active');
    } catch (err) {
      setError(describeError(err));
      setStatus('error');
    }
  }, []);

  // Start on open, always release the camera on close.
  useEffect(() => {
    let cancelled = false;
    start().then(() => {
      if (cancelled) stop();
    });
    return () => {
      cancelled = true;
      stop();
    };
  }, [start, stop]);

  const snap = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !video.videoWidth) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    setPhoto(canvas.toDataURL('image/png'));
    setFlash(true);
    window.setTimeout(() => setFlash(false), 120);
  };

  return (
    <div className="flex h-full flex-col gap-2 p-2">
      <div className="field98 relative flex min-h-0 flex-1 items-center justify-center overflow-hidden !bg-dark !p-0">
        <video ref={videoRef} muted playsInline aria-label="Live camera preview" className={`h-full w-full object-contain ${status === 'active' ? '' : 'invisible'}`} />
        {status === 'starting' && <p className="absolute m-0 p-4 text-center text-white">Waiting for camera…</p>}
        {status === 'error' && (
          <div role="alert" className="absolute flex max-w-[90%] flex-col items-center gap-3 p-4 text-center text-white">
            <p className="m-0">{error}</p>
            <button type="button" className="btn98 !text-ink" onClick={start}>Retry</button>
          </div>
        )}
        {flash && <div className="absolute inset-0 bg-white" aria-hidden="true" />}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className="btn98 font-bold" disabled={status !== 'active'} onClick={snap}>
          SNAP
        </button>
        <p role="status" className="m-0 flex items-center gap-2">
          <span aria-hidden="true" className={`inline-block h-3 w-3 border-2 border-dark ${status === 'active' ? 'bg-[#3f9d4f]' : 'bg-[#d04a3f]'}`} />
          {status === 'active' ? 'Camera Active' : status === 'starting' ? 'Starting…' : 'Camera Off'}
        </p>
        {photo && (
          <div className="ml-auto flex items-center gap-2">
            <img src={photo} alt="Your latest snapshot" className="h-12 w-auto border-2 border-dark" />
            <a className="btn98" href={photo} download={`snapshot-${Date.now()}.png`}>
              Download
            </a>
          </div>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />
    </div>
  );
}
