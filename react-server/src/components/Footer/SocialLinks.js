import React from "react";
import styles from './SocialLinks.module.css';
import FacebookIcon from "./SocialMedia/FacebookIcon";
import InstagramIcon from "./SocialMedia/InstagramIcon";
import YoutubeIcon from "./SocialMedia/YoutubeIcon";
import TwitterIcon from "./SocialMedia/TwitterIcon";

export default function SocialLinks()
{
    return(
        <div className={styles.box}>
            <a href="twitter.com" className={styles.iconsList}>
                <TwitterIcon/>
            </a>
            <a href="twitter.com" className={styles.iconsList}>
                <FacebookIcon/>
            </a>
            <a href="twitter.com" className={styles.iconsList}>
                <InstagramIcon/>
            </a>
            <a href="twitter.com" className={styles.iconsList}>
                <YoutubeIcon/>
            </a>
       </div>
    );
}