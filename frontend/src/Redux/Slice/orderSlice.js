import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


// Async Thunk to create Order
export const createOrder = createAsyncThunk("order/create", async (orderData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/orders`, orderData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                "Content-Type": "application/json"
            }
        })
        return response.data
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

// Async Thunk to fetch user Orders
export const fetchUserOrders = createAsyncThunk("orders/fetchUserOrders", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders/my-orders`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("userToken")}`
                }
            }
        )
        return response.data
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

// Async Thunk to fetch orders details by ID
export const fetchOrderDetails = createAsyncThunk("orders/fetchOrderDetails", async (orderId, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("userToken")}`
                }
            }
        )
        return response.data
    } catch (error) {
        rejectWithValue(error.response.data)
    }
})

const orderSlice = createSlice({
    name: "orders",
    initialState: {
        orders: [],
        totalOrders: 0,
        orderDetails: 0,
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch user orders
            .addCase(fetchUserOrders.pending, (state) => {
                state.loading = true
                state.error = null
            }).addCase(fetchUserOrders.fulfilled, (state, action) => {
                state.loading = false
                state.orders = action.payload
            }).addCase(fetchUserOrders.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload.message
            })
            // Fetch order details
            .addCase(fetchOrderDetails.pending, (state) => {
                state.loading = true
                state.error = null
            }).addCase(fetchOrderDetails.fulfilled, (state, action) => {
                state.loading = false
                state.orderDetails = action.payload
            }).addCase(fetchOrderDetails.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload.message
            })
    }
})

export default orderSlice.reducer