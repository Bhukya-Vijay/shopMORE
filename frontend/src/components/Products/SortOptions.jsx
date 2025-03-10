import { useSearchParams } from "react-router-dom"


function SortOptions() {
    const [searchParams, setSearchParams] = useSearchParams()

    const handleSort = (e) => {
        const sortBy = e.target.value
        searchParams.set("sortBy", sortBy)
        setSearchParams(searchParams)
    }
    return (
        <div className="mb-4 flex items-center justify-end">
            <select id="sort" value={searchParams.get("sortBy") || ""} onChange={handleSort} className="border-1 border-gray-200 p-2 rounded-md focus:outline-none">
                <option value="">Default</option>
                <option value="PriceAsc">Price: Low to High</option>
                <option value="PriceDesc">Price: High to Low</option>
                <option value="Popularity">Popularity</option>
            </select>
        </div>
    )
}

export default SortOptions