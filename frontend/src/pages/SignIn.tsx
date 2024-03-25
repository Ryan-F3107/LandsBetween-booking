import { useForm } from "react-hook-form"
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from '../api-client';
import { useAppContext } from "../contexts/AppContext";
import { Link, useNavigate } from "react-router-dom";

export type SignInFormData = {
    email: string;
    password:string;
}
const SignIn = () => {
    const { register, formState:{errors}, handleSubmit } = useForm<SignInFormData>();
    const {showToast} = useAppContext();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    //creating something on backend
    const mutation = useMutation(apiClient.signIn, {
        onSuccess: async () => {
            showToast({message: "Sign in Successful!", type:"SUCCESS"});
            await queryClient.invalidateQueries("validateToken");
            //Navigate to home page
            navigate("/");
        },
        onError: (error:Error) => {
            showToast({message: error.message, type:"ERROR"});
        }
    });

    const onSubmit = handleSubmit((data) => {
        mutation.mutate(data)   //whenever mutate is called React-query calls function defined(apiClient.signIn) in useMutation
    });

    return (
        <form className="flex flex-col gap-5" onSubmit={onSubmit}>
            <h2 className="text-3xl font-bold">Sign In</h2>
            <label className="text-gray-700 text-sm font-bold flex-1">
                    Email
                    <input type="email" className="border rounded w-full py-1 px-2 font-normal"
                    {...register("email", {required: "This field is required"})}></input>
                    {errors.email && (/* if left is true then do right, if error for firstName property exists */
                        <span className="text-red-500">{errors.email.message}</span>
                    )}
            </label>
            <label className="text-gray-700 text-sm font-bold flex-1">
                    Password
                    <input type="password" className="border rounded w-full py-1 px-2 font-normal"
                    {...register("password", {
                        required: "This field is required",
                        minLength: {
                            value: 6,
                            message: "Password must be atleast 6 characters"
                        }
                    })}></input>
                    {errors.password && (/* if left is true then do right, if error for firstName property exists */
                        <span className="text-red-500">{errors.password.message}</span>
                    )}
            </label>
            <span className="flex items-center justify-between">
                <span className="text-sm">
                    Not Registered? <Link to="/register" className="underline">Create an account here</Link>
                </span>
                <button type="submit" className="bg-blue-700 text-white p-2 font-bold hover:bg-blue-500 text-xl">
                    Login
                </button>
            </span>
        </form>
    )
}

export default SignIn;