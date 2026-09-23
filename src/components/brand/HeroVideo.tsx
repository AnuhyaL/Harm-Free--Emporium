/**
 * Full-bleed background video. Isolated so the client can swap the footage freely.
 * - Plays on every screen size (client request). The poster paints first; the <video>
 *   mounts right after first paint so it never blocks the initial render.
 * - A visible Pause/Play control is always shown (WCAG 2.2.2), which also covers
 *   visitors who prefer reduced motion.
 * - If autoplay is blocked (e.g. battery saver), it shows "Play" instead of failing silently.
 * - If the file is missing, it stays on the poster.
 */
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Icon } from '@/components/ui/Icon';

export interface HeroVideoProps {
  sources?: { src: string; type: string }[];
  poster?: string;
  posterAlt?: string;
  children?: ReactNode;
}

// Add { src: '/media/hfe.webm', type: 'video/webm' } first once a WebM encode exists.
const DEFAULT_SOURCES = [{ src: '/media/hfe.mp4', type: 'video/mp4' }];

export function HeroVideo({
  sources = DEFAULT_SOURCES,
  poster = '/media/hfe-poster.jpg',
  posterAlt = '',
  children,
}: HeroVideoProps) {
  const [mountVideo, setMountVideo] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);

  // Mount after the first paint so the poster and headline render immediately.
  useEffect(() => {
    const id = requestAnimationFrame(() => setMountVideo(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const tryPlay = () => {
    const v = ref.current;
    if (!v) return;
    v.play().then(
      () => setPaused(false),
      () => setPaused(true), // autoplay blocked: offer a Play button
    );
  };

  const togglePause = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) tryPlay();
    else {
      v.pause();
      setPaused(true);
    }
  };

  return (
    <div className="relative isolate overflow-hidden bg-navy">
      <img
        src={poster}
        alt={posterAlt}
        className="absolute inset-0 -z-20 h-full w-full object-cover"
        {...{ fetchpriority: 'high' }}
        decoding="async"
      />
      {mountVideo && !failed && (
        <video
          ref={ref}
          className={`absolute inset-0 -z-10 h-full w-full object-cover transition-opacity duration-700 ${ready ? 'opacity-100' : 'opacity-0'}`}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={poster}
          aria-hidden
          onCanPlay={() => {
            setReady(true);
            if (ref.current?.paused && !paused) tryPlay();
          }}
          onError={() => setFailed(true)}
        >
          {sources.map((s) => (
            <source
              key={s.src}
              src={s.src}
              type={s.type}
              onError={(e) => {
                // The last source failing means no playable video: stay on the poster.
                if (e.currentTarget === e.currentTarget.parentElement?.lastElementChild) setFailed(true);
              }}
            />
          ))}
        </video>
      )}
      {/* Scrim: charcoal → transparent keeps the headline and body text at AA contrast on the left. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(90deg, rgb(var(--hfe-navy) / 0.86) 0%, rgb(var(--hfe-navy) / 0.7) 45%, rgb(var(--hfe-navy) / 0.1) 100%), linear-gradient(0deg, rgb(var(--hfe-navy) / 0.45), transparent 40%)',
        }}
      />
      {/* On narrow screens the text spans the full width, so tint evenly as well. */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-navy/60 md:hidden" />
      {children}
      {ready && !failed && (
        <button
          type="button"
          onClick={togglePause}
          className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 text-xs font-medium text-white backdrop-blur hover:bg-black/60"
          aria-label={paused ? 'Play background video' : 'Pause background video'}
        >
          {paused ? (
            <Icon name="arrowRight" size={14} />
          ) : (
            <span className="flex gap-0.5" aria-hidden>
              <span className="h-3 w-1 bg-white" />
              <span className="h-3 w-1 bg-white" />
            </span>
          )}
          {paused ? 'Play' : 'Pause'}
        </button>
      )}
    </div>
  );
}
