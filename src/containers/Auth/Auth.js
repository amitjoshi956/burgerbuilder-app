import React, { Component } from 'react'
import classes from './Auth.css'

import Input from '../../components/UI/Input/Input'
import Button from '../../components/UI/Button/Button'
import Spinner from '../../components/UI/Spinner/Spinner'

import * as actions from '../../store/actions'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

class Auth extends Component {
    state = {
        controls: {
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'email id'
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true,
                },
                valid: false,
                touched: false,
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Password'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 6,
                },
                valid: false,
                touched: false,
            },
        },
        isSignUp: true,
    }

    checkValidity(value, rules) {
        let isValid = true

        if (rules.required) isValid = isValid && value.trim() !== ''
        if (rules.minLength) isValid = isValid && value.length >= rules.minLength
        if (rules.maxLength) isValid = isValid && value.length <= rules.maxLength
        if (rules.isNumeric) {
            const pattern = /^\d+$/
            isValid = isValid && pattern.test(value)
        }
        if (rules.isEmail) {
            const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.]+\.[a-zA-Z]{2,4}$/
            isValid = isValid && pattern.test(value)
        }

        return isValid
    }

    inputChangedHandler = (event, controlName) => {
        const updatedControls = {
            ...this.state.controls,
            [controlName]: {
                ...this.state.controls[controlName],
                value: event.target.value,
                valid: this.checkValidity(event.target.value, this.state.controls[controlName].validation),
                touched: true,
            },
        }
        this.setState({ controls: updatedControls })
    }

    submitHandler = (event) => {
        event.preventDefault()
        this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.isSignUp)
    }

    switchAuthModeHandler = () => {
        this.setState(prevState => {
            return { isSignUp: !prevState.isSignUp }
        })
    }

    render() {
        const formElements = []
        for (let key in this.state.controls) {
            formElements.push({
                id: key,
                config: this.state.controls[key]
            })
        }

        let form = (
            formElements.map(formElement => (
                <Input
                    key={formElement.id}
                    elementType={formElement.config.elementType}
                    elementConfig={formElement.config.elementConfig}
                    value={formElement.config.value}
                    valid={formElement.config.valid}
                    shouldValidate={formElement.config.validation}
                    touched={formElement.config.touched}
                    changed={(event) => this.inputChangedHandler(event, formElement.id)} />
            ))
        )
        if (this.props.loading) form = <Spinner />

        let error = null
        if (this.props.error)
            error = <p style={{ color: 'darkred' }}>{this.props.error}</p>

        let authRedirect = null
        if (this.props.isAuthenticated)
            authRedirect = <Redirect to='/' />

        return (
            <div className={classes.Auth}>
                {authRedirect}
                {error}
                <form onSubmit={event => this.submitHandler(event)}>
                    {form}
                    <Button btnType='Success'>Submit</Button>
                </form>
                <Button
                    clicked={this.switchAuthModeHandler}
                    btnType='Danger'>
                    {this.state.isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
                </Button>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token !== null,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password, isSignUp) => dispatch(actions.auth(email, password, isSignUp))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth)