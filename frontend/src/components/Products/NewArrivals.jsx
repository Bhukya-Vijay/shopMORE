import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";

function NewArrivals() {
    const scrollRef = useRef(null);
    const [isAtStart, setIsAtStart] = useState(true);
    const [isAtEnd, setIsAtEnd] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [newArrivals, setNewArrivals] = useState([]);

    useEffect(() => {
        const fetchNewArrivals = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`);
                setNewArrivals(response.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchNewArrivals();
    }, []);

    // Function to check scroll position dynamically
    const checkScrollPosition = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setIsAtStart(scrollLeft <= 0);
            setIsAtEnd(scrollLeft + clientWidth >= scrollWidth);
        }
    };

    // Scroll left and right
    const handleScrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -scrollRef.current.offsetWidth, behavior: "smooth" });
        }
    };

    const handleScrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: scrollRef.current.offsetWidth, behavior: "smooth" });
        }
    };

    // Mouse drag functionality
    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.clientX);
        setScrollLeft(scrollRef.current.scrollLeft);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const moveX = e.clientX - startX;
        scrollRef.current.scrollLeft = scrollLeft - moveX;
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        const scrollElement = scrollRef.current;
        if (scrollElement) {
            scrollElement.addEventListener("scroll", checkScrollPosition);
            checkScrollPosition(); // Initial check
        }
        return () => {
            if (scrollElement) {
                scrollElement.removeEventListener("scroll", checkScrollPosition);
            }
        };
    }, [newArrivals]);

    return (
        <section>
            <div className="container mx-auto text-center relative">
                <h2 className="text-3xl font-bold mb-4">Explore New Arrivals</h2>
                <p className="text-lg text-gray-600 mb-8">
                    Discover the latest styles straight off the runway, freshly added to keep your wardrobe on the cutting edge of fashion.
                </p>

                {/* Scroll Buttons */}
                <div className="absolute right-0 bottom-[-30px] flex space-x-2">
                    <button
                        onClick={handleScrollLeft}
                        disabled={isAtStart}
                        className={`p-2 rounded border border-gray-200 bg-white text-black 
                        ${isAtStart ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                        <FiChevronLeft className="text-2xl" />
                    </button>
                    <button
                        onClick={handleScrollRight}
                        disabled={isAtEnd}
                        className={`p-2 rounded border border-gray-200 bg-white text-black 
                        ${isAtEnd ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                        <FiChevronRight className="text-2xl" />
                    </button>
                </div>
            </div>

            {/* Scrollable Content */}
            <div
                ref={scrollRef}
                className={`container mx-auto overflow-x-scroll flex space-x-6 relative scrollbar-hide
                ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                {newArrivals.map((product) => (
                    <div key={product._id} className="min-w-[100%] sm:min-w-[50%] lg:min-w-[30%] relative">
                        <img
                            src={product.images[0]?.url || "/placeholder.jpg"}
                            alt={product.name || "Product"}
                            className="w-full h-[300px] object-cover rounded-lg"
                            draggable="false"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-opacity-50 backdrop-blur-md text-white rounded-b-lg p-2">
                            <Link to={`/product/${product._id}`} className="block">
                                <h4 className="font-medium">{product.name}</h4>
                                <p className="mt-1 ">${product.price}</p>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default NewArrivals;