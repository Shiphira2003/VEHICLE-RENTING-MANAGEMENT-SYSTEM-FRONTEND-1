import { useNavigate } from 'react-router-dom';
import Image from '../../assets/purple car.jpg';

const Hero = () => {
  const navigate = useNavigate();

  const handleServicesClick = () => {
    navigate('/services'); // Make sure this matches your route path
  };

  return (
    <section
      className="w-screen h-screen bg-cover bg-center bg-no-repeat relative"
      style={{backgroundImage : `url(${Image})` }}
    >
      {/* Overlay to darken image for text readability */}
      <div className="absolute inset-0 bg-black opacity-60"></div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-8 tracking-wide">
          Effortless Journeys, Seamless Management.
        </h1>
        <p className="text-xl md:text-3xl mb-11 leading-relaxed">
          Your ultimate solution for streamlined vehicle rentals and comprehensive fleet management.
          From booking to maintenance, take full control of your mobility with ease.
        </p>
        <button 
          onClick={handleServicesClick}
          className="btn btn-primary bg-white text-blue-500 hover:bg-gray-200 border-none text-lg px-9 py-4 rounded-lg font-semibold uppercase tracking-wider"
        >
          View Our Services
        </button>
      </div>
    </section>
  );
};

export default Hero;