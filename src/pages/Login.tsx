import { Link } from "react-router-dom";
import loginImg from "../../src/assets/login.jpg";
import { useForm } from "react-hook-form";
import { Toaster, toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { userApi } from "../features/api/userApi";
import { FaSignInAlt } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
import Footer from "../components/Footer";
import { Navbar } from "../components/Navbar";

type UserLoginFormValues = {
  email: string;
  password: string;
};

export const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors } } = useForm<UserLoginFormValues>();
  const [loginUser, { isLoading }] = userApi.useLoginUserMutation();

  const onSubmit = async (data: UserLoginFormValues) => {
    const loadingToastId = toast.loading("Logging in...");
    try {
      const res = await loginUser(data).unwrap();
      toast.success(res?.message, { id: loadingToastId });
      dispatch(setCredentials(res));
      if (res.role === "admin") {
        navigate("/admindashboard");
      } else {
        navigate("/userDashboard");
      }
    } catch (err: any) {
      toast.error('Failed to Login: ' + (err.data?.message || err.message || err.error || err));
      toast.dismiss(loadingToastId);
      console.error("Login error:", err);
    }
  };

  return (
    <>
      <Navbar />
      <Toaster richColors position="top-right" />

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-10">
        <div className="grid sm:grid-cols-2 gap-6 md:gap-10 bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden w-full max-w-4xl lg:max-w-6xl">
          {/* Image Section - Hidden on mobile */}
          <div className="hidden sm:flex items-center justify-center bg-gradient-to-tr from-blue-200 via-pink-100 to-white p-4">
            <img 
              src={loginImg} 
              alt="Login" 
              className="rounded-2xl w-full h-full object-cover max-h-[500px]"
            />
          </div>

          {/* Form Section */}
          <div className="flex items-center justify-center p-6 sm:p-8">
            <form 
              className="w-full max-w-md space-y-4 sm:space-y-6 bg-white rounded-2xl p-4 sm:p-8"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="text-center mb-4 sm:mb-6">
                <h1 className="text-3xl sm:text-4xl font-bold text-orange-600 mb-2">Login</h1>
                <p className="text-gray-500 text-sm sm:text-base">Welcome Back</p>
              </div>

              {/* Email Field */}
              <div className="space-y-1">
                <label className="block text-gray-700 text-sm sm:text-base">Email</label>
                <input
                  type="email"
                  className="input w-full bg-white border border-gray-300 text-gray-800 
                            focus:border-orange-500 focus:ring-1 focus:ring-orange-500
                            py-2 px-3 rounded-lg transition-all"
                  placeholder="Enter your email"
                  {...register("email", { required: true })}
                />
                {errors.email && (
                  <span className="text-red-600 text-xs sm:text-sm">Email is required</span>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <label className="block text-gray-700 text-sm sm:text-base">Password</label>
                <input
                  type="password"
                  className="input w-full bg-white border border-gray-300 text-gray-800 
                            focus:border-orange-500 focus:ring-1 focus:ring-orange-500
                            py-2 px-3 rounded-lg transition-all"
                  placeholder="Enter your password"
                  {...register("password", { required: true })}
                />
                {errors.password && (
                  <span className="text-red-600 text-xs sm:text-sm">Password is required</span>
                )}
              </div>

             {/* Login Button */}
<button
  type="submit"
  className="btn w-full mt-4 sm:mt-6 bg-purple-200 hover:bg-orange-100 
            text-white font-medium py-2 px-4 rounded-lg shadow-md
            border border-gray-300 hover:border-orange-500
            hover:scale-[1.02] transition-transform duration-200
            flex items-center justify-center gap-2"
  disabled={isLoading}
>
  {isLoading ? (
    <span className="loading loading-spinner loading-sm text-white"></span>
  ) : (
    <>
      <FaSignInAlt className="text-white" />
      <span>Login</span>
    </>
  )}
</button>

              {/* Forgot Password Link */}
              <div className="text-center mt-2 sm:mt-3">
                <Link 
                  to="#" 
                  className="text-orange-500 hover:text-orange-600 text-xs sm:text-sm underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Additional Links */}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-6 text-center mt-4 sm:mt-6">
                <Link 
                  to="/" 
                  className="text-blue-500 hover:text-blue-600 text-xs sm:text-sm flex items-center gap-1"
                >
                  <span role="img" aria-label="home">🏡</span> Go to HomePage
                </Link>
                <Link 
                  to="/register" 
                  className="text-yellow-500 hover:text-yellow-600 text-xs sm:text-sm flex items-center gap-1"
                >
                  Need An Account?
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
      <hr className="mt-6" />
      <Footer />
    </>
  );
};