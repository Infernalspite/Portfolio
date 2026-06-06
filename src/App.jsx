import { useState, useEffect, useRef } from "react";

/* ── GLOBAL STYLES ─────────────────────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap');
    *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; cursor:none!important; }
    html { scroll-behavior:smooth; }
    body { background:#0a0a0a; color:#f0ede8; overflow-x:hidden; font-family:'Inter',sans-serif; }
    ::-webkit-scrollbar { width:2px; }
    ::-webkit-scrollbar-track { background:#0a0a0a; }
    ::-webkit-scrollbar-thumb { background:#dc2626; }
    ::selection { background:#dc2626; color:#fff; }
    @keyframes scanMove { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
    @keyframes flicker { 0%,100%{opacity:1} 92%{opacity:1} 93%{opacity:0.6} 94%{opacity:1} 97%{opacity:0.8} 98%{opacity:1} }
    @keyframes glitchX { 0%,100%{clip-path:inset(0 0 95% 0)} 25%{clip-path:inset(30% 0 50% 0)} 50%{clip-path:inset(60% 0 10% 0)} 75%{clip-path:inset(10% 0 80% 0)} }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
    @keyframes fadeUp { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
    @keyframes slideInLeft { from{opacity:0;transform:translateX(-60px)} to{opacity:1;transform:translateX(0)} }
    @keyframes slideInRight { from{opacity:0;transform:translateX(60px)} to{opacity:1;transform:translateX(0)} }
    @keyframes scaleIn { from{opacity:0;transform:scale(0.92)} to{opacity:1;transform:scale(1)} }
    @keyframes lineExpand { from{width:0} to{width:100%} }
    @keyframes marqueescroll { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
    @keyframes pulse { 0%,100%{opacity:0.4} 50%{opacity:1} }
    @keyframes rotate { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    .animate-fadeUp { animation: fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) both; }
    .animate-left { animation: slideInLeft 0.9s cubic-bezier(0.16,1,0.3,1) both; }
    .animate-right { animation: slideInRight 0.9s cubic-bezier(0.16,1,0.3,1) both; }
    .animate-scale { animation: scaleIn 0.9s cubic-bezier(0.16,1,0.3,1) both; }
    input, textarea { font-family:'Space Mono',monospace; }
    input::placeholder, textarea::placeholder { color:rgba(240,237,232,0.3); }
  `}</style>
);

/* ── CURSOR ────────────────────────────────────────────────────────────────── */
const Cursor = () => {
  const dot = useRef(null);
  const ring = useRef(null);
  const mouse = useRef({x:0,y:0});
  const ringPos = useRef({x:0,y:0});
  useEffect(()=>{
    const onMove = e => {
      mouse.current = {x:e.clientX, y:e.clientY};
      if(dot.current) dot.current.style.transform = `translate(${e.clientX-4}px,${e.clientY-4}px)`;
    };
    window.addEventListener('mousemove', onMove);
    let raf;
    const loop = () => {
      ringPos.current.x += (mouse.current.x - ringPos.current.x) * 0.1;
      ringPos.current.y += (mouse.current.y - ringPos.current.y) * 0.1;
      if(ring.current) ring.current.style.transform = `translate(${ringPos.current.x-20}px,${ringPos.current.y-20}px)`;
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf); };
  },[]);
  return (
    <>
      <div ref={dot} style={{position:'fixed',top:0,left:0,width:8,height:8,background:'#dc2626',borderRadius:'50%',zIndex:99999,pointerEvents:'none',transition:'background 0.2s'}}/>
      <div ref={ring} style={{position:'fixed',top:0,left:0,width:40,height:40,border:'1.5px solid rgba(220,38,38,0.6)',borderRadius:'50%',zIndex:99998,pointerEvents:'none'}}/>
    </>
  );
};

/* ── SCANLINE OVERLAY ──────────────────────────────────────────────────────── */
const Scanlines = () => (
  <>
    <div style={{position:'fixed',inset:0,zIndex:55,pointerEvents:'none',backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.08) 3px,rgba(0,0,0,0.08) 4px)'}}/>
    <div style={{position:'fixed',top:0,left:0,right:0,height:'2px',background:'rgba(220,38,38,0.15)',zIndex:56,pointerEvents:'none',animation:'scanMove 6s linear infinite'}}/>
  </>
);

/* ── GRID ──────────────────────────────────────────────────────────────────── */
const GridBg = ({light=false}) => (
  <div style={{position:'absolute',inset:0,zIndex:0,pointerEvents:'none',backgroundImage:`linear-gradient(${light?'rgba(220,38,38,0.04)':'rgba(220,38,38,0.06)'} 1px,transparent 1px),linear-gradient(90deg,${light?'rgba(220,38,38,0.04)':'rgba(220,38,38,0.06)'} 1px,transparent 1px)`,backgroundSize:'64px 64px'}}/>
);

/* ── MARQUEE ───────────────────────────────────────────────────────────────── */
const Marquee = ({dark=true}) => {
  const items = ['AI & DATA SCIENCE','PYTHON','C++','MACHINE LEARNING','NLP','RESEARCH','GODOT ENGINE','WEB DEV','CHENNAI IT','CGPA 8.5'];
  const str = items.map(i=>`${i} ◆`).join('  ');
  return (
    <div style={{overflow:'hidden',background:dark?'#dc2626':'#0a0a0a',padding:'12px 0',position:'relative',zIndex:2}}>
      <div style={{display:'flex',whiteSpace:'nowrap',animation:'marqueescroll 22s linear infinite'}}>
        {[str,str].map((s,i)=>(
          <span key={i} style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:15,letterSpacing:'0.2em',color:dark?'#fff':'#dc2626',paddingRight:'2rem'}}>{s}</span>
        ))}
      </div>
    </div>
  );
};

/* ── useInView ─────────────────────────────────────────────────────────────── */
const useInView = (ref, threshold=0.12) => {
  const [v,setV] = useState(false);
  useEffect(()=>{
    const ob = new IntersectionObserver(([e])=>{ if(e.isIntersecting) setV(true); },{threshold});
    if(ref.current) ob.observe(ref.current);
    return ()=>ob.disconnect();
  },[]);
  return v;
};

/* ── LOADER ────────────────────────────────────────────────────────────────── */
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';
const scramble = (target, progress) =>
  target.split('').map((ch,i) => progress > i/target.length ? ch : CHARS[Math.floor(Math.random()*CHARS.length)]).join('');

const Loader = ({onDone}) => {
  const [pct, setPct] = useState(0);
  const [name, setName] = useState('TAARUNYA GIRIRAJ');
  const [role, setRole] = useState('AI & DATA SCIENCE');
  const [logs, setLogs] = useState([]);
  const logLines = ['> BOOT SEQUENCE INITIATED','> NEURAL CORE LOADED','  [AI/ML]......... OK','  [PYTHON]........ OK','  [C++]........... OK','> MOUNTING PORTFOLIO','  [PROJECTS]...... 4','  [CERTS]......... 8','> RENDER ENGINE STARTED','  WELCOME, OPERATOR ◆'];

  useEffect(()=>{
    let v=0;
    const id = setInterval(()=>{
      v += Math.random()*2.5+0.3;
      if(v>=100){ v=100; clearInterval(id); setTimeout(onDone,800); }
      setPct(Math.floor(Math.min(v,100)));
      setName(scramble('TAARUNYA GIRIRAJ', v/100));
      setRole(scramble('AI & DATA SCIENCE', v/100));
      setLogs(logLines.slice(0, Math.min(Math.floor((v/100)*logLines.length)+1, logLines.length)));
    },40);
    return ()=>clearInterval(id);
  },[]);

  return (
    <div style={{position:'fixed',inset:0,background:'#0a0a0a',zIndex:9999,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',overflow:'hidden',animation:'flicker 4s ease-in-out infinite'}}>
      <GridBg/>
      <Scanlines/>
      {/* corner brackets */}
      {[{top:20,left:20},{top:20,right:20},{bottom:20,left:20},{bottom:20,right:20}].map((pos,i)=>(
        <svg key={i} width="32" height="32" style={{position:'absolute',...pos,opacity:0.5}}>
          {i===0&&<><path d="M0 20 L0 0 L20 0" fill="none" stroke="#dc2626" strokeWidth="2"/></>}
          {i===1&&<><path d="M32 20 L32 0 L12 0" fill="none" stroke="#dc2626" strokeWidth="2"/></>}
          {i===2&&<><path d="M0 12 L0 32 L20 32" fill="none" stroke="#dc2626" strokeWidth="2"/></>}
          {i===3&&<><path d="M32 12 L32 32 L12 32" fill="none" stroke="#dc2626" strokeWidth="2"/></>}
        </svg>
      ))}
      {/* top bar */}
      <div style={{position:'absolute',top:20,left:60,right:60,display:'flex',justifyContent:'space-between',fontFamily:"'Space Mono',monospace",fontSize:10,color:'rgba(220,38,38,0.5)',letterSpacing:'0.3em'}}>
        <span>SYS://BOOT_v2.5</span>
        <span>{new Date().toLocaleDateString('en-GB')}</span>
      </div>

      <div style={{position:'relative',zIndex:2,width:'90%',maxWidth:700,display:'grid',gridTemplateColumns:'1fr 1fr',gap:48,alignItems:'center'}}>
        {/* LEFT */}
        <div>
          <div style={{fontFamily:"'Space Mono',monospace",fontSize:9,letterSpacing:'0.4em',color:'rgba(220,38,38,0.5)',marginBottom:12}}>◆ IDENTITY.LOAD</div>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'clamp(2.8rem,7vw,5.5rem)',lineHeight:0.92,color:'#f0ede8',letterSpacing:'0.04em',marginBottom:8,textShadow:pct<85?`${(Math.random()-0.5)*6}px 0 #dc2626`:'none'}}>
            {name}
          </div>
          <div style={{fontFamily:"'Space Mono',monospace",fontSize:13,color:'#dc2626',letterSpacing:'0.3em',marginBottom:28}}>
            {role}
          </div>
          {/* barcode */}
          <div style={{display:'flex',gap:2,alignItems:'flex-end',marginBottom:24}}>
            {Array.from({length:36},(_,i)=>(
              <div key={i} style={{width:i%5===0?3:i%3===0?2:1,height:i%7===0?32:i%4===0?22:16,background:`rgba(220,38,38,${0.3+Math.random()*0.6})`}}/>
            ))}
          </div>
          {/* progress */}
          <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:'rgba(240,237,232,0.5)',marginBottom:6,display:'flex',justifyContent:'space-between'}}>
            <span>LOADING ASSETS</span><span style={{color:'#dc2626'}}>{pct}%</span>
          </div>
          <div style={{height:2,background:'rgba(220,38,38,0.15)'}}>
            <div style={{height:'100%',background:'#dc2626',width:`${pct}%`,transition:'width 0.05s',boxShadow:'0 0 8px rgba(220,38,38,0.6)'}}/>
          </div>
          <div style={{fontFamily:"'Space Mono',monospace",fontSize:9,color:'rgba(240,237,232,0.25)',letterSpacing:'0.2em',marginTop:10}}>
            13.0827°N 80.2707°E ◆ CHENNAI.IN
          </div>
        </div>
        {/* RIGHT: terminal */}
        <div style={{border:'1px solid rgba(220,38,38,0.25)',padding:'20px',background:'rgba(220,38,38,0.03)'}}>
          <div style={{display:'flex',gap:6,alignItems:'center',marginBottom:16,paddingBottom:12,borderBottom:'1px solid rgba(220,38,38,0.15)'}}>
            {['#ef4444','#f59e0b','#22c55e'].map((c,i)=><span key={i} style={{width:9,height:9,borderRadius:'50%',background:c,display:'block'}}/>)}
            <span style={{fontFamily:"'Space Mono',monospace",fontSize:9,color:'rgba(220,38,38,0.4)',marginLeft:6}}>terminal — bash</span>
          </div>
          <div style={{fontFamily:"'Space Mono',monospace",fontSize:11,lineHeight:1.9,color:'rgba(240,237,232,0.7)'}}>
            {logs.map((l,i)=>(
              <div key={i} style={{color:l.startsWith('>')? '#dc2626': l.startsWith('  [')? 'rgba(240,237,232,0.45)':'rgba(240,237,232,0.7)'}}>{l}</div>
            ))}
            <span style={{animation:'blink 0.8s step-end infinite',color:'#dc2626'}}>█</span>
          </div>
        </div>
      </div>
      {/* bottom strip */}
      <div style={{position:'absolute',bottom:20,left:60,right:60,display:'flex',justifyContent:'space-between',fontFamily:"'Space Mono',monospace",fontSize:9,color:'rgba(220,38,38,0.35)',letterSpacing:'0.2em'}}>
        <span>AI ◆ PYTHON ◆ C++ ◆ ML ◆ GODOT</span>
        <span>©2025 TG_PORTFOLIO</span>
      </div>
    </div>
  );
};

/* ── NAV ───────────────────────────────────────────────────────────────────── */
const Nav = ({active,go}) => {
  const [scrolled,setScrolled] = useState(false);
  useEffect(()=>{
    const fn=()=>setScrolled(window.scrollY>60);
    window.addEventListener('scroll',fn);
    return()=>window.removeEventListener('scroll',fn);
  },[]);
  return (
    <nav style={{position:'fixed',top:0,left:0,right:0,zIndex:40,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'18px 48px',background:scrolled?'rgba(10,10,10,0.97)':'transparent',borderBottom:scrolled?'1px solid rgba(220,38,38,0.15)':'none',backdropFilter:scrolled?'blur(12px)':'none',transition:'all 0.4s'}}>
      <div style={{display:'flex',alignItems:'center',gap:10}}>
        <div style={{width:8,height:8,background:'#dc2626',animation:'pulse 2s ease-in-out infinite'}}/>
        <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,letterSpacing:'0.15em',color:'#f0ede8'}}>TG</span>
        <span style={{fontFamily:"'Space Mono',monospace",fontSize:9,color:'rgba(220,38,38,0.5)',letterSpacing:'0.2em'}}>_PORTFOLIO</span>
      </div>
      <div style={{display:'flex',gap:36}}>
        {['HOME','ABOUT','PROJECTS','SKILLS','CONTACT'].map(l=>(
          <button key={l} onClick={()=>go(l)} style={{fontFamily:"'Space Mono',monospace",fontSize:10,letterSpacing:'0.25em',color:active===l?'#dc2626':'rgba(240,237,232,0.5)',background:'none',border:'none',cursor:'none',position:'relative',padding:'4px 0',transition:'color 0.3s'}}>
            {l}
            <span style={{position:'absolute',bottom:0,left:0,height:'1.5px',background:'#dc2626',width:active===l?'100%':'0%',transition:'width 0.35s cubic-bezier(0.16,1,0.3,1)'}}/>
          </button>
        ))}
      </div>
      <div style={{fontFamily:"'Space Mono',monospace",fontSize:9,color:'rgba(220,38,38,0.4)',letterSpacing:'0.2em'}}>
        {new Date().toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}).toUpperCase()}
      </div>
    </nav>
  );
};

/* ── HERO ──────────────────────────────────────────────────────────────────── */
const Hero = ({go}) => {
  const [on,setOn]=useState(false);
  useEffect(()=>{ setTimeout(()=>setOn(true),100); },[]);
  const d=(delay)=>({animationDelay:`${delay}s`,animationFillMode:'both'});

  return (
    <section style={{position:'relative',minHeight:'100vh',display:'flex',flexDirection:'column',overflow:'hidden',background:'#0a0a0a'}}>
      <GridBg/>
      <Scanlines/>
      {/* top meta strip — like reference image */}
      <div style={{position:'relative',zIndex:2,display:'flex',justifyContent:'space-between',padding:'90px 48px 0',fontFamily:"'Space Mono',monospace",fontSize:10,color:'rgba(240,237,232,0.35)',letterSpacing:'0.25em',opacity:on?1:0,transition:'opacity 1s 0.3s'}}>
        <span>CREATIVE PORTFOLIO</span>
        <span>{new Date().toLocaleDateString('en-GB',{day:'2-digit',month:'long',year:'numeric'}).toUpperCase()}</span>
      </div>

      {/* MASSIVE HEADLINE — reference style, text bleeds edge to edge */}
      <div style={{position:'relative',zIndex:2,padding:'24px 0 0',overflow:'hidden',opacity:on?1:0,transition:'opacity 0.8s 0.2s'}}>
        <div style={{
          fontFamily:"'Bebas Neue',sans-serif",
          fontSize:'clamp(5.5rem,16vw,18rem)',
          lineHeight:0.85,
          letterSpacing:'0.02em',
          color:'#dc2626',
          paddingLeft:48,
          position:'relative',
        }}>
          TAARUNYA
          {/* glitch layer */}
          <div style={{position:'absolute',top:0,left:48,fontFamily:"'Bebas Neue',sans-serif",fontSize:'clamp(5.5rem,16vw,18rem)',lineHeight:0.85,letterSpacing:'0.02em',color:'#dc2626',opacity:0.4,animation:'glitchX 8s ease-in-out infinite',clipPath:'inset(0 0 90% 0)',mixBlendMode:'screen',userSelect:'none'}}>TAARUNYA</div>
        </div>
        <div style={{
          fontFamily:"'Bebas Neue',sans-serif",
          fontSize:'clamp(5.5rem,16vw,18rem)',
          lineHeight:0.85,
          letterSpacing:'0.02em',
          color:'#f0ede8',
          paddingLeft:48,
        }}>
          GIRIRAJ
        </div>
      </div>

      {/* content row — bio left, info right */}
      <div style={{position:'relative',zIndex:2,display:'grid',gridTemplateColumns:'1fr 1fr',gap:48,padding:'32px 48px 0',flex:1,alignItems:'start',opacity:on?1:0,transition:'opacity 0.8s 0.5s'}}>
        <div>
          <p style={{fontFamily:"'Space Mono',monospace",fontSize:13,lineHeight:1.85,color:'rgba(240,237,232,0.6)',maxWidth:420,marginBottom:32}}>
            AI & Data Science undergraduate at Chennai Institute of Technology — building intelligent systems, from SaaS platforms to small language models. CGPA 8.5.
          </p>
          <div style={{display:'flex',gap:12}}>
            <button onClick={()=>go('PROJECTS')} style={{display:'flex',alignItems:'center',gap:8,padding:'14px 32px',fontFamily:"'Bebas Neue',sans-serif",fontSize:16,letterSpacing:'0.15em',color:'#f0ede8',background:'#dc2626',border:'none',cursor:'none',transition:'all 0.2s'}}
              onMouseEnter={e=>e.currentTarget.style.background='#b91c1c'}
              onMouseLeave={e=>e.currentTarget.style.background='#dc2626'}>
              VIEW WORK →
            </button>
            <button onClick={()=>go('CONTACT')} style={{padding:'14px 32px',fontFamily:"'Bebas Neue',sans-serif",fontSize:16,letterSpacing:'0.15em',color:'#dc2626',background:'transparent',border:'1.5px solid rgba(220,38,38,0.4)',cursor:'none',transition:'all 0.2s'}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor='#dc2626';e.currentTarget.style.background='rgba(220,38,38,0.06)';}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(220,38,38,0.4)';e.currentTarget.style.background='transparent';}}>
              CONTACT
            </button>
          </div>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:4,fontFamily:"'Space Mono',monospace",fontSize:11,color:'rgba(240,237,232,0.35)',letterSpacing:'0.15em'}}>
          <span>itstaarunya@gmail.com</span>
          <span>@Infernalspite (GitHub)</span>
          <span>Chennai, Tamil Nadu, India</span>
        </div>
      </div>

      {/* bottom strip */}
      <div style={{position:'relative',zIndex:2,display:'flex',justifyContent:'space-between',padding:'20px 48px',borderTop:'1px solid rgba(220,38,38,0.1)',marginTop:'auto',fontFamily:"'Space Mono',monospace",fontSize:10,color:'rgba(240,237,232,0.25)',letterSpacing:'0.15em',opacity:on?1:0,transition:'opacity 1s 0.8s'}}>
        <span>itstaarunya@gmail.com</span>
        <div style={{display:'flex',gap:6,alignItems:'center'}}>{Array.from({length:5}).map((_,i)=><div key={i} style={{width:i===2?24:8,height:1.5,background:`rgba(220,38,38,${0.2+i*0.05})`}}/>)}</div>
        <span>13.0827° N, 80.2707° E</span>
      </div>
    </section>
  );
};

/* ── ABOUT ─────────────────────────────────────────────────────────────────── */
const About = () => {
  const ref=useRef(null); const v=useInView(ref);
  return (
    <section ref={ref} style={{background:'#111',position:'relative',overflow:'hidden'}}>
      <GridBg/>
      {/* section header */}
      <div style={{padding:'72px 48px 0',position:'relative',zIndex:2}}>
        <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:8,opacity:v?1:0,transition:'opacity 0.8s'}}>
          <div style={{width:12,height:1.5,background:'#dc2626'}}/>
          <span style={{fontFamily:"'Space Mono',monospace",fontSize:10,letterSpacing:'0.35em',color:'rgba(220,38,38,0.6)'}}>01 // ABOUT ME</span>
        </div>
        <div className={v?'animate-left':''} style={{opacity:v?1:0}}>
          <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'clamp(3.5rem,9vw,9rem)',lineHeight:0.88,letterSpacing:'0.04em',color:'#f0ede8'}}>
            HELLO,<br/>I'M <span style={{color:'#dc2626'}}>TAARUNYA</span><br/>GIRIRAJ
          </h2>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:64,padding:'48px 48px 72px',position:'relative',zIndex:2}}>
        {/* left bio */}
        <div className={v?'animate-left':''} style={{animationDelay:'0.1s',opacity:v?1:0}}>
          <p style={{fontFamily:"'Space Mono',monospace",fontSize:13,lineHeight:1.95,color:'rgba(240,237,232,0.65)',marginBottom:24}}>
            A motivated Artificial Intelligence and Data Science undergraduate with a strong foundation in Object-Oriented Programming, Data Structures, and software development. Passionate about building scalable intelligent solutions.
          </p>
          <p style={{fontFamily:"'Space Mono',monospace",fontSize:13,lineHeight:1.95,color:'rgba(240,237,232,0.45)',marginBottom:36}}>
            Currently architecting an AI-driven SaaS platform, researching environmental data science, and expanding into game development with Godot Engine.
          </p>
          {/* stats row */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:1,border:'1px solid rgba(220,38,38,0.2)',overflow:'hidden'}}>
            {[{n:'8.5',l:'CGPA'},{n:'4+',l:'PROJECTS'},{n:'5+',l:'CERTS'},{n:'2',l:'INTERNSHIPS'}].map((s,i)=>(
              <div key={s.l} style={{padding:'20px 16px',background:i===0?'rgba(220,38,38,0.08)':'transparent',borderRight:i<3?'1px solid rgba(220,38,38,0.12)':'none',textAlign:'center'}}>
                <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:36,color:'#dc2626',lineHeight:1}}>{s.n}</div>
                <div style={{fontFamily:"'Space Mono',monospace",fontSize:9,color:'rgba(240,237,232,0.4)',letterSpacing:'0.2em',marginTop:4}}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* right — profile card */}
        <div className={v?'animate-right':''} style={{animationDelay:'0.15s',opacity:v?1:0}}>
          {/* red circle accent like reference */}
          <div style={{position:'relative',marginBottom:24}}>
            <div style={{width:100,height:100,background:'#dc2626',borderRadius:'50%',position:'absolute',right:0,top:-20,opacity:0.15}}/>
            <div style={{border:'1px solid rgba(220,38,38,0.2)',background:'rgba(220,38,38,0.04)',padding:'0'}}>
              <div style={{display:'flex',alignItems:'center',gap:6,padding:'8px 14px',borderBottom:'1px solid rgba(220,38,38,0.15)',background:'rgba(220,38,38,0.06)'}}>
                {['#ef4444','#f59e0b','#22c55e'].map((c,i)=><span key={i} style={{width:8,height:8,borderRadius:'50%',background:c,display:'block'}}/>)}
                <span style={{fontFamily:"'Space Mono',monospace",fontSize:9,color:'rgba(220,38,38,0.4)',marginLeft:6}}>operator.profile</span>
              </div>
              <div style={{padding:'18px 20px'}}>
                {[
                  {k:'NAME',v:'Taarunya Giriraj'},
                  {k:'DOB',v:'19 June 2007'},
                  {k:'INSTITUTE',v:'Chennai Institute of Technology'},
                  {k:'MAJOR',v:'Artificial Intelligence & Data Science'},
                  {k:'CGPA',v:'8.5 / 10.0'},
                  {k:'INTERNSHIP',v:'8Queens, Chennai (Summer 2025)'},
                  {k:'INTERN 2',v:'Ideassion Institute, Chennai (2 Weeks)'},
                  {k:'EMAIL',v:'itstaarunya@gmail.com'},
                  {k:'GITHUB',v:'github.com/Infernalspite'},
                  {k:'STATUS',v:'Open to Opportunities'},
                ].map(r=>(
                  <div key={r.k} style={{display:'flex',gap:16,padding:'8px 0',borderBottom:'1px solid rgba(220,38,38,0.07)'}}>
                    <span style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:'rgba(220,38,38,0.5)',width:90,flexShrink:0,letterSpacing:'0.1em'}}>{r.k}</span>
                    <span style={{fontFamily:"'Space Mono',monospace",fontSize:11,color:'rgba(240,237,232,0.75)',lineHeight:1.5}}>{r.v}</span>
                  </div>
                ))}
                <div style={{display:'flex',alignItems:'center',gap:8,marginTop:14}}>
                  <span style={{width:7,height:7,borderRadius:'50%',background:'#dc2626',display:'block',animation:'pulse 1.4s ease-in-out infinite'}}/>
                  <span style={{fontFamily:"'Space Mono',monospace",fontSize:9,letterSpacing:'0.2em',color:'rgba(220,38,38,0.5)'}}>ACTIVELY BUILDING</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ── PROJECTS ──────────────────────────────────────────────────────────────── */
const projects = [
  {n:'01',t:'AI Educational SaaS Platform',sub:'PLATFORM ARCHITECTURE · IN PROGRESS',tags:['Python','HTML/CSS','AI/ML'],desc:'Architecting an AI-powered SaaS platform to enhance personalized student learning through adaptive content delivery and interaction analysis algorithms.'},
  {n:'02',t:'SLM for Healthcare',sub:'SMALL LANGUAGE MODEL',tags:['Python','NLP','Healthcare'],desc:'Specialized Small Language Model tailored for healthcare applications — enabling intelligent medical data interpretation and clinical decision support.'},
  {n:'03',t:'Job Web Scraper',sub:'DATA AUTOMATION ENGINE',tags:['Python','Web Scraping','Data Engineering'],desc:'Multi-site job listing scraper with structured data parsing, normalization, and export pipelines for aggregated job market analysis.'},
  {n:'04',t:'Water Hyacinth Research',sub:'ENVIRONMENTAL DATA SCIENCE · NOV–DEC 2024',tags:['Data Analysis','Research','Ecology'],desc:'Ecological study on Water Hyacinth effects on water bodies. Presented at SRM University — awarded Runner-Up at the Youth Research Competition.'},
];

const Projects = () => {
  const ref=useRef(null); const v=useInView(ref);
  return (
    <section ref={ref} style={{background:'#0a0a0a',position:'relative',overflow:'hidden',paddingBottom:72}}>
      <GridBg/>
      <div style={{padding:'72px 48px 48px',position:'relative',zIndex:2}}>
        <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:8,opacity:v?1:0,transition:'opacity 0.8s'}}>
          <div style={{width:12,height:1.5,background:'#dc2626'}}/>
          <span style={{fontFamily:"'Space Mono',monospace",fontSize:10,letterSpacing:'0.35em',color:'rgba(220,38,38,0.6)'}}>02 // SELECTED WORKS</span>
        </div>
        <div className={v?'animate-left':''} style={{opacity:v?1:0}}>
          <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'clamp(3.5rem,9vw,9rem)',lineHeight:0.88,letterSpacing:'0.04em',color:'#f0ede8'}}>
            MY<br/><span style={{color:'#dc2626'}}>PROJECTS</span>
          </h2>
        </div>
      </div>
      {/* project list — editorial rows like reference */}
      <div style={{position:'relative',zIndex:2,padding:'0 48px'}}>
        {projects.map((p,i)=>{
          const pref=useRef(null); const pv=useInView(pref,0.1);
          const [h,setH]=useState(false);
          return (
            <div key={p.n} ref={pref}
              onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
              style={{
                borderTop:`1px solid rgba(220,38,38,${h?0.35:0.12})`,
                padding:'28px 0',
                display:'grid',gridTemplateColumns:'80px 1fr auto',gap:32,alignItems:'start',
                cursor:'none',transition:'all 0.3s',
                background:h?'rgba(220,38,38,0.03)':'transparent',
                opacity:pv?1:0,transform:pv?'translateY(0)':'translateY(30px)',
                transition:`opacity 0.8s ${i*0.1}s,transform 0.8s ${i*0.1}s cubic-bezier(0.16,1,0.3,1),background 0.3s`,
              }}>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:48,color:h?'#dc2626':'rgba(240,237,232,0.15)',lineHeight:1,transition:'color 0.3s'}}>{p.n}</div>
              <div>
                <div style={{fontFamily:"'Space Mono',monospace",fontSize:9,letterSpacing:'0.3em',color:'rgba(220,38,38,0.5)',marginBottom:8}}>{p.sub}</div>
                <h3 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'clamp(1.6rem,3vw,2.8rem)',letterSpacing:'0.04em',color:h?'#dc2626':'#f0ede8',transition:'color 0.3s',marginBottom:10,lineHeight:1}}>{p.t}</h3>
                <p style={{fontFamily:"'Space Mono',monospace",fontSize:11,lineHeight:1.8,color:'rgba(240,237,232,0.45)',maxWidth:560}}>{p.desc}</p>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:6,alignItems:'flex-end',paddingTop:4}}>
                {p.tags.map(t=><span key={t} style={{fontFamily:"'Space Mono',monospace",fontSize:9,letterSpacing:'0.15em',padding:'3px 10px',border:`1px solid rgba(220,38,38,${h?0.4:0.2})`,color:`rgba(220,38,38,${h?0.8:0.5})`,transition:'all 0.3s',whiteSpace:'nowrap'}}>{t}</span>)}
              </div>
            </div>
          );
        })}
        <div style={{borderTop:'1px solid rgba(220,38,38,0.12)'}}/>
      </div>
    </section>
  );
};

/* ── SKILLS ────────────────────────────────────────────────────────────────── */
const skillGroups=[
  {l:'LANGUAGES',s:['Python','C++']},
  {l:'WEB & FRAMEWORKS',s:['HTML','CSS','React (Learning)']},
  {l:'AI / ML',s:['Machine Learning','NLP','Data Analysis','Model Training']},
  {l:'DEV TOOLS',s:['GitHub','VS Code','Godot Engine']},
  {l:'CS CONCEPTS',s:['OOP','DSA','SaaS Architecture','Web Scraping']},
  {l:'SOFT SKILLS',s:['Leadership','Problem Solving','Research','Collaboration']},
];
const achievements=[
  {y:'2025',t:'3rd Place — SDG Hackathon, Chennai Institute of Technology'},
  {y:'2024',t:'Runner-Up — SRM University Youth Research Competition'},
  {y:'2025',t:'Coursera: Python Programming & Data Science Certifications'},
  {y:'2025',t:'SWAYAM IIT — AI for Aspiring Engineers'},
  {y:'2025',t:'SWAYAM IIT — Machine Learning using Python'},
  {y:'2025',t:'2-Week Internship — Ideassion Institute for Talent Transformation, Chennai'},
  {y:'2024–25',t:'Multiple Hackathons & Technical Conferences'},
  {y:'2025',t:'Game Development Practitioner — Godot Engine (Ongoing)'},
];

const Skills = () => {
  const ref=useRef(null); const v=useInView(ref);
  return (
    <section ref={ref} style={{background:'#111',position:'relative',overflow:'hidden',paddingBottom:72}}>
      <GridBg/>
      <div style={{padding:'72px 48px 48px',position:'relative',zIndex:2}}>
        <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:8,opacity:v?1:0,transition:'opacity 0.8s'}}>
          <div style={{width:12,height:1.5,background:'#dc2626'}}/>
          <span style={{fontFamily:"'Space Mono',monospace",fontSize:10,letterSpacing:'0.35em',color:'rgba(220,38,38,0.6)'}}>03 // TECH STACK</span>
        </div>
        <div className={v?'animate-left':''} style={{opacity:v?1:0,marginBottom:48}}>
          <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'clamp(3.5rem,9vw,9rem)',lineHeight:0.88,letterSpacing:'0.04em',color:'#f0ede8'}}>
            MY<br/><span style={{color:'#dc2626'}}>EDUCATION</span><br/>& SKILLS
          </h2>
        </div>
        {/* education block — reference style */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:48,marginBottom:56,position:'relative',zIndex:2}}>
          <div>
            <div style={{marginBottom:6,display:'flex',gap:16}}>
              <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:18,color:'#f0ede8',letterSpacing:'0.1em'}}>Bachelor of Technology</span>
              <span style={{fontFamily:"'Space Mono',monospace",fontSize:11,color:'rgba(220,38,38,0.6)',marginLeft:'auto',whiteSpace:'nowrap'}}>(2024 – 2028)</span>
            </div>
            <div style={{fontFamily:"'Space Mono',monospace",fontSize:11,color:'rgba(240,237,232,0.45)',lineHeight:1.8,paddingBottom:20,borderBottom:'1px solid rgba(220,38,38,0.12)',marginBottom:20}}>
              Chennai Institute of Technology — Artificial Intelligence & Data Science. CGPA: 8.5 / 10.0. Strong foundation in OOP, Data Structures, algorithms, and AI/ML fundamentals.
            </div>
            <div style={{display:'flex',gap:16,marginBottom:6}}>
              <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:18,color:'#f0ede8',letterSpacing:'0.1em'}}>Summer Intern — 8Queens</span>
              <span style={{fontFamily:"'Space Mono',monospace",fontSize:11,color:'rgba(220,38,38,0.6)',marginLeft:'auto',whiteSpace:'nowrap'}}>(June–July 2025)</span>
            </div>
            <div style={{fontFamily:"'Space Mono',monospace",fontSize:11,color:'rgba(240,237,232,0.45)',lineHeight:1.8,paddingBottom:20,borderBottom:'1px solid rgba(220,38,38,0.12)'}}>
              Chennai, India — selected for a competitive internship focused on technology-driven solutions, collaborating with engineering teams on software development and codebase optimization.
            </div>
          </div>
          <div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:10}}>
              {skillGroups.map((g,gi)=>(
                <div key={g.l} className={v?'animate-fadeUp':''} style={{animationDelay:`${gi*0.07}s`,opacity:v?1:0,border:'1px solid rgba(220,38,38,0.14)',padding:'16px',background:'rgba(220,38,38,0.03)'}}>
                  <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:12}}>
                    <div style={{width:4,height:4,background:'#dc2626',flexShrink:0}}/>
                    <span style={{fontFamily:"'Space Mono',monospace",fontSize:8,letterSpacing:'0.25em',color:'rgba(220,38,38,0.55)'}}>{g.l}</span>
                  </div>
                  <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
                    {g.s.map(sk=><span key={sk} style={{fontFamily:"'Space Mono',monospace",fontSize:10,padding:'3px 8px',border:'1px solid rgba(220,38,38,0.18)',color:'rgba(240,237,232,0.6)'}}>{sk}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* achievements table */}
        <div style={{border:'1px solid rgba(220,38,38,0.15)',position:'relative',zIndex:2,opacity:v?1:0,transition:'opacity 0.9s 0.5s'}}>
          <div style={{padding:'14px 20px',borderBottom:'1px solid rgba(220,38,38,0.12)',display:'flex',alignItems:'center',gap:10,background:'rgba(220,38,38,0.05)'}}>
            <div style={{width:6,height:6,background:'#dc2626'}}/>
            <span style={{fontFamily:"'Space Mono',monospace",fontSize:9,letterSpacing:'0.3em',color:'rgba(220,38,38,0.6)'}}>CERTIFICATES & ACHIEVEMENTS</span>
          </div>
          {achievements.map((a,i)=>(
            <div key={i} style={{display:'grid',gridTemplateColumns:'80px 1fr',gap:20,padding:'14px 20px',borderBottom:i<achievements.length-1?'1px solid rgba(220,38,38,0.07)':'none',alignItems:'start'}}>
              <span style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:'rgba(220,38,38,0.45)',letterSpacing:'0.1em'}}>{a.y}</span>
              <span style={{fontFamily:"'Space Mono',monospace",fontSize:12,color:'rgba(240,237,232,0.65)',lineHeight:1.6}}>{a.t}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ── CONTACT ───────────────────────────────────────────────────────────────── */
const Contact = () => {
  const ref=useRef(null); const v=useInView(ref);
  const [form,setForm]=useState({name:'',email:'',subject:'',message:''});
  const [status,setStatus]=useState('idle'); // idle | sending | sent | error
  const [touched,setTouched]=useState({});

  const handleChange = e => setForm(f=>({...f,[e.target.name]:e.target.value}));
  const handleBlur = e => setTouched(t=>({...t,[e.target.name]:true}));

  const handleSubmit = async () => {
    if(!form.name||!form.email||!form.message){ setTouched({name:true,email:true,message:true}); return; }
    setStatus('sending');
    try {
      const res = await fetch('https://formsubmit.co/ajax/itstaarunya@gmail.com', {
        method:'POST',
        headers:{'Content-Type':'application/json','Accept':'application/json'},
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: form.subject || `Portfolio Contact from ${form.name}`,
          message: form.message,
          _subject: `[Portfolio] New message from ${form.name}`,
          _template: 'table',
        }),
      });
      const data = await res.json();
      if(data.success==='true'||data.success===true){ setStatus('sent'); setForm({name:'',email:'',subject:'',message:''}); setTouched({}); }
      else setStatus('error');
    } catch { setStatus('error'); }
    setTimeout(()=>setStatus('idle'),5000);
  };

  const inputStyle = (field) => ({
    width:'100%',padding:'14px 16px',
    fontFamily:"'Space Mono',monospace",fontSize:12,
    color:'#f0ede8',background:'transparent',
    border:`1px solid ${touched[field]&&!form[field]?'rgba(239,68,68,0.7)':'rgba(220,38,38,0.22)'}`,
    outline:'none',transition:'border-color 0.3s',
    letterSpacing:'0.05em',
  });

  return (
    <section ref={ref} style={{background:'#0a0a0a',position:'relative',overflow:'hidden',paddingBottom:80}}>
      <GridBg/>
      <div style={{padding:'72px 48px 0',position:'relative',zIndex:2}}>
        <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:8,opacity:v?1:0,transition:'opacity 0.8s'}}>
          <div style={{width:12,height:1.5,background:'#dc2626'}}/>
          <span style={{fontFamily:"'Space Mono',monospace",fontSize:10,letterSpacing:'0.35em',color:'rgba(220,38,38,0.6)'}}>04 // GET IN TOUCH</span>
        </div>
        <div className={v?'animate-left':''} style={{opacity:v?1:0,marginBottom:12}}>
          <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'clamp(3.5rem,9vw,9rem)',lineHeight:0.88,letterSpacing:'0.04em',color:'#f0ede8'}}>
            LET'S <span style={{color:'#dc2626'}}>CONNECT.</span>
          </h2>
        </div>
        {/* professional response note */}
        <div style={{display:'flex',alignItems:'flex-start',gap:12,padding:'16px 20px',border:'1px solid rgba(220,38,38,0.2)',background:'rgba(220,38,38,0.05)',maxWidth:640,marginBottom:48,opacity:v?1:0,transition:'opacity 0.9s 0.2s'}}>
          <div style={{width:6,height:6,background:'#dc2626',flexShrink:0,marginTop:4,animation:'pulse 1.5s ease-in-out infinite'}}/>
          <p style={{fontFamily:"'Space Mono',monospace",fontSize:11,lineHeight:1.8,color:'rgba(240,237,232,0.65)'}}>
            I personally review every message and will respond to each inquiry <span style={{color:'#dc2626',fontWeight:700}}>as promptly as possible</span>. Whether you have a project in mind, a collaboration opportunity, or simply want to connect — I look forward to hearing from you.
          </p>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:64,position:'relative',zIndex:2}}>
          {/* contact info */}
          <div className={v?'animate-left':''} style={{animationDelay:'0.1s',opacity:v?1:0}}>
            <div style={{marginBottom:32}}>
              {[
                {l:'EMAIL',v:'itstaarunya@gmail.com',href:'mailto:itstaarunya@gmail.com'},
                {l:'PHONE',v:'+91 9487108550',href:'tel:+919487108550'},
                {l:'LINKEDIN',v:'taarunya-giriraj-082303382',href:'https://www.linkedin.com/in/taarunya-giriraj-082303382/'},
                {l:'GITHUB',v:'Infernalspite',href:'https://github.com/Infernalspite'},
                {l:'LOCATION',v:'Chennai, Tamil Nadu, India'},
              ].map((c,i)=>(
                <div key={c.l} style={{display:'grid',gridTemplateColumns:'110px 1fr',gap:16,padding:'16px 0',borderBottom:'1px solid rgba(220,38,38,0.1)',alignItems:'center'}}>
                  <span style={{fontFamily:"'Space Mono',monospace",fontSize:9,letterSpacing:'0.25em',color:'rgba(220,38,38,0.5)'}}>{c.l}</span>
                  {c.href
                    ? <a href={c.href} target="_blank" rel="noreferrer" style={{fontFamily:"'Space Mono',monospace",fontSize:13,color:'rgba(240,237,232,0.8)',textDecoration:'none',letterSpacing:'0.03em',transition:'color 0.2s'}}
                        onMouseEnter={e=>e.currentTarget.style.color='#dc2626'}
                        onMouseLeave={e=>e.currentTarget.style.color='rgba(240,237,232,0.8)'}>
                        {c.v}
                      </a>
                    : <span style={{fontFamily:"'Space Mono',monospace",fontSize:13,color:'rgba(240,237,232,0.8)',letterSpacing:'0.03em'}}>{c.v}</span>
                  }
                </div>
              ))}
            </div>
            {/* decorative element */}
            <div style={{display:'flex',flexDirection:'column',gap:3}}>
              {Array.from({length:5}).map((_,i)=>(
                <div key={i} style={{display:'flex',gap:3}}>
                  {Array.from({length:12}).map((_,j)=>(
                    <div key={j} style={{width:4,height:4,background:`rgba(220,38,38,${(i+j)%3===0?0.5:(i+j)%3===1?0.15:0.05})`}}/>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* form */}
          <div className={v?'animate-right':''} style={{animationDelay:'0.15s',opacity:v?1:0}}>
            <div style={{fontFamily:"'Space Mono',monospace",fontSize:9,letterSpacing:'0.3em',color:'rgba(220,38,38,0.5)',marginBottom:20}}>◆ SEND A MESSAGE</div>
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                <div>
                  <input name="name" value={form.name} onChange={handleChange} onBlur={handleBlur}
                    placeholder="YOUR NAME *" style={inputStyle('name')}
                    onFocus={e=>e.target.style.borderColor='rgba(220,38,38,0.6)'}
                    onBlurCapture={e=>e.target.style.borderColor=touched.name&&!form.name?'rgba(239,68,68,0.7)':'rgba(220,38,38,0.22)'}
                  />
                  {touched.name&&!form.name&&<div style={{fontFamily:"'Space Mono',monospace",fontSize:9,color:'#ef4444',marginTop:4}}>Required</div>}
                </div>
                <div>
                  <input name="email" value={form.email} onChange={handleChange} onBlur={handleBlur}
                    placeholder="YOUR EMAIL *" style={inputStyle('email')}
                    onFocus={e=>e.target.style.borderColor='rgba(220,38,38,0.6)'}
                  />
                  {touched.email&&!form.email&&<div style={{fontFamily:"'Space Mono',monospace",fontSize:9,color:'#ef4444',marginTop:4}}>Required</div>}
                </div>
              </div>
              <input name="subject" value={form.subject} onChange={handleChange}
                placeholder="SUBJECT" style={inputStyle('subject')}
                onFocus={e=>e.target.style.borderColor='rgba(220,38,38,0.6)'}
                onBlur={e=>e.target.style.borderColor='rgba(220,38,38,0.22)'}
              />
              <div>
                <textarea name="message" value={form.message} onChange={handleChange} onBlur={handleBlur}
                  placeholder="YOUR MESSAGE *" rows={5} style={{...inputStyle('message'),resize:'vertical',minHeight:130}}
                  onFocus={e=>e.target.style.borderColor='rgba(220,38,38,0.6)'}
                />
                {touched.message&&!form.message&&<div style={{fontFamily:"'Space Mono',monospace",fontSize:9,color:'#ef4444',marginTop:4}}>Required</div>}
              </div>

              {status==='sent' && (
                <div style={{padding:'14px 20px',border:'1px solid rgba(34,197,94,0.4)',background:'rgba(34,197,94,0.06)',fontFamily:"'Space Mono',monospace",fontSize:11,color:'rgba(34,197,94,0.9)',letterSpacing:'0.1em'}}>
                  ◆ MESSAGE SENT. I'll respond as soon as possible.
                </div>
              )}
              {status==='error' && (
                <div style={{padding:'14px 20px',border:'1px solid rgba(239,68,68,0.4)',background:'rgba(239,68,68,0.06)',fontFamily:"'Space Mono',monospace",fontSize:11,color:'rgba(239,68,68,0.9)',letterSpacing:'0.1em'}}>
                  ✗ FAILED TO SEND. Please email directly: itstaarunya@gmail.com
                </div>
              )}

              <button onClick={handleSubmit} disabled={status==='sending'}
                style={{
                  padding:'15px 0',fontFamily:"'Bebas Neue',sans-serif",fontSize:18,letterSpacing:'0.2em',
                  color:'#f0ede8',background:status==='sending'?'rgba(220,38,38,0.5)':'#dc2626',
                  border:'none',cursor:'none',transition:'all 0.2s',
                  display:'flex',alignItems:'center',justifyContent:'center',gap:12,
                }}
                onMouseEnter={e=>{ if(status!=='sending') e.currentTarget.style.background='#b91c1c'; }}
                onMouseLeave={e=>{ if(status!=='sending') e.currentTarget.style.background='#dc2626'; }}>
                {status==='sending'
                  ? <><span style={{animation:'blink 0.6s step-end infinite'}}>█</span> TRANSMITTING...</>
                  : 'SEND MESSAGE →'
                }
              </button>

              <div style={{fontFamily:"'Space Mono',monospace",fontSize:9,color:'rgba(240,237,232,0.25)',letterSpacing:'0.15em',textAlign:'center',lineHeight:1.6}}>
                Your message is sent securely and directly to my inbox.<br/>I respond to all inquiries professionally and promptly.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ── SECTION MAP ───────────────────────────────────────────────────────────── */
const SMAP = {HOME:0,ABOUT:1,PROJECTS:2,SKILLS:3,CONTACT:4};

/* ── APP ───────────────────────────────────────────────────────────────────── */
export default function App(){
  const [loading,setLoading]=useState(true);
  const [fadeOut,setFadeOut]=useState(false);
  const [active,setActive]=useState('HOME');
  const refs=[useRef(null),useRef(null),useRef(null),useRef(null),useRef(null)];

  const done=()=>{ setFadeOut(true); setTimeout(()=>setLoading(false),700); };
  const go=label=>{ setActive(label); refs[SMAP[label]]?.current?.scrollIntoView({behavior:'smooth'}); };

  useEffect(()=>{
    const ob=new IntersectionObserver(entries=>entries.forEach(e=>{
      if(e.isIntersecting){ const i=refs.findIndex(r=>r.current===e.target); if(i!==-1) setActive(Object.keys(SMAP)[i]); }
    }),{threshold:0.25});
    refs.forEach(r=>{ if(r.current) ob.observe(r.current); });
    return()=>ob.disconnect();
  },[]);

  return (
    <>
      <GlobalStyles/>
      {loading && (
        <div style={{position:'fixed',inset:0,zIndex:9999,opacity:fadeOut?0:1,transition:'opacity 0.7s',pointerEvents:fadeOut?'none':'all'}}>
          <Loader onDone={done}/>
        </div>
      )}
      <div style={{opacity:loading&&!fadeOut?0:1,transition:'opacity 0.7s 0.1s'}}>
        <Cursor/>
        <Nav active={active} go={go}/>
        <div ref={refs[0]}><Hero go={go}/></div>
        <Marquee dark={true}/>
        <div ref={refs[1]}><About/></div>
        <Marquee dark={false}/>
        <div ref={refs[2]}><Projects/></div>
        <div ref={refs[3]}><Skills/></div>
        <div ref={refs[4]}><Contact/></div>
        <footer style={{background:'#0a0a0a',borderTop:'1px solid rgba(220,38,38,0.12)',padding:'24px 48px',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{width:6,height:6,background:'#dc2626'}}/>
            <span style={{fontFamily:"'Space Mono',monospace",fontSize:9,letterSpacing:'0.25em',color:'rgba(240,237,232,0.3)'}}>TAARUNYA GIRIRAJ ◆ 2025</span>
          </div>
          <span style={{fontFamily:"'Space Mono',monospace",fontSize:9,letterSpacing:'0.2em',color:'rgba(240,237,232,0.2)'}}>AI & DATA SCIENCE ◆ CHENNAI INSTITUTE OF TECHNOLOGY</span>
          <span style={{fontFamily:"'Space Mono',monospace",fontSize:9,letterSpacing:'0.2em',color:'rgba(240,237,232,0.2)'}}>BUILT WITH REACT</span>
        </footer>
      </div>
    </>
  );
}