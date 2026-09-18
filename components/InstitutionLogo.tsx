import { cn } from '@/lib/utils';

interface InstitutionLogoProps {
  name: string;
  size?: number;
  className?: string;
}

function getInitials(name: string): string {
  // Remove common suffixes
  const clean = name
    .replace(/\b(of|and|the|in|for|at|&)\b/gi, ' ')
    .replace(/[^\w\s]/g, ' ')
    .trim();
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length >= 3) {
    return (words[0][0] + words[1][0] + words[2][0]).toUpperCase();
  }
  if (words.length === 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return words[0]?.slice(0, 2).toUpperCase() || '??';
}

// Generate a deterministic hue from name string
function nameToHue(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = (h * 31 + name.charCodeAt(i)) % 360;
  }
  return h;
}

export default function InstitutionLogo({ name, size = 36, className }: InstitutionLogoProps) {
  const initials = getInitials(name);
  const hue = nameToHue(name);
  const bg = `oklch(0.92 0.06 ${hue})`;
  const fg = `oklch(0.35 0.12 ${hue})`;

  return (
    <div
      className={cn('initials-badge shrink-0', className)}
      style={{
        width: size,
        height: size,
        fontSize: size < 32 ? 10 : size < 48 ? 12 : 16,
        background: bg,
        color: fg,
        borderRadius: 8,
      }}
      title={name}
    >
      {initials}
    </div>
  );
}

