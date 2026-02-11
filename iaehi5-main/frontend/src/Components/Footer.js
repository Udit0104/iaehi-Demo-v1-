import React from "react";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.text}>
          Copyright © 2025 IaeHi Technology - All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
