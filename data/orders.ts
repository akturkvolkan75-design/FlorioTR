export type OrderStatus =
  | "Yeni"
  | "Kabul Edildi"
  | "Hazırlanıyor"
  | "Hazır"
  | "Kuryede"
  | "Teslim Edildi"
  | "İptal";


export type Order = {

id:number;

floristId:number;

customer:{
name:string;
phone:string;
district:string;
address:string;
};


product:{
name:string;
quantity:number;
price:number;
};


customerNote:string;

flowerNote:string;

status:OrderStatus;

createdAt:string;

};



export const orders:Order[] = [


{
id:10245,

floristId:1,

customer:{
name:"Ahmet Yılmaz",
phone:"0555 111 22 33",
district:"Kadıköy",
address:"Kadıköy Merkez İstanbul"
},

product:{
name:"Kırmızı Gül Buketi",
quantity:1,
price:750
},

customerNote:"Akşam teslim edilsin",

flowerNote:"Mutluluklar dilerim 🌹",

status:"Yeni",

createdAt:"06.08.2026"

},



{
id:10246,

floristId:2,

customer:{
name:"Ayşe Demir",
phone:"0555 222 33 44",
district:"Beşiktaş",
address:"Beşiktaş Çarşı"
},

product:{
name:"Beyaz Orkide",
quantity:1,
price:950
},

customerNote:"Özel not yok",

flowerNote:"Seni seviyorum ❤️",

status:"Kabul Edildi",

createdAt:"06.08.2026"

},



{
id:10247,

floristId:3,

customer:{
name:"Mehmet Kaya",
phone:"0555 333 44 55",
district:"Üsküdar",
address:"Üsküdar Sahil"
},

product:{
name:"Papatya Sepeti",
quantity:1,
price:600
},

customerNote:"Hızlı hazırlanmalı",

flowerNote:"Geçmiş olsun 🌸",

status:"Hazırlanıyor",

createdAt:"06.08.2026"

},



{
id:10248,

floristId:3,

customer:{
name:"Zeynep Acar",
phone:"0555 444 55 66",
district:"Bakırköy",
address:"Bakırköy Meydan"
},

product:{
name:"Premium Gül Kutusu",
quantity:1,
price:1500
},

customerNote:"Akşam 19:00",

flowerNote:"İyi ki varsın 💕",

status:"Hazır",

createdAt:"06.08.2026"

},



{
id:10249,

floristId:2,

customer:{
name:"Can Özkan",
phone:"0555 555 66 77",
district:"Beşiktaş",
address:"Beşiktaş Merkez"
},

product:{
name:"Lilyum Buketi",
quantity:2,
price:1200
},

customerNote:"-",

flowerNote:"Sevgiler",

status:"Kuryede",

createdAt:"06.08.2026"

},



{
id:10250,

floristId:1,

customer:{
name:"Elif Kaya",
phone:"0555 666 77 88",
district:"Kadıköy",
address:"Kadıköy İstanbul"
},

product:{
name:"Orkide Aranjmanı",
quantity:1,
price:1300
},

customerNote:"Kapıya bırakılmasın",

flowerNote:"Nice mutlu yıllara 🌸",

status:"Yeni",

createdAt:"06.08.2026"

}


];