import React from "react";

const NewsLatter = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-2 mt-20 pb-14">
      <h1 className="md:text-4xl text-2xl font-semibold">Get Fresh Deals, Delivered!</h1>
      <p className="md:text-lg text-gray-500/70 pb-8">
      Join our newsletter for weekly updates on fresh groceries, best prices, and exclusive member discounts...
      </p>
      <form className="flex items-center justify-between max-w-2xl w-full md:h-13 h-12">
        <input
          className="border border-gray-300 rounded-md h-full border-r-0 outline-none w-full rounded-r-none px-3 text-gray-500"
          type="text"
          placeholder="Email"
          required
        />
        <button
          type="submit"
          className="md:px-12 px-8 h-full text-white bg-primary hover:bg-primary-dull transition-all cursor-pointer rounded-md rounded-l-none"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
};

export default NewsLatter;
