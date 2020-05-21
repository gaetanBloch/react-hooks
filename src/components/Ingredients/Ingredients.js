import React, { useCallback, useEffect, useState } from 'react';

import IngredientForm from './IngredientForms/IngredientForm';
import Search from '../Search/Search';
import IngredientList from './IngredientList/IngredientList';
import ErrorModal from '../UI/ErrorModal/ErrorModal';

const Ingredients = () => {

  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const filerIngredientsHandler = useCallback(filteredIngredients => {
    setIngredients(filteredIngredients);
  }, []);

  const addIngredientHandler = ingredient => {
    setLoading(true);
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
      setLoading(false);
      setIngredients(prevIngredients => prevIngredients.concat({
        id: responseJson.name,
        ...ingredient
      }));
    });
  };

  const removeIngredientHandler = id => {
    setLoading(true);
    fetch(
      `https://react-hooks-b09bb.firebaseio.com/ingredients/${id}.jon`,
      { method: 'DELETE' }
    ).then(() => {
      setLoading(false);
      setIngredients(preIngredients => preIngredients.filter(ingredient => {
        return ingredient.id !== id;
      }));
    }).catch(error => {
      setError(error.message);
    });
  };

  const clearErrorHandler = () => {
    setError(null);
  }

  return (
    <div className="App">

      {error && <ErrorModal onClose={clearErrorHandler}>{error}</ErrorModal>}

      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={loading} />
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
