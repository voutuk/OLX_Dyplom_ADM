import { Header } from "./header";
import { Content } from "./content";
import { Footer } from "./footer";
import { useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
const DefaultLayout: React.FC = () => {
  const location = useLocation()
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (location.pathname.includes('advert/'))
      containerRef.current?.scrollTo({
        top: 0,
        behavior: location.pathname.includes('advert/') ? "auto" : "smooth"
      });
  }, [location])
  return (
    <div ref={containerRef} className='w-full h-screen flex flex-col justify-stretch overflow-y-auto' >
      <Header />
      <Content />
      <Footer />
    </div>
  );
};

export default DefaultLayout;