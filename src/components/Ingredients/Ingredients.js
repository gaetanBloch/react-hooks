import React, { useCallback, useEffect, useState } from 'react';

import IngredientForm from './IngredientForms/IngredientForm';
import Search from '../Search/Search';
import IngredientList from './IngredientList/IngredientList';

const Ingredients = () => {

  const [ingredients, setIngredients] = useState([]);

  const filerIngredientsHandler = useCallback(filteredIngredients => {
    setIngredients(filteredIngredients);
  }, []);

  const addIngredientHandler = ingredient => {
    fetch(
      'https://react-hooks-b09bb.firebaseio.com/ingredients.json',
      {
        method: 'POST',
        body: JSON.stringify(ingredient),
        header: { 'Content-Type': 'application/json' }
      }
    ).then(response => {
      return response.json();
    }).then(responseJson => {
      setIngredients(prevIngredients => prevIngredients.concat({
        id: responseJson.name,
        ...ingredient
      }));
    });
  };

  const removeIngredientHandler = id => {
    fetch(
      `https://react-hooks-b09bb.firebaseio.com/ingredients/${id}.json`,
      { method: 'DELETE' }
    ).then(() => {
      setIngredients(preIngredients => preIngredients.filter(ingredient => {
        return ingredient.id !== id;
      }));
    });
  };

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />
      <section>
        <Search onLoadIngredients={filerIngredientsHandler} />
        <IngredientList
          ingredients={ingredients}
          onRemoveItem={removeIngredientHandler} />
      </section>
    </div>
  );
};

export default Ingredients;
