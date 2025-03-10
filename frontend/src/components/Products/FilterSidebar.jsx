import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"


function FilterSidebar() {
    const [searchParams, setSearchParams] = useSearchParams()
    const navigate = useNavigate()
    const [filters, setFilters] = useState({
        category: "",
        gender: "",
        color: "",
        size: [],
        material: [],
        brand: [],
        minPrice: 10,
        maxPrice: 500,
    })

    const [priceRange, setPriceRange] = useState([10, 500])

    const categories = ["Top Wear", "Bottom Wear"]

    const colors = [
        "Red", "Blue", "Black", "Green", "Yellow", "Gray", "White", "Pink", "Beige", "Navy",
    ]

    const sizes = ["XS", "S", "M", "L", "XL", "XXL",]

    const materials = ["Cotton", "Wool", "Denim", "Polyster", "Silk", "Linen", "Viscose", "Fleece",]

    const brands = ["Urban Threads", "Modern Fit", "Street Style", "Beach Breeze", "Fashionista", "ChicStyle",]

    const gender = ["Men", "Women"]

    useEffect(() => {
        const params = Object.fromEntries([...searchParams])

        setFilters({
            category: params.category || "",
            gender: params.gender || "",
            color: params.color || "",
            size: params.size?.split(",") || [],
            material: params.material?.split(",") || [],
            brand: params.brand?.split(",") || [],
            minPrice: params.minPrice?.split(",") || 10,
            maxPrice: params.maxPrice?.split(",") || 500,
        })
        setPriceRange([10, params.maxPrice || 500])
    }, [searchParams])

    const handleFilterChange = (e) => {
        const { name, value, checked, type } = e.target;
        let newFilters = { ...filters };

        if (name === "color") {
            // Toggle color selection
            newFilters.color = newFilters.color === value ? "" : value;
        } else if (type === "checkbox") {
            if (checked) {
                newFilters[name] = [...(newFilters[name] || []), value];
            } else {
                newFilters[name] = newFilters[name].filter((item) => item !== value);
            }
        } else {
            newFilters[name] = value;
        }

        setFilters(newFilters);
        UpdateURLParams(newFilters);
    };

    const UpdateURLParams = (newFilters) => {
        const params = new URLSearchParams()
        Object.keys(newFilters).forEach((key) => {
            if (Array.isArray(newFilters[key]) && newFilters[key].length > 0) {
                params.append(key, newFilters[key].join(","))
            } else if (newFilters[key]) {
                params.append(key, newFilters[key])
            }
        })
        setSearchParams(params)
        navigate(`?${params.toString()}`)
    }

    const handlePriceRange = (e) => {
        const newPrice = e.target.value
        setPriceRange([10, newPrice])
        const newFilters = { ...filters, minPrice: 10, maxPrice: newPrice }
        setFilters(filters)
        UpdateURLParams(newFilters)
    }

    return (
        <div className="p-4">
            <h3 className="text-xl font-medium text-gray-800 mb-4">Filter</h3>
            {/* Category Filter */}
            <div className="mb-6">
                <label className="block text-gray-600 font-medium mb-2">Category</label>
                {categories.map((category) => (
                    <div key={category} className="flex items-center mb-1">
                        <input type="radio" name="category" value={category} onChange={handleFilterChange}
                            checked={filters.category === category} className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300" />
                        <span className="text-gray-700">{category}</span>
                    </div>
                ))}
            </div>

            {/* Gender Filter */}
            <div className="mb-6">
                <label className="block text-gray-600 font-medium mb-2">Gender</label>
                {gender.map((gender) => (
                    <div key={gender} className="flex items-center mb-1">
                        <input type="radio" name="gender" value={gender} onChange={handleFilterChange}
                            checked={filters.gender === gender} className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300" />
                        <span className="text-gray-700">{gender}</span>
                    </div>
                ))}
            </div>

            {/* Color Filter */}
            <div className="mb-6">
                <label className="block text-gray-600 font-medium mb-2">Color</label>
                <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                        <button key={color} name="color" value={color} onClick={() => handleFilterChange({ target: { name: "color", value: color } })} className={`w-8 h-8 rounded-full border border-gray-300 cursor-pointer transitn hover:scale-105 ${filters.color === color ? "ring-2 ring-blue-200" : ""}`} style={{ backgroundColor: color.toLowerCase() }}>

                        </button>

                    ))}
                </div>
            </div>

            {/* Size Filter */}
            <div className="mb-6">
                <label className="block text-gray-600 font-medium mb-2">Size</label>
                {sizes.map((size) => (
                    <div key={size} className="flex items-center mb-1">
                        <input type="checkbox" name="size" value={size} onChange={handleFilterChange}
                            checked={filters.size.includes(size)} className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300" />
                        <span className="text-gray-700">{size}</span>
                    </div>

                ))}
            </div>

            {/* Material Filter */}
            <div className="mb-6">
                <label className="block text-gray-600 font-medium mb-2">Material</label>
                {materials.map((material) => (
                    <div key={material} className="flex items-center mb-1">
                        <input type="checkbox" name="material" value={material} onChange={handleFilterChange}
                            checked={filters.material.includes(material)} className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300" />
                        <span className="text-gray-700">{material}</span>
                    </div>

                ))}
            </div>

            {/* Brand Filter */}
            <div className="mb-6">
                <label className="block text-gray-600 font-medium mb-2">Brand</label>
                {brands.map((brand) => (
                    <div key={brand} className="flex items-center mb-1">
                        <input type="checkbox" name="brand" value={brand} onChange={handleFilterChange}
                            checked={filters.brand.includes(brand)} className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300" />
                        <span className="text-gray-700">{brand}</span>
                    </div>
                ))}
            </div>

            {/* Price range Filter */}
            <div className="mb-8">
                <label className="block text-gray-600 font-medium mb-2">Price Range</label>
                <input type="range" name="PriceRange" value={priceRange[1]} onChange={handlePriceRange} min={10} max={500} className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer" />
                <div className="flex justify-between text-gray-600 mt-2">
                    <span>$10</span>
                    <span>${priceRange[1]}</span>
                </div>
            </div>
        </div>
    )
}

export default FilterSidebar