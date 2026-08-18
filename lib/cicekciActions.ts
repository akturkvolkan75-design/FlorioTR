"use server";


import {
  updateFlowerShopStatus,
} from "./cicekciler";





export async function approveFlowerShop(
  id:number
) {


  return await updateFlowerShopStatus(
    id,
    "Aktif"
  );


}








export async function rejectFlowerShop(
  id:number
) {


  return await updateFlowerShopStatus(
    id,
    "Reddedildi"
  );


}