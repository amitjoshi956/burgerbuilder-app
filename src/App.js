import React, { Suspense, useEffect } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux'

import Layout from './hoc/Layout/Layout'
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder'
import Logout from './containers/Auth/Logout/Logout'
import * as actions from './store/actions'

import lazyLoad from './utils/asyncImport'
const Checkout = lazyLoad('containers/CheckOut/CheckOut')
const Orders = lazyLoad('containers/Orders/Orders')
const Auth = lazyLoad('containers/Auth/Auth')

const App = props => {

  useEffect(() =>
    props.onTryAutoSignup(), [])

  // use this function to render a provided component
  const renderComponent = (CustomComponent) => () => <CustomComponent />

  let routes = (
    <Switch>
      <Route path='/auth' render={renderComponent(Auth)} />
      <Route path='/' component={BurgerBuilder} />
      <Redirect to='/' />
    </Switch>
  )

  if (props.isAuthenticated) {
    routes = (
      <Switch>
        <Route path='/checkout' render={renderComponent(Checkout)} />
        <Route path='/orders' component={renderComponent(Orders)} />
        <Route path='/logout' component={Logout} />
        <Route path='/auth' component={renderComponent(Auth)} />
        <Route path='/' component={BurgerBuilder} />
        <Redirect to='/' />
      </Switch>
    )
  }

  return (
    <div>
      <Layout>
        <Suspense fallback={<p>Loading...</p>}>
          {routes}
        </Suspense>
      </Layout>
    </div>
  );

}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState())
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App))