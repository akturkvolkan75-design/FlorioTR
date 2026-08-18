import { getFlowerShopOrders } from "./lib/flower-shop-orders";


async function test(){

  const orders =
  await getFlowerShopOrders(1);


  console.log(
    "ÇİÇEKÇİ 1 SİPARİŞLERİ:"
  );


  console.log(orders);

}


test();