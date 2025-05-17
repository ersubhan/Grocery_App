import React from 'react';
import { useAppContext } from '../../Context/AppContext';
import { assets } from '../../assets/assets';
import { Link, NavLink, Outlet } from 'react-router-dom';
import toast from 'react-hot-toast';

const SellerLayout = () => {

    const { axios, navigate } = useAppContext();

    const sidebarLinks = [
        { name: "Add Product", path: "/seller", icon: assets.add_icon },
        { name: "Product List", path: "/seller/product-list", icon: assets.product_list_icon },
        { name: "Orders", path: "/seller/orders", icon: assets.order_icon },
        { name: "Logout", path: "/logout", icon: assets.arrow_right_icon_colored }, // Add icon if needed
    ];

    const logout = async () => {
        try {
            const { data } = await axios.post('/api/seller/logout');
            if (data.success) {
                toast.success(data.message);
                navigate('/');
            } else {
                toast.error(data.message || "Logout failed");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Logout failed!");
        }
    };

    return (
        <>
            {/* Header */}
            <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white">
                <Link to='/'>
                    <img src={assets.logo} alt="logo" className='cursor-pointer w-34 md:w-38' />
                </Link>
                <div className="flex items-center gap-5 text-gray-500">
                    <p>Hi! Admin</p>
                    <button onClick={logout} className='border rounded-full text-sm px-4 py-1 bg-primary text-white hover:bg-primary-dull cursor-pointer'>
                        Logout
                    </button>
                </div>
            </div>

            {/* Sidebar + Outlet */}
            <div className='flex'>
                <div className="md:w-64 w-16 border-r h-[95vh] text-base border-gray-300 pt-4 flex flex-col">
                    {sidebarLinks.map((item) => (
                        item.name === "Logout" ? (
                            <button
                                key={item.name}
                                onClick={logout}
                                className="flex items-center py-3 px-4 gap-3 w-full text-left hover:bg-gray-100/90 border-white cursor-pointer"
                            >
                                <img src={item.icon} alt="" className="w-7 h-7" />
                                <p className="md:block hidden text-center">{item.name}</p>
                            </button>
                        ) : (
                            <NavLink
                                to={item.path}
                                key={item.name}
                                end={item.path === "/seller"}
                                className={({ isActive }) =>
                                    `flex items-center py-3 px-4 gap-3 w-full 
                                    ${isActive
                                        ? "border-r-4 md:border-r-[6px] bg-primary/10 border-primary text-primary"
                                        : "hover:bg-gray-100/90 border-white"
                                    }`
                                }
                            >
                                <img src={item.icon} alt="" className='w-7 h-7' />
                                <p className="md:block hidden text-center">{item.name}</p>
                            </NavLink>
                        )
                    ))}
                </div>

                <div className="flex-1 overflow-y-auto">
                    <Outlet />
                </div>
            </div>
        </>
    );
};

export default SellerLayout;
