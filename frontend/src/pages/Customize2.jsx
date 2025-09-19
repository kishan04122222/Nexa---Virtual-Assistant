import React, { useContext, useState } from 'react'
import { userDataContext } from '../context/userContext'
import axios from 'axios'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';


const Customize2 = () => {
    const {userData,selectedImage,backendImage,serverUrl,setUserData} = useContext(userDataContext)
    const [AssistantName,setAssistantName] = useState(userData?.AssistantName || "")
    const [loading,setLoading] = useState(false);
    const navigate = useNavigate()

    const handleUpdateAssistant = async() =>{
      setLoading(true)
      try {
        let formData = new FormData()
        formData.append("assistantName",AssistantName)
        if(backendImage){
          formData.append("assistantImage",backendImage)
        }else{
          formData.append("imageUrl",selectedImage)
        }

        const result = await axios.post(`${serverUrl}/api/user/update`,formData,{withCredentials:true})
        setLoading(false)
        console.log(result.data)
        setUserData(result.data)
        navigate("/")
      } catch (error) {
        setLoading(false)
        console.log(error)
      }
    }
    
  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353] flex items-center justify-center p-[20px] relative  flex-col'>
      <IoIosArrowRoundBack className='absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer' onClick={()=>navigate("/customize")}/>

      <h1 className='text-white text-[30px] mb-[40px] text-center'>Enter Your <span className='text-blue-300'>Assistant Name</span></h1>

       <input type="text" placeholder="eg. Jarvis" className="px-[20px] py-[10px] w-full max-w-[600px] h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 rounded-2xl text-[18px]" required onChange={(e) => setAssistantName(e.target.value)} value={AssistantName}/>

       {AssistantName && <button className='text-[19px] mt-[30px] text-black font-semibold cursor-pointer min-w-[300px] h-[60px] bg-white rounded-2xl'disabled={loading} onClick={() =>{
        handleUpdateAssistant()
       }}>{!loading? "Move Ahead" : "Loading..."}</button>}
    </div>
  )
}

export default Customize2
