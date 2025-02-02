import { useEffect } from "react";

type ToastProps = {
    message: string;
    type: "SUCCESS" | "ERROR";
    onClose: () => void;
}

const Toast = ({message,type, onClose}: ToastProps) => {
    
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000);   //after 5s onClose is called
        return () => {
            clearTimeout(timer);    //resets the timer
        }
    },[onClose]);   //depends on state of onClose
    const styles = type === "SUCCESS"
    ? "fixed top-4 right-4 z-50 p-4 rounded-md bg-green-600 text-white max-w-md"
    : "fixed top-4 right-4 z-50 p-4 rounded-md bg-red-600 text-white max-w-md"
    
    return (
        <div className={styles}>
            <div className="flex justify-content items-center">
                <span className="text-lg font-semibold">{message}</span>
            </div>
        </div>
    )
}

export default Toast;