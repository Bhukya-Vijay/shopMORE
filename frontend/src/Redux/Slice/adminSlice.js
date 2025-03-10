import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


// fetch all users (Admin only)
export const fetchUsers = createAsyncThunk("/admin/fetchUsers", async () => {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users`,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`
            }
        }
    )
    return response.data
})

// Add the create user action
export const addUser = createAsyncThunk("admin/addUser", async (userData, { rejectWithValue }) => {

    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users`, userData,
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

// Update user info (name, password, role)
export const updateUser = createAsyncThunk("/admin/updateUser", async ({ id, name, password, role }) => {
    const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`,
        { name, password, role },
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`
            }
        }
    );
    return response.data.user;
});

// Update the user Info
export const updateUserRole = createAsyncThunk("/admin/updateUserRole", async ({ id, name, email, role }, { rejectWithValue }) => {

    try {
        const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`,
            { name, email, role },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("userToken")}`
                }
            }
        )
        return response.data.user
    } catch (error) {
        console.error("updateUserRole error:", error.response?.data)
        return rejectWithValue(error.response?.data || "An error occurred")
    }

})

// Delete user
export const deleteUser = createAsyncThunk("admin/deleteUser", async (id) => {
    await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`
            }
        }
    )
    return id
})


const adminSlice = createSlice({
    name: "admin",
    initialState: {
        users: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true
                state.error = null
            }).addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false
                state.users = action.payload
            }).addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false
                console.log("fetchUsers error", action.payload)
                state.error = action.payload?.message || "An error occurred"
            })
            .addCase(updateUserRole.pending, (state) => {
                state.loading = true
                state.error = null
            }).addCase(updateUserRole.fulfilled, (state, action) => {
                state.loading = false
                const updatedUser = action.payload
                const userIndex = state.users.findIndex(
                    (user) => user._id === updatedUser._id
                )
                if (userIndex !== -1) {
                    state.users[userIndex] = updatedUser
                }
                state.error = null
            }).addCase(updateUserRole.rejected, (state, action) => {
                state.loading = false
                console.error("Error updating user role:", action.payload);
                state.error = action.payload?.message || "Failed to update user role";
            })
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            }).addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false;
                const updatedUser = action.payload;
                const userIndex = state.users.findIndex(
                    (user) => user._id === updatedUser._id
                );
                if (userIndex !== -1) {
                    state.users[userIndex] = updatedUser;
                }
            }).addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                // console.log("updateUser error", action.payload)
                state.error = action.payload?.message || "An error occurred";
            })
            .addCase(deleteUser.pending, (state) => {
                state.loading = true
                state.error = null
            }).addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false
                state.users = state.users.filter((user) => user._id !== action.payload)
                state.error = action.payload.message
            }).addCase(deleteUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload?.message || "An error occurred"
            })
            .addCase(addUser.pending, (state) => {
                state.loading = true
                state.error = null
            }).addCase(addUser.fulfilled, (state, action) => {
                state.loading = false
                state.users.push(action.payload.user) // add a new user to the state
                state.error = null
            }).addCase(addUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload?.message || "An error occurred"
            })
    }
})

export default adminSlice.reducer