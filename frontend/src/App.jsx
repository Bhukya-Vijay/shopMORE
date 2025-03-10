import { BrowserRouter, Route, Routes } from "react-router-dom"
import UserLayout from "./components/Layout/UserLayout.jsx"
import Home from "./pages/Home.jsx"
import { Toaster } from 'sonner'
import Login from "./pages/Login.jsx"
import Register from "./pages/Register.jsx"
import Profile from "./pages/Profile.jsx"
import CollectionPage from "./pages/CollectionPage.jsx"
import ProductDetails from "./components/Products/ProductDetails.jsx"
import Checkout from "./components/Cart/Checkout.jsx"
import OrderConformationPage from "./pages/OrderConformationPage.jsx"
import OrderDetails from "./pages/OrderDetails.jsx"
import MyOrders from "./pages/MyOrders.jsx"
import AdminLayout from "./components/Admin/AdminLayout.jsx"
import AdminHomePage from "./pages/AdminHomePage.jsx"
import UserManagement from "./components/Admin/UserManagement.jsx"
import ProductManagement from "./components/Admin/ProductManagement.jsx"
import EditProduct from "./components/Admin/EditProduct.jsx"
import OrderManagent from "./components/Admin/OrderManagent.jsx"

import { Provider } from 'react-redux'
import store from "./Redux/Store.js"
import ProtectedRoute from "./components/Common/ProtectedRoute.jsx"
import EditUser from "./components/Admin/EditUser.jsx"


const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<UserLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="profile" element={<Profile />} />
            <Route path="collections/:collection" element={<CollectionPage />} />
            <Route path="product/:id" element={<ProductDetails />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="order-confirmation" element={<OrderConformationPage />} />
            <Route path="order/:id" element={<OrderDetails />} />
            <Route path="my-orders" element={<MyOrders />} />
          </Route>
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminHomePage />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="products/:id/edit" element={<EditProduct />} />
            <Route path="users/:id/edit" element={<EditUser />} />
            <Route path="orders" element={<OrderManagent />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App
