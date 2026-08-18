import { prisma } from "./prisma";



export type FlowerShopStatus =
  | "Onay Bekliyor"
  | "Aktif"
  | "Reddedildi";





export type FlowerShop = {

  id: number;

  shopName: string;

  owner: string;

  phone: string;

  email: string;

  password: string;

  city: string;

  district: string;

  address: string;

  status: FlowerShopStatus;

};







export async function getFlowerShops() {


  return await prisma.flowerShop.findMany({

    orderBy: {

      createdAt: "desc",

    },

  });


}









export async function getFlowerShopByLogin(

  email: string,

  password: string

) {


  return await prisma.flowerShop.findFirst({

    where: {

      email,

      password,

    },

  });


}









export async function updateFlowerShopStatus(

  id: number,

  status: FlowerShopStatus

) {


  return await prisma.flowerShop.update({

    where: {

      id,

    },


    data: {

      status,

    },


  });


}