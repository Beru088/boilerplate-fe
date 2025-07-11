import { useState, useCallback } from 'react';

type AsyncFunction<T> = () => Promise<T>;

export function useAsync<T>(asyncFn: AsyncFunction<T>) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await asyncFn();
      setData(result);
      return result;
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [asyncFn]);

  return { data, loading, error, fetch, setData };
}
