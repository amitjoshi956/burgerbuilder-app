import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import classes from './Auth.css'

import Input from '../../components/UI/Input/Input'
import Button from '../../components/UI/Button/Button'
import Spinner from '../../components/UI/Spinner/Spinner'
import * as actions from '../../store/actions'
import { updateObject, checkValidity } from '../../utils/utility'

const Auth = props => {
    const [authForm, setAuthForm] = useState({
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
    })
    const [isSignUp, setIsSignUp] = useState(true)

    const inputChangedHandler = (event, controlName) => {
        const updatedControls = updateObject(authForm, {
            [controlName]: updateObject(authForm[controlName], {
                value: event.target.value,
                valid: checkValidity(event.target.value, authForm[controlName].validation),
                touched: true,
            }),
        })
        setAuthForm(updatedControls)
    }

    const submitHandler = (event) => {
        event.preventDefault()
        props.onAuth(authForm.email.value, authForm.password.value, isSignUp)
    }

    const switchAuthModeHandler = () => setIsSignUp(prevIsSignUp => !prevIsSignUp)

    // component did mount
    useEffect(() => {
        if (!props.isBuildingBurger && props.authRedirectPath !== '/')
            props.onSetAuthRedirectPath()
    }, [])

    const formElements = []
    for (let key in authForm) {
        formElements.push({
            id: key,
            config: authForm[key]
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
                changed={(event) => inputChangedHandler(event, formElement.id)} />
        ))
    )
    if (props.loading) form = <Spinner />

    let error = null
    if (props.error)
        error = <p style={{ color: 'darkred' }}>{props.error}</p>

    let authRedirect = null
    if (props.isAuthenticated)
        authRedirect = <Redirect to={props.authRedirectPath} />

    return (
        <div className={classes.Auth}>
            {authRedirect}
            {error}
            <form onSubmit={event => submitHandler(event)}>
                {form}
                <Button btnType='Success'>Submit</Button>
            </form>
            <Button
                clicked={switchAuthModeHandler}
                btnType='Danger'>
                {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
            </Button>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token !== null,
        isBuildingBurger: state.burgerBuilder.building,
        authRedirectPath: state.auth.authRedirectPath,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password, isSignUp) => dispatch(actions.auth(email, password, isSignUp)),
        onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth)