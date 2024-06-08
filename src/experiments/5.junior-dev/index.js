import { HTMLLayout } from '../../components/layout/html-layout';
import { useEffect, useState } from "react";
import { motion, LayoutGroup, AnimatePresence } from "framer-motion";
import styles from './saas/components/_banner.module.scss'

// Components
import Header from "./components/Header";
import Banner from "./components/Banner";
import Loader from "./components/Loader";

const Junior = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loading
      ? document.querySelector("body").classList.add("loading")
      : document.querySelector("body").classList.remove("loading");
  }, [loading]);

  return (
    <LayoutGroup type='crossfade'>
      <AnimatePresence>
        {loading ? (
          <motion.div key='loader'>
            <Loader setLoading={setLoading} />
          </motion.div>
        ) : (
          <>
            {/* <Header /> */}
            <Banner />
            {!loading && (
              <div className={`${styles.transitionImage} ${styles.final}`}>
                <motion.img
                  transition={{ ease: "easeInOut", duration: 1.6 }}
                  src={`/images/image-2.jpg`}
                  layoutId='main-image-1'
                />
              </div>
            )}
          </>
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
};

Junior.Layout = HTMLLayout;

Junior.Title = 'Junior';
Junior.Description = (
  <p>
    I am now a Junior Dev yay!
  </p>
);
Junior.Tags = ['framer motion', 'animation'];

export default Junior;
