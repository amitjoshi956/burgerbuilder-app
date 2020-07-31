import * as actionTypes from './actions'

const initialState = {
    ingredients: {
        'cheese': 0,
        'salad': 0,
        'patty': 0,
        'paneer-tikka': 0
    },
    totalPrice: 0,
}

const INGREDIENT_PRICES = {
    'salad': 18,
    'paneer-tikka': 30,
    'cheese': 15,
    'patty': 22
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ADD_INGREDIENT:
            return {
                ...state,
                ingredients: {
                    ...state.ingredients,
                    [action.ingredientName]: state.ingredients[action.ingredientName] + 1
                },
                totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingredientName]
            }
        case actionTypes.REMOVE_INGREDIENT:
            return {
                ...state,
                ingredients: {
                    ...state.ingredients,
                    [action.ingredientName]: state.ingredients[action.ingredientName] - 1
                },
                totalPrice: state.totalPrice - INGREDIENT_PRICES[action.ingredientName]
            }
        default:
            break;
    }

    return state
}

export default reducer