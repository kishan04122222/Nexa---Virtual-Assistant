import React, { useContext, useRef, useState } from 'react'
import img1 from "../assets/img1.jpg";
import img2 from "../assets/img2.jpg";
import img3 from "../assets/img3.jpg";
import img4 from "../assets/img4.jpg";
import img5 from "../assets/img5.jpg";
import img6 from "../assets/img6.jpg";
import Card from '../components/Card';
import { LuImagePlus } from "react-icons/lu";
import authbg from "../assets/authbg.jpg"
import { IoIosArrowRoundBack } from "react-icons/io";
import { userDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const Customize = () => {

  const navigate = useNavigate();

  const {serverUrl ,userData,setUserData,frontendImage,setFrontendImage,backendImage,setBackendImage,
      selectedImage,setSelectedImage
    } = useContext(userDataContext)
  const inputImage = useRef()

  const handleImage = (e) =>{
    const file = e.target.files[0];
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
  }

  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353] flex items-center justify-center p-[20px]  flex-col'>
       <IoIosArrowRoundBack className='absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer' onClick={()=>navigate("/")}/>
      <h1 className='text-white text-[30px] mb-[40px] text-center'>Select Your <span className='text-blue-300'>Assistant Image</span></h1>
      <div className='w-full max-w-[900px] flex items-center justify-center flex-wrap gap-[15px] '>
        <Card image={img1}/>
        <Card image={img2}/>
        <Card image={img3}/>
        <Card image={img4}/>
        <Card image={authbg}/>
        <Card image={img5}/>
        <Card image={img6}/>

         <div className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-[#030326] border-2 border-[#181860] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white flex items-center justify-center ${selectedImage == "input" ? "border-4 border-white shadow-2xl shadow-blue-950":null}`} onClick={() => {inputImage.current.click() 
          setSelectedImage("input")}}>
     {!frontendImage && <LuImagePlus className='w-[25px] h-[25px] text-white' />}
     {frontendImage && <img src={frontendImage} className='h-full object-cover'/>}
    </div>
    <input type="file" accept='image/*' ref={inputImage} hidden onChange={handleImage}/>
      </div>
      {selectedImage && <button className='text-[19px] mt-[30px] text-black font-semibold cursor-pointer min-w-[150px] h-[60px] bg-white rounded-2xl' onClick={()=>navigate("/customize2")}>Next</button>}
      
    </div>
  )
}

export default Customize
