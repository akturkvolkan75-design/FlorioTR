import { assignOrderToFlowerShop } from "./lib/order-routing";


async function test(){

  const result =
    await assignOrderToFlowerShop(1);


  console.log(result);

}


test();