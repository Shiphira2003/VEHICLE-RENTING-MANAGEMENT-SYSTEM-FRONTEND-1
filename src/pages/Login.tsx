import { Link } from "react-router-dom";
import loginImg from "../../src/assets/login.jpg";
import { useForm } from "react-hook-form"
import { Toaster, toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { userApi } from "../features/api/userApi";
import { FaSignInAlt } from "react-icons/fa"
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
import Footer from "../components/Footer";
import { Navbar } from "../components/Navbar";

type UserLoginFormValues = {
  email: string;
  password: string;
}
export const Login = () => {
     const navigate = useNavigate();
     const dispatch = useDispatch();
     const { register, handleSubmit, formState: { errors } } = useForm<UserLoginFormValues>();
     const [loginUser,{isLoading}] = userApi.useLoginUserMutation()

     const onSubmit = async (data: UserLoginFormValues) => {
    const loadingToastId = toast.loading("Logging in...");
    // console.log(data)
    try {
      const res = await loginUser(data).unwrap()
    //   console.log(res)
        toast.success(res?.message, { id: loadingToastId })
        dispatch(setCredentials(res))
        // navigate("/dashboard")
        if (res.role === "admin") {
          navigate("/admindashboard");
        } else {
          navigate("/userDashboard");
        }
    } catch (err: any) {
      toast.error('Failed to Login: ' + (err.data?.message || err.message || err.error || err));
      toast.dismiss(loadingToastId)
      console.error("Login error:", err);
    }
    }

    return (
        <>
        <Navbar/>
            <Toaster
                richColors
                position="top-right"
            />


            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-10">
                <div className="grid sm:grid-cols-2 gap-10 bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden w-full max-w-4xl lg:max-w-6xl">
                    <div className="hidden sm:flex items-center justify-center bg-gradient-to-tr from-blue-200 via-pink-100 to-white p-4">
                        <img src={loginImg} alt="Login" className="rounded-2xl max-w-full h-auto" />
                    </div>
                    <div className="flex items-center justify-center p-8">
                        <form className="w-full max-w-md space-y-6 bg-white rounded-2xl p-8" onSubmit={handleSubmit(onSubmit)}>
                            <div className="text-center mb-6">
                                <div className="text-4xl font-bold text-orange-600 mb-2">Login</div>
                                <p className="text-gray-500">Welcome Back</p>
                            </div>

                            <label className="block">
                                <span className="text-gray-700">Email</span>
                                <input type="email"
                                    className="input input-bordered border-2 w-full mt-1 focus:border-orange-500 focus:ring-orange-500"
                                    placeholder="Email"
                                    {...register("email", { required: true })}
                                />
                            </label>
                            {errors.email && <span className="text-red-600 text-sm">Email is required</span>}

                            <label className="block">
                                <span className="text-gray-700">Password</span>
                                <input type="password"
                                    className="input input-bordered border-2 w-full mt-1 focus:border-orange-500 focus:ring-orange-500"
                                    placeholder="Password"
                                    {...register("password", { required: true })}
                                />
                            </label>
                            {errors.password && <span className="text-red-600 text-sm">Password is required</span>}

                            <button type="submit"
                                className="btn bg-orange-500 hover:bg-orange-600 text-white w-full mt-4 shadow-md hover:scale-105 transition-transform flex items-center justify-center gap-2"
                                disabled={isLoading}
                            >
                                {isLoading ? <span className="loading loading-spinner text-white"></span> : <FaSignInAlt />}
                                {isLoading ? "Logging In..." : "Login"}
                            </button>

                            <Link to="#" className="text-orange-500 hover:underline text-sm block text-center mt-2">
                                Forgot password?
                            </Link>

                            <div className="flex justify-center flex-wrap gap-x-6 gap-y-2 text-center mt-4">
                                <Link to="/" className="text-blue-500 hover:underline flex items-center justify-center gap-1">
                                    <span role="img" aria-label="home">🏡</span> Go to HomePage
                                </Link>
                                <Link to="/register" className="text-yellow-500 hover:underline flex items-center justify-center gap-1">
                                    Need An Account?
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <hr className="mt-6" />
            <Footer/>
        </>
    )
}