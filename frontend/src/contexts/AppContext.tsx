/*  Global State
Hold properties exposed to our components
 */
import React, { useContext, useState } from 'react';
import Toast from '../components/Toast';
import { useQuery } from 'react-query';
import * as apiClient from '../api-client';

type ToastMessage = {
    message: string;
    type: "SUCCESS" | "ERROR";
}
//All components are exposed to below contexts
type AppContext = {
    showToast: (toastMessage: ToastMessage) => void;
    isLoggedIn: boolean;
}
/* 
by default- undefined */
const AppContext = React.createContext<AppContext | undefined>(undefined);  //gives access to everything in context

//Similar to regular components - can store states/use hooks. Takes in react Node as props
export const AppContextProvider = ({children}:{children:React.ReactNode}) => {

    const [toast, setToast] = useState<ToastMessage | undefined>(undefined);
    //indicate if validate token endpoint returns a 401 - user not logged in
    const { isError } = useQuery("validateToken", apiClient.validateToken, {
        retry: false,
    });

    return(
        <AppContext.Provider 
        value={{
            showToast: (toastMessage) => {setToast(toastMessage)},
            isLoggedIn: !isError    //isError - False ==> isLoggedIn - True
            }}>
            {/* when onClose called - Toast is set to undefined, LHS of conditional op-&& results in false, removing Toast message */}
            {toast && (<Toast message={toast.message} type={toast.type} onClose={() => setToast(undefined)}/>)} 
            {children}
        </AppContext.Provider>
    )
};
//Easier to use App Context in other components
export const useAppContext = () => {
    const context = useContext(AppContext);
    return context as AppContext;
};