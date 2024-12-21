import {Roboto} from "next/font/google";
import localFont from "next/font/local";

export const faBrandsFont = localFont({
    src: "./assets/fa-brands-400.ttf",
    display: "swap"
});

export const robotoFont = Roboto({
    weight: ["400", "500", "700"],
    subsets: ["latin"],
    display: "swap"
});
