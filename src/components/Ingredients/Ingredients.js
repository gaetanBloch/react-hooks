import React, { useCallback, useEffect, useMemo, useReducer } from 'react';

import IngredientForm from './IngredientForms/IngredientForm';
import Search from '../Search/Search';
import IngredientList from './IngredientList/IngredientList';
import ErrorModal from '../UI/ErrorModal/ErrorModal';
import useHttp from '../../hooks/http';

const SET = 'SET';
const ADD = 'ADD';
const DELETE = 'DELETE';

const ingredientReducer = (ingredientsState, action) => {
  switch (action.type) {
    case SET:
      return action.ingredients;
    case ADD:
      return ingredientsState.concat(action.ingredient);
    case DELETE:
      return ingredientsState.filter(ingredient => ingredient.id !== action.id);
    default:
      throw new Error('Should never happen!');
  }
};

const Ingredients = () => {

  const [ingredients, dispatchIngredients] = useReducer(
    ingredientReducer,
    [],
    undefined
  );

  const { httpState, sendRequest } = useHttp();

  useEffect(() => {
    dispatchIngredients({type: 'DELETE', id: httpState.extra})
  }, [httpState.data, httpState.extra])

  const filerIngredientsHandler = useCallback(filteredIngredients => {
    dispatchIngredients({ type: SET, ingredients: filteredIngredients });
  }, []);

  const addIngredientHandler = useCallback(ingredient => {
    // dispatchHttp({ type: SEND });
    // fetch(
    //   'https://react-hooks-b09bb.firebaseio.com/ingredients.json',
    //   {
    //     method: 'POST',
    //     body: JSON.stringify(ingredient),
    //     header: { 'Content-Type': 'application/json' }
    //   }
    // ).then(response => {
    //   return response.json();
    // }).then(responseJson => {
    //   dispatchHttp({ type: RESPONSE });
    //   dispatchIngredients({
    //     type: ADD, ingredient: { id: responseJson.name, ...ingredient }
    //   });
    // }).catch(setDefaultErrorMessage);
  }, []);

  const removeIngredientHandler = useCallback(id => {
    // dispatchHttp({ type: SEND });
    // fetch(
    //   `https://react-hooks-b09bb.firebaseio.com/ingredients/${id}.json`,
    //   { method: 'DELETE' }
    // ).then(() => {
    //   dispatchHttp({ type: RESPONSE });
    //   dispatchIngredients({ type: DELETE, id });
    // }).catch(setDefaultErrorMessage);
    sendRequest(
      `https://react-hooks-b09bb.firebaseio.com/ingredients/${id}.json`,
      'DELETE',
      null,
      id
    );
  }, [sendRequest]);

  const setDefaultErrorMessage = () => {
    // dispatchHttp({ type: ERROR, error: 'An unexpected error occurred!' });
  };

  const clearErrorHandler = useCallback(() => {
    // dispatchHttp({ type: CLEAR_ERROR });
  }, []);

  const ingredientList = useMemo(() => {
    return <IngredientList
      ingredients={ingredients}
      onRemoveItem={removeIngredientHandler} />;
  }, [ingredients, removeIngredientHandler]);

  return (
    <div className="App">

      {httpState.error &&
      <ErrorModal onClose={clearErrorHandler}>{httpState.error}</ErrorModal>}

      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={httpState.loading} />
      <section>
        <Search onLoadIngredients={filerIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
};

export default Ingredients;
