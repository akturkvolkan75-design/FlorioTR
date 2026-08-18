"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
} from "react";


import { themes } from "@/themes/themes";


type ThemeContextType = {

  theme: "florio";

  changeTheme: () => void;

};


const ThemeContext =
createContext<ThemeContextType | null>(null);



export function ThemeProvider({

children,

}:{

children:ReactNode;

}){


const theme = "florio";



useEffect(()=>{


const colors = themes.florio.colors;


document.body.style.background =
colors.background;


document.body.style.color =
colors.foreground;


document.documentElement.style.setProperty(
"--background",
colors.background
);


document.documentElement.style.setProperty(
"--foreground",
colors.foreground
);


document.documentElement.style.setProperty(
"--primary",
colors.primary
);


document.documentElement.style.setProperty(
"--accent",
colors.accent
);



},[]);




function changeTheme(){

// Tema sistemi kaldırıldı.
// FlorioTR tek marka teması kullanır.

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