import { Link } from 'react-router-dom';
import { FaCar, FaChair, FaGasPump, FaCogs, FaSearch, FaFilter } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { 
  useGetAllVehiclesQuery,
  useLazyGetFilteredVehiclesQuery 
} from '../../features/api/vehiclesApi';
import type { Vehicle } from '../../types/vehicleDetails';
import { Toaster, toast } from 'sonner';

export const VehiclesListing = () => {
  // State for filters and search
  const [filters, setFilters] = useState({
    manufacturer: '',
    maxDailyPrice: 1000,
    sort: 'dailyRateAsc',
    searchQuery: ''
  });

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const vehiclesPerPage = 8;

  // RTK Query hooks
  const { data: allVehicles, error, isLoading: isInitialLoading } = useGetAllVehiclesQuery();
  const [triggerFilter, { 
    data: filteredVehicles, 
    isLoading: isFilterLoading, 
    isFetching: isFilterFetching 
  }] = useLazyGetFilteredVehiclesQuery();

  // Determine which vehicles to display
  const vehiclesToDisplay = filteredVehicles || allVehicles;

  // Get unique manufacturers for filter dropdown
  const manufacturers = Array.from(
    new Set(allVehicles?.map(v => v.vehicleSpec.manufacturer) || [])
  ).sort();

  // Apply filters handler
  const applyFilters = () => {
    if (filters.searchQuery) {
      // Client-side search when search query is present
      return;
    }
    
    triggerFilter({
      manufacturer: filters.manufacturer || undefined,
      maxDailyPrice: filters.maxDailyPrice,
      sort: filters.sort as 'dailyRateAsc' | 'dailyRateDesc'
    });
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Handle filter changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { id, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [id]: id === 'maxDailyPrice' ? Number(value) : value
    }));
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (filters.searchQuery) {
      toast.info('Using client-side search');
    } else {
      applyFilters();
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      manufacturer: '',
      maxDailyPrice: 1000,
      sort: 'dailyRateAsc',
      searchQuery: ''
    });
    setCurrentPage(1);
  };

  // Apply filters when component mounts
  useEffect(() => {
    applyFilters();
  }, []);

  // Pagination logic
  const indexOfLastVehicle = currentPage * vehiclesPerPage;
  const indexOfFirstVehicle = indexOfLastVehicle - vehiclesPerPage;
  const currentVehicles = vehiclesToDisplay?.slice(indexOfFirstVehicle, indexOfLastVehicle) || [];
  const totalPages = Math.ceil((vehiclesToDisplay?.length || 0) / vehiclesPerPage);

  // Loading state
  if (isInitialLoading || isFilterLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <span className="loading loading-spinner loading-lg text-purple-600"></span>
        <p className="ml-4 text-lg text-purple-600">Loading vehicles...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 text-red-700 p-4">
        <p>Error loading vehicles: {error instanceof Error ? error.message : 'An unknown error occurred'}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Toaster richColors position="top-right" />
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-lg p-6 mb-8 text-white py-16 px-4 text-center">
        <h1 className="text-5xl font-extrabold mb-4">Find Your Perfect Ride</h1>
        <p className="text-xl font-light">Choose from our wide selection of vehicles</p>
      </div>

      <div className="container mx-auto px-4 pb-12">
        {/* Search and Filters Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
              <FaFilter className="inline mr-2 text-purple-600" />
              Filter Vehicles
            </h2>
            
            <form onSubmit={handleSearch} className="w-full md:w-auto">
              <div className="join">
                <input
                  type="text"
                  id="searchQuery"
                  placeholder="Search by model or features..."
                  className="input input-bordered join-item w-full md:w-64"
                  value={filters.searchQuery}
                  onChange={handleFilterChange}
                />
                <button type="submit" className="btn join-item bg-purple-600 text-white hover:bg-purple-700">
                  <FaSearch />
                </button>
              </div>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Manufacturer Filter */}
            <div>
              <label htmlFor="manufacturer" className="block text-gray-700 text-sm font-semibold mb-2">
                Manufacturer
              </label>
              <select
                id="manufacturer"
                className="select select-bordered w-full"
                value={filters.manufacturer}
                onChange={handleFilterChange}
              >
                <option value="">All Manufacturers</option>
                {manufacturers.map(manufacturer => (
                  <option key={manufacturer} value={manufacturer}>
                    {manufacturer}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div>
              <label htmlFor="maxDailyPrice" className="block text-gray-700 text-sm font-semibold mb-2">
                Max Daily Price: ${filters.maxDailyPrice}
              </label>
              <input
                type="range"
                min="0"
                max="1000"
                value={filters.maxDailyPrice}
                id="maxDailyPrice"
                className="range range-primary w-full"
                step="10"
                onChange={handleFilterChange}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>$0</span>
                <span>$500</span>
                <span>$1000+</span>
              </div>
            </div>

            {/* Sort By */}
            <div>
              <label htmlFor="sort" className="block text-gray-700 text-sm font-semibold mb-2">
                Sort By
              </label>
              <select
                id="sort"
                className="select select-bordered w-full"
                value={filters.sort}
                onChange={handleFilterChange}
              >
                <option value="dailyRateAsc">Price: Low to High</option>
                <option value="dailyRateDesc">Price: High to Low</option>
                <option value="yearDesc">Newest First</option>
                <option value="yearAsc">Oldest First</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex items-end space-x-2">
              <button 
                onClick={applyFilters}
                className="btn bg-purple-600 hover:bg-purple-700 text-white flex-1"
                disabled={isFilterFetching}
              >
                {isFilterFetching ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  'Apply Filters'
                )}
              </button>
              <button 
                onClick={resetFilters}
                className="btn btn-outline flex-1"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-600">
            Showing {currentVehicles.length} of {vehiclesToDisplay?.length || 0} vehicles
          </p>
          {isFilterFetching && (
            <p className="text-purple-600 flex items-center">
              <span className="loading loading-spinner loading-xs mr-2"></span>
              Updating results...
            </p>
          )}
        </div>

        {/* Vehicles Grid */}
        {currentVehicles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentVehicles.map((vehicle) => (
                <div 
                  key={vehicle.vehicleId} 
                  className="card bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <figure className="relative">
                    <img
                      src={vehicle.imageUrl || '/default-car.jpg'}
                      alt={`${vehicle.vehicleSpec.manufacturer} ${vehicle.vehicleSpec.model}`}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/default-car.jpg';
                      }}
                    />
                    <div className="absolute top-2 right-2 badge badge-accent text-white">
                      ${vehicle.rentalRate}/day
                    </div>
                  </figure>
                  <div className="card-body p-4">
                    <h3 className="card-title text-lg font-bold text-gray-800">
                      {vehicle.vehicleSpec.manufacturer} {vehicle.vehicleSpec.model}
                      <span className="text-sm font-normal text-gray-500 block">
                        {vehicle.vehicleSpec.year}
                      </span>
                    </h3>

                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 my-2">
                      <div className="flex items-center">
                        <FaChair className="mr-1 text-purple-500" />
                        {vehicle.vehicleSpec.seatingCapacity} Seats
                      </div>
                      <div className="flex items-center">
                        <FaGasPump className="mr-1 text-purple-500" />
                        {vehicle.vehicleSpec.fuelType}
                      </div>
                      <div className="flex items-center">
                        <FaCogs className="mr-1 text-purple-500" />
                        {vehicle.vehicleSpec.transmission}
                      </div>
                      <div className="flex items-center">
                        <FaCar className="mr-1 text-purple-500" />
                        {vehicle.color || 'N/A'}
                      </div>
                    </div>

                    <div className="card-actions justify-between items-center mt-4">
                      <span className={`badge ${vehicle.availability ? 'badge-success' : 'badge-error'} text-white`}>
                        {vehicle.availability ? 'Available' : 'Booked'}
                      </span>
                      <Link
                        to={`/vehicles/${vehicle.vehicleId}`}
                        className="btn btn-sm bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="join">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="join-item btn"
                  >
                    «
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`join-item btn ${currentPage === page ? 'btn-active' : ''}`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="join-item btn"
                  >
                    »
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-purple-500 text-5xl mb-4">🚗</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No vehicles found</h3>
            <p className="text-gray-600 mb-4">
              {filters.manufacturer || filters.maxDailyPrice < 1000 
                ? "Try adjusting your filters to see more results." 
                : "We currently don't have any vehicles available."}
            </p>
            <button 
              onClick={resetFilters}
              className="btn bg-purple-600 hover:bg-purple-700 text-white"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};