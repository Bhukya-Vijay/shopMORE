import { useEffect, useState } from "react"
import Hero from "../components/Layout/Hero"
import FeaturedCollections from "../components/Products/FeaturedCollections"
import Features from "../components/Products/Features"
import GenderCollectionSection from "../components/Products/GenderCollectionSection"
import NewArrivals from "../components/Products/NewArrivals"
import ProductDetails from "../components/Products/ProductDetails"
import ProductGrid from "../components/Products/ProductGrid"
import { useDispatch, useSelector } from 'react-redux'
import { fetchProductsByFilters } from "../Redux/Slice/productSlice"
import axios from "axios"

function Home() {
  const dispatch = useDispatch()
  const { products, loading, error } = useSelector((state) => state.products)
  const [bestSellerProduct, setBestSellerProduct] = useState(null)

  useEffect(() => {
    // Fetch products for a specific collection
    dispatch(
      fetchProductsByFilters({
        gender: "Women",
        category: "Bottom Wear",
        limit: 8
      })
    )

    // Fetch Best seller product  
    const fetchBestSeller = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`)
        // console.log(response.data.bestSeller)
        setBestSellerProduct(response.data.bestSeller)

      } catch (error) {
        console.error(error)
      }
    }
    fetchBestSeller()
  }, [dispatch])

  // console.log("products from home", products)

  return (
    <div className="border-b border-gray-300">
      <Hero />
      <GenderCollectionSection />
      <NewArrivals />
      {/* Best Sellers */}
      <h2 className="text-3xl text-center font-bold mb-4 mt-4">Best Seller</h2>
      {bestSellerProduct ? (<ProductDetails productId={bestSellerProduct._id} />) :
        (<p className="text-center">Loading best seller product.....</p>)
      }


      <div className="container mx-auto mb-5">
        <h2 className="text-3xl text-center font-bold mb-4">
          Top Wears for Women
        </h2>
        <ProductGrid products={products} loading={loading} error={error} />
      </div>
      <FeaturedCollections />
      <Features />
    </div >
  )
}

export default Home