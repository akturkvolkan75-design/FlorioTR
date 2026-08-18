"use client";


import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect
} from "react";


import { themes, type ThemeName } from "@/themes/themes";



type ThemeContextType = {

  theme: ThemeName;

  changeTheme:
  (
    theme: ThemeName
  ) => void;

};



const ThemeContext =
createContext<ThemeContextType | null>(null);





export function ThemeProvider({

children,

initialTheme = "pudra",

}:{

children:ReactNode;

initialTheme?: ThemeName;

}){


const [theme,setTheme] =
useState<ThemeName>(initialTheme);


useEffect(()=>{

const savedTheme =
window.localStorage.getItem("floriotr_theme") as ThemeName | null;

const hasThemeCookie =
document.cookie.includes("floriotr_theme=");

if(!hasThemeCookie && savedTheme && savedTheme in themes){

// Eski localStorage kaydını yeni sunucu çerezine yalnızca bir kez taşı.
// eslint-disable-next-line react-hooks/set-state-in-effect
setTheme(savedTheme);

document.cookie =
`floriotr_theme=${savedTheme}; path=/; max-age=31536000; samesite=lax`;

}

},[]);



useEffect(()=>{


document.body.style.background =
themes[theme].colors.background;


document.body.style.color =
themes[theme].colors.foreground;

document.documentElement.style.setProperty(
  "--background",
  themes[theme].colors.background
);

document.documentElement.style.setProperty(
  "--foreground",
  themes[theme].colors.foreground
);

document.documentElement.style.setProperty(
  "--primary",
  themes[theme].colors.primary
);

document.documentElement.style.setProperty(
  "--accent",
  themes[theme].colors.accent
);



},[theme]);





function changeTheme(theme:ThemeName){

setTheme(theme);

window.localStorage.setItem("floriotr_theme",theme);

document.cookie =
`floriotr_theme=${theme}; path=/; max-age=31536000; samesite=lax`;

}





return(


<ThemeContext.Provider

value={{

theme,

changeTheme

}}

>


{children}


</ThemeContext.Provider>


);


}







export function useTheme(){


const context =
useContext(ThemeContext);



if(!context){

throw new Error(
"useTheme ThemeProvider içinde kullanılmalı"
);

}



return context;


}
