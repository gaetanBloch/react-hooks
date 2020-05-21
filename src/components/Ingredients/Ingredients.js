import React from 'react';

import IngredientForm from './IngredientForms/IngredientForm';
import Search from '../Search/Search';

function Ingredients() {
  return (
    <div className="App">
      <IngredientForm />

      <section>
        <Search />
        {/* Need to add list here! */}
      </section>
    </div>
  );
}

export default Ingredients;
