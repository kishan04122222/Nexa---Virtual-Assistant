import React, { useContext, useRef, useState } from 'react'
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useEffect } from 'react'
import aiImg from "../assets/ai.gif"
import userImg from "../assets/user.gif"
import { CgMenuRight } from "react-icons/cg";
import { RxCross1 } from "react-icons/rx";


const Home = () => {
  const {userData,serverUrl,setUserData,getGeminiResponse} = useContext(userDataContext)
  const navigate = useNavigate()
  const [listening,setListening] = useState(false)
  const isSpeakingRef = useRef(false)
  const recognitionRef = useRef(null)
  const [userText,setUserText] = useState("")
  const [aiText,setAiText] = useState("")
  const isRecognizingRef = useRef(false)
  const [ham,setHam] = useState(false)
  const synth = window.speechSynthesis

  const handleLogout = async() =>{
    try {
      const result = await axios.get(`${serverUrl}/api/auth/logout`,{withCredentials:true})
      setUserData(null)
      navigate("/signin")
    } catch (error) {
      setUserData(null)
      console.log(error)
    }
  }

  const startRecognition = () =>{
    if(!isRecognizingRef.current && !isSpeakingRef.current){
      try {
      recognitionRef.current?.start();
      setListening(true)
    } catch (error) {
      if(!error.message.includes("start")){
        console.error("Recognition error ",error);
      }
    }
    }
    
  }

  const speak = (text) =>{
    const utterence = new SpeechSynthesisUtterance(text);

    utterence.lang = 'hi-IN'
    const voices = window.speechSynthesis.getVoices()
    const hindivoice = voices.find(v =>v.lang === 'hi-IN');
    if(hindivoice){
      utterence.voice = hindivoice;
    }

    isSpeakingRef.current = true;
    utterence.onend = () =>{
      setAiText("")
      isSpeakingRef.current = false
      setTimeout(()=>{
          startRecognition()
      },800)
      
    }
    synth.cancel()
    synth.speak(utterence)
  }

  const handleCommand = (data) =>{
    const {type,userInput,response} = data;
    speak(response);

    if(type === 'google-search'){
      const query = encodeURIComponent(userInput)
      window.open(`https://www.google.com/search?q=${query}`,'_blank');
    }

    if(type === 'calculator-open'){
      window.open(`https://www.google.com/search?q=calculator`,'_blank')
    }

    if(type === 'facebook-open'){
      window.open(`https://www.facebook.com`,'_blank');
    }

    if(type === 'instagram-open'){
      window.open(`https://www.instagram.com`,'_blank')
    }

    if(type === 'weather-show'){
      window.open(`https://www.google.com/search?q=weather`,'_blank')
    }

    if(type === 'youtube-search' || type === 'youtube-play'){
      const query = encodeURIComponent(userInput)
      window.open(`https://www.youtube.com/results?search_query=${query}`,'_blank')
    }
  }

  useEffect(() =>{
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition ;
    
    const recognition = new SpeechRecognition()

    recognition.continuous = true;
    recognition.lang = 'en-US';
    recognition.interimResults = false

    recognitionRef.current = recognition;

   let isMounted = true; //flag to avoid setState on unmounted component

   const startTimeout = setTimeout(()=>{
    if(isMounted && !isSpeakingRef.current && !isRecognizingRef.current){
      try {
        recognition.start();
        console.log("Recognition requested to start")
      } catch (error) {
        if(error.name !== "InvalidStateError"){
          console.error(error)
        }
      }
    }
   },1000)


    recognition.onstart = () =>{
      isRecognizingRef.current = true;
      setListening(true)
    }

    recognition.onend = () =>{
      isRecognizingRef.current = false;
      setListening(false)

      if(isMounted && !isSpeakingRef.current){
        setTimeout(()=>{
          if(isMounted){
            try {
              recognition.start();
              console.log("Recognition restarted")
            } catch (error) {
              if(error.name !== "InvalidStateError"){
          console.error(error)
        }
            }
          }
        },1000)
      }
    }

    recognition.onerror = (event) =>{
      console.warn("Recognition error : ",event.error);
      isRecognizingRef.current = false;
      setListening(false);

      if(event.error !== "aborted" && isMounted && !isSpeakingRef.current){
        setTimeout(() => {
         if(isMounted){
          try {
            recognition.start();
            console.log("Recognition start after error")
          } catch (error) {
            if(error.name != "InvalidStateError") console.log(error)
          }
         }
        }, 1000);
      }
    }
    

    recognition.onresult = async(e) =>{
      const transcript = e.results[e.results.length-1][0].transcript.trim()
      console.log("heard : " + transcript)

      if(transcript.toLowerCase().includes(userData.assistantName.toLowerCase())){
        setAiText("")
        setUserText(transcript)
        recognition.stop()
        isRecognizingRef.current = false
        setListening(false)
        let data = await getGeminiResponse(transcript)
        console.log(data)
        handleCommand(data)
        setAiText(data.response)
        setUserText("")
      }
    }

  
      const greeting = new SpeechSynthesisUtterance(`Hello ${userData.name}, what can I help you with?`);
      greeting.lang = 'hi-IN';
      window.speechSynthesis.speak(greeting)
  
    

    return () =>{
      isMounted = false
      clearTimeout(startTimeout)
      recognition.stop();
      setListening(false)
      isRecognizingRef.current = false;
    }

  },[])

  return (
    <div className='w-full h-[100vh] overflow-hidden bg-gradient-to-t from-[black] to-[#030353] flex items-center justify-center flex-col gap-[15px]'>

      <CgMenuRight className='lg:hidden text-white cursor-pointer absolute top-[20px] right-[20px] w-[25px] h-[25px]'onClick={()=>setHam(true)} />

      <div className={`absolute top-0 lg:hidden w-full h-full bg-[#00000053] backdrop-blur-lg p-[20px] flex flex-col gap-[20px] items-start ${ham? "translate-x-0" : "translate-x-full"} transition-transform`}>
        <RxCross1 className='text-white absolute cursor-pointer top-[20px] right-[20px] w-[25px] h-[25px]' onClick={()=>setHam(false)}/>

        <button className="text-[19px] text-black font-semibold  min-w-[150px] h-[60px] bg-white rounded-2xl  cursor-pointer" onClick={handleLogout}>Logout</button> 

        <button className="text-[19px] cursor-pointer  px-[20px] py-[10px] text-black font-semibold min-w-[150px]   h-[60px] bg-white rounded-2xl" onClick={() =>navigate("/customize")}>Modify your Assistant</button>

        <div className='w-full h-[2px] bg-gray-400'></div>
        <h1 className='text-white text-[19px] font-semibold'>History</h1>

        <div className='w-full h-[400px] overflow-y-auto gap-[20px] flex flex-col '>
         {userData.history?.map((hist, index) => (
  <span
    key={`${hist}-${index}`}
    className="text-gray-200 text-[18px] truncate"
  >
    {hist}
  </span>
))}


        </div>
      </div>



       <button className="text-[19px] mt-[30px] text-black font-semibold hidden lg:block min-w-[150px] h-[60px] bg-white rounded-2xl absolute top-[20px] right-[20px] cursor-pointer" onClick={handleLogout}>Logout</button> 

        <button className="text-[19px] cursor-pointer mt-[30px] hidden lg:block px-[20px] py-[10px] text-black font-semibold min-w-[150px] absolute top-[100px] right-[20px] h-[60px] bg-white rounded-2xl" onClick={() =>navigate("/customize")}>Modify your Assistant</button>
      <div className='flex justify-center items-center overflow-hidden  rounded-4xl w-[300px] h-[400px] shadow-lg'>
        <img src={userData?.assistantImage} alt=""  className='h-full object-cover'/>
      </div> 
      <h1 className='text-white text-[18px] font-semibold'>I'm {userData?.assistantName}</h1>

      {!aiText && <img src={userImg} alt='' className='w-[200px]'/>}
      {aiText && <img src={aiImg} alt='' className='w-[200px]'/>}

      <h1 className="text-[18px] font-semibold text-wrap text-white">{userText? userText : aiText? aiText : null}</h1>

    </div>
  )
}

export default Home
