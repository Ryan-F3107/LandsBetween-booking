import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";

import * as apiClient from '../api-client';
import { useAppContext } from "../contexts/AppContext";

export type RegisterFormData = {
    firstName:string;
    lastName:string;
    email:string;
    password:string;
    confirmPassword:string;
}
const Register = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { showToast } = useAppContext();
    //watch-allows us to use values from other input fields,
    //destructured errors from formState
    const { register, watch, handleSubmit, formState:{errors} } = useForm<RegisterFormData>(); //passed to all the inputs
    //react-query used so that we don't have to manually manage the stage, it is built into the mutation hook - update data on server
    const mutation = useMutation(apiClient.register, {
        onSuccess: async() => {  //both below items run onSuccess
            showToast({message: "Registration Success", type:"SUCCESS"});   //Since Toast is in AppContext - will remain visible even if navigated onto home page
            //need to wait for validation before navigating to homePage
            await queryClient.invalidateQueries("validateToken");
            navigate("/");
        },
        onError: (error: Error) => {
            showToast({message: error.message, type:"ERROR"});
        }
    });

    /* 
    .mutate calls apiClient function
     */
    const onSubmit = handleSubmit((data) => {
        mutation.mutate(data); 
    })

    return (
        <form className="flex flex-col gap-5" onSubmit={onSubmit}> {/* Form is submitted when we click enter or the button */}
            <h2 className="text-3xl font-bold">Create an account</h2>
            <div className="flex flex-col md:flex-row gap-5">
                <label className="text-gray-700 text-sm font-bold flex-1">
                    First Name
                    <input className="border rounded w-full py-1 px-2 font-normal" 
                    {...register("firstName", {required: "This field is required"})}></input>
                    {errors.firstName && (/* if left is true then do right, if error for firstName property exists */
                        <span className="text-red-500">{errors.firstName.message}</span>
                    )}
                </label>
                <label className="text-gray-700 text-sm font-bold flex-1">
                    Last Name
                    <input className="border rounded w-full py-1 px-2 font-normal"
                    {...register("lastName", {required: "This field is required"})}></input>
                    {errors.lastName && (/* if left is true then do right, if error for firstName property exists */
                        <span className="text-red-500">{errors.lastName.message}</span>
                    )}
                </label>
            </div>
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
            <label className="text-gray-700 text-sm font-bold flex-1">
                    Confirm Password
                    <input type="password" className="border rounded w-full py-1 px-2 font-normal"
                    {...register("confirmPassword", {
                        validate:(val)=>{
                            if(!val){
                                return "This field is required";
                            } else if(watch("password") !== val) {
                                return "Your passwords do no match";
                            }
                        }
                    })}></input>
                    {errors.confirmPassword && (/* if left is true then do right, if error for firstName property exists */
                        <span className="text-red-500">{errors.confirmPassword.message}</span>
                    )}
            </label>
            <span>
                <button type="submit" className="bg-blue-700 text-white p-2 font-bold hover:bg-blue-500 text-xl">
                    Create Account
                </button>
            </span>
        </form>
    )
}

export default Register