import {NextResponse} from "next/server";
import {getProductCatalog} from "@/lib/product-catalog";
export async function GET(){return NextResponse.json({success:true,products:await getProductCatalog()});}
