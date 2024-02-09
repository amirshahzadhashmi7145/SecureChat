import {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

const Signup = () => {
    const [name,setName] = useState('');
    const [password,setPassword] = useState('');
    const [username,setUsername] = useState('');
    const [email,setEmail] = useState('');

    const navigate = useNavigate();

    axios.interceptors.response.use(
        response => {
            return response
        },
        error => {
            if (!error.response) {
                alert("Check Your Internet Connection")
            }

            return Promise.reject(error)
        }
    )
    const handleClick = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8000/register',{name:name,username:username,password:password,email:email})
            .then((response) => {
                console.log(response)
                if(response.status === 200){
                    alert('Registered Successfully!')
                    navigate("/login")
                }
            })
            .catch(error => {
                if(error.response.status === 409){
                    alert("Username and Email must be unique!")
                }
                else{
                    alert("Server Error. Try Again Later!")
                }
            })
    }

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img
                    className="mx-auto h-96 w-96"
                    src="https://png.pngtree.com/png-clipart/20230915/original/pngtree-secure-chat-icon-with-locker-and-password-symbol-vector-illustration-vector-png-image_12211142.png" />
                <h2 className="-mt-14 text-3xl tracking-tight font-bold leading-9 text-gray-900">Get Registered With Us</h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6">
                    <div>
                        <label className="pb-1.5 text-start block font-medium text-gray-700 text-sm leading-6">Full
                            Name</label>
                        <div>
                            <input
                                id='name'
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value)
                                }}
                                name='name'
                                type='text'
                                required
                                className="px-2 block w-full rounded-md py-1.5 shadow-sm text-gray-800 ring-1 ring-inset ring-gray-300 bg-white placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="pb-1.5 text-start block font-medium text-gray-700 text-sm leading-6">Username</label>
                        <div>
                            <input
                                id='username'
                                value={username}
                                onChange={(e) => {
                                    setUsername(e.target.value)
                                }}
                                name='username'
                                type='text'
                                required
                                className="px-2 block w-full rounded-md py-1.5 shadow-sm text-gray-800 ring-1 ring-inset ring-gray-300 bg-white placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="pb-1.5 text-start block font-medium text-gray-700 text-sm leading-6">Email
                            Address</label>
                        <div>
                            <input
                                id='email'
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value)
                                }}
                                name='email'
                                type='email'
                                autoComplete='email'
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
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                name="password"
                                type="password"
                                required
                                className="px-2 block w-full rounded-md py-1.5 shadow-sm text-gray-800 ring-1 ring-inset ring-gray-300 bg-white placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            onClick={handleClick}
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                            Register
                        </button>
                    </div>

                </form>
            </div>


        </div>
    )
}

export default Signup;