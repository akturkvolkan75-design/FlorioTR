export type Florist = {

  id: number;

  slug: string;

  name: string;

  city: string;

  district: string;

  address: string;

  phone: string;

  whatsapp: string;

  rating: number;

  workingHours: string;

  description: string;

  image: string;

  active: boolean;

};



export const florists: Florist[] = [


  {

    id: 1,

    slug: "kadikoy-gul-bahcesi",

    name: "Kadıköy Gül Bahçesi",

    city: "İstanbul",

    district: "Kadıköy",

    address:
    "Kadıköy Merkez, İstanbul",

    phone:
    "0555 111 22 33",

    whatsapp:
    "905551112233",

    rating: 4.9,

    workingHours:
    "09:00 - 21:00",

    description:
    "FlorioTR özel siparişlerini hazırlayan güvenilir çiçek noktası.",

    image:
    "/flowers/florist-1.jpg",

    active:true

  },




  {

    id: 2,

    slug: "besiktas-cicek-evi",

    name: "Beşiktaş Çiçek Evi",

    city:"İstanbul",

    district:"Beşiktaş",

    address:
    "Beşiktaş Çarşı, İstanbul",

    phone:
    "0555 444 55 66",

    whatsapp:
    "905554445566",

    rating:4.8,

    workingHours:
    "08:30 - 22:00",

    description:
    "Özel günler için FlorioTR siparişlerini hazırlayan çözüm ortağı.",

    image:
    "/flowers/florist-2.jpg",

    active:true

  },





  {

    id:3,

    slug:"bakirkoy-cicek-atolyesi",

    name:"Bakırköy Çiçek Atölyesi",

    city:"İstanbul",

    district:"Bakırköy",

    address:
    "Bakırköy Meydan, İstanbul",

    phone:
    "0555 777 88 99",

    whatsapp:
    "905557778899",

    rating:4.7,

    workingHours:
    "09:00 - 20:00",

    description:
    "Zarif FlorioTR tasarımlarını hazırlayan butik çiçek noktası.",

    image:
    "/flowers/florist-3.jpg",

    active:true

  }


];