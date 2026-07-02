"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Download, Star, CheckCircle2, AlertTriangle, XCircle, Share2, Truck, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const categories = [
  { name: "Engine & Mechanical", score: 91, items: { passed: 42, issues: 3, critical: 0 } },
  { name: "Chassis & Suspension", score: 85, items: { passed: 28, issues: 5, critical: 1 } },
  { name: "Tyres & Brakes", score: 88, items: { passed: 22, issues: 3, critical: 0 } },
  { name: "Electrical & Lights", score: 92, items: { passed: 18, issues: 1, critical: 0 } },
  { name: "Body & Cabin", score: 82, items: { passed: 15, issues: 4, critical: 1 } },
  { name: "Documents", score: 95, items: { passed: 12, issues: 0, critical: 0 } },
];

const photos = [
  { url: "https://images.pexels.com/photos/8092/city-vehicles-trucks.jpg?auto=compress&cs=tinysrgb&w=400", caption: "Front View" },
  { url: "https://images.pexels.com/photos/93398/pexels-photo-93398.jpeg?auto=compress&cs=tinysrgb&w=400", caption: "Engine Bay" },
  { url: "https://images.pexels.com/photos/2116.jpg?auto=compress&cs=tinysrgb&w=400", caption: "Rear View" },
  { url: "https://images.pexels.com/photos/20781/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400", caption: "Side Profile" },
  { url: "https://images.pexels.com/photos/385997/pexels-photo-385997.jpeg?auto=compress&cs=tinysrgb&w=400", caption: "Tyre Condition" },
  { url: "https://images.pexels.com/photos/1061582/pexels-photo-1061582.jpeg?auto=compress&cs=tinysrgb&w=400", caption: "Cabin Interior" },
];

const checklistItems = {
  passed: ["Engine oil level - OK", "Coolant level - OK", "Brake pad thickness - Good", "Headlights - Working", "Tyre tread depth - Adequate", "RC Book - Verified", "Insurance - Valid", "PUC Certificate - Valid"],
  issues: ["Minor oil leak near gasket", "Wiper blade needs replacement", "Slight rust on chassis rear", "AC cooling slightly weak", "Left indicator slightly dim"],
  critical: ["Clutch pedal free play exceeds limit", "Front suspension bush worn"],
};

function scoreColor(score: number) {
  if (score >= 75) return "bg-green-500";
  if (score >= 51) return "bg-yellow-500";
  return "bg-red-500";
}

export default function ReportPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const overallScore = 88;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b-4 border-cavalo-yellow py-4 px-4 sm:px-6 sticky top-0 z-40 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button onClick={() => router.push("/dashboard")} className="text-gray-500 hover:text-navy"><ArrowLeft className="w-5 h-5" /></button>
          <h1 className="text-navy font-bold text-lg flex-1">Inspection Report #{params.id}</h1>
          <button className="btn-cavalo text-sm px-4 py-2 inline-flex items-center gap-1"><Download className="w-4 h-4" /> PDF</button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Report Hero */}
        <div className="cavalo-card p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-16 h-16 bg-cavalo-yellow-light rounded-lg flex items-center justify-center flex-shrink-0"><Truck className="w-8 h-8 text-cavalo-yellow" /></div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-navy">Tata Prima</h2>
              <div className="flex items-center gap-2 flex-wrap mt-2">
                <Badge className="bg-cavalo-yellow-light text-cavalo-yellow border border-cavalo-yellow/30">C3</Badge>
                <Badge className="bg-gray-100 text-gray-600 border border-gray-200">MH01</Badge>
                <Badge className="bg-gray-100 text-gray-600 border border-gray-200">Jan 15 2025</Badge>
                <Badge className="bg-gray-100 text-gray-600 border border-gray-200">Mumbai</Badge>
              </div>
              <div className="flex items-center gap-2 mt-3 text-sm">
                <div className="w-7 h-7 bg-cavalo-yellow-light rounded-full flex items-center justify-center"><User className="w-4 h-4 text-cavalo-yellow" /></div>
                <span className="text-gray-600">Inspector: Rajesh Kumar</span>
                <span className="flex items-center gap-1 text-gray-600"><Star className="w-3.5 h-3.5 text-cavalo-yellow fill-cavalo-yellow" /> 4.8</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-green-600">{overallScore}</div>
              <div className="text-gray-500 text-sm">out of 100</div>
              <Badge className="mt-2 bg-green-100 text-green-700 border border-green-200">Recommended</Badge>
            </div>
          </div>
          <div className="mt-6">
            <div className="flex justify-between text-xs text-gray-400 mb-1.5"><span>0</span><span>50</span><span>75</span><span>100</span></div>
            <div className="relative h-4 rounded overflow-hidden bg-gray-200">
              <div className="absolute inset-y-0 left-0 w-[50%] bg-red-300" />
              <div className="absolute inset-y-0 left-[50%] w-[25%] bg-yellow-300" />
              <div className="absolute inset-y-0 left-[75%] w-[25%] bg-green-300" />
              <div className="absolute top-0 bottom-0 bg-navy w-1" style={{ left: `${overallScore}%` }} />
            </div>
          </div>
        </div>

        {/* Category cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((c, i) => (
            <div key={i} className="cavalo-card p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-navy text-sm">{c.name}</h3>
                <span className={`text-xl font-bold ${c.score >= 75 ? "text-green-600" : c.score >= 51 ? "text-yellow-600" : "text-red-600"}`}>{c.score}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className={`h-full rounded-full ${scoreColor(c.score)}`} style={{ width: `${c.score}%` }} /></div>
              <div className="flex gap-3 mt-3 text-xs"><span className="text-green-600">{c.items.passed} passed</span><span className="text-yellow-600">{c.items.issues} issues</span>{c.items.critical > 0 && <span className="text-red-600">{c.items.critical} critical</span>}</div>
            </div>
          ))}
        </div>

        {/* Photo gallery */}
        <div className="cavalo-card p-6">
          <h2 className="font-semibold text-navy mb-4">Photo Gallery</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {photos.map((p, i) => (
              <div key={i} className="group">
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.url} alt={p.caption} className="w-full h-full object-cover group-hover:scale-105 transition" loading="lazy" />
                </div>
                <p className="text-gray-600 text-xs mt-2 text-center">{p.caption}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Checklist summary */}
        <div className="cavalo-card p-6">
          <h2 className="font-semibold text-navy mb-4">Checklist Summary</h2>
          <Tabs defaultValue="passed">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="passed" className="text-green-600 data-[state=active]:text-white data-[state=active]:bg-green-600">Passed ({checklistItems.passed.length})</TabsTrigger>
              <TabsTrigger value="issues" className="text-yellow-600 data-[state=active]:text-white data-[state=active]:bg-yellow-500">Issues ({checklistItems.issues.length})</TabsTrigger>
              <TabsTrigger value="critical" className="text-red-600 data-[state=active]:text-white data-[state=active]:bg-red-600">Critical ({checklistItems.critical.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="passed"><div className="space-y-2">{checklistItems.passed.map((item, i) => <div key={i} className="flex items-center gap-2 text-sm py-2 border-b border-gray-100"><CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" /><span className="text-gray-700">{item}</span></div>)}</div></TabsContent>
            <TabsContent value="issues"><div className="space-y-2">{checklistItems.issues.map((item, i) => <div key={i} className="flex items-center gap-2 text-sm py-2 border-b border-gray-100"><AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0" /><span className="text-gray-700">{item}</span></div>)}</div></TabsContent>
            <TabsContent value="critical"><div className="space-y-2">{checklistItems.critical.map((item, i) => <div key={i} className="flex items-center gap-2 text-sm py-2 border-b border-gray-100"><XCircle className="w-4 h-4 text-red-600 flex-shrink-0" /><span className="text-gray-700">{item}</span></div>)}</div></TabsContent>
          </Tabs>
        </div>

        <div className="flex gap-3 pb-8">
          <button className="btn-cavalo flex-1 py-3 text-sm inline-flex items-center justify-center gap-2"><Share2 className="w-4 h-4" /> Share Report</button>
          <button onClick={() => router.push("/book")} className="flex-1 btn-cavalo-outline py-3 text-sm inline-flex items-center justify-center gap-2"><Truck className="w-4 h-4" /> Book Another Inspection</button>
        </div>
      </div>
    </div>
  );
}
