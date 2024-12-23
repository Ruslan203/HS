// src/components/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="footer mt">
            <div className="container">
                <div className="row">
                    <div className="col-12 col-lg-6 footer__left">
                        <div className="row nav-footer">
                            <div className="col-6 col-sm-4"><a href="#" className="nav-footer__link">Мастера</a></div>
                            <div className="col-6 col-sm-4"><a href="#" className="nav-footer__link">Салоны</a></div>
                            <div className="col-6 col-sm-4"><a href="#" className="nav-footer__link">Работы</a></div>
                            <div className="col-6 col-sm-4"><a href="#" className="nav-footer__link">Заказы</a></div>
                            <div className="col-6 col-sm-4"><a href="#" className="nav-footer__link">Значения</a></div>
                            <div className="col-6 col-sm-4"><a href="#" className="nav-footer__link">Магазин</a></div>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6 footer__right">
                        <div className="social">
                            <a href="#" target="_blank" className="social__item social__item--vk"><i className="fab fa-vk"></i></a>
                            <a href="#" target="_blank" className="social__item social__item--facebook"><i className="fab fa-facebook-f"></i></a>
                            <a href="#" target="_blank" className="social__item social__item--twitter"><i className="fab fa-twitter"></i></a>
                            <a href="#" target="_blank" className="social__item social__item--instagram"><i className="fab fa-instagram"></i></a>
                            <a href="#" target="_blank" className="social__item social__item--ok"><i className="fab fa-odnoklassniki"></i></a>
                            <a href="#" target="_blank" className="social__item social__item--youtube"><i className="fab fa-youtube"></i></a>
                            <a href="#" target="_blank" className="social__item social__item--telegram"><i className="fab fa-telegram-plane"></i></a>
                        </div>
                        <div className="copy">© RusTattoo, 2020</div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;