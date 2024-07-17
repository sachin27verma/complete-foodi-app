import axios from 'axios'
import React from 'react'


const axiosPublic =  axios.create({
    baseURL: ' https://complete-foodi-server-whx8.onrender.com/',
  })

const useAxiosPublic = () => {
  return axiosPublic
}

export default useAxiosPublic;

  
