import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import styles from '../saas/components/_banner.module.scss';
import animateStyle from '../saas/components/_marquee.module.scss';
const banner = {
  animate: {
    transition: {
      delayChildren: 0.4,
      staggerChildren: 0.1,
    },
  },
};

const letterAni = {
  initial: { y: 400 },
  animate: {
    y: 0,
    transition: {
      ease: "easeInOut", // Changed easing value
      duration: 1,
    },
  },
};

const Banner = () => {
  const [playMarquee, setPlayMarquee] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setPlayMarquee(true);
    }, 2000);
  }, []);

  return (
    <motion.div className={styles.banner} variants={banner}>
      <BannerRowTop title={"Montek"} fontSize="font-size: 20rem;" />
      <BannerRowCenter title={"Junior"} playMarquee={playMarquee} fontSize="font-size: 20rem;" />
      <BannerRowBottom title={"Dev"} fontSize="font-size: 20rem;" />
    </motion.div>
  );
};

const AnimatedLetters = ({ title, disabled, fontSize }) => (
  <motion.span
    className={styles.rowTitle}
    variants={disabled ? null : banner}
    initial="initial"
    animate="animate"
  >
    {[...title].map((letter, index) => (
      <motion.span
        key={index}
        className={styles.rowLetter}
        style={{ fontSize }}
        variants={disabled ? null : letterAni}
      >
        {letter}
      </motion.span>
    ))}
  </motion.span>
);

const BannerRowTop = ({ title, fontSize  }) => {
  return (
    <div className={styles.bannerRow}>
      <div className={styles.rowCol}>
        <AnimatedLetters title={title} fontSize={fontSize} />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          ease: "easeInOut",
          duration: 1,
          delay: 0.4,
        }}
        className={styles.rowCol}
      >
        <span className={styles.rowMessage}>
          Yay, I am now a Junior Dev!
        </span>
      </motion.div>
    </div>
  );
};

const BannerRowBottom = ({ title, fontSize }) => {
  return (
    <div className={`${styles.bannerRow} ${styles.center}`}>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ ease: "easeInOut", duration: 1, delay: 1 }} // Changed easing value
        className={styles.scroll}
      >
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            ease: "easeInOut",
            duration: 1,
            delay: 1.8,
          }}
        >
          scroll
        </motion.span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            ease: "easeInOut",
            duration: 1,
            delay: 1.8,
          }}
        >
          down
        </motion.span>
      </motion.div>
      <AnimatedLetters title={title} fontSize={fontSize} />
    </div>
  );
};

const BannerRowCenter = ({ title, playMarquee, fontSize  }) => {
  return (
    <div className={`${styles.bannerRow} ${animateStyle.marquee} ${playMarquee ? animateStyle.animate : ''}`}>
      <motion.div
        initial={{ y: 310 }}
        animate={{ y: 0 }}
        transition={{ ease: "easeInOut", duration: 1 }} // Changed easing value
        className={animateStyle.marqueeInner}
      >
        <AnimatedLetters title={title} fontSize={fontSize}   />
        <AnimatedLetters title={title} fontSize={fontSize} />
        <AnimatedLetters title={title} fontSize={fontSize}  />
        <AnimatedLetters title={title} fontSize={fontSize}  />
      </motion.div>
    </div>
  );
};

export default Banner;
