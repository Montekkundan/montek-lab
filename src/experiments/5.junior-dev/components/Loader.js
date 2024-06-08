import React from "react";
import { motion } from "framer-motion";
import Image from "./Image";
import styles from '../saas/components/_loader.module.scss';
import style from '../saas/components/_banner.module.scss';
const container = {
  show: {
    transition: {
      staggerChildren: 0.35,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 200 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      ease: "easeInOut", // Changed easing value
      duration: 1.6,
    },
  },
  exit: {
    opacity: 0,
    y: -200,
    transition: {
      ease: "easeInOut",
      duration: 0.8,
    },
  },
};

const itemMain = {
  hidden: { opacity: 0, y: 200 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      ease: "easeInOut", // Changed easing value
      duration: 1.6,
    },
  },
};

const Loader = ({ setLoading }) => {
  return (
    <motion.div className={styles.loader}>
      <motion.div
        variants={container}
        onAnimationComplete={() => setLoading(false)}
        initial="hidden"
        animate="show"
        exit="exit"
        className={styles.loaderInner}
      >
        <ImageBlock variants={item} id="image-1" />
        <motion.div variants={itemMain} className={style.transitionImage}>
          <motion.img
            layoutId="main-image-1"
            src={`/images/image-2.jpg`}
          />
        </motion.div>
        <ImageBlock variants={item} id="image-3" />
        <ImageBlock variants={item} id="image-4" />
        <ImageBlock variants={item} id="image-5" />
      </motion.div>
    </motion.div>
  );
};

export const ImageBlock = ({ posX, posY, variants, id }) => {
  return (
    <motion.div
      variants={variants}
      className={`${styles.imageBlock} ${styles[id]}`}
      style={{
        top: `${posY}vh`,
        left: `${posX}vw`,
      }}
    >
      <Image
        src={`/images/${id}.webp`}
        fallback={`/images/${id}.jpg`}
        alt={id}
      />
    </motion.div>
  );
};

export default Loader;