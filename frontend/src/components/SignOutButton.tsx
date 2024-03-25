import { useMutation, useQueryClient } from "react-query";

import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";

const SignOutButton = () => {
    const queryClient = useQueryClient();
    const {showToast} = useAppContext();
    //apiClient.signOut gives us an expired token
    const mutation = useMutation(apiClient.signOut, {
        onSuccess: async() => {
            //force the validateToken to run again, in appContext it gives an error - that user is not logged in
            //Ensures that the UI refreshes and user does not need to refresh the page manually
            await queryClient.invalidateQueries("validateToken")    //validateToken comes from the appContext
            showToast({message: "Sign Out Successful", type:"SUCCESS"})
        },
        onError: (error: Error) => {
            showToast({message: error.message, type:"ERROR"})
        } 
    });
    const handleClick = () => {
        mutation.mutate();
    }
    return (
        <button onClick={handleClick} className="text-blue-600 px-3 font-bold hover:bg-gray-100 bg-white">
            Sign Out
        </button>
    )
}

export default SignOutButton;