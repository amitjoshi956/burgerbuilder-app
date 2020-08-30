import authReducer from './auth'
import * as actionTypes from '../actions/actionTypes'

describe('auth reducer', () => {
    it('should return the initial state for invalid state input', () => {
        expect(authReducer(undefined, {})).toEqual({
            token: null,
            userId: null,
            error: null,
            loading: false,
            authRedirectPath: '/',
        })
    })

    it('should return state with token and user id on login', () => {
        expect(authReducer(undefined, {
            type: actionTypes.AUTH_SUCCESS,
            userId: 'test-user-id',
            idToken: 'test-token',
        })).toEqual({
            token: 'test-token',
            userId: 'test-user-id',
            error: null,
            loading: false,
            authRedirectPath: '/',
        })
    })
})