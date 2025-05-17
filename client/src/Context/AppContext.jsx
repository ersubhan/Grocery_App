import React, { useEffect } from "react";
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from 'axios';


// backend url 
axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

  // currency 
  const currency = import.meta.env.VITE_CURRENCY;
    
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState({});

  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    try {
      // Only parse if savedCart is not null or undefined
      return savedCart ? JSON.parse(savedCart) : {};
    } catch (error) {
      // If parsing fails (corrupt data), return an empty object
      console.error("Error parsing cartItems from localStorage", error);
      return {};
    }
  });
  

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);
  
  

  // fetch seller status
  const fetchSeller = async ()=> {
    try {
      const {data} = await axios.get('/api/seller/is-auth');
      if (data.success) {
        setIsSeller(true)
      } else {
        setIsSeller(false)
      }
    } catch (error) {
      setIsSeller(false)
    }
  }

   // fetch user auth status , user data & cart item
  //  const fetchUser = async ()=> {
  //   try {
  //     const { data } = await axios.get('/api/user/is-auth')
  //     if (data.success) {
  //       setUser(data.user)
  //       setCartItems(data.user.cartItems)
  //     }
  //   } catch (error) {
  //     setUser(null)
  //     setCartItems({});
  //   }
  //  }
  const fetchUser = async () => {
    try {
      const { data } = await axios.get('/api/user/is-auth');
      if (data.success) {
        const localCart = JSON.parse(localStorage.getItem('cartItems')) || {};
        const serverCart = data.user.cartItems || {};
  
        // Merge logic (adds quantities if the same item exists)
        const mergedCart = { ...serverCart };
        for (let key in localCart) {
          if (mergedCart[key]) {
            mergedCart[key] += localCart[key];
          } else {
            mergedCart[key] = localCart[key];
          }
        }
  
        setUser(data.user);
        setCartItems(mergedCart);
      }
    } catch (error) {
      setUser(null);
      setCartItems({});
    }
  };
  


  // fetch all products 
  const fetchProducts = async()=> {
    try {
      const { data } = await axios.get('/api/product/list')
      if (data.success) {
        setProducts(data.products)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }


  // add products to cart 
  const addToCart = (itemId)=> {
    let cartData = structuredClone(cartItems || {}); // ✅ safe fallback
  
    cartData[itemId] = (cartData[itemId] || 0) + 1; // ✅ cleaner increment logic
  
    setCartItems(cartData);
    toast.success("Added To Cart...");
  };
  

  // update cart item quantity 
  const updateCartItem = (itemId,quantity)=> {
    let cartData = structuredClone(cartItems);
    cartData[itemId] = quantity;
    setCartItems(cartData)
    toast.success("Cart Updated Successfully...")
  }

  // remove from cart 
  const removeFromCart = (itemId)=> {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] -= 1;
      if (cartData[itemId] ===0 ) {
        delete cartData[itemId]; 
      }
    }
    toast.success("Removed From Cart...")
    setCartItems(cartData)
  }

    // get cart item count 
  const getCartCount =()=> {
    let totalCount = 0;
    for(const item in cartItems) {
      totalCount += cartItems[item]
    }
    return totalCount;
  }

  // get cart total amount 
  const getCartAmount = ()=> {
    let totalAmount = 0;
    for(const items in cartItems) {
      let itemInfo = products.find((product)=> product._id === items);
      if (cartItems[items] > 0) {
        totalAmount += itemInfo.offerPrice * cartItems[items]
      }
    }
    return Math.floor(totalAmount * 100) / 100;
  }

  useEffect(()=>{
    fetchUser();
    fetchSeller();
    fetchProducts();
  },[]);

  // update database cart item 
  useEffect(()=>{
    const updateCart = async ()=> {
      try {
        const { data } = await axios.post('/api/cart/update', {cartItems})
        if (!data.success) {
          toast.success(data.message)
        }
      } catch (error) {
        toast.success(error.message)
      }
    }
    // user is available then is function is run 
    if (user) {
      updateCart()
    }

  },[cartItems, user]);


  const value = {
    navigate,
    user,
    setUser,
    setIsSeller,
    isSeller,
    showUserLogin,
    setShowUserLogin,
    products,
    currency,
    addToCart,
    updateCartItem,
    removeFromCart,
    cartItems,
    searchQuery,
    setSearchQuery,
    getCartAmount,
    getCartCount,
    axios,
    fetchProducts
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
