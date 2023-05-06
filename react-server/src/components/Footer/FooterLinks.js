import React from "react";
import styles from "./FooterLinks.module.css";

export default function FooterLinks() {
  const links = [
    { Name: "Audio and Subtitles", Link: "/xy" },
    { Name: "Audio Description", Link: "/xy" },
    { Name: "Help Center", Link: "/xy" },
    { Name: "Media Center", Link: "/xy" },
    { Name: "Investor Relationships", Link: "/xy" },
    { Name: "Jobs", Link: "/xy" },
    { Name: "Terms of Use", Link: "/xy" },
    { Name: "Privacy", Link: "/xy" },
    { Name: "Legal Notice", Link: "/xy" },
    { Name: "Cookie Preference", Link: "/xy" },
    { Name: "Impressum", Link: "/xy" },
    { Name: "Contact US", Link: "/xy" },
  ];
  return (
    <ul className={styles.linksList}>
      {links.map((link) => (
        <li className={styles.link} key={link.Name}>
          <a href={link.Link}>{link.Name}</a>
        </li>
      ))}
    </ul>
  );
}
