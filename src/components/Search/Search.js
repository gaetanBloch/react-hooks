import React, { useState } from 'react';

import Card from '../UI/Card/Card';
import './Search.css';

const Search = React.memo(props => {

  const [filter, setFilter] = useState('');

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
