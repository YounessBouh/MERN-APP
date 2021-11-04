import React from 'react'
import {Switch,Route} from 'react-router-dom'
import ProductDetails from './productDetails/ProductDetails'
import Products from './products/Products'
import Navbar from './navbar/Navbar'

function Pages() {
    return (
        <div>
        <Navbar />
        <Switch>
           
         <Route path='/' exact component={Products} />
         <Route path='/Details/:id' exact component={ProductDetails} />

        </Switch>
            
        </div>
    )
}

export default Pages
