/**
 * Имя файла из заголовка Content-Disposition ответа на скачивание.
 * Поддерживает `filename*=UTF-8''...` (RFC 5987, приоритетнее) и `filename="..."`.
 * Нет заголовка или имени в нем — null, вызывающая сторона подставляет свое имя.
 */
export function getContentDispositionFilename(header: unknown): string | null {
  if (typeof header !== 'string') return null;

  const encoded = /filename\*\s*=\s*(?:[\w-]+'[^']*')?([^;]+)/i.exec(header)?.[1];
  if (encoded) {
    try {
      return decodeURIComponent(encoded.trim().replace(/^"|"$/g, ''));
    } catch {
      // Битая кодировка — пробуем обычный filename
    }
  }

  const plain = /filename\s*=\s*("([^"]*)"|[^;]+)/i.exec(header);
  const filename = (plain?.[2] ?? plain?.[1])?.trim();

  return filename || null;
}
