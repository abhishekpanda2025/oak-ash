import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import { Play, Pause, Volume2, VolumeX, Music } from "lucide-react";
import craftingVideo from "@/assets/crafting-video.mp4";

// Ambient audio context for crafting sounds
const useAmbientAudio = (isInView: boolean) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const createAmbientSound = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const ctx = audioContextRef.current;
    
    // Create gain node for volume control
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.connect(ctx.destination);
    gainNodeRef.current = gainNode;

    // Create a warm, ambient tone (simulating workshop atmosphere)
    const oscillator = ctx.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(110, ctx.currentTime); // Low A note for warmth
    
    // Add subtle vibrato
    const vibrato = ctx.createOscillator();
    vibrato.frequency.setValueAtTime(0.5, ctx.currentTime);
    const vibratoGain = ctx.createGain();
    vibratoGain.gain.setValueAtTime(2, ctx.currentTime);
    vibrato.connect(vibratoGain);
    vibratoGain.connect(oscillator.frequency);
    vibrato.start();

    // Create a second oscillator for harmonic richness
    const oscillator2 = ctx.createOscillator();
    oscillator2.type = 'triangle';
    oscillator2.frequency.setValueAtTime(220, ctx.currentTime);
    
    const gainNode2 = ctx.createGain();
    gainNode2.gain.setValueAtTime(0, ctx.currentTime);
    
    oscillator.connect(gainNode);
    oscillator2.connect(gainNode2);
    gainNode2.connect(ctx.destination);
    
    oscillator.start();
    oscillator2.start();
    oscillatorRef.current = oscillator;

    return { gainNode, gainNode2, oscillator, oscillator2 };
  }, []);

  const startAmbientSound = useCallback(() => {
    if (!isAudioEnabled) return;
    
    try {
      const { gainNode, gainNode2 } = createAmbientSound();
      const ctx = audioContextRef.current;
      if (ctx && gainNode) {
        // Fade in
        gainNode.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 2);
        gainNode2?.gain.linearRampToValueAtTime(0.015, ctx.currentTime + 2);
        setIsAudioPlaying(true);
      }
    } catch (e) {
      console.log('Audio not supported');
    }
  }, [isAudioEnabled, createAmbientSound]);

  const stopAmbientSound = useCallback(() => {
    const ctx = audioContextRef.current;
    const gainNode = gainNodeRef.current;
    if (ctx && gainNode) {
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
      setIsAudioPlaying(false);
    }
  }, []);

  const toggleAudio = useCallback(() => {
    if (isAudioEnabled) {
      stopAmbientSound();
      setIsAudioEnabled(false);
    } else {
      setIsAudioEnabled(true);
      if (isInView) {
        startAmbientSound();
      }
    }
  }, [isAudioEnabled, isInView, startAmbientSound, stopAmbientSound]);

  useEffect(() => {
    if (isInView && isAudioEnabled) {
      startAmbientSound();
    } else {
      stopAmbientSound();
    }
  }, [isInView, isAudioEnabled, startAmbientSound, stopAmbientSound]);

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return { isAudioEnabled, isAudioPlaying, toggleAudio };
};

export const CraftingVideoSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  
  const isInView = useInView(ref, { margin: "-20%" });
  const { isAudioEnabled, toggleAudio } = useAmbientAudio(isInView);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.9, 1, 1, 0.9]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        setIsPlaying(false);
      });
    }
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section ref={ref} className="relative py-20 md:py-32 bg-neutral-950 overflow-hidden">
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-amber-500/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="container-luxury relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-xs tracking-luxury uppercase text-amber-400 mb-4 font-sans font-light">
            The Art of Creation
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white mb-4">
            Crafted with <span className="italic text-amber-400">Passion</span>
          </h2>
          <p className="text-neutral-400 font-sans font-light max-w-xl mx-auto">
            Witness the dedication and artistry behind every OAK & ASH piece, 
            where master craftsmen transform precious metals into timeless treasures.
          </p>
        </motion.div>

        {/* Video Container */}
        <motion.div
          className="relative max-w-5xl mx-auto"
          style={{ opacity, scale }}
        >
          {/* Decorative corners */}
          <div className="absolute -top-4 -left-4 w-16 h-16 border-l-2 border-t-2 border-amber-500/50 z-20" />
          <div className="absolute -bottom-4 -right-4 w-16 h-16 border-r-2 border-b-2 border-amber-500/50 z-20" />

          {/* Video wrapper */}
          <div className="relative aspect-video bg-neutral-900 overflow-hidden">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              loop
              muted={isMuted}
              playsInline
              autoPlay
            >
              <source src={craftingVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Video overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 via-transparent to-neutral-950/30 pointer-events-none" />

            {/* Video controls */}
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <motion.button
                  onClick={togglePlay}
                  className="w-12 h-12 bg-amber-500/90 backdrop-blur-sm flex items-center justify-center text-black hover:bg-amber-400 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5 ml-0.5" />
                  )}
                </motion.button>

                <motion.button
                  onClick={toggleMute}
                  className="w-10 h-10 bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </motion.button>

                {/* Ambient Audio Toggle */}
                <motion.button
                  onClick={toggleAudio}
                  className={`w-10 h-10 backdrop-blur-sm flex items-center justify-center transition-colors ${
                    isAudioEnabled 
                      ? "bg-amber-500/80 text-black" 
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  title={isAudioEnabled ? "Disable ambient sound" : "Enable ambient crafting sound"}
                >
                  <Music className="w-4 h-4" />
                </motion.button>
              </div>

              <div className="text-white/70 text-xs font-sans tracking-wide uppercase">
                Master Craftsmanship
              </div>
            </div>

            {/* Play button overlay when paused */}
            {!isPlaying && (
              <motion.button
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center bg-black/40 z-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="w-20 h-20 bg-amber-500/90 rounded-full flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-8 h-8 text-black ml-1" />
                </motion.div>
              </motion.button>
            )}
          </div>

          {/* Video caption */}
          <motion.p
            className="text-center text-neutral-500 text-sm font-sans font-light mt-6 italic"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            "Every piece carries the soul of its maker" — OAK & ASH Atelier
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};
