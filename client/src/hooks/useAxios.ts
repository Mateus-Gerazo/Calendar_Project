import { useState, useEffect } from 'react';
import { AxiosError } from 'axios';

interface UseAxiosOptions<T> {
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: AxiosError) => void;
}

export const useAxios = <T,>(
  axiosPromise: () => Promise<{ data: T }>,
  options: UseAxiosOptions<T> = {}
) => {
  const { immediate = true, onSuccess, onError } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(immediate);
  const [error, setError] = useState<AxiosError | null>(null);

  const execute = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosPromise();
      setData(response.data);
      onSuccess?.(response.data);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(axiosError);
      onError?.(axiosError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, []);

  return { data, loading, error, execute, refetch: execute };
};
