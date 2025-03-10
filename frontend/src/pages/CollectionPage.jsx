import { useEffect, useRef, useState } from "react"
import { FaFilter } from 'react-icons/fa'
import FilterSidebar from "../components/Products/FilterSidebar"
import SortOptions from "../components/Products/SortOptions"
import ProductGrid from "../components/Products/ProductGrid"
import { useParams, useSearchParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { fetchProductsByFilters } from "../Redux/Slice/productSlice.js"


function CollectionPage() {

    const { collection } = useParams()
    const [searchParams] = useSearchParams()
    const dispatch = useDispatch()
    const { products, loading, error } = useSelector((state) => state.products)
    const queryParams = Object.fromEntries([...searchParams])

    const sideBarRef = useRef(null)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    const searchTerm = searchParams.get("search") || ""

    useEffect(() => {
        dispatch(fetchProductsByFilters({ collection, ...queryParams }))
    }, [dispatch, collection, queryParams])

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen)
    }

    const handleClickOutside = (e) => {
        // Close sidebar if clicked outside
        if (sideBarRef.current && !sideBarRef.current.contains(e.target)) {
            setIsSidebarOpen(false)
        }

    }

    useEffect(() => {
        // Add Event listener for clicks
        document.addEventListener("mousedown", handleClickOutside)
        //  Clean Event listener
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    // console.log("query products", products)


    return (
        <div className="flex flex-col lg:flex-row">
            {/* Mobile Filter Button */}
            <button onClick={toggleSidebar} className="lg:hidden border p-2 flex justify-center items-center">
                <FaFilter className="mr-2" /> Filters
            </button>

            {/* Filter Sidebar */}
            <div ref={sideBarRef} className={`${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 z-50 left-0 w-64 bg-white overflow-y-auto transition-transform duration-300 lg:static lg:translate-x-0`}>
                <FilterSidebar />
            </div>
            <div className="flex-grow p-4">
                <h2 className="text-2xl uppercase mb-4">All Collection</h2>

                {/* Sort Options */}
                <SortOptions />

                {/* Product Grid */}
                <ProductGrid products={products} loading={loading} error={error} searchTerm={searchTerm} />
            </div>
        </div>
    )
}

export default CollectionPage
