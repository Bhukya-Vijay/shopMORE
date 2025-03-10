import { configureStore } from '@reduxjs/toolkit'
import authReducer from './Slice/authSlice.js'
import productReducer from './Slice/productSlice.js'
import cartReducer from './Slice/CartSlice.js'
import checkoutReducer from './Slice/checkoutSlice.js'
import orderReducer from './Slice/orderSlice.js'
import adminReducer from './Slice/adminSlice.js'
import adminProductReducer from './Slice/adminProductSlice.js'
import adminOrdersReducer from './Slice/adminOrderSlice.js'


const store = configureStore({
    reducer: {
        auth: authReducer,
        products: productReducer,
        cart: cartReducer,
        checkout: checkoutReducer,
        orders: orderReducer,
        admin: adminReducer,
        adminProducts: adminProductReducer,
        adminOrders: adminOrdersReducer
    }
})

export default store