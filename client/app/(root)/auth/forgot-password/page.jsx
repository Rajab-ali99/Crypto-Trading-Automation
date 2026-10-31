'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { toast } from "react-toastify";

// Project specific imports
import { zSchema } from "@/lib/zodSchema";
import { WEBSITE_LOGIN } from "@/routes/WebsiteRoutes";

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
import ResetPassword from "@/components/auth/Forgot-password"; // Assuming this is your Reset form

// Icons
import { BsLightningChargeFill } from 'react-icons/bs';
import { FiMail } from 'react-icons/fi';
import axios from 'axios';

export default function ForgotPassword() {
    // Original State
    const [otpEmail, setotpEmail] = useState('');
    const [OtpVerifyloading, setOtpVerifyloading] = useState(false);
    const [loading, setloading] = useState(false);
    const [isOtpVerified, setisOtpVerified] = useState(false);
    const [resetToken, setresetToken] = useState('');

    // Original Schema
    const formSchema = zSchema.pick({
        email: true,
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    });

    // Original Submit Functions
    const handleForgotPassword = async (values) => {
        try {
            setloading(true);
            const { data: ForgotPasswordResponse } = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/forgot-password/send-otp`, values);
            if (!ForgotPasswordResponse.success) {
                toast.error(ForgotPasswordResponse.message);
            }
            if (ForgotPasswordResponse.success) {
                form.reset();
                toast.success(ForgotPasswordResponse.message);
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
            const { data: otpResponse } = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/forgot-password/verify-otp`, values);
            if (!otpResponse.success) {
                toast.error(otpResponse.message);
            }
            if (otpResponse.success) {
                toast.success(otpResponse.message);
                setisOtpVerified(true);
                setresetToken(otpResponse?.data?.resetToken);
                
            }
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
        initial: { opacity: 0, scale: 0.95, y: 10 },
        animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
        exit: { opacity: 0, scale: 0.95, y: -10, transition: { duration: 0.2 } }
    };

    // Dynamic Headers based on step
    const getHeaderText = () => {
        if (isOtpVerified) return { title: "", desc: "" };
        if (otpEmail) return { title: "Verify OTP", desc: "Enter the code sent to your email." };
        return { title: "Reset Password", desc: "Enter your email to receive a recovery code." };
    };

    const { title, desc } = getHeaderText();

    return (
        <div className="min-h-[calc(100vh-66px)] flex items-center justify-center bg-gray-50 dark:bg-[#09090b] relative overflow-hidden transition-colors duration-500">
            
           
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
            
           
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
                    <motion.h1 
                        key={title}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-2"
                    >
                        {title}
                    </motion.h1>
                    <motion.p 
                        key={desc}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm text-gray-500 dark:text-gray-400"
                    >
                        {desc}
                    </motion.p>
                </div>

                <div className="min-h-[200px]">
                    <AnimatePresence mode="wait">
                        {!otpEmail ? (
                            // STEP 1: Email Form
                            <motion.div
                                key="email-form"
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
                                        onSubmit={form.handleSubmit(handleForgotPassword)}
                                        className="space-y-4"
                                    >
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

                                        <motion.div variants={itemVariants} className="pt-2">
                                            <ButtonLoadder 
                                                type="submit" 
                                                text="Send Recovery Code" 
                                                loading={loading} 
                                                className="w-full py-6 bg-green-500 hover:bg-green-400 text-black font-semibold rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(34,197,94,0.2)] hover:shadow-[0_0_25px_rgba(34,197,94,0.4)] border-none"
                                            />
                                        </motion.div>
                                    </motion.form>
                                </Form>
                                
                                <motion.div variants={itemVariants} className="mt-8 text-center">
                                    <Link href={WEBSITE_LOGIN} className="text-sm text-green-600 dark:text-green-500 hover:underline font-medium transition-colors">
                                        Back to Login
                                    </Link>
                                </motion.div>
                            </motion.div>

                        ) : !isOtpVerified ? (
                            // STEP 2: OTP Verification
                            <motion.div
                                key="otp-form"
                                variants={formSwapVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                className="pt-2"
                            >
                                <OtpVerification 
                                    email={otpEmail} 
                                    onSubmit={(values) => handleOTPSubmit(values)} 
                                    loading={OtpVerifyloading} 
                                />
                            </motion.div>
                        ) : (
                           
                            <motion.div
                                key="reset-form"
                                variants={formSwapVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                            >
                                <ResetPassword Token={resetToken} email={otpEmail} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}