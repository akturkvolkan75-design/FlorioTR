export const themes = {


  royalLuxury: {

    name: "Royal Luxury",

    colors: {

      background: "#0B0B0B",

      surface: "#151515",

      primary: "#D4AF37",

      secondary: "#0F5132",

      text: "#FFFFFF",

      muted: "#C7C7C7",

    },


    style: {

      logo: "✨",

      button:
        "bg-yellow-600 hover:bg-yellow-700",

      card:
        "bg-[#151515] border border-yellow-600/20",

    },

  },





  oceanElegance: {


    name: "Ocean Elegance",


    colors: {

      background:"#F8FCFF",

      surface:"#FFFFFF",

      primary:"#3B82F6",

      secondary:"#B8E3FF",

      text:"#1E293B",

      muted:"#64748B",

    },


    style: {

      logo:"💎",

      button:
        "bg-blue-500 hover:bg-blue-600",

      card:
        "bg-white shadow-lg",

    },


  },








  romanticRose:{


    name:"Romantic Rose",


    colors:{


      background:"#FFF1F5",

      surface:"#FFFFFF",

      primary:"#EC4899",

      secondary:"#FBCFE8",

      text:"#3F3F46",

      muted:"#71717A",


    },


    style:{


      logo:"🌸",

      button:
        "bg-pink-600 hover:bg-pink-700",

      card:
        "bg-white shadow-md",


    },


  },









  naturalGarden:{


    name:"Natural Garden",


    colors:{


      background:"#F0FDF4",

      surface:"#FFFFFF",

      primary:"#15803D",

      secondary:"#DCFCE7",

      text:"#1F2937",

      muted:"#6B7280",


    },


    style:{


      logo:"🌿",

      button:
        "bg-green-700 hover:bg-green-800",

      card:
        "bg-white shadow-lg",


    },


  },









  weddingPearl:{


    name:"Wedding Pearl",


    colors:{


      background:"#FAFAFA",

      surface:"#FFFFFF",

      primary:"#94A3B8",

      secondary:"#E2E8F0",

      text:"#334155",

      muted:"#64748B",


    },


    style:{


      logo:"💍",

      button:
        "bg-slate-500 hover:bg-slate-600",

      card:
        "bg-white shadow-xl",


    },


  },


};


export type ThemeName =
 keyof typeof themes;