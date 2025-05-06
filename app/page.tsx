import Image from "next/image";
import Navbar from "../components/Navbar";
import Dashboard from "./dashboard/page";

export default function Home() {
  return (
   <>
    <Navbar/>
   <Dashboard />
   </>
        
  );
}
