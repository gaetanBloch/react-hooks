import React, { useEffect, useState } from 'react';

import Card from '../UI/Card/Card';
import './Search.css';

const Search = React.memo(props => {

  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetch('https://react-hooks-b09bb.firebaseio.com/ingredients.json')
      .then(response => {
        return response.json();
      }).then(responseJson => {
      const loadedIngredients = [];
      Object.keys(responseJson).forEach(key => {
        loadedIngredients.push({
          id: key,
          title: responseJson[key].title,
          amount: responseJson[key].amount
        });
      });
    });
  }, [filter])

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            type="text"
            value={filter}
            onChange={event => setFilter(event.target.value)} />
        </div>
      </Card>
    </section>
  );
});

export default Search;
