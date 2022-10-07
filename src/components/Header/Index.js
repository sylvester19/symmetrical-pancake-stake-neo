import React, { useState } from 'react'
import logo from "../../logo.png";
import { Link } from '@reach/router';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { GiHamburgerMenu } from "react-icons/gi";

const Header = () => {

    const [isOpen, setOpen] = useState(false);
    const [active, setActive] = useState("-1");

    const handleClick = (event) => {
        setActive(event.target.id);
    };


    return (
        <nav className="main-nav">
            <div className="logo">
                <a target="__blank" href='https://noe-global.com/'><img src={logo} alt="img" /></a>
            </div>
            <div className={isOpen ? " mobile-menu-link" : "menu-link"}>
                <ul className="navbarul">
                    <li>
                        <Link to="/">
                            <a
                                className={active === "-1" ? "actived" : ""}
                                href="/#"
                                id={"-1"}
                                onClick={handleClick}
                            >
                                Staking
                            </a>
                        </Link>
                    </li>
                    <li>
                        <Link to="/earn">
                            <a
                                className={active === "0" ? "actived" : ""}
                                href="/#"
                                id={"0"}
                            >
                                Earn
                            </a>
                        </Link>
                    </li>
                    <li>
                        <a
                            className={active === "1" ? "actived" : ""}
                            href="/#"
                            id={"1"}
                            onClick={handleClick}
                        >
                            Farming
                        </a>
                    </li>
                    <li>
                        <a
                            className={active === "2" ? "actived" : ""}
                            href="/#"
                            id={"2"}
                            onClick={handleClick}
                        >
                            Lending
                        </a>
                    </li>
                    <li>
                        <a href="/#"
                            rel="noreferrer"
                            className={active === "3" ? "actived" : ""}
                            id={"3"}
                            onClick={handleClick}
                        >
                            Affiliation
                        </a>
                    </li>
                    <li>
                        <a href="/#"
                            className={active === "4" ? "actived" : ""}
                            id={"4"}
                            onClick={handleClick}
                        >
                            Swap
                        </a>
                    </li>
                    {/* <li>
            <NavLink
              className={active === "5" ? "actived" : ""}
              id={"5"}
              onClick={handleClick}
              to="/"
            >
              Market
            </NavLink>
          </li> */}

                    {/* <button className="contact-btn">connect wallet</button> */}
                    <ConnectButton className="contact-btn" sx={{ color: '#000000' }} />
                </ul>
                {/* hamburger menu code below */}
            </div>
            <div className="button">
                <div className="ham">
                    <GiHamburgerMenu onClick={() => setOpen(!isOpen)} />
                </div>
            </div>
        </nav>
    );
}
export default Header;