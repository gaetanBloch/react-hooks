import { useCallback, useReducer } from 'react';

const SEND = 'SEND';
const RESPONSE = 'RESPONSE';
const ERROR = 'ERROR';
const CLEAR_ERROR = 'CLEAR_ERROR';

const httpReducer = (httpState, action) => {
  switch (action.type) {
    case SEND:
      return { ...httpState, loading: true, error: null, data: null };
    case RESPONSE:
      return { ...httpState, loading: false, data: action.data };
    case ERROR:
      return { ...httpState, loading: false, error: action.error };
    case CLEAR_ERROR:
      return { ...httpState, error: null };
    default:
      throw new Error('Should never happen!');
  }
};

const useHttp = () => {
  const [httpState, dispatchHttp] = useReducer(
    httpReducer,
    { loading: false, data: null, error: null },
    undefined
  );

  const sendRequest = useCallback((url, method, body) => {
    dispatchHttp({ type: SEND });
    fetch(url, { method, body, header: { 'Content-Type': 'application/json' } })
      .then(response => response.json())
      .then(responseData => {
        dispatchHttp({ type: RESPONSE, data: responseData });
      })
      .catch(() => {
        dispatchHttp({ type: ERROR, error: 'An unexpected error occurred!' });
      });
  }, []);

  return {
    httpState: {
      loading: httpState.loading,
      data: httpState.data,
      error: httpState.error,
    },
    sendRequest
  };
};

export default useHttp;
