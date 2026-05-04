import React, { Suspense, useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion';
// import HeroScene from '../componants/Hero-Scene';
import Ball from '@/components/ui/Ball';

const Animation = () => {
    const videoRef = useRef(null);
    const [videoReady, setVideoReady] = useState(false);
    const [isSmall, setIsSmall] = useState(false);

    useEffect(() => {
        const check = () =>
            setIsSmall(
                window.matchMedia("(max-width: 640px)").matches ||
                window.matchMedia("(prefers-reduced-motion: reduce)").matches
            );
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);
    return (
        <>
            <div className='hidden md:block relative h-screen isolate overflow-hidden pt-24 md:pt-28'>
                {/* Video background */}
                <div className="pointer-events-none absolute inset-0 -z-10">
                    {!isSmall && (
                        <video
                            ref={videoRef}
                            className={`h-full w-full object-cover transition-opacity duration-700 ${videoReady ? "opacity-100" : "opacity-0"
                                }`}
                            src='/'
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="metadata"
                            onCanPlay={() => setVideoReady(true)}
                        />
                    )}
                </div>
                <div className='flex justify-center items-center'>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        // className="h-[350px] md:h-[450px] lg:h-[500px]"
                        className="bg-slate-900 rounded-4xl cursor-pointer h-[80vh] w-[60vw]"
                    >
                        <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-muted-foreground">Loading 3D…</div>}>
                            <Ball />
                            {/* <HeroScene /> */}
                        </Suspense>

                    </motion.div>
                </div>

            </div >
        </>
    )
}

export default Animation;