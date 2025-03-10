import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { addUser, deleteUser, fetchUsers, updateUser, updateUserRole } from "../../Redux/Slice/adminSlice.js"


const UserManagement = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user } = useSelector((state) => state.auth)
    const { users, loading, error } = useSelector((state) => state.admin)

    useEffect(() => {
        if (user && user.role !== "admin") {
            navigate("/")
        } else {
            dispatch(fetchUsers())
        }
    }, [user, navigate, dispatch])


    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "customer", // Default role,
    })

    const handleFormInput = (e) => {
        setFormData({
            ...formData, [e.target.name]: e.target.value
        })
    }

    const handleFormSubmit = (e) => {
        e.preventDefault()
        dispatch(addUser(formData))
        // Reset the form after submiting
        setFormData({
            name: "",
            email: "",
            password: "",
            role: "customer",
        })
    }

    const handleRoleChange = (userId, newRole) => {
        dispatch(updateUserRole({ id: userId, role: newRole }))
    }

    const handleEditUser = (userId, newRole, newPassword, name, email) => {
        dispatch(updateUser({ id: userId, role: newRole, password: newPassword, name, email }))
    }

    const handleDeleteUser = (userId) => {
        if (window.confirm("Are you sure you want to delete this user")) {
            dispatch(deleteUser(userId))
        }
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">User Management</h2>
            {loading && <p>Loading......</p>}
            {error && <p>Error: {error}</p>}
            {/* Add New User Form */}
            <div className="p-6 rounded-lg mb-6">
                <h3 className="text-lg font-bold mb-4">Add New User</h3>
                <form onSubmit={handleFormSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleFormInput} className="w-full p-2 border-1 border-gray-200 rounded" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleFormInput} className="w-full p-2 border-1 border-gray-200 rounded" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleFormInput} className="w-full p-2 border-1 border-gray-200 rounded" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Role</label>
                        <select name="role" value={formData.role} onChange={handleFormInput} className="w-full p-2 border-1 border-gray-200 rounded">
                            <option value="customer">Customer</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button type="submit" className="bg-green-500 hover:bg-green-600 text-white rounded-md py-2 px-4">Add User</button>
                </form>
            </div>
            <div className="overflow-x-auto shadow-md sm:rounded-lg">
                <table className="min-w-full text-left text-gray-500 ">
                    <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                        <tr>
                            <th className="py-3 px-4">Name</th>
                            <th className="py-3 px-4">Email</th>
                            <th className="py-3 px-4">Role</th>
                            <th className="py-3 px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? (
                            users.map((user) => (
                                <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer">
                                    <td className="p-4 font-medium text-gray-900">{user.name}</td>
                                    <td className="p-4">{user.email}</td>
                                    <td className="p-4">
                                        <select name="role" value={user.role} onChange={(e) => handleRoleChange(user._id, e.target.value)} className="p-2 rounded border">
                                            <option value="customer">Customer</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                    <td className="p-4 flex gap-2">
                                        <Link to={`/admin/users/${user._id}/edit`}>
                                            <button onClick={() => handleEditUser(user._id)} className="bg-yellow-500 text-white px-2 py-2 rounded hover:bg-yellow-600">Edit</button>
                                        </Link>
                                        <button onClick={() => handleDeleteUser(user._id)} className="bg-red-500 text-white px-2 py-2 rounded hover:bg-red-600">Delete</button>
                                    </td>
                                </tr>
                            ))
                        ) : (<tr>
                            <td colSpan="4" className="text-center p-4">No users found</td>
                        </tr>)}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default UserManagement