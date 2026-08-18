"use client";
import {useEffect,useState} from "react";
import {products as baseProducts} from "@/data/products";
export type CatalogProduct=(typeof baseProducts)[number]&{isActive:boolean};
export function useProducts(){const [products,setProducts]=useState<CatalogProduct[]>(baseProducts.map(product=>({...product,isActive:true})));useEffect(()=>{fetch("/api/products",{cache:"no-store"}).then(r=>r.json()).then(data=>{if(data.success)setProducts(data.products);});},[]);return products.filter(product=>product.isActive);}
