import React from 'react';
import Slider from 'react-slick';
import './TgBot.css';

const imagePaths = [
  "/static/bot-slide1.svg",
  "/static/bot-slide2.svg",
  "/static/bot-slide3.svg",
  "/static/bot-slide4.svg",
  "/static/bot-slide5.svg",
  "/static/bot-slide6.svg",
  "/static/bot-slide7.svg",
  "/static/bot-slide8.svg",
];

const TgBot = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 15000,
    slidesToShow: 4,
    slidesToScroll: 4,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: 'linear',
    arrows: false,
    pauseOnHover: false,
  };

  return (
    <div className="tg-bot-container container-fluid container-xxl d-flex flex-column mt-5">
      <p className="tg-bot-title mb-5">Маєте питання щодо вашого екзотика?</p>
      <div className="tg-bot-slider-wrapper" style={{ width: '100%' }}>
        <Slider {...settings}>
          {imagePaths.map((src, i) => (
            <div key={i} className="tg-bot-slide">
              <img
                src={src}
                alt={`Питання ${i + 1}`}
                style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
              />
            </div>
          ))}
        </Slider>
      </div>
      <div className="d-flex justify-content-center align-items-center">
        <img src="/static/AI-assistant.svg" alt="" className='me-5' />
        <div className="d-flex flex-column assistant-block ms-5">
          <p className='mb-2'><strong>Наш <a style={{ color: '#B4FF3B', textDecoration:'none'}} href='https://t.me/exotic_world_bot'>AI-асистент</a> залюбки надасть Вам відповідь!</strong></p>
          <p className='mb-2'>Почніть розмову вже зараз.</p>
          <a href="https://t.me/exotic_world_bot" target="_blank" rel="noreferrer" className="tg-bot-link mb-0">
            <div className="d-flex">
              <img src="/static/telegram-icon.svg" alt="" className='me-3' />
              <p className='mb-0'>t.me/exotic_world_bot</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default TgBot;
