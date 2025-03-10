import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { fetchUsers, updateUser } from "../../Redux/Slice/adminSlice"


const EditUser = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const { users, loading, error } = useSelector((state) => state.admin);
    const { user } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "customer",
    });

    useEffect(() => {
        if (user && user.role !== "admin") {
            navigate("/");
        } else {
            dispatch(fetchUsers());
        }
    }, [user, navigate, dispatch]);

    useEffect(() => {
        if (id && users.length > 0) {
            const selectedUser = users.find((u) => u._id === id);
            if (selectedUser) {
                setFormData({
                    name: selectedUser.name,
                    email: selectedUser.email,
                    password: "", // Keep password empty for security
                    role: selectedUser.role,
                });
            }
        }
    }, [id, users]);

    const handleFormInput = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        dispatch(updateUser({ id, name: formData.name, role: formData.role, password: formData.password }))
            .then(() => navigate("/admin/users"));
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Edit User</h2>
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}
            <form onSubmit={handleFormSubmit} className="p-6 bg-white rounded-lg shadow-md">
                <div className="mb-4">
                    <label className="block text-gray-700">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleFormInput}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        disabled
                        className="w-full p-2 border border-gray-300 bg-gray-100 rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">New Password (Optional)</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleFormInput}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Role</label>
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleFormInput}
                        className="w-full p-2 border border-gray-300 rounded"
                    >
                        <option value="customer">Customer</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-md py-2 px-4"
                >
                    Update User
                </button>
            </form>
        </div>
    );
};

export default EditUser;
