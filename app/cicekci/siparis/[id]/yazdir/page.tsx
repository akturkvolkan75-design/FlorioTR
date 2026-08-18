import { notFound } from "next/navigation";


export default async function PrintOrderPage({

  params,

}: {

  params: Promise<{ id:string }>;

}) {


  const { id } = await params;


  const orders = [

    {
      id: id + "-1",
      receiverName: "Ayşe Yılmaz",
      phone: "0555 555 55 55",
      address: "Kadıköy Moda Mah. No:15",
      product: "Kırmızı Gül Buketi",
      customerNote:
        "Bebek uyuyor. Zile basmayın. Kapıya vurun.",
      receiverNote:
        "Canım annem,\nSeni çok seviyorum ❤️"
    },


    {
      id: id + "-2",
      receiverName: "Mehmet Kaya",
      phone: "0555 222 22 22",
      address: "Beşiktaş Çarşı",
      product: "Beyaz Lilyum",
      customerNote:
        "Teslimattan önce arayınız.",
      receiverNote:
        "Yeni yaşın kutlu olsun 🌸"
    },


    {
      id: id + "-3",
      receiverName: "Zeynep Demir",
      phone: "0555 333 33 33",
      address: "Üsküdar Sahil",
      product: "Papatya Buketi",
      customerNote:
        "Çiçek geldiğini söylemeyiniz.",
      receiverNote:
        "Seni düşündüm ❤️"
    }

  ];



  if(!orders){

    notFound();

  }



  return (

    <main className="bg-white text-black">


      <div
        dangerouslySetInnerHTML={{
          __html: `

          <style>

          @page {

            size: A4 landscape;

            margin: 5mm;

          }


          @media print {

            body {

              margin:0;

            }

          }


          </style>

          `
        }}
      />



      <div className="w-full">


        {orders.map((order)=>(


          <section

            key={order.id}

            className="
            h-[64mm]
            mb-[2mm]
            border-b
            border-dashed
            border-gray-300
            "

          >


            <div

              className="
              grid
              h-full
              grid-cols-[50%_25%_25%]
              "

            >


              {/* TESLİMAT */}

              <div

                className="
                border-r
                border-dashed
                border-gray-300
                p-2
                "

              >

                <h2 className="font-bold text-sm">

                  TESLİMAT

                </h2>


                <p className="mt-2 font-bold text-sm">

                  {order.receiverName}

                </p>


                <p className="text-xs">

                  {order.phone}

                </p>


                <p className="mt-2 text-xs">

                  {order.address}

                </p>


                <p className="mt-2 font-bold text-xs">

                  🌸 {order.product}

                </p>


              </div>





              {/* MÜŞTERİ NOTU */}

              <div

                className="
                border-r
                border-dashed
                border-gray-300
                p-2
                "

              >

                <h2 className="font-bold text-xs">

                  MÜŞTERİ NOTU

                </h2>


                <p

                  className="
                  mt-2
                  text-xs
                  leading-tight
                  "

                >

                  {order.customerNote}

                </p>


              </div>







              {/* ALICI MESAJI */}

              <div

                className="
                p-2
                text-center
                "

              >


                <div className="text-xl">

                  🌸

                </div>


                <p

                  className="
                  mt-2
                  whitespace-pre-line
                  text-sm
                  leading-tight
                  "

                >

                  {order.receiverNote}

                </p>


              </div>



            </div>


          </section>


        ))}


      </div>


    </main>

  );

}