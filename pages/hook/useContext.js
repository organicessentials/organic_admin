import React, { createContext, useContext, useState ,useEffect} from "react";
import { index } from "../../service/api/orders";
import {show} from "../../service/api/affilates";
import { userCount } from "../../service/api/customer";
import { showComments } from "../../service/api/review";



  
const AuthContext = createContext({});
  
export const AuthProvider = ({ children }) => {
    const [order, setOrder] = useState(""); 
    const [affilateUser,setAffilateUser] = useState("")
    const [user,setUser] = useState("")
    const [review,setReview] = useState("")
 
    useEffect(() => {
       index().then((data)=>{
        setOrder(data);
       }).catch((err)=>{
        console.log(err);
       })
    }, [])

    useEffect(() => {
      show().then((data)=>{
        setAffilateUser(data);
      })
    }, [])

   useEffect(() => {
    userCount().then((data)=>{
        setUser(data);
    }).catch((err)=>{
        console.log(err);
    })
   }, [])

   useEffect(() => {
    showComments()
        .then((data) => {
            const processingReviews = data.filter((doc) => doc.status === "processing");
            setReview(processingReviews);
        })
        .catch((err) => {
            console.log(err);
        });
}, []);

   
   
    
    
  
    return (
      <AuthContext.Provider
        value={{
            order,
            affilateUser,
            user,review
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  };
  
export default function useAuth() {
    return useContext(AuthContext);
}