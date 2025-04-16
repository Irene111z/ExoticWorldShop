import { $authHost, $host } from "./index";
import { jwtDecode } from "jwt-decode"

export const registration = async(email, password, name, lastname, phone) =>{
    const {data} = await $host.post('api/user/reg', {email, password, name, lastname, phone})
    return jwtDecode(data.jwt_token)
}
export const login = async(email, password) =>{
    const {data} = await $host.post('api/user/login', {email, password})
    return jwtDecode(data.jwt_token)
}
export const auth = async() =>{
    const res = await $host.post('api/user/auth')
    return res
}