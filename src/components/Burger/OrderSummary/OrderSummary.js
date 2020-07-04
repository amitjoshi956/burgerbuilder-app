import React, { Component } from 'react'

import Aux from '../../../hoc/Aux/Aux'
import Button from '../../UI/Button/Button'

class OrderSummary extends Component {
    // componentWillUpdate() {
    //     console.log('[OrderSummary] will update')
    // }

    render() {
        const ingredientSummary = Object.keys(this.props.ingredients)
            .filter(igKey => this.props.ingredients[igKey] > 0)
            .map((igKey) => {
                return (
                    <li key={igKey}>
                        <span style={{ textTransform: 'capitalize' }}>{igKey}</span>: {this.props.ingredients[igKey]}
                    </li>)
            })
        return (
            <Aux>
                <h1>Your Order</h1>
                <p>A juicy-crispy burger packed with the following ingredients:</p>
                <ul>
                    {ingredientSummary}
                </ul>
                <strong>Total Price: {this.props.price.toFixed(2)}</strong>
                <p>Continue to checkout?</p>
                <Button btnType='Danger' clicked={this.props.purchaseCancelled}>CANCEL</Button>
                <Button btnType='Success' clicked={this.props.purchaseContinued}>CONTINUE</Button>
            </Aux>
        )
    }

}

export default OrderSummary