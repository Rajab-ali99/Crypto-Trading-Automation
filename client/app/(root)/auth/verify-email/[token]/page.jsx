'use client';

import React, { useState, useEffect, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-toastify';

// Project imports
import { WEBSITE_LOGIN } from '@/routes/WebsiteRoutes';
import Loading from '@/components/dashboard/Loading';
import Verified from '@/public/assets/images/verified.gif';
import UnVerified from '@/public/assets/images/verification-failed.gif';

// Icons
import { BsLightningChargeFill } from 'react-icons/bs';
import axios from 'axios';

const VerifyEmailPage = ({ params }) => {
    const [IsVerified, setIsVerified] = useState(null);
    const [loading, setloading] = useState(false);
    const token = params?.token;

    const VerifyEmail = async () => {
        try {
            setloading(true);
            const { data: ResponseVerifyEmail } = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/verify-email`, { token });
            if (ResponseVerifyEmail.success) {
                setIsVerified(true);
            }
            toast.success(ResponseVerifyEmail?.message);
        } catch (error) {
            toast.error(error.response?.data?.message);
        } finally {
            setloading(false);
        }
    };

    useEffect(() => {
        VerifyEmail();
    }, [token]);

    // Animation Variants
    const statusSwapVariants = {
        initial: { opacity: 0, y: 10, scale: 0.95 },
        animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, type: 'spring', damping: 20 } },
        exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
    };

    return (
        <div className="min-h-[calc(100vh-66px)] flex items-center justify-center bg-gray-50 dark:bg-[#09090b] relative overflow-hidden transition-colors duration-500">
            
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
            
            {/* Subtle Glow Effect */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-green-500/10 dark:bg-green-500/20 blur-[120px] rounded-full pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="w-full max-w-md z-10 p-8 m-4 bg-white dark:bg-[#111113] border border-gray-200 dark:border-zinc-800 rounded-3xl shadow-2xl dark:shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col items-center text-center"
            >
                <div className="flex items-center justify-center mb-6">
                    <motion.div
                        initial={{ rotate: -180, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        transition={{ duration: 0.7, type: 'spring' }}
                        className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.4)]"
                    >
                        <BsLightningChargeFill className="text-black text-2xl" />
                    </motion.div>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">
                    Verification
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
                    Let’s start keeping your belongings safe.
                </p>

                <div className="w-full min-h-[220px] flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        {IsVerified ? (
                            <motion.div
                                key="success"
                                variants={statusSwapVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                className="w-full flex flex-col items-center"
                            >
                                <div className="p-4 bg-green-50 dark:bg-green-500/10 rounded-full mb-4">
                                    <Image
                                        className="h-[80px] w-auto object-contain"
                                        src={Verified.src}
                                        height={Verified.height}
                                        width={Verified.width}
                                        alt="Verified logo"
                                    />
                                </div>
                                <h2 className="text-green-600 dark:text-green-500 text-xl font-bold mb-6">
                                    Email verification success!
                                </h2>
                                <Link 
                                    href={WEBSITE_LOGIN}
                                    className="w-full py-4 bg-green-500 hover:bg-green-400 text-black font-semibold rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(34,197,94,0.2)] hover:shadow-[0_0_25px_rgba(34,197,94,0.4)] block"
                                >
                                    Continue to Login
                                </Link>
                            </motion.div>
                        ) : loading ? (
                            <motion.div
                                key="loading"
                                variants={statusSwapVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                className="flex flex-col items-center justify-center"
                            >
                                <Loading />
                                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 animate-pulse">
                                    Verifying your token...
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="error"
                                variants={statusSwapVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                className="w-full flex flex-col items-center"
                            >
                                <div className="p-4 bg-red-50 dark:bg-red-500/10 rounded-full mb-4">
                                    <Image
                                        className="h-[80px] w-auto object-contain"
                                        src={UnVerified.src}
                                        height={UnVerified.height}
                                        width={UnVerified.width}
                                        alt="UnVerified logo"
                                    />
                                </div>
                                <h2 className="text-red-600 dark:text-red-500 text-xl font-bold mb-6">
                                    Verification failed!
                                </h2>
                                <Link 
                                    href={WEBSITE_LOGIN}
                                    className="w-full py-4 bg-gray-100 hover:bg-gray-200 dark:bg-[#1a1a1d] dark:hover:bg-[#27272a] text-gray-900 dark:text-white font-semibold rounded-xl transition-all duration-300 block"
                                >
                                    Return to Login
                                </Link>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer Instructions */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-8 pt-6 border-t border-gray-100 dark:border-zinc-800/50 w-full"
                >
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">
                        Instant Access
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed mx-auto max-w-[280px]">
                        We'll send a one-time code to your inbox. New here? We'll set up your account automatically.
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default VerifyEmailPage;