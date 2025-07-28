import { Link } from 'react-router-dom';
import { FaCar, FaChair, FaGasPump, FaCogs, FaSearch, FaFilter } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { 
  useGetAllVehiclesQuery,
  useLazyGetFilteredVehiclesQuery 
} from '../../features/api/vehiclesApi';
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

  // Get unique manufacturers for filter dropdown
  const manufacturers = Array.from(
    new Set(allVehicles?.map(v => v.vehicleSpec.manufacturer) || [])
  ).sort();

  // Apply filters handler
  const applyFilters = () => {
    if (filters.searchQuery) {
      // Client-side search when search query is present
      toast.info('Showing search results');
      setCurrentPage(1);
      return;
    }
    
    triggerFilter({
      manufacturer: filters.manufacturer || undefined,
      maxDailyPrice: filters.maxDailyPrice,
      sort: filters.sort as 'dailyRateAsc' | 'dailyRateDesc'
    });
    setCurrentPage(1); 
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
    applyFilters();
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

  // Determine which vehicles to display with search functionality
  const vehiclesToDisplay = filters.searchQuery 
    ? allVehicles?.filter(vehicle => {
        const searchTerm = filters.searchQuery.toLowerCase();
        return (
          vehicle.vehicleSpec.manufacturer.toLowerCase().includes(searchTerm) ||
          vehicle.vehicleSpec.model.toLowerCase().includes(searchTerm) ||
          vehicle.vehicleSpec.fuelType.toLowerCase().includes(searchTerm) ||
          vehicle.vehicleSpec.transmission.toLowerCase().includes(searchTerm) ||
          (vehicle.color && vehicle.color.toLowerCase().includes(searchTerm))
        );
      })
    : filteredVehicles || allVehicles;

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
    <div className="w-full bg-gray-50 min-h-screen">
      <Toaster richColors position="top-right" />
      
      {/* Page Header */}
      <div className="w-full bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 text-white py-12 sm:py-16 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-3 sm:mb-4">Find Your Perfect Ride</h1>
          <p className="text-base sm:text-lg md:text-xl font-light">Choose from our wide selection of vehicles</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 pb-8 sm:pb-12">
        {/* Search and Filters Section */}
        <div className="w-full bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-md p-3 sm:p-4 md:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
              <FaFilter className="inline mr-2 text-purple-600" />
              Filter Vehicles
            </h2>
            
            <form onSubmit={handleSearch} className="w-full md:w-auto min-w-[200px]">
              <div className="join w-full">
                <input
                  type="text"
                  id="searchQuery"
                  placeholder="Search vehicles..."
                  className="input input-bordered join-item w-full text-sm sm:text-base"
                  value={filters.searchQuery}
                  onChange={handleFilterChange}
                />
                <button 
                  type="submit" 
                  className="btn join-item bg-purple-600 text-white hover:bg-purple-700 px-3 sm:px-4"
                >
                  <FaSearch className="text-sm sm:text-base" />
                </button>
              </div>
            </form>
          </div>

          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Manufacturer Filter */}
            <div className="w-full">
              <label htmlFor="manufacturer" className="block text-gray-700 text-xs sm:text-sm font-semibold mb-1 sm:mb-2">
                Manufacturer
              </label>
              <select
                id="manufacturer"
                className="select select-bordered w-full text-sm sm:text-base"
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
            <div className="w-full">
              <label htmlFor="maxDailyPrice" className="block text-gray-700 text-xs sm:text-sm font-semibold mb-1 sm:mb-2">
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
              <div className="flex justify-between text-[10px] xs:text-xs text-gray-500 mt-1">
                <span>$0</span>
                <span>$500</span>
                <span>$1000+</span>
              </div>
            </div>

            {/* Sort By */}
            <div className="w-full">
              <label htmlFor="sort" className="block text-gray-700 text-xs sm:text-sm font-semibold mb-1 sm:mb-2">
                Sort By
              </label>
              <select
                id="sort"
                className="select select-bordered w-full text-sm sm:text-base"
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
            <div className="flex items-end gap-2 w-full">
              <button 
                onClick={applyFilters}
                className="btn bg-purple-600 hover:bg-purple-700 text-white flex-1 
                          text-xs sm:text-sm min-h-[2.5rem] h-auto py-1.5"
                disabled={isFilterFetching}
              >
                {isFilterFetching ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  'Apply Filters'
                )}
              </button>
              <button 
                onClick={resetFilters}
                className="btn btn-outline flex-1 text-xs sm:text-sm min-h-[2.5rem] h-auto py-1.5"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center mb-3 sm:mb-4 gap-1 sm:gap-2">
          <p className="text-gray-600 text-sm sm:text-base">
            Showing {currentVehicles.length} of {vehiclesToDisplay?.length || 0} vehicles
          </p>
          {isFilterFetching && (
            <p className="text-purple-600 flex items-center text-sm sm:text-base">
              <span className="loading loading-spinner loading-xs mr-1 sm:mr-2"></span>
              Updating results...
            </p>
          )}
        </div>

        {/* Vehicles Grid */}
        {currentVehicles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
              {currentVehicles.map((vehicle) => (
                <div 
                  key={vehicle.vehicleId} 
                  className="card bg-white rounded-lg shadow-sm sm:shadow-md border border-gray-100 
                            overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <figure className="relative aspect-video">
                    <img
                      src={vehicle.imageUrl || '/default-car.jpg'}
                      alt={`${vehicle.vehicleSpec.manufacturer} ${vehicle.vehicleSpec.model}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/default-car.jpg';
                      }}
                    />
                    <div className="absolute top-2 right-2 badge badge-accent text-white text-xs sm:text-sm">
                      ${vehicle.rentalRate}/day
                    </div>
                  </figure>
                  <div className="card-body p-3 sm:p-4">
                    <h3 className="card-title text-base sm:text-lg font-bold text-gray-800">
                      {vehicle.vehicleSpec.manufacturer} {vehicle.vehicleSpec.model}
                      <span className="text-xs sm:text-sm font-normal text-gray-500 block">
                        {vehicle.vehicleSpec.year}
                      </span>
                    </h3>

                    <div className="grid grid-cols-2 gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600 my-1 sm:my-2">
                      <div className="flex items-center truncate">
                        <FaChair className="mr-1 text-purple-500 flex-shrink-0" />
                        <span className="truncate">{vehicle.vehicleSpec.seatingCapacity} Seats</span>
                      </div>
                      <div className="flex items-center truncate">
                        <FaGasPump className="mr-1 text-purple-500 flex-shrink-0" />
                        <span className="truncate">{vehicle.vehicleSpec.fuelType}</span>
                      </div>
                      <div className="flex items-center truncate">
                        <FaCogs className="mr-1 text-purple-500 flex-shrink-0" />
                        <span className="truncate">{vehicle.vehicleSpec.transmission}</span>
                      </div>
                      <div className="flex items-center truncate">
                        <FaCar className="mr-1 text-purple-500 flex-shrink-0" />
                        <span className="truncate">{vehicle.color || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="card-actions justify-between items-center mt-2 sm:mt-3">
                      <span className={`badge ${vehicle.availability ? 'badge-success' : 'badge-error'} 
                                    text-white text-xs sm:text-sm`}>
                        {vehicle.availability ? 'Available' : 'Booked'}
                      </span>
                      <Link
                        to={`/vehicles/${vehicle.vehicleId}`}
                        className="btn btn-sm bg-purple-600 hover:bg-purple-500 text-white 
                                  text-xs sm:text-sm px-2 sm:px-3"
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
              <div className="flex justify-center mt-6 sm:mt-8">
                <div className="join">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="join-item btn btn-sm sm:btn-md"
                  >
                    «
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`join-item btn btn-sm sm:btn-md ${currentPage === page ? 'btn-active' : ''}`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="join-item btn btn-sm sm:btn-md"
                  >
                    »
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="w-full bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-md p-6 sm:p-8 md:p-10 lg:p-12 text-center">
            <div className="text-purple-500 text-4xl sm:text-5xl mb-3 sm:mb-4">🚗</div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">No vehicles found</h3>
            <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4">
              {filters.manufacturer || filters.maxDailyPrice < 1000 
                ? "Try adjusting your filters to see more results." 
                : "We currently don't have any vehicles available."}
            </p>
            <button 
              onClick={resetFilters}
              className="btn bg-purple-600 hover:bg-purple-700 text-white text-sm sm:text-base"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};