import { prisma } from "./prisma";



export async function getFlowerShopOrders(
  flowerShopId:number
){


  const orders = await prisma.order.findMany({

    where:{

      flowerShopId

    },


    orderBy:{

      createdAt:"desc"

    }

  });



  return orders;


}





export async function updateOrderStatus(

  orderId:number,

  status:string

){


  return await prisma.order.update({

    where:{

      id:orderId

    },


    data:{

      status

    }


  });


}