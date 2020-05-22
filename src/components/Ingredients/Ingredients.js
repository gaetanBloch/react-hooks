import React, { useCallback, useEffect, useMemo, useReducer } from 'react';

import IngredientForm from './IngredientForms/IngredientForm';
import Search from '../Search/Search';
import IngredientList from './IngredientList/IngredientList';
import ErrorModal from '../UI/ErrorModal/ErrorModal';
import useHttp from '../../hooks/http';

const SET = 'SET';
const ADD = 'ADD';
const DELETE = 'DELETE';

const ADD_INGREDIENT = 'ADD_INGREDIENT';
const REMOVE_INGREDIENT = 'REMOVE_INGREDIENT';

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

  const { httpState, sendRequest, clearError } = useHttp();

  useEffect(() => {
    if (!httpState.loading && !httpState.error) {
      if (httpState.identifier === REMOVE_INGREDIENT) {
        dispatchIngredients({ type: DELETE, id: httpState.extra });
      } else if (httpState.identifier === ADD_INGREDIENT) {
        dispatchIngredients({
          type: ADD,
          ingredient: { id: httpState.data.name, ...httpState.extra }
        });
      }
    }
  }, [
    httpState.loading,
    httpState.error,
    httpState.identifier,
    httpState.extra,
    httpState.data
  ]);

  const filerIngredientsHandler = useCallback(filteredIngredients => {
    dispatchIngredients({ type: SET, ingredients: filteredIngredients });
  }, []);

  const addIngredientHandler = useCallback(ingredient => {
    sendRequest(
      'https://react-hooks-b09bb.firebaseio.com/ingredients.json',
      'POST',
      JSON.stringify(ingredient),
      ingredient,
      ADD_INGREDIENT
    );
  }, [sendRequest]);

  const removeIngredientHandler = useCallback(id => {
    sendRequest(
      `https://react-hooks-b09bb.firebaseio.com/ingredients/${id}.json`,
      'DELETE',
      null,
      id,
      REMOVE_INGREDIENT
    );
  }, [sendRequest]);

  const ingredientList = useMemo(() => {
    return <IngredientList
      ingredients={ingredients}
      onRemoveItem={removeIngredientHandler} />;
  }, [ingredients, removeIngredientHandler]);

  return (
    <div className="App">

      {
        httpState.error &&
        <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>
      }

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
