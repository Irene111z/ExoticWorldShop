import React from 'react'
import './Banner.css'

const Banner = () => {
  return (
    <div className='banner-home'>
      <img src="/static/home-img.png" alt="" />
      <div className="banner-home-content">
        <div className="d-flex flex-column justify-content-between container-fluid container-xxl">
        <p className='banner-home-title my-0'>My Exotic Friend</p>
        <p className='banner-home-text'>магазин зоотоварів для екзотичних тварин</p>
        </div>
      </div>
      <div className="banner-home-content-bottom">
        <div className="d-flex flex-column justify-content-between container-fluid container-xxl">
        {/* <p className='banner-home-title text-end'>“Ми відповідальні за тих,<br></br>кого приручили”</p> */}
        </div>
      </div>
      <img src="/static/divider-home-banner.svg" alt="" className='banner-home-divider'/>
    </div>
  )
}

export default Banner