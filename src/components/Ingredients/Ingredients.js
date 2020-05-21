import React, { useCallback, useReducer } from 'react';

import IngredientForm from './IngredientForms/IngredientForm';
import Search from '../Search/Search';
import IngredientList from './IngredientList/IngredientList';
import ErrorModal from '../UI/ErrorModal/ErrorModal';

const SET = 'SET';
const ADD = 'ADD';
const DELETE = 'DELETE';

const SEND = 'SEND';
const RESPONSE = 'RESPONSE';
const ERROR = 'ERROR';
const CLEAR_ERROR = 'CLEAR_ERROR';

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

const httpReducer = (httpState, action) => {
  switch (action.type) {
    case SEND:
      return { ...httpState, loading: true, error: null };
    case RESPONSE:
      return { ...httpState, loading: false };
    case ERROR:
      return { ...httpState, loading: false, error: action.error };
    case CLEAR_ERROR:
      return { ...httpState, error: null };
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
  const [httpState, dispatchHttp] = useReducer(
    httpReducer,
    { loading: false, error: null },
    undefined
  );

  const filerIngredientsHandler = useCallback(filteredIngredients => {
    dispatchIngredients({ type: SET, ingredients: filteredIngredients });
  }, []);

  const addIngredientHandler = useCallback(ingredient => {
    dispatchHttp({ type: SEND });
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
      dispatchHttp({ type: RESPONSE });
      dispatchIngredients({
        type: ADD, ingredient: { id: responseJson.name, ...ingredient }
      });
    }).catch(setDefaultErrorMessage);
  }, []);

  const removeIngredientHandler = id => {
    dispatchHttp({ type: SEND });
    fetch(
      `https://react-hooks-b09bb.firebaseio.com/ingredients/${id}.json`,
      { method: 'DELETE' }
    ).then(() => {
      dispatchHttp({ type: RESPONSE });
      dispatchIngredients({ type: DELETE, id });
    }).catch(setDefaultErrorMessage);
  };

  const setDefaultErrorMessage = () => {
    dispatchHttp({ type: ERROR, error: 'An unexpected error occurred!' });
  };

  const clearErrorHandler = () => {
    dispatchHttp({ type: CLEAR_ERROR });
  };

  return (
    <div className="App">

      {httpState.error &&
      <ErrorModal onClose={clearErrorHandler}>{httpState.error}</ErrorModal>}

      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={httpState.loading} />
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
