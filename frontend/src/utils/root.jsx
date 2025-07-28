import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext"
import { useEffect } from "react";
// import (useEffect)


const Root=()=>{
    const  {user}= useAuth();
const navigate = useNavigate();
    useEffect(()=>{
    if(user){

      if (user.role==="admin"){
        navigate("/admin/dashboard");
       }
      else if ( user.role =="employee"){
        navigate("/customer/dashboard");

       }
      else {
        navigate("/login")
        }
    } 
    else{
      navigate("/login");
   }
  },[user, navigate])

  return null;
}


export default Root;