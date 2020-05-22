import { useCallback, useReducer } from 'react';

const SEND = 'SEND';
const RESPONSE = 'RESPONSE';
const ERROR = 'ERROR';
const CLEAR_ERROR = 'CLEAR_ERROR';

const httpReducer = (httpState, action) => {
  switch (action.type) {
    case SEND:
      return {
        ...httpState,
        loading: true,
        error: null,
        data: null,
        extra: null,
        identifier: action.identifier
      };
    case RESPONSE:
      return {
        ...httpState,
        loading: false,
        data: action.data,
        extra: action.extra
      };
    case ERROR:
      return {
        ...httpState,
        loading: false,
        error: action.error
      };
    case CLEAR_ERROR:
      return {
        ...httpState,
        error: null
      };
    default:
      throw new Error('Should never happen!');
  }
};

const useHttp = () => {
  const [httpState, dispatchHttp] = useReducer(
    httpReducer,
    { loading: false, data: null, error: null, extra: null, identifier: null },
    undefined
  );

  const sendRequest = useCallback((url, method, body, extra, identifier) => {
    dispatchHttp({ type: SEND, identifier });
    fetch(url, { method, body, header: { 'Content-Type': 'application/json' } })
      .then(response => response.json())
      .then(responseData => {
        dispatchHttp({ type: RESPONSE, data: responseData, extra });
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
      extra: httpState.extra,
      identifier: httpState.identifier
    },
    sendRequest
  };
};

export default useHttp;
