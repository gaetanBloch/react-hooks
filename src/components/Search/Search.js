import React, { useCallback, useEffect, useRef, useState } from 'react';

import Card from '../UI/Card/Card';
import './Search.css';
import useHttp from '../../hooks/http';
import ErrorModal from '../UI/ErrorModal/ErrorModal';

const Search = React.memo(props => {

  const { onLoadIngredients } = props;
  const [filter, setFilter] = useState('');
  const filterRef = useRef();
  const { httpState, sendRequest, clearError } = useHttp();

  const fetchFilteredIngredients = useCallback(() => {
    const queryParams = filter.length === 0
      ? ''
      : `?orderBy="title"&equalTo="${filter}"`;
    sendRequest(
      `https://react-hooks-b09bb.firebaseio.com/ingredients.json${queryParams}`,
      'GET'
    );
  }, [filter, sendRequest]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (filter === filterRef.current.value) {
        fetchFilteredIngredients();
      }
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [filter, filterRef, fetchFilteredIngredients]);

  useEffect(() => {
    if (!httpState.loading && !httpState.error && httpState.data) {
      const loadedIngredients = [];
      Object.keys(httpState.data).forEach(key => {
        loadedIngredients.push({
          id: key,
          title: httpState.data[key].title,
          amount: httpState.data[key].amount
        });
      });
      onLoadIngredients(loadedIngredients);
    }
  }, [httpState.loading, httpState.data, httpState.error, onLoadIngredients]);

  return (
    <section className="search">

      {
        httpState.error &&
        <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>
      }

      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            ref={filterRef}
            type="text"
            value={filter}
            onChange={event => setFilter(event.target.value)} />
        </div>
      </Card>
    </section>
  );
});

export default Search;
