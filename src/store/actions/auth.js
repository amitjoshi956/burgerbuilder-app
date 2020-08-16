import * as actionTypes from './actionTypes'
import axios from 'axios'

const errorMap = {
    'EMAIL_EXISTS': 'This email address is already in use by another account',
    'OPERATION_NOT_ALLOWED': 'Password sign-in is disabled for this project',
    'TOO_MANY_ATTEMPTS_TRY_LATER': 'We have blocked all requests from this device due to unusual activity. Try again later',
    'EMAIL_NOT_FOUND': 'There is no user record corresponding to this identifier. The user may have been deleted',
    'INVALID_PASSWORD': 'Password is invalid or the user does not have a password',
    'USER_DISABLED': 'The user account has been disabled by an administrator',
    'MISSING_PASSWORD': 'Please enter the password',
    'INVALID_EMAIL': 'Please enter the email',
}

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START,
    }
}

export const authSuccess = (idToken, userId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        idToken,
        userId,
    }
}

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error
    }
}

export const auth = (email, password, isSignUp) => {
    return dispatch => {
        dispatch(authStart())
        const authData = {
            email,
            password,
            returnSecureToken: true,
        }
        let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAMX6GbOiWTnJsHDNS_ENMnO-7Ig4GY_7I'
        if (!isSignUp)
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAMX6GbOiWTnJsHDNS_ENMnO-7Ig4GY_7I'
        axios.post(url, authData)
            .then(response => {
                console.log(response)
                dispatch(authSuccess(response.data.idToken, response.data.localId))
            })
            .catch(error => {
                dispatch(authFail(errorMap[error.response.data.error.message]))
            })
    }
}