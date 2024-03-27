import { useState } from 'react';

interface UseMutationState<T> {
  loading: boolean;
  data?: T;
  error?: object;
}

type UseMutationResult<T> = [(data: any, url?: string) => void, UseMutationState<T>];

export default function useMutation<T = any>(
  method: 'POST' | 'PUT' | 'DELETE',
  url: string,
): UseMutationResult<T> {
  const [state, setState] = useState<UseMutationState<T>>({
    loading: false,
    data: undefined,
    error: undefined,
  });

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<undefined | any>(undefined);
  const [error, setError] = useState<undefined | any>(undefined);
  function mutation(data: any | null, mUrl?: string) {
    setLoading(true);
    fetch(mUrl ? mUrl : url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : null,
    })
      .then((res) => res.json().catch(() => {}))
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }
  return [mutation, { loading, data, error }];
}
