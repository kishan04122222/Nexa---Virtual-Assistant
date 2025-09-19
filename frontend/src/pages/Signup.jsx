import React, { useContext, useState } from "react";
import bg from "../assets/authbg.jpg";
import { IoEye, IoEyeOff } from "react-icons/io5";
import {useNavigate} from 'react-router-dom'
import { userDataContext } from "../context/userContext";
import axios from "axios"

const Signup = () => {
    const [showPassword,setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [name,setName] = useState("");
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const {serverUrl,userData,setUserData}  = useContext(userDataContext)
    const [err,setErr] = useState("")
    const [loading,setLoading] = useState(false)


    const handleSignUp = async(e) =>{
      e.preventDefault()
      setErr("")
      setLoading(true)
      try {
        let result = await axios.post(`${serverUrl}/api/auth/signup`,{
          name,email,password
        },{withCredentials:true})

        setUserData(result.data)
        setLoading(true)
        navigate("/customize")
      } catch (error) {
        console.log(error);
        setUserData(null)
        setLoading(true)
        setErr(error.response.data.message)
      }
    }

  return (
    <div
      className="w-full h-[100vh] bg-cover flex items-center justify-center"
      style={{backgroundImage: `url(${bg})`}}>

        <form className='w-[90%] h-[600px] max-w-[500px] backdrop-blur shadow-lg shadow-black bg-[#00000062] flex items-center justify-center flex-col gap-[20px] px-[20px]' onSubmit={handleSignUp}>

            <h1 className='mb-[30px] text-white font-semibold text-[30px]'>
                Register to <span className="text-blue-800">Nexa</span></h1>

                
                <input type="text" placeholder="Enter Your Name" className="px-[20px] py-[10px] w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 rounded-2xl text-[18px]" required onChange={(e) => setName(e.target.value)} value={name}/>

                <input type="email" placeholder="Enter Your Email" className="px-[20px] py-[10px] w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 rounded-2xl text-[18px]" required onChange={(e) => setEmail(e.target.value)} value={email} />

                <div className="w-full h-[60px] border-2 relative bg-transparent border-white text-[18px] rounded-2xl text-white">
                    <input type={showPassword?"text":"password"} placeholder="Enter Password" className="w-full h-full py-[10px] px-[20px] placeholder-gray-300 bg-transparent outline-none rounded-2xl" required onChange={(e) => setPassword(e.target.value)} value={password}/>

                    {!showPassword && <IoEye className="top-[18px] right-[20px] w-[25px] h-[25px] text-[white] absolute"  onClick={() =>setShowPassword(true)}/> }

                    {showPassword && <IoEyeOff className="top-[18px] right-[20px] w-[25px] h-[25px] text-[white] absolute"  onClick={() =>setShowPassword(false)}/> }
                    
                </div>

                {err.length > 0 && <p className="text-red-500">
                  *{err}
                  </p>}

                <button className="text-[19px] mt-[30px] text-black font-semibold min-w-[150px] h-[60px] bg-white rounded-2xl"disabled={loading}>{loading?"Loading...":"Sign Up"}</button>

                <p className="text-[white] cursor-pointer text-[18px]" onClick={() => navigate("/signin")}>Already have an account ? <span className="text-blue-500">Sign In</span></p>
        </form>
    </div>
  );
};

export default Signup;

