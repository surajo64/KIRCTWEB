import { createContext, useEffect } from "react";
import { doctors } from "../assets/assets";
import axios from 'axios'
import { useState } from "react";
import { toast } from 'react-toastify'


export const AppContext = createContext();

const AppContextProvider = (props) => {

  const currencySymbol = '₦'

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : false)

  const [userData, setUserData] = useState(false)
  
  
  

  const value = {
    
    currencySymbol,
    token, setToken,
    backendUrl,
    userData,setUserData,
   
  }

  return (

    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}
export default AppContextProvider