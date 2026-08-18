import { florists } from "@/data/florists";



export function assignFlorist(
  district: string
) {


  const activeFlorists = florists.filter(

    (item)=>

      item.active === true

  );




  // Önce aynı ilçeden bul

  const sameDistrict = activeFlorists.filter(

    (item)=>

      item.district
      .toLocaleLowerCase("tr-TR")

      ===

      district
      .toLocaleLowerCase("tr-TR")

  );





  if(sameDistrict.length > 0){


    return sameDistrict.sort(

      (a,b)=>

      b.rating - a.rating

    )[0];


  }







  // İlçe bulunamazsa İstanbul içinden en yüksek puanlıyı seç

  const fallback = activeFlorists.sort(

    (a,b)=>

    b.rating - a.rating

  )[0];




  return fallback ?? null;



}