import { useEffect, useMemo, useRef, useState } from "react";

const TONE_CDN = "https://unpkg.com/tone@14.8.49/build/Tone.js";

export default function App() {
  const [toneReady, setToneReady] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [dataset, setDataset] = useState("neows");
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const canvasRef = useRef(null);
  const vizStateRef = useRef({ points: [] });
  const synthRef = useRef(null);
  const reverbRef = useRef(null);

  useEffect(() => {
    if (window.Tone) { setToneReady(true); return; }
    const s = document.createElement("script");
    s.src = TONE_CDN; s.async = true;
    s.onload = () => setToneReady(true);
    s.onerror = () => console.error("Failed to load Tone.js");
    document.head.appendChild(s);
  }, []);

  useEffect(() => {
    const c = canvasRef.current; if (!c) return;
    const resize = () => {
      c.width = c.clientWidth * window.devicePixelRatio;
      c.height = (c.clientWidth * 0.55) * window.devicePixelRatio;
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const demoData = useMemo(() => ({
    neows: [
      { name: "Demo NEO A", vel: 12.3, miss: 54000, mag: 22.1 },
      { name: "Demo NEO B", vel: 5.1, miss: 320000, mag: 19.2 },
      { name: "Demo NEO C", vel: 25.7, miss: 88000, mag: 17.9 },
      { name: "Demo NEO D", vel: 18.4, miss: 120000, mag: 20.1 },
    ],
    flares: [
      { cls: "C2.1", peak: "10:12" },
      { cls: "M1.0", peak: "14:33" },
      { cls: "B8.4", peak: "18:05" },
      { cls: "C5.3", peak: "21:27" },
    ]
  }), []);

  const fetchData = async () => {
    setLoading(true); setError("");
    try {
      if (!apiKey) {
        setData(dataset === "neows" ? demoData.neows : demoData.flares);
        return;
      }
      if (dataset === "neows") {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const dd = String(today.getDate()).padStart(2, "0");
        const date = `${yyyy}-${mm}-${dd}`;
        const r = await fetch(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${date}&end_date=${date}&api_key=${apiKey}`);
        if (!r.ok) throw new Error(`NeoWs error ${r.status}`);
        const json = await r.json();
        const arr = Object.values(json.near_earth_objects || {}).flat().slice(0, 16);
        const mapped = arr.map((o, i) => ({
          name: o.name || `NEO-${i+1}`,
          vel: parseFloat(o.close_approach_data?.[0]?.relative_velocity?.kilometers_per_second || 0),
          miss: parseFloat(o.close_approach_data?.[0]?.miss_distance?.kilometers || 0),
          mag: parseFloat(o.absolute_magnitude_h || 0)
        }));
        setData(mapped);
      } else {
        const end = new Date();
        const start = new Date(Date.now() - 3*24*3600*1000);
        const fmt = (d) => d.toISOString().split("T")[0];
        const r = await fetch(`https://api.nasa.gov/DONKI/FLR?startDate=${fmt(start)}&endDate=${fmt(end)}&api_key=${apiKey}`);
        if (!r.ok) throw new Error(`DONKI FLR error ${r.status}`);
        const arr = await r.json();
        const mapped = arr.slice(0, 16).map((f) => ({
          cls: f.classType || "B1.0",
          peak: (f.peakTime || "").split("T")[1]?.slice(0,5) || "--:--"
        }));
        setData(mapped.length ? mapped : demoData.flares);
      }
    } catch (e) {
      console.error(e);
      setError(e.message || "Failed to load data");
      setData(dataset === "neows" ? demoData.neows : demoData.flares);
    } finally { setLoading(false); }
  };

  const SCALES = { pleasant: ["C4","D4","E4","G4","A4","C5","D5","E5","G5","A5"] };
  function normalize(v,min,max){if(!isFinite(v))return 0;return(Math.min(Math.max(v,min),max)-min)/(max-min);}
  function velocityToNote(v){const x=normalize(v,0,40);return SCALES.pleasant[Math.floor(x*(SCALES.pleasant.length-1))];}
  function missToDuration(m){const x=1-normalize(Math.log10(m+1),3,7);return 0.2+x*0.8;}

  useEffect(()=>{vizStateRef.current.points = data.map((d,i)=>({label:d.name,angle:(i/Math.max(data.length,1))*Math.PI*2,radius:60+(normalize(d.vel,0,40)*140),size:6+(1-normalize(Math.log10((d.miss||1)+1),3,7))*10}));},[data]);

  useEffect(()=>{
    let raf;
    const ctx=canvasRef.current?.getContext("2d");
    function draw(){
      const c=canvasRef.current;if(!c||!ctx){raf=requestAnimationFrame(draw);return;}
      const dpr=window.devicePixelRatio||1,w=c.width,h=c.height;
      ctx.clearRect(0,0,w,h);
      ctx.fillStyle="#0a0a0a";ctx.fillRect(0,0,w,h);
      const cx=w/2,cy=h/2;
      ctx.globalAlpha=0.8;
      for(let i=0;i<60;i++){const x=Math.random()*w,y=Math.random()*h,r=(Math.random()*1.2+0.2)*dpr;ctx.fillStyle="#1f2937";ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();}
      ctx.globalAlpha=1;
      const pts=vizStateRef.current.points||[];
      ctx.strokeStyle="#334155";ctx.lineWidth=1*dpr;
      pts.forEach(p=>{ctx.beginPath();ctx.arc(cx,cy,p.radius*dpr,0,Math.PI*2);ctx.stroke();});
      pts.forEach(p=>{const x=cx+Math.cos(p.angle)*p.radius*dpr,y=cy+Math.sin(p.angle)*p.radius*dpr,size=p.size*dpr*(1+(p.pulse||0)*0.6);ctx.fillStyle="#93c5fd";ctx.beginPath();ctx.arc(x,y,size,0,Math.PI*2);ctx.fill();if(w/dpr>640){ctx.fillStyle="#94a3b8";ctx.font=`${12*dpr}px ui-sans-serif`;ctx.fillText(p.label,x+8*dpr,y-8*dpr);}if(p.pulse)p.pulse*=0.86;});
      raf=requestAnimationFrame(draw);
    }
    draw();
    return ()=>cancelAnimationFrame(raf);
  },[]);

  useEffect(()=>{setData(demoData.neows);},[demoData]);

  return(
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="sticky top-0 z-10 border-b border-neutral-800 backdrop-blur bg-neutral-950/60">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg sm:text-2xl font-bold tracking-tight">🎶 Sky Symphony</h1>
          <div className="flex items-center gap-2 text-sm">
            <select value={dataset} onChange={e=>setDataset(e.target.value)} className="bg-neutral-900 border border-neutral-700 rounded-full px-3 py-1">
              <option value="neows">Near-Earth Objects</option>
              <option value="flares">Solar Flares (DONKI)</option>
            </select>
            <button onClick={()=>{}} className={`px-3 py-1 rounded-full ${isPlaying?"bg-rose-300 text-neutral-900":"bg-emerald-300 text-neutral-900"}`}>{isPlaying?"Stop":"Play"}</button>
          </div>
        </div>
      </header>
      <div className="max-w-6xl mx-auto px-4 py-2 text-xs text-neutral-400 flex flex-wrap items-center gap-3">
        <span>Tone.js: {toneReady?"loaded":"loading..."}</span>
        <span>Data: {dataset==="neows"?"NEO velocity+distance → notes":"Flare class → notes"}</span>
        {error&&<span className="text-rose-400">Error: {error}</span>}
      </div>
      <main className="max-w-6xl mx-auto px-2 sm:px-4 pb-10">
        <section className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2 border border-neutral-800 rounded-2xl overflow-hidden bg-neutral-900/40">
            <canvas ref={canvasRef} className="w-full" style={{aspectRatio:"16/9"}} />
          </div>
        </section>
      </main>
      <footer className="max-w-6xl mx-auto px-4 py-6 text-xs text-neutral-500 flex flex-wrap gap-3">
        Built with React • Tone.js • NASA APIs • © Sky Symphony
      </footer>
    </div>
  );
}
