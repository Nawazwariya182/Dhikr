export interface ScannedQRResult {
  type: 'circle' | 'khatm' | 'invalid';
  id: string;
}

/**
 * Builds the standard QR code image URL from api.qrserver.com
 */
export function getQRCodeUrl(data: string, size = 300): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=15&data=${encodeURIComponent(data)}`;
}

/**
 * Build a custom deep link URI for Dhikr Circles
 */
export function buildCircleUri(circleId: string): string {
  return `dhikr://circle/${circleId.trim().toLowerCase()}`;
}

/**
 * Build a custom deep link URI for Quran Khatm Rooms
 */
export function buildKhatmUri(roomId: string): string {
  return `dhikr://khatm/${roomId.trim().toLowerCase()}`;
}

/**
 * Parse a scanned QR code data payload
 */
export function parseScannedQR(data: string, expectedType?: 'circle' | 'khatm'): ScannedQRResult {
  if (!data) return { type: 'invalid', id: '' };
  
  const trimmed = data.trim();
  const lower = trimmed.toLowerCase();
  
  if (lower.startsWith('dhikr://circle/')) {
    const id = trimmed.substring('dhikr://circle/'.length).trim();
    return { type: 'circle', id };
  }
  
  if (lower.startsWith('dhikr://khatm/')) {
    const id = trimmed.substring('dhikr://khatm/'.length).trim();
    return { type: 'khatm', id };
  }
  
  // Fallback: If it's a simple raw alphanumeric code, treat it as the expected type or default to circle
  if (/^[a-z0-9_-]{3,50}$/i.test(trimmed)) {
    return {
      type: expectedType || 'circle',
      id: trimmed,
    };
  }

  return { type: 'invalid', id: '' };
}
