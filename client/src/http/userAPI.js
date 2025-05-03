import { $authHost, $host } from "./index";
import { jwtDecode } from "jwt-decode"

export const registration = async(email, password, name, lastname, phone, img) =>{
    const {data} = await $host.post('api/user/reg', {email, password, name, lastname, phone, img})
    localStorage.setItem('token', data.jwt_token)
    return jwtDecode(data.jwt_token)
}
export const login = async(email, password) =>{
    const {data} = await $host.post('api/user/login', {email, password})
    localStorage.setItem('token', data.jwt_token)
    return jwtDecode(data.jwt_token)
}
export const check_token = async() =>{
    const {data} = await $authHost.get('api/user/check_token')
    localStorage.setItem('token', data.jwt_token)
    return jwtDecode(data.jwt_token)
}