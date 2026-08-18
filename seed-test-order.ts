import { prisma } from "./lib/prisma";


async function createTestOrder(){


const order = await prisma.order.create({

data:{


customerName:"Ahmet Yılmaz",

customerPhone:"0555 111 22 33",


city:"İstanbul",

district:"Kadıköy",

address:"Kadıköy Merkez İstanbul",


productName:"Kırmızı Gül Buketi",

quantity:1,

price:750,


paymentStatus:"Bekliyor",

status:"Yeni"


}


});



console.log("Sipariş oluşturuldu:");

console.log(order);


}



createTestOrder();