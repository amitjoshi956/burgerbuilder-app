import React from 'react'
import classes from './Logo.css'

import burgerLogo from '../../../assets/images/burger-builder.png'

const logo = (props) => (
    <div className={classes.Logo}>
        <img src={burgerLogo} alt='BurgerBuilder' />
    </div>
)

export default logo