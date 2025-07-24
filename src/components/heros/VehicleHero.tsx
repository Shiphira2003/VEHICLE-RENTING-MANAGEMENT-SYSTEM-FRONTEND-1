import { Link } from 'react-router-dom';
import { FaCar, FaChair, FaGasPump, FaCogs } from 'react-icons/fa'; 
import { useState, useMemo } from 'react';
import { useGetAllVehiclesQuery } from '../../features/api/vehiclesApi'; 
import  type{ Vehicle } from '../../types/vehicleDetails'; 

// Removed local image imports as data will come from API

export const VehiclesListing = () => {
    // Fetch data using the RTK Query hook
    const { data: vehicles, error, isLoading } = useGetAllVehiclesQuery();

    // Manage filter and sort states
    const [filters, setFilters] = useState({
        type: '', // This will filter based on vehicleSpec.model for now
        maxDailyPrice: 250, // Set a reasonable default max price
    });
    const [sort, setSort] = useState('dailyRateAsc'); 

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { id, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [id]: id === 'maxDailyPrice' ? Number(value) : value,
        }));
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSort(e.target.value);
    };

    // Memoize filtered and sorted vehicles to prevent unnecessary re-renders
    const filteredAndSortedVehicles = useMemo(() => {
        if (!vehicles) return []; // Return empty array if data is not yet available

        let filtered = vehicles.filter(vehicle => {
            // Filter by vehicle type (using vehicleSpec.model as a proxy for 'type')
            const matchesType = filters.type ? vehicle.vehicleSpec.model.toLowerCase().includes(filters.type.toLowerCase()) : true;
            // Filter by max daily price (using rentalRate)
            const matchesPrice = vehicle.rentalRate <= filters.maxDailyPrice;
            return matchesType && matchesPrice;
        });

        // Apply sorting
        filtered.sort((a, b) => {
            if (sort === 'dailyRateAsc') {
                return a.rentalRate - b.rentalRate;
            } else if (sort === 'dailyRateDesc') {
                return b.rentalRate - a.rentalRate;
            }
            return 0; // No sorting if 'popularity' or other undefined sort is selected
        });

        return filtered;
    }, [vehicles, filters, sort]); // Recalculate when vehicles data, filters, or sort change

    // Display loading state
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <span className="loading loading-spinner loading-lg text-purple-600"></span>
                <p className="ml-4 text-lg text-purple-600">Loading vehicles...</p>
            </div>
        );
    }

    // Display error state
    if (error) {
        // You might want a more user-friendly error message or a retry mechanism
        return (
            <div className="min-h-screen flex items-center justify-center bg-red-50 text-red-700 p-4">
                <p>Error loading vehicles: {error instanceof Error ? error.message : 'An unknown error occurred'}</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 container mx-auto p-8">
            {/* Page Header */}
            <div className="bg-purple-100 rounded-lg shadow-lg p-6 mb-8 border border-gray-100 text-purple-800 py-16 px-4 text-center">
                <h1 className="text-5xl font-extrabold mb-4 animate-fadeInUp">
                    "Drive Your Dream"
                </h1>
                <p className="text-xl text-bold text-blue-800 font-light animate-fadeInUp delay-200">
                    Rent your perfect ride.
                </p>
            </div>

            {/* Main Content Area */}
            <div className="container mx-auto p-8">
                {/* Filters and Search */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border border-gray-100">
                    <h2 className="text-2xl font-bold text-purple-800 mb-4">Find Your Perfect Ride</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {/* Filter: Vehicle Type */}
                        <div>
                            <label htmlFor="type" className="block text-gray-700 text-sm font-semibold mb-2">Vehicle Type</label>
                            <select
                                id="type"
                                className="select select-bordered w-full"
                                value={filters.type}
                                onChange={handleFilterChange}
                            >
                                <option value="">All Types</option>
                                {/* These options are based on your mock data's 'type' values,
                                    but now they will filter against vehicle.vehicleSpec.model */}
                                <option value="SUV">SUV</option>
                                <option value="Sedan">Sedan</option>
                                <option value="Luxury">Luxury</option>
                                <option value="Truck">Truck</option>
                                <option value="Electric">Electric</option>
                                <option value="Bus">Bus</option>
                                <option value="brabus">Brabus</option>
                            </select>
                        </div>

                        {/* Filter: Max Daily Price */}
                        <div>
                            <label htmlFor="maxDailyPrice" className="block text-gray-700 text-sm font-semibold mb-2">Max Daily Price: ${filters.maxDailyPrice}</label>
                            <input
                                type="range"
                                min="0"
                                max="250" // Adjusted max to cover your highest mock rate (230)
                                value={filters.maxDailyPrice}
                                id="maxDailyPrice"
                                className="range range-primary"
                                step="10"
                                onChange={handleFilterChange}
                            />
                            <div className="w-full flex justify-between text-xs px-2 text-gray-600">
                                <span>KSH 0</span>
                                <span>KSH 1000</span>
                                <span>KSH 2000+</span>
                            </div>
                        </div>

                        {/* Sort By */}
                        <div>
                            <label htmlFor="sortBy" className="block text-gray-700 text-sm font-semibold mb-2">Sort By</label>
                            <select
                                id="sortBy"
                                className="select select-bordered w-full"
                                value={sort}
                                onChange={handleSortChange}
                            >
                                <option value="dailyRateAsc">Price: Low to High</option>
                                <option value="dailyRateDesc">Price: High to Low</option>
                                {/* 'Popularity' sorting would require a 'popularity' field in your Vehicle data */}
                            </select>
                        </div>

                        <div className="md:col-span-3 lg:col-span-1 flex items-end">
                             <button className="btn bg-orange-500 hover:bg-orange-600 text-white w-full">
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Vehicle Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredAndSortedVehicles.length > 0 ? (
                        filteredAndSortedVehicles.map((vehicle) => (
                            <div key={vehicle.vehicleId} className="card bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden transform hover:scale-105 transition-transform duration-300">
                                <figure>
                                    <img
                                        src={vehicle.imageUrl} // Now using imageUrl from API data
                                        alt={`${vehicle.vehicleSpec.manufacturer} ${vehicle.vehicleSpec.model}`}
                                        className="w-full h-48 object-cover"
                                    />
                                </figure>
                                <div className="card-body p-6">
                                    <h2 className="card-title text-purple-800 text-2xl font-bold mb-1">
                                        {vehicle.vehicleSpec.manufacturer} <span className="text-lg text-gray-500 font-normal">{vehicle.vehicleSpec.model}</span>
                                    </h2>
                                    <p className="text-gray-700 text-sm mb-3">{vehicle.description}</p>

                                    {/* Specifications Grid */}
                                    <div className="grid grid-cols-2 gap-y-2 text-gray-600 text-sm mb-4">
                                        <div className="flex items-center gap-2">
                                            <FaCar className="text-purple-600" /> {vehicle.vehicleSpec.model} {/* Using model as a type indicator */}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FaChair className="text-purple-600" /> {vehicle.vehicleSpec.seatingCapacity} Seats
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FaGasPump className="text-purple-600" /> {vehicle.vehicleSpec.fuelType}
                                        </div>
                                        {/* Assuming your backend's VehicleSpec includes 'transmission' */}
                                        {/* If it doesn't, you'll need to add it to types/vehicleDetails.ts VehicleSpec interface */}
                                        <div className="flex items-center gap-2">
                                            <FaCogs className="text-purple-600" /> {vehicle.vehicleSpec.transmission}
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-baseline mb-4">
                                        <p className="text-3xl font-extrabold text-orange-600">
                                            ${vehicle.rentalRate}
                                            <span className="text-lg font-normal text-gray-500">/day</span>
                                        </p>
                                        <div className="badge badge-outline text-purple-600 border-purple-600">
                                            {vehicle.availability ? 'Available' : 'Unavailable'}
                                        </div>
                                    </div>

                                    <div className="card-actions justify-end">
                                        <Link 
  to={`/vehicles/${vehicle.vehicleId}`}  
  className="btn bg-white hover:bg-purple-300 text-white w-full"
>
  View Details
</Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center text-gray-600 text-lg py-10">
                            No vehicles found matching your criteria.
                        </div>
                    )}
                </div>

                {/* Pagination (Conceptual) - uncomment and implement if needed */}
                 <div className="flex justify-center mt-12">
                    <div className="join">
                        <button className="join-item btn btn-primary bg-purple-700 hover:bg-purple-800 text-white">«</button>
                        <button className="join-item btn btn-primary bg-purple-700 hover:bg-purple-800 text-white">Page 1</button>
                        <button className="join-item btn btn-primary bg-purple-700 hover:bg-purple-800 text-white">2</button>
                        <button className="join-item btn btn-primary bg-purple-700 hover:bg-purple-800 text-white">3</button>
                        <button className="join-item btn btn-primary bg-purple-700 hover:bg-purple-800 text-white">»</button>
                    </div>
                </div> 
            </div>
        </div>
    );
};
