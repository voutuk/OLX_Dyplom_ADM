import React, { useRef } from "react";
import { ScrolledContainerProps } from "./props";

const ScrolledContainer: React.FC<ScrolledContainerProps> = ({ children, className, scrollDir = 'horisontal' }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const handleMouseDown = (e: React.MouseEvent) => {
        if (!scrollRef.current) return;
        const isHorisontal = scrollDir === 'horisontal'
        const start = isHorisontal ? e.pageX : e.pageY;
        const scroll = isHorisontal ? scrollRef.current.scrollLeft : scrollRef.current.scrollTop;

        const handleMouseMove = (event: MouseEvent) => {
            if (!scrollRef.current) return;
            const walk = isHorisontal ? event.pageX - start : event.pageY - start;
            const scrollStep =  scroll - walk;
            isHorisontal ? scrollRef.current.scrollLeft = scrollStep : scrollRef.current.scrollTop = scrollStep;
        };

        const handleMouseUp = () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };
    return (
        <>
            <div ref={scrollRef} onMouseDown={handleMouseDown} className={`${className} overflow-hidden  whitespace-nowrap  active:cursor-grabbing`}>
                {children}
            </div>
        </>)
}

export default ScrolledContainer;