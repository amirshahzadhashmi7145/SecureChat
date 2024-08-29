import axios from "axios";
import {useState} from "react";
import {useDispatch} from "react-redux";
import {loginSuccess} from "../redux/actions/authAction.js";
import {useNavigate} from "react-router-dom";

const Login = () => {
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleClick = (e) => {
        e.preventDefault();
        axios.post('http://34.67.130.26/securechat/api/login',{username:username,password:password},{withCredentials:true})
            .then((response) => {
            if(response.data.Status === "Success"){
                console.log(response.data)
                dispatch(loginSuccess(response.data.userId))
                navigate('/');
                alert("Welcome "+response.data.name+" To SecureChat");
            }
        })
            .catch(err => {
                if(err.response.status === 401 || err.response.status === 404){
                    alert("Credentials not correct")
                }
                else{
                    alert("Server Error Try Again Later!")
                }
            })
    }

    const handleRegisterNavigation = () => {
        navigate('/signup');
    };

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img
                    className="mx-auto h-96 w-96"
                    src="https://png.pngtree.com/png-clipart/20230915/original/pngtree-secure-chat-icon-with-locker-and-password-symbol-vector-illustration-vector-png-image_12211142.png"  alt='logo'/>
                <h2 className="-mt-14 text-3xl tracking-tight font-bold leading-9 text-gray-900">Sign in to your account</h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6">
                    <div>
                        <label
                            className="pb-1.5 text-start block font-medium text-gray-700 text-sm leading-6">Username</label>
                        <div>
                            <input
                                id='username'
                                name='username'
                                type='username'
                                autoComplete='username'
                                onChange={(e) => {
                                    setUsername(e.target.value)
                                }}
                                value={username}
                                required
                                className="px-2 block w-full rounded-md py-1.5 shadow-sm text-gray-800 ring-1 ring-inset ring-gray-300 bg-white placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="pb-1.5 text-start block text-sm text-gray-700 leading-6 font-medium">
                            Password
                        </label>
                        <div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                }}
                                required
                                className="px-2 block w-full rounded-md py-1.5 shadow-sm text-gray-800 ring-1 ring-inset ring-gray-300 bg-white placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            onClick={handleClick}>
                            Sign in
                        </button>
                    </div>

                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{" "}
                            <span
                                onClick={handleRegisterNavigation}
                                className="text-indigo-600 hover:text-indigo-500 cursor-pointer"
                            >
                                Register here
                            </span>
                        </p>
                    </div>

                </form>
            </div>

        </div>
    )
}

export default Login;