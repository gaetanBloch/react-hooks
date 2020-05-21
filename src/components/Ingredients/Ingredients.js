import React, { useCallback, useReducer, useState } from 'react';

import IngredientForm from './IngredientForms/IngredientForm';
import Search from '../Search/Search';
import IngredientList from './IngredientList/IngredientList';
import ErrorModal from '../UI/ErrorModal/ErrorModal';

const SET = 'SET';
const ADD = 'ADD';
const DELETE = 'DELETE';

const ingredientReducer = (ingredients, action) => {
  switch (action.type) {
    case SET:
      return action.ingredients;
    case ADD:
      return ingredients.concat(action.ingredient);
    case DELETE:
      return ingredients.filter(ingredient => ingredient.id !== action.id);
    default:
      throw new Error('Should never happen');
  }
};

const Ingredients = () => {

  const [ingredients, dispatch] = useReducer(ingredientReducer, [], undefined);

  // const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const filerIngredientsHandler = useCallback(filteredIngredients => {
    dispatch({ type: SET, ingredients: filteredIngredients });
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
      dispatch({
        type: ADD, ingredient: { id: responseJson.name, ...ingredient }
      });
    }).catch(setDefaultErrorMessage);
  };

  const removeIngredientHandler = id => {
    setLoading(true);
    fetch(
      `https://react-hooks-b09bb.firebaseio.com/ingredients/${id}.json`,
      { method: 'DELETE' }
    ).then(() => {
      setLoading(false);
      dispatch({ type: DELETE, id });
    }).catch(setDefaultErrorMessage);
  };

  const setDefaultErrorMessage = () => {
    setLoading(false);
    setError('An unexpected error occurred!');
  };

  const clearErrorHandler = () => {
    setError(null);
  };

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
