import axios from 'axios'
import React from 'react'


const axiosPublic =  axios.create({
    baseURL: ' https://foodi-client-b9e3c.web.app',
  })

const useAxiosPublic = () => {
  return axiosPublic
}

export default useAxiosPublic;

  