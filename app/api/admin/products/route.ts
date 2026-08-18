import sharp from "sharp";
import {NextResponse} from "next/server";
import {getAdminSession} from "@/lib/admin-auth";
import {getProductCatalog} from "@/lib/product-catalog";
import {products as baseProducts} from "@/data/products";
import {prisma} from "@/lib/prisma";
import {savePublicImage} from "@/lib/image-storage";

const allowedTypes=["image/jpeg","image/png","image/webp","image/avif"];
async function saveImage(file:File,slug:string){if(file.size>15*1024*1024||!allowedTypes.includes(file.type))throw new Error("INVALID_IMAGE");const optimized=await sharp(Buffer.from(await file.arrayBuffer())).rotate().resize({width:1600,height:1600,fit:"inside",withoutEnlargement:true}).webp({quality:84}).toBuffer();return savePublicImage({bucket:"product-images",prefix:slug,contents:optimized});}
function slugify(value:string){return value.toLocaleLowerCase("tr").replaceAll("ı","i").replaceAll("ğ","g").replaceAll("ü","u").replaceAll("ş","s").replaceAll("ö","o").replaceAll("ç","c").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");}

export async function GET(){if(!(await getAdminSession()))return NextResponse.json({success:false},{status:401});return NextResponse.json({success:true,products:await getProductCatalog()});}

export async function POST(request:Request){
  if(!(await getAdminSession()))return NextResponse.json({success:false,message:"Yetkisiz erişim."},{status:401});
  try{const form=await request.formData();const name=String(form.get("name")||"").trim();const category=String(form.get("category")||"").trim();const description=String(form.get("description")||"").trim();const price=Number(form.get("price"));const vip=String(form.get("vip"))==="true";const isActive=String(form.get("isActive"))==="true";const file=form.get("image");if(name.length<3||!category||description.length<10||!Number.isInteger(price)||price<1)return NextResponse.json({success:false,message:"Ürün bilgilerini eksiksiz doldurun."},{status:400});if(!(file instanceof File)||!file.size)return NextResponse.json({success:false,message:"Yeni ürün için görsel seçmelisiniz."},{status:400});let slug=slugify(name);if(!slug)slug=`urun-${Date.now()}`;if(baseProducts.some(item=>item.slug===slug)||await prisma.productOverride.findUnique({where:{slug}}))slug=`${slug}-${Date.now().toString().slice(-5)}`;const last=await prisma.productOverride.aggregate({_max:{catalogId:true}});const catalogId=Math.max(1000,Number(last._max.catalogId||0)+1);const image=await saveImage(file,slug);await prisma.productOverride.create({data:{slug,catalogId,name,category,description,price,image,vip,isCustom:true,isActive}});return NextResponse.json({success:true,message:"Yeni ürün eklendi."});}catch(error){return NextResponse.json({success:false,message:error instanceof Error&&error.message==="INVALID_IMAGE"?"Görsel JPG, PNG, WebP veya AVIF ve en fazla 15 MB olmalıdır.":"Ürün eklenemedi."},{status:400});}
}

export async function PATCH(request:Request){
  if(!(await getAdminSession()))return NextResponse.json({success:false,message:"Yetkisiz erişim."},{status:401});
  const form=await request.formData();const slug=String(form.get("slug")||"");const price=Number(form.get("price"));const isActive=String(form.get("isActive"))==="true";const base=baseProducts.find(item=>item.slug===slug);const existing=await prisma.productOverride.findUnique({where:{slug}});
  if((!base&&!existing?.isCustom)||!Number.isInteger(price)||price<1||price>1000000)return NextResponse.json({success:false,message:"Ürün veya fiyat bilgisi geçersiz."},{status:400});let image=existing?.image||base?.image||"";const file=form.get("image");
  if(file instanceof File&&file.size){try{image=await saveImage(file,slug);}catch{return NextResponse.json({success:false,message:"Görsel JPG, PNG, WebP veya AVIF ve en fazla 15 MB olmalıdır."},{status:400});}}
  await prisma.productOverride.upsert({where:{slug},create:{slug,price,image,isActive},update:{price,image,isActive}});return NextResponse.json({success:true,message:"Ürün güncellendi."});
}
