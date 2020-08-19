import React, { Component } from 'react'
import Button from '../../../components/UI/Button/Button'

import classes from './ContactData.css'
import axios from '../../../axios-orders'
import Spinner from '../../../components/UI/Spinner/Spinner'
import Input from '../../../components/UI/Input/Input'
import { connect } from 'react-redux'
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler'
import * as actions from '../../../store/actions/'

class ContactData extends Component {
    state = {
        orderForm: {
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Name'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 2
                },
                valid: false,
                touched: false,
            },
            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Street'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false,
            },
            zipcode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'ZIP Code'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 5,
                    maxLength: 6,
                },
                valid: false,
                touched: false,
            },
            country: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Country'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false,
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your e-mail'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false,
            },
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        { value: 'supreme', displayValue: 'Supreme' },
                        { value: 'fastest', displayValue: 'Fastest' },
                        { value: 'cheapest', displayValue: 'Cheapest' },
                    ]
                },
                value: 'fastest',
                validation: {},
                valid: true,
            }
        },
        isFormValid: false,
    }

    orderHandler = (event) => {
        event.preventDefault()
        // this.setState({ loading: true })
        const formData = {}
        for (let formElement in this.state.orderForm) {
            formData[formElement] = this.state.orderForm[formElement].value
        }
        const order = {
            ingredients: this.props.ings,
            price: this.props.price,
            orderData: formData,
        }
        this.props.onOrderBurger(this.props.token, order)
    }

    checkValidity(value, rules) {
        let isValid = true

        if (rules.required) isValid = isValid && value.trim() !== ''
        if (rules.minLength) isValid = isValid && value.length >= rules.minLength
        if (rules.maxLength) isValid = isValid && value.length <= rules.maxLength
        if (rules.isNumeric) isValid = isValid && (/^\d+$/).test(value)

        return isValid
    }

    inputChangedHandler = (event, inputIdentifer) => {
        const updatedOrderForm = { ...this.state.orderForm }
        const updatedFormEl = { ...updatedOrderForm[inputIdentifer] }
        updatedFormEl.value = event.target.value
        updatedFormEl.valid = this.checkValidity(updatedFormEl.value, updatedFormEl.validation)
        updatedFormEl.touched = true
        updatedOrderForm[inputIdentifer] = updatedFormEl

        let isFormValid = true
        for (let key in updatedOrderForm) {
            isFormValid = isFormValid && updatedOrderForm[key].valid
            if (!isFormValid) break
        }
        this.setState({ orderForm: updatedOrderForm, isFormValid })
    }

    render() {
        const formElements = []
        for (let key in this.state.orderForm) {
            formElements.push({
                id: key,
                config: this.state.orderForm[key]
            })
        }

        let form = (
            <form onSubmit={this.orderHandler}>
                {formElements.map(formElement => (
                    <Input
                        key={formElement.id}
                        elementType={formElement.config.elementType}
                        elementConfig={formElement.config.elementConfig}
                        value={formElement.config.value}
                        valid={formElement.config.valid}
                        shouldValidate={formElement.config.validation}
                        touched={formElement.config.touched}
                        changed={(event) => this.inputChangedHandler(event, formElement.id)} />
                ))}
                <Button disabled={!this.state.isFormValid} btnType='Success'>ORDER</Button>
            </form>
        )
        if (this.props.loading)
            form = <Spinner />

        return (
            <div className={classes.ContactData}>
                <h4>Enter contact details</h4>
                {form}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        loading: state.order.loading,
        token: state.auth.token,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onOrderBurger: (token, orderData) => dispatch(actions.purchaseBurger(token, orderData))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios))