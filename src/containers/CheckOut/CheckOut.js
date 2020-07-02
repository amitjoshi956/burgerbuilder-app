import React, { Component } from 'react'
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary'

class CheckOut extends Component {
    state = {
        ingredients: {
            'cheese': 1,
            'paneer-tikka': 1,
            'patty': 1,
            'salad': 1,
        }
    }

    render() {
        return (
            <div>
                <CheckoutSummary ingredients={this.state.ingredients} />
            </div>
        )
    }
}

export default CheckOut