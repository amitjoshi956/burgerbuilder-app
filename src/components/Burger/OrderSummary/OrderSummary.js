import React from 'react'

import Aux from '../../../hoc/Aux/Aux'
import Button from '../../UI/Button/Button'

const OrderSummary = props => {
    const ingredientSummary = Object.keys(props.ingredients)
        .filter(igKey => props.ingredients[igKey] > 0)
        .map((igKey) => {
            return (
                <li key={igKey}>
                    <span style={{ textTransform: 'capitalize' }}>{igKey}</span>: {props.ingredients[igKey]}
                </li>)
        })
    return (
        <Aux>
            <h1>Your Order</h1>
            <p>A juicy-crispy burger packed with the following ingredients:</p>
            <ul>
                {ingredientSummary}
            </ul>
            <strong>Total Price: {props.price.toFixed(2)}</strong>
            <p>Continue to checkout?</p>
            <Button btnType='Danger' clicked={props.purchaseCancelled}>CANCEL</Button>
            <Button btnType='Success' clicked={props.purchaseContinued}>CONTINUE</Button>
        </Aux>
    )
}

export default OrderSummary