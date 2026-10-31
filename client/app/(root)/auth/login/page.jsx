'use client';

import React, { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from 'zod';
import { useRouter } from "next/navigation";

// Project specific imports
import { zSchema } from "@/lib/zodSchema";
import { toast } from "react-toastify";
import {  WEBSITE_DASHBOARD, WEBSITE_FORGOTPASSWORD, WEBSITE_Register } from "@/routes/WebsiteRoutes";


// Components
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ButtonLoadder from "@/components/ButtonLoadder";
import OtpVerification from "@/components/OtpVerification";
import Link from "next/link";

// Icons
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import { BsLightningChargeFill } from 'react-icons/bs';
import { FiMail, FiLock } from 'react-icons/fi';
import axios from 'axios';

function LoginPageContent() {
    const router = useRouter();

    // State
    const [otpEmail, setotpEmail] = useState('');
    const [OtpVerifyloading, setOtpVerifyloading] = useState(false);
    const [loading, setloading] = useState(false);
    const [showPassword, setshowPassword] = useState(false);

    // Zod Schema
    const formSchema = zSchema.pick({
        email: true,
    }).extend({
        password: z.string().min(5, "Password is required.")
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    // Login Submission
    const handleLoginSubmit = async (values) => {
        try {
            setloading(true);
            const { data: ResponseLogin } = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`, values);
            if (!ResponseLogin.success) {
                toast.error(ResponseLogin.message);
            }
            if (ResponseLogin.success) {
                form.reset();
                toast.success(ResponseLogin.message);
                setotpEmail(values.email);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        } finally {
            setloading(false);
        }
    };

    const handleOTPSubmit = async (values) => {
        try {
            setOtpVerifyloading(true);
            const { data } = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/verify-otp`,
                values,
                { withCredentials: true }
            );
            const { success, message, data: user } = data;

            if (!success) {
                toast.error(message);
                return;
            }

            toast.success(message);
            setotpEmail("");
            router.push(WEBSITE_DASHBOARD)

        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        } finally {
            setOtpVerifyloading(false);
        }
    };

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
    };

    const formSwapVariants = {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } },
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
                className="w-full max-w-md z-10 p-8 m-4 bg-white dark:bg-[#111113] border border-gray-200 dark:border-zinc-800 rounded-3xl shadow-2xl dark:shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            >
                <div className="flex items-center justify-center mb-8">
                    <motion.div
                        initial={{ rotate: -180, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        transition={{ duration: 0.7, type: 'spring' }}
                        className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.4)]"
                    >
                        <BsLightningChargeFill className="text-black text-2xl" />
                    </motion.div>
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">
                        {otpEmail ? "Verify OTP" : "Welcome Back"}
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {otpEmail ? "Enter the code sent to your email." : "Log in to manage your belongings."}
                    </p>
                </div>

                <AnimatePresence mode="wait">
                    {!otpEmail ? (
                        <motion.div
                            key="login-form"
                            variants={formSwapVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            <Form {...form}>
                                <motion.form
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="show"
                                    onSubmit={form.handleSubmit(handleLoginSubmit)}
                                    className="space-y-4"
                                >
                                    {/* Email Field */}
                                    <motion.div variants={itemVariants}>
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                                                <FiMail className="text-gray-400 dark:text-gray-500" />
                                                            </div>
                                                            <Input 
                                                                type='email' 
                                                                placeholder="Email Address" 
                                                                className="w-full pl-10 pr-4 py-6 bg-gray-100 dark:bg-[#1a1a1d] border border-transparent focus:border-green-500 dark:focus:border-green-500 focus-visible:ring-0 text-gray-900 dark:text-white rounded-xl outline-none transition-all duration-300"
                                                                {...field} 
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage className="text-red-500 text-xs ml-1" />
                                                </FormItem>
                                            )}
                                        />
                                    </motion.div>

                                    {/* Password Field */}
                                    <motion.div variants={itemVariants}>
                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                                                <FiLock className="text-gray-400 dark:text-gray-500" />
                                                            </div>
                                                            <Input 
                                                                type={showPassword ? 'text' : 'password'} 
                                                                placeholder="Password" 
                                                                className="w-full pl-10 pr-12 py-6 bg-gray-100 dark:bg-[#1a1a1d] border border-transparent focus:border-green-500 dark:focus:border-green-500 focus-visible:ring-0 text-gray-900 dark:text-white rounded-xl outline-none transition-all duration-300"
                                                                {...field} 
                                                            />
                                                            <button 
                                                                className="absolute cursor-pointer inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" 
                                                                type="button" 
                                                                onClick={() => setshowPassword(!showPassword)}
                                                            >
                                                                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                                                            </button>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage className="text-red-500 text-xs ml-1" />
                                                </FormItem>
                                            )}
                                        />
                                    </motion.div>

                                    {/* Submit Button */}
                                    <motion.div variants={itemVariants} className="pt-2">
                                        <ButtonLoadder 
                                            type="submit" 
                                            text="Log In" 
                                            loading={loading} 
                                            className="w-full py-6 bg-green-500 hover:bg-green-400 text-black font-semibold rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(34,197,94,0.2)] hover:shadow-[0_0_25px_rgba(34,197,94,0.4)] border-none"
                                        />
                                    </motion.div>
                                </motion.form>
                            </Form>

                            {/* Additional Links */}
                            <motion.div variants={itemVariants} className="mt-6 flex flex-col items-center gap-3">
                                <Link 
                                    href={WEBSITE_FORGOTPASSWORD} 
                                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-500 transition-colors"
                                >
                                    Forgot Password?
                                </Link>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Don't have an account?{' '}
                                    <Link href={WEBSITE_Register} className="text-green-600 dark:text-green-500 hover:underline font-medium transition-colors">
                                        Create account
                                    </Link>
                                </div>
                            </motion.div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="otp-form"
                            variants={formSwapVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="pt-4"
                        >
                            <OtpVerification 
                                email={otpEmail} 
                                onSubmit={(values) => handleOTPSubmit(values)} 
                                loading={OtpVerifyloading} 
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen" />}>
            <LoginPageContent />
        </Suspense>
    );
}