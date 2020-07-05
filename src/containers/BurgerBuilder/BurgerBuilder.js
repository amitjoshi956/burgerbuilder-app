import React, { Component } from 'react'
import Aux from '../../hoc/Aux/Aux'
import Burger from '../../components/Burger/Burger'
import BuildContols from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import Spinner from "../../components/UI/Spinner/Spinner";
import axios from '../../axios-orders'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'

const INGREDIENT_PRICES = {
    'salad': 18,
    'paneer-tikka': 30,
    'cheese': 15,
    'patty': 22
}

class BurgerBuilder extends Component {
    state = {
        ingredients: null,
        totalPrice: 0,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false,
    }

    updatePurchaseState(ingredients) {
        const sum = Object.values({ ...ingredients })
            .reduce((sum, qt) => {
                return sum + qt
            }, 0)
        this.setState({ purchasable: sum > 0 })
    }

    purchaseHandler = () => {
        this.setState({ purchasing: true })
    }

    purchaseCancelHandler = () => {
        this.setState({ purchasing: false })
    }

    purchaseContinueHandler = () => {
        let queryString = ''
        for (let i in this.state.ingredients) {
            if (this.state.ingredients[i] > 0)
                queryString += encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]) + '&'
        }
        queryString += 'price=' + this.state.totalPrice
        this.props.history.push({
            pathname: '/checkout',
            search: '?' + queryString,
        })
    }

    componentDidMount() {
        axios.get('https://burger-builder-956.firebaseio.com/ingredients.json')
            .then(res => {
                this.setState({ ingredients: res.data })
            })
            .catch(error => {
                this.setState({ error: true })
            })
    }

    addIngredientHandler = (type) => {
        const updatedCount = this.state.ingredients[type] + 1
        const updatedIngredients = {
            ...this.state.ingredients
        }
        updatedIngredients[type] = updatedCount
        const newPrice = this.state.totalPrice + INGREDIENT_PRICES[type]
        this.setState({ totalPrice: newPrice, ingredients: updatedIngredients })
        this.updatePurchaseState(updatedIngredients)
    }

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type]
        if (oldCount <= 0) return
        const updatedCount = oldCount - 1
        const updatedIngredients = {
            ...this.state.ingredients
        }
        updatedIngredients[type] = updatedCount
        const newPrice = this.state.totalPrice - INGREDIENT_PRICES[type]
        this.setState({ totalPrice: newPrice, ingredients: updatedIngredients })
        this.updatePurchaseState(updatedIngredients)
    }

    render() {
        const disabledInfo = {
            ...this.state.ingredients
        }
        for (const key in disabledInfo)
            disabledInfo[key] = disabledInfo[key] <= 0

        let orderSummary = null
        let burger = this.state.error ? <p>Ingredients cannot be loaded!</p> : <Spinner />

        if (this.state.ingredients) {
            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients} />
                    <BuildContols
                        ingredientAdded={this.addIngredientHandler}
                        ingredientRemoved={this.removeIngredientHandler}
                        disabled={disabledInfo}
                        price={this.state.totalPrice}
                        purchasable={this.state.purchasable}
                        ordered={this.purchaseHandler} />
                </Aux>
            )
            orderSummary = (
                <OrderSummary
                    ingredients={this.state.ingredients}
                    price={this.state.totalPrice}
                    purchaseCancelled={this.purchaseCancelHandler}
                    purchaseContinued={this.purchaseContinueHandler} />
            )
        }

        if (this.state.loading) {
            orderSummary = <Spinner />
        }

        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        )
    }
}

export default withErrorHandler(BurgerBuilder, axios)