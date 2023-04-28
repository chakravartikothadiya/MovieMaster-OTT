import React from "react";
import styles from './Footer.module.css';
import FooterLinks from "./FooterLinks";
import SocialLinks from "./SocialLinks";

export default function Footer()
{
    return(
        <footer>
            <div className={styles.sociallinks}>  
                <SocialLinks/>
            </div>
            <div className={styles.footerlinks}>
                <FooterLinks/>
            </div>
        </footer>
    );
}