import React from "react";
import { BsGlobe } from 'react-icons/bs'
import { BsInstagram } from 'react-icons/bs'
import { BsYoutube } from 'react-icons/bs'
import { BsFacebook } from 'react-icons/bs'
import { AiFillTwitterCircle } from 'react-icons/ai'
import { BsTelegram } from 'react-icons/bs'
import { FaMedium } from 'react-icons/fa'

const Footer = () => {
    return (
        <div className='Footer'>
            <div className='policy'>
                <p>All rights reserved NOE GLOBAL 2022 </p>
            </div>
            <div className='socials'>
                <a href='https://noe-global.com/' target="_blank" rel="noreferrer"><BsGlobe className='socialIcon' /></a>
                <a href='https://www.instagram.com/noe_global_finance/' target="_blank" rel="noreferrer"><BsInstagram className='socialIcon' /></a>
                <a href='https://www.youtube.com/channel/UCd4O3c3jjzkgcbCOqB5Lkjw' target="_blank" rel="noreferrer"><BsYoutube className='socialIcon' /></a>
                <a href='https://www.facebook.com/noecryptobank' target="_blank" rel="noreferrer"><BsFacebook className='socialIcon' /></a>
                <a href='https://twitter.com/NoeCryptobank' target="_blank" rel="noreferrer"><AiFillTwitterCircle className='socialIcon' /></a>
                <a href='https://t.me/noecryptobankchat' target="_blank" rel="noreferrer"><BsTelegram className='socialIcon' /></a>
                <a href='https://medium.com/@noebank' target="_blank" rel="noreferrer"><FaMedium className='socialIcon' /></a>
            </div>
            <div className='info_more'>
                <p>More infos : <a href="mailto:contact@noe-global.com">contact@noe-global.com</a></p>
            </div>
        </div>
    );
}

export default Footer;