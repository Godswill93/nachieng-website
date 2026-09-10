import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Maximize2, Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";

const Ctrl = ({ onClick, label, testId, children, pressed }) => (
    <button
        type="button"
        onClick={onClick}
        aria-label={label}
        aria-pressed={pressed}
        data-testid={testId}
        className="flex h-11 w-11 items-center justify-center text-paper/80 transition-colors duration-200 hover:bg-white/10 hover:text-paper"
    >
        {children}
    </button>
);

const Placeholder = () => (
    <div
        data-testid="walkthrough-placeholder"
        className="flex aspect-video w-full flex-col items-start justify-between border border-dashed border-white/30 p-6"
    >
        <span className="eyebrow text-signalhi">Preview-only placeholder</span>
        <p className="text-sm text-white/60">Approved footage not yet supplied. Hidden on the production site.</p>
    </div>
);

export const WalkthroughMedia = ({ item }) => {
    const reduce = useReducedMotion();
    const wrapRef = useRef(null);
    const videoRef = useRef(null);
    const [inView, setInView] = useState(false);
    const [playing, setPlaying] = useState(false);
    const [muted, setMuted] = useState(true);
    const [showTranscript, setShowTranscript] = useState(false);
    const hasVideo = item.sources?.length > 0;

    useEffect(() => {
        if (!hasVideo || !wrapRef.current) return undefined;
        const io = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting) {
                    setInView(true);
                    io.disconnect();
                }
            },
            { rootMargin: "200px" }
        );
        io.observe(wrapRef.current);
        return () => io.disconnect();
    }, [hasVideo]);

    const toggle = () => {
        const v = videoRef.current;
        if (!v) return;
        if (v.paused) v.play();
        else v.pause();
    };
    const replay = () => {
        const v = videoRef.current;
        if (!v) return;
        v.currentTime = 0;
        v.play();
    };
    const fullscreen = () => wrapRef.current?.requestFullscreen?.();

    return (
        <figure ref={wrapRef} data-testid={`walkthrough-item-${item.id}`} className="bg-ink">
            {!hasVideo ? (
                <Placeholder />
            ) : (
                <div className="relative aspect-video w-full bg-ink">
                    {inView && !reduce ? (
                        <video
                            ref={videoRef}
                            className="h-full w-full"
                            poster={item.poster || undefined}
                            preload="metadata"
                            playsInline
                            muted={muted}
                            onPlay={() => setPlaying(true)}
                            onPause={() => setPlaying(false)}
                            onEnded={() => setPlaying(false)}
                            data-testid={`walkthrough-video-${item.id}`}
                        >
                            {item.sources.map((s) => (
                                <source key={s.src} src={s.src} type={s.type} />
                            ))}
                            {item.captions && <track kind="captions" src={item.captions} srcLang="en" label="English" default />}
                        </video>
                    ) : (
                        item.poster && <img src={item.poster} alt="" className="h-full w-full object-cover" loading="lazy" />
                    )}
                    {!reduce && (
                        <div className="absolute inset-x-0 bottom-0 flex items-center gap-1 bg-ink/80 px-2 backdrop-blur-md">
                            <Ctrl onClick={toggle} label={playing ? "Pause" : "Play"} testId={`walkthrough-play-${item.id}`}>
                                {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                            </Ctrl>
                            <Ctrl onClick={replay} label="Replay" testId={`walkthrough-replay-${item.id}`}>
                                <RotateCcw className="h-4 w-4" />
                            </Ctrl>
                            <Ctrl onClick={() => setMuted((m) => !m)} label={muted ? "Unmute" : "Mute"} pressed={muted} testId={`walkthrough-mute-${item.id}`}>
                                {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                            </Ctrl>
                            <span className="ml-auto" />
                            {typeof document !== "undefined" && document.fullscreenEnabled && (
                                <Ctrl onClick={fullscreen} label="Fullscreen" testId={`walkthrough-fullscreen-${item.id}`}>
                                    <Maximize2 className="h-4 w-4" />
                                </Ctrl>
                            )}
                        </div>
                    )}
                </div>
            )}
            <figcaption className="border-t border-white/10 px-5 py-4">
                <div className="flex items-baseline justify-between gap-4">
                    <p className="font-expanded text-sm font-semibold text-paper">{item.title}</p>
                    {item.transcript && (
                        <button
                            type="button"
                            onClick={() => setShowTranscript((s) => !s)}
                            aria-expanded={showTranscript}
                            data-testid={`walkthrough-transcript-toggle-${item.id}`}
                            className="eyebrow text-white/60 underline-offset-4 hover:text-paper hover:underline"
                        >
                            Transcript
                        </button>
                    )}
                </div>
                {item.caption && <p className="mt-2 text-sm leading-6 text-white/60">{item.caption}</p>}
                {showTranscript && item.transcript && (
                    <p data-testid={`walkthrough-transcript-${item.id}`} className="mt-3 text-sm leading-6 text-white/70">
                        {item.transcript}
                    </p>
                )}
            </figcaption>
        </figure>
    );
};
