
import contactImage from '../../assets/contacthero.jpg'; 

const ContactHero = () => {
  return (
    <section className="min-h-[80vh] flex items-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-100 py-16 px-4 sm:px-8 lg:px-16">
      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20 max-w-7xl">

    
        <div className="flex-1 text-center lg:text-left order-2 lg:order-1">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-4">
            Connect with{" "}
            <span className="bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">
              Shiwama Drive
            </span>
          </h1>
         <p className="text-lg sm:text-xl text-gray-700 mb-8 max-w-2xl lg:max-w-none mx-auto lg:mx-0 leading-relaxed">
  Ready to take the wheel on your next journey? Whether you're looking to rent a vehicle,
  streamline your fleet, or have any questions about our services, Shiwama Drive is here to help.
</p>

          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            
            <div className="card bg-white text-gray-800 shadow-lg border border-purple-200 transition-transform transform hover:scale-105 duration-300">
              <div className="card-body items-center text-center p-6">
                <div className="text-purple-600 text-4xl mb-3">📞</div>
                <h2 className="card-title text-xl font-bold mb-1">Call Us</h2>
                <p className="text-md">Mon - Sun: 24/7</p>
                <a href="tel:+2547XXXXXXXX" className="link link-hover text-purple-700 text-lg font-medium mt-1">
                  +254 740798648
                </a>
              </div>
            </div>


            <div className="card bg-white text-gray-800 shadow-lg border border-pink-200 transition-transform transform hover:scale-105 duration-300">
              <div className="card-body items-center text-center p-6">
                <div className="text-pink-600 text-4xl mb-3">📧</div>
                <h2 className="card-title text-xl font-bold mb-1">Email Us</h2>
                <p className="text-md">For inquiries & feedback</p>
                <a href="mailto:info@shiwamasdelicacies.com" className="link link-hover text-pink-700 text-lg font-medium mt-1">
                  sdrive@gmail.com
                </a>
              </div>
            </div>

            <div className="md:col-span-2 card bg-white text-gray-800 shadow-lg border border-indigo-200 transition-transform transform hover:scale-105 duration-300">
              <div className="card-body items-center text-center p-6">
                <div className="text-indigo-600 text-4xl mb-3">📍</div>
                <h2 className="card-title text-xl font-bold mb-1">Find Us</h2>
                <p className="text-md mb-1">Smart street, Block </p>
                <p className="text-md">Nyahururu, Laikipia County, Kenya</p>
                <a href="https://maps.app.goo.gl/YourGoogleMapsLinkHere" target="_blank" rel="noopener noreferrer" className="link link-hover text-indigo-700 text-md font-medium mt-1">
                  Get Directions
                </a>
              </div>
            </div>

          </div>
        
        </div>

        
        <div className="flex-1 relative order-1 lg:order-2 w-full max-w-md lg:max-w-none">
          <img
            src={contactImage}
            alt="Shiwama's Delicacies Restaurant Interior"
            className="w-full h-full object-cover rounded-3xl shadow-2xl transform hover:scale-102 transition-transform duration-500 ease-in-out"
          />
           <div className="absolute -top-4 -right-4 w-20 h-20 bg-purple-300 rounded-full opacity-30 animate-pulse"></div>
           <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-pink-300 rounded-full opacity-25 animate-pulse delay-1000"></div>
        </div>

      </div>
    </section>
  );
};

export default ContactHero;