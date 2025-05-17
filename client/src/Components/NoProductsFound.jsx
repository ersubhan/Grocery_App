import React from "react";
import { motion } from "framer-motion";

const NoProductsFound = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col items-center justify-center h-[60vh] text-center"
    >
      <img
        src="https://www.animatedimages.org/data/media/298/animated-eat-and-drink-image-0276.gif" // Cute dog image
        alt="Cute Dog"
        className="w-30 h-30 object-cover mb-4 animate-bounce"
      />
      <h2 className="text-2xl font-semibold text-primary mb-2">
        No Products Found
      </h2>
      <p className="text-gray-500 text-sm max-w-sm">
        Looks like this pup couldn't sniff out any products. Try adjusting your
        filters or come back later!
      </p>
    </motion.div>
  );
};

export default NoProductsFound;
