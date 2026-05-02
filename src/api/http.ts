import { API_ERROR_MESSAGES } from './config';

export class HttpError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

function statusToMessage(status: number): string {
  switch (status) {
    case 401:
      return API_ERROR_MESSAGES.UNAUTHORIZED;
    case 403:
      return API_ERROR_MESSAGES.FORBIDDEN;
    case 404:
      return API_ERROR_MESSAGES.NOT_FOUND;
    case 500:
      return API_ERROR_MESSAGES.SERVER_ERROR;
    default:
      return API_ERROR_MESSAGES.NETWORK_ERROR;
  }
}

interface RequestOptions {
  timeout?: number;
  signal?: AbortSignal;
}

export async function getJson<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const { timeout, signal } = options;
  let controller: AbortController | undefined;
  let timeoutId: NodeJS.Timeout | undefined;

  if (timeout) {
    controller = new AbortController();
    timeoutId = setTimeout(() => controller?.abort(), timeout);
  }

  try {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      signal: signal ?? controller?.signal,
    });
    if (!res.ok) {
      throw new HttpError(statusToMessage(res.status), res.status);
    }
    return (await res.json()) as T;
  } catch (error) {
    if (error instanceof HttpError) throw error;
    if (error instanceof Error && error.name === 'AbortError') {
      throw new HttpError(API_ERROR_MESSAGES.TIMEOUT_ERROR, 408);
    }
    throw new HttpError(API_ERROR_MESSAGES.NETWORK_ERROR, 0);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}
