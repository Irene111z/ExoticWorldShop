import React, { useContext } from 'react'
import {Routes, Route, Navigate, useLocation} from 'react-router-dom'
import { authRoutes, publicRoutes, adminRoutes } from '../routes'
import { HOMEPAGE_ROUTE } from '../utils/path'
import { Context } from '../index'

const AppRouter = () => {
  const {user} = useContext(Context)
  const location = useLocation();
  // console.log("isAuth",user.isAuth)
  // console.log("isAdmin",user.isAdmin)
  return (
    <Routes>
        {
            user.isAuth && authRoutes.map(({path, Component})=>
            <Route key={path} path = {path} element = {<Component/>} />)
        }
        {
            user.isAuth && user.isAdmin && adminRoutes.map(({path, Component})=>
            <Route key={path} path = {path} element = {<Component/>} />)
        }
        {
            publicRoutes.map(({path, Component})=>
            <Route key={path + location.pathname} path = {path} element = {<Component/>} />)
        }
        <Route path="*" element={<Navigate to={HOMEPAGE_ROUTE} />} />
    </Routes>
  )
}

export default AppRouter