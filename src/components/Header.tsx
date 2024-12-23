// src/components/Header.tsx
import React from 'react';
import Link from 'next/link';

const Header: React.FC = () => {
    return (
        <header className="header">
            <div className="container">
                <div className="row align-items-center header__wrapper">
                    <div className="col-3 col-sm-2 header__burger">
                        <div className="burger"><span></span></div>
                    </div>
                    <div className="col-6 col-sm-8 col-lg-2 logo header__logo">
                        <Link href="/">
                            <a className="logo__link">
                                <img src="/images/logo.svg" className="logo__image" alt="Logo" />
                            </a>
                        </Link>
                    </div>
                    <div className="col-2 d-none d-lg-block city header__city">
                        <a href="#" className="city__link">Москва</a>
                    </div>
                    <div className="col-6 d-none d-lg-block nav header__nav">
                        <ul className="nav__list">
                            <li className="nav__item"><a href="#" className="nav__link nav__link--active">Мастера</a></li>
                            <li className="nav__item"><a href="#" className="nav__link">Салоны</a></li>
                            <li className="nav__item"><a href="#" className="nav__link">Работы</a></li>
                            <li className="nav__item"><a href="#" className="nav__link">Заказы</a></li>
                            <li className="nav__item"><a href="#" className="nav__link">Значения</a></li>
                            <li className="nav__item"><a href="#" className="nav__link">Магазин</a></li>
                        </ul>
                    </div>
                    <div className="col-3 col-sm-2 col-lg-2 header__profile">
                        <a href="#" className="header__shop"><span className="header__shop-notify">1</span></a>
                        <a href="#" className="header__profile-link">Вход</a>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;