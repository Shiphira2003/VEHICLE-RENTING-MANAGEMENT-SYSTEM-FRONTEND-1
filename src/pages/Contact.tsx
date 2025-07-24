import Footer from "../components/Footer";
import ContactHero from "../components/heros/ContactHero";
import { Navbar } from "../components/Navbar";
import Image from '../assets/contact-us.jpeg'; 

const Contact = () => {
  return (
    <>
      <Navbar />
      <ContactHero />
      {/* Main container  */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-16 flex-grow">
          <div className="grid items-center justify-items-center gap-x-8 gap-y-12 lg:grid-cols-2 rounded-lg overflow-hidden shadow-xl">
            {/* Contact form section */}
            <div
              className="relative flex items-center justify-center p-6 lg:p-12 rounded-l-lg lg:rounded-l-lg lg:rounded-r-none"
              style={{
                backgroundImage: `url(${Image})`, 
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            >
             
              <div className="absolute inset-0 bg-white opacity-90 rounded-l-lg lg:rounded-l-lg lg:rounded-r-none"></div>

              <div className="relative z-10 w-full"> 
                <p className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Get in Touch</p>
                <p className="mt-2 text-lg text-gray-700">
                  Our friendly team would love to hear from you.
                </p>
                <form action="#" method="POST" className="mt-8 space-y-6">
                  <div className="grid w-full gap-y-6 md:gap-x-6 lg:grid-cols-2">
                    <div className="grid w-full items-center gap-2">
                      <label
                        className="text-sm font-medium leading-none text-gray-700"
                        htmlFor="first_name"
                      >
                        First Name
                      </label>
                      <input
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:ring-offset-1"
                        type="text"
                        id="first_name"
                        placeholder="First Name"
                      />
                    </div>
                    <div className="grid w-full items-center gap-2">
                      <label
                        className="text-sm font-medium leading-none text-gray-700"
                        htmlFor="last_name"
                      >
                        Last Name
                      </label>
                      <input
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:ring-offset-1"
                        type="text"
                        id="last_name"
                        placeholder="Last Name"
                      />
                    </div>
                  </div>
                  <div className="grid w-full items-center gap-2">
                    <label
                      className="text-sm font-medium leading-none text-gray-700"
                      htmlFor="email"
                    >
                      Email
                    </label>
                    <input
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:ring-offset-1"
                      type="email"
                      id="email"
                      placeholder="Email"
                    />
                  </div>
                  <div className="grid w-full items-center gap-2">
                    <label
                      className="text-sm font-medium leading-none text-gray-700"
                      htmlFor="phone_number"
                    >
                      Phone number
                    </label>
                    <input
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:ring-offset-1"
                      type="tel"
                      id="phone_number"
                      placeholder="Phone number"
                    />
                  </div>
                  <div className="grid w-full items-center gap-2">
                    <label
                      className="text-sm font-medium leading-none text-gray-700"
                      htmlFor="message"
                    >
                      Message
                    </label>
                    <textarea
                      className="flex h-24 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:ring-offset-1"
                      id="message"
                      placeholder="Leave us a message"
                      rows={4}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200"
                  >
                    Send a Message
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact;