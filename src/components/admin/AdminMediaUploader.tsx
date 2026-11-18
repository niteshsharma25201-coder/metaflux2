import { useState } from 'react';
import { Upload } from 'lucide-react';

interface AdminMediaUploaderProps {
  token: string;
  accept?: string;
  label?: string;
  onUploaded: (result: { url: string; mediaType: 'image' | 'video' }) => void;
}

export function AdminMediaUploader({
  token,
  accept = 'image/*,video/mp4,video/webm,video/quicktime',
  label = 'Upload Image or Video',
  onUploaded,
}: AdminMediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }
      onUploaded({
        url: data.url,
        mediaType: data.mediaType === 'video' ? 'video' : 'image',
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-black/15 bg-white hover:bg-[#F7F7FA] text-xs font-semibold text-[#111111] cursor-pointer transition-colors">
        <Upload className="w-3.5 h-3.5 text-[#7651D9]" />
        <span>{uploading ? 'Uploading...' : label}</span>
        <input
          type="file"
          accept={accept}
          onChange={handleFileChange}
          disabled={uploading}
          className="sr-only"
        />
      </label>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
