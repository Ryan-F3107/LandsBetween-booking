import {Link} from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import SignOutButton from './SignOutButton';

const Header = () => {
    const {isLoggedIn} = useAppContext();
return (
    <div className="bg-blue-900 py-6">
        <div className="container mx-auto flex justify-between">
            <span className="text-3xl text-white font-bold tracking-tight">{/* tracking-tigh gives logo effect */}
                <Link to="/">LandsBetween_Holidays.com</Link>
            </span>
            <span className="flex space-x-2 ">
                {isLoggedIn ? <>
                    <Link to="/my-bookings" 
                    className="flex items-center text-white px-3 font-bold hover:bg-blue-600">
                        My Bookings
                    </Link>
                    <Link to="/my-hoyels" 
                    className="flex items-center text-white px-3 font-bold hover:bg-blue-600">
                        My Hotels
                    </Link>
                    <SignOutButton/>
                </>:
                <Link to="/sign-in" className="flex bg-white items-center text-blue-500 px-3 font-bold hover:bg-grey-100">
                    Sign In
                </Link>
                }
                
            </span>{/* adds space to child element by 2 */}
        </div>
    </div>
);
}

export default Header;
