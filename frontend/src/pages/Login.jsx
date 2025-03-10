import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import login from '../assets/login.webp'
import { loginUser } from '../Redux/Slice/authSlice.js'
import { useDispatch, useSelector } from "react-redux"
import { mergeCart } from "../Redux/Slice/CartSlice.js"


function Login() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { user, guestId, loading } = useSelector((state) => state.auth)
  const { cart } = useSelector((state) => state.cart)

  // Get redirect parameter and check if its's checkout or something
  const redirect = new URLSearchParams(location.search).get("redirect") || "/"
  const isCheckoutRedirect = redirect.includes("checkout")

  useEffect(() => {
    if (user) {
      if (cart?.products.length > 0 && guestId) {
        dispatch(mergeCart({ guestId, user })).then(() => {
          navigate(isCheckoutRedirect ? "/checkout" : "/")
        })
      } else {
        navigate(isCheckoutRedirect ? "/checkout" : "/")
      }
    }
  }, [user, guestId, cart, navigate, isCheckoutRedirect, dispatch])

  const handleLogin = (e) => {
    e.preventDefault()
    dispatch(loginUser({ email, password }))
  }

  return (
    <div className="flex">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12">
        <form onSubmit={handleLogin} className="w-full max-w-md bg-white p-8 rounded-lg border-1 border-gray-300 shadow-sm">
          <div className="flex justify-center mb-6">
            <h2 className="text-xl font-medium">shopMORE</h2>
          </div>
          <h2 className="text-2xl font-bold text-center mb-6">Hey there!</h2>
          <p className="text-center mb-6">Enter your Username and Password to Login</p>
          <div className="mb-4">
            <label htmlFor="EMAIL" className="block text-sm font-semibold mb-2">Email</label>
            <input id="EMAIL" type="email" value={email} className="w-full p-2 border-1 border-gray-300 rounded" placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="mb-4">
            <label htmlFor="PASSWORD" className="block text-sm font-semibold mb-2">Password</label>
            <input id="PASSWORD" type="password" value={password} className="w-full p-2 border-1 border-gray-300 rounded" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="w-full bg-black text-white p-2 rounded-lg font-semibold hover:bg-gray-800 transition">
            {loading ? "Loading......" : "Sign In"}
          </button>
          <p className="mt-6 text-center text-sm">Don&apos;t have an account? {" "}
            <Link to={`/register?redirect=${encodeURIComponent(redirect)}`} className="text-blue-500">Register</Link>
          </p>
        </form>
      </div>
      <div className="hidden md:block w-1/2 bg-gray-800">
        <div className="h-full flex flex-col justify-center items-center">
          <img src={login} alt="Login to Account" className="h-[750px] w-full object-cover" />
        </div>
      </div>
    </div>
  )
}

export default Login