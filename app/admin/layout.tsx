import AdminNav from "@/components/admin/AdminNav";
export default function AdminLayout({children}:{children:React.ReactNode}){return <div className="min-h-screen bg-[#f5f2eb] text-slate-950" style={{color:"#0f172a",backgroundColor:"#f5f2eb"}}><AdminNav/>{children}</div>}
