import { useState } from 'react';
import { Film, Image as ImageIcon } from 'lucide-react';

interface MediaFrameProps {
  src?: string;
  mediaType?: 'image' | 'video' | string;
  alt: string;
  fallbackLabel?: string;
  className?: string;
  controls?: boolean;
  variant?: 'project' | 'portrait';
}

function getInitials(label: string): string {
  const parts = label.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'MF';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export function MediaFrame({
  src,
  mediaType = 'image',
  alt,
  fallbackLabel = 'META FLUX',
  className = 'w-full h-full object-cover',
  controls = false,
  variant = 'project',
}: MediaFrameProps) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        className={`w-full h-full flex flex-col items-center justify-center p-6 select-none ${
          variant === 'portrait'
            ? 'bg-gradient-to-br from-[#F3F0FA] via-[#F7F7FA] to-[#EAE4F8] text-[#111111]'
            : 'bg-gradient-to-br from-[#F7F7FA] via-[#F3F0FA] to-[#ECE8F6] text-[#111111]'
        }`}
        aria-label={alt}
      >
        {variant === 'portrait' ? (
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="font-display text-2xl font-semibold tracking-tight text-[#7651D9]">
              {getInitials(fallbackLabel)}
            </span>
            <span className="text-[11px] font-medium tracking-wide text-[#111111]/55 max-w-[140px] truncate">
              {fallbackLabel}
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="w-10 h-10 rounded-full bg-white border border-black/10 flex items-center justify-center text-[#7651D9]">
              {mediaType === 'video' ? (
                <Film className="w-4 h-4" />
              ) : (
                <ImageIcon className="w-4 h-4" />
              )}
            </div>
            <span className="text-xs font-medium text-[#111111]/65 max-w-[200px] truncate">
              {fallbackLabel}
            </span>
          </div>
        )}
      </div>
    );
  }

  if (mediaType === 'video') {
    return (
      <video
        src={src}
        controls={controls}
        playsInline
        muted={!controls}
        loop={!controls}
        autoPlay={!controls}
        onError={() => setHasError(true)}
        className={className}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      loading="lazy"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
