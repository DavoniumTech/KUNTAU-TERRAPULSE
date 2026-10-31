/* KUNTAU TERRAPULSE v0.5.0 — KTP 3D space studio background.
   All 3D elements are decorative context, not NISAR observations or live satellite tracking. */
(() => {
  'use strict';
  const host = document.getElementById('spaceCanvas');
  const fallback = document.getElementById('cosmosCanvas');
  if (!host) return;
  const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const isSmall = () => window.matchMedia?.('(max-width: 760px)').matches || window.innerWidth < 760;
  const rand = (a,b) => a + Math.random() * (b-a);

  // A light 2D starfield remains as a graceful fallback when WebGL is unavailable.
  if (fallback) {
    const ctx = fallback.getContext('2d');
    if (ctx) {
      let w=0,h=0,stars=[];
      const resize2D=()=>{const d=Math.min(window.devicePixelRatio||1,1.25);w=innerWidth;h=innerHeight;fallback.width=Math.round(w*d);fallback.height=Math.round(h*d);ctx.setTransform(d,0,0,d,0,0);stars=Array.from({length:isSmall()?95:185},()=>({x:rand(0,w),y:rand(0,h),r:rand(.3,1.35),a:rand(.12,.52),p:rand(0,6.28),v:rand(.025,.11)}));};
      resize2D();window.addEventListener('resize',resize2D,{passive:true});
      const draw2D=()=>{ctx.clearRect(0,0,w,h);for(const q of stars){q.p+=.014;if(!prefersReduced){q.y-=q.v;if(q.y<0)q.y=h;}ctx.beginPath();ctx.arc(q.x,q.y,q.r,0,Math.PI*2);ctx.fillStyle=`rgba(158,222,214,${q.a*(.7+.3*Math.sin(q.p))})`;ctx.fill();}if(!prefersReduced)requestAnimationFrame(draw2D);};draw2D();
    }
  }
  if (!window.THREE) { document.documentElement.classList.add('space-fallback'); return; }

  const THREE=window.THREE;
  let renderer, raf=0, resizeObserver, lastFrame=0, scene, camera;
  try {
    scene=new THREE.Scene();
    camera=new THREE.PerspectiveCamera(48,innerWidth/innerHeight,.1,140);
    camera.position.set(0,0,14);
    renderer=new THREE.WebGLRenderer({alpha:true,antialias:!isSmall(),powerPreference:'low-power'});
    renderer.setPixelRatio(Math.min(devicePixelRatio||1,isSmall()?1.15:1.45));
    renderer.setSize(innerWidth,innerHeight,false);
    renderer.setClearColor(0x000000,0);
    if ('outputColorSpace' in renderer) renderer.outputColorSpace=THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);
    document.documentElement.classList.add('three-space-ready');

    scene.add(new THREE.AmbientLight(0x8bbdc9,1.2));
    const keyLight=new THREE.DirectionalLight(0xffdfb0,2.6);keyLight.position.set(-6,5,9);scene.add(keyLight);
    const blueRim=new THREE.PointLight(0x2ca8e8,3.5,35);blueRim.position.set(8,1,4);scene.add(blueRim);
    const warmRim=new THREE.PointLight(0xff755f,1.25,28);warmRim.position.set(5,-5,-2);scene.add(warmRim);

    // Build a small stylised world texture. It is an illustration, not a geographic basemap.
    const texCanvas=document.createElement('canvas');texCanvas.width=1024;texCanvas.height=512;
    const tctx=texCanvas.getContext('2d');
    const sea=tctx.createLinearGradient(0,0,0,512);sea.addColorStop(0,'#2f9ac0');sea.addColorStop(.48,'#155c94');sea.addColorStop(1,'#0b2a57');tctx.fillStyle=sea;tctx.fillRect(0,0,1024,512);
    const landGrad=tctx.createLinearGradient(0,40,800,440);landGrad.addColorStop(0,'#b7d28b');landGrad.addColorStop(.55,'#5cae83');landGrad.addColorStop(1,'#287d73');tctx.fillStyle=landGrad;
    const polygon=(pts)=>{tctx.beginPath();pts.forEach(([x,y],i)=>i?tctx.lineTo(x,y):tctx.moveTo(x,y));tctx.closePath();tctx.fill();};
    // Approximate decorative continent silhouettes only.
    polygon([[95,125],[137,92],[193,77],[236,99],[249,137],[224,164],[203,202],[168,224],[140,201],[113,191],[86,159]]);
    polygon([[205,236],[246,213],[277,232],[288,272],[274,315],[256,370],[228,404],[209,363],[194,316],[183,270]]);
    polygon([[394,113],[444,90],[506,100],[543,120],[568,108],[633,121],[659,157],[629,183],[600,195],[570,220],[526,207],[497,184],[457,176],[418,155]]);
    polygon([[439,211],[487,196],[532,220],[551,263],[538,322],[506,372],[473,365],[451,322],[427,273]]);
    polygon([[645,286],[687,264],[724,279],[761,314],[750,348],[711,362],[675,340]]);
    polygon([[808,353],[831,343],[852,359],[842,381],[816,378]]);
    // Subtle longitude/latitude grid on texture.
    tctx.strokeStyle='rgba(208,242,245,.18)';tctx.lineWidth=2;
    for(let y=64;y<512;y+=64){tctx.beginPath();tctx.moveTo(0,y);tctx.lineTo(1024,y);tctx.stroke();}
    for(let x=96;x<1024;x+=128){tctx.beginPath();tctx.ellipse(x,256,Math.max(16,Math.abs(512-x)*.46),250,0,0,Math.PI*2);tctx.stroke();}
    const earthTexture=new THREE.CanvasTexture(texCanvas);earthTexture.colorSpace=THREE.SRGBColorSpace;

    const earthSystem=new THREE.Group();scene.add(earthSystem);
    const earth=new THREE.Mesh(new THREE.SphereGeometry(2.25,72,56),new THREE.MeshStandardMaterial({map:earthTexture,roughness:.82,metalness:.04}));earthSystem.add(earth);
    const wire=new THREE.Mesh(new THREE.SphereGeometry(2.272,24,16),new THREE.MeshBasicMaterial({color:0xa4ebee,wireframe:true,transparent:true,opacity:.14}));earthSystem.add(wire);
    const clouds=new THREE.Mesh(new THREE.SphereGeometry(2.29,48,36),new THREE.MeshBasicMaterial({color:0xd4f6f5,wireframe:true,transparent:true,opacity:.045}));earthSystem.add(clouds);
    const atmosphere=new THREE.Mesh(new THREE.SphereGeometry(2.39,56,40),new THREE.MeshBasicMaterial({color:0x44cce4,transparent:true,opacity:.105,side:THREE.BackSide}));earthSystem.add(atmosphere);
    const halo=new THREE.Mesh(new THREE.SphereGeometry(2.55,48,32),new THREE.MeshBasicMaterial({color:0x3b9fdb,transparent:true,opacity:.035,side:THREE.BackSide}));earthSystem.add(halo);

    const ringMat=new THREE.MeshBasicMaterial({color:0x6fe0ce,transparent:true,opacity:.52});
    const orbitA=new THREE.Mesh(new THREE.TorusGeometry(3.0,.012,8,220),ringMat);orbitA.rotation.set(.9,.18,.28);earthSystem.add(orbitA);
    const orbitB=new THREE.Mesh(new THREE.TorusGeometry(3.34,.006,6,220),new THREE.MeshBasicMaterial({color:0x63aee0,transparent:true,opacity:.28}));orbitB.rotation.set(1.2,.36,-.3);earthSystem.add(orbitB);
    const orbitC=new THREE.Mesh(new THREE.TorusGeometry(2.72,.004,6,180),new THREE.MeshBasicMaterial({color:0xf1b875,transparent:true,opacity:.35}));orbitC.rotation.set(.35,.7,.85);earthSystem.add(orbitC);

    // Detailed satellite body and solar panels, orbiting the decorative globe.
    const satellite=new THREE.Group();
    const satBody=new THREE.Mesh(new THREE.BoxGeometry(.34,.24,.28),new THREE.MeshStandardMaterial({color:0xe4ece4,metalness:.72,roughness:.28}));satellite.add(satBody);
    const satGold=new THREE.Mesh(new THREE.BoxGeometry(.09,.29,.3),new THREE.MeshStandardMaterial({color:0xc7a36d,metalness:.7,roughness:.34}));satGold.position.z=.01;satellite.add(satGold);
    const panelMat=new THREE.MeshStandardMaterial({color:0x246fa5,metalness:.72,roughness:.38,emissive:0x0b3159,emissiveIntensity:.28});
    for(const side of [-1,1]){const panel=new THREE.Mesh(new THREE.BoxGeometry(.72,.18,.035),panelMat);panel.position.x=side*.57;satellite.add(panel);for(let i=-2;i<=2;i++){const stripe=new THREE.Mesh(new THREE.BoxGeometry(.012,.183,.04),new THREE.MeshBasicMaterial({color:0x9bd6ed}));stripe.position.set(side*.57+i*.13,0,.023);satellite.add(stripe);}}
    const dish=new THREE.Mesh(new THREE.ConeGeometry(.1,.16,18),new THREE.MeshStandardMaterial({color:0xe9c58b,metalness:.5,roughness:.4}));dish.position.y=-.18;dish.rotation.x=Math.PI;satellite.add(dish);
    satellite.scale.setScalar(.92);scene.add(satellite);

    // Sun/energy source and two orbiting bodies add the solar-system depth from the reference.
    const sunGroup=new THREE.Group();sunGroup.position.set(-5.3,3.25,-3);scene.add(sunGroup);
    const sun=new THREE.Mesh(new THREE.SphereGeometry(.62,32,24),new THREE.MeshBasicMaterial({color:0xf5bd74}));sunGroup.add(sun);
    const sunWire=new THREE.Mesh(new THREE.IcosahedronGeometry(.77,2),new THREE.MeshBasicMaterial({color:0xf6a969,wireframe:true,transparent:true,opacity:.45}));sunGroup.add(sunWire);
    const sunHalo=new THREE.Mesh(new THREE.SphereGeometry(1.0,32,24),new THREE.MeshBasicMaterial({color:0xff9e62,transparent:true,opacity:.075,side:THREE.BackSide}));sunGroup.add(sunHalo);
    const orbitPlanet=new THREE.Mesh(new THREE.SphereGeometry(.34,28,20),new THREE.MeshStandardMaterial({color:0x9a83c9,roughness:.72,metalness:.06}));scene.add(orbitPlanet);
    const moon=new THREE.Mesh(new THREE.SphereGeometry(.19,24,18),new THREE.MeshStandardMaterial({color:0xd2d8d2,roughness:.96}));scene.add(moon);
    const miniMoon=new THREE.Mesh(new THREE.SphereGeometry(.075,16,12),new THREE.MeshStandardMaterial({color:0xe2b58a,roughness:.9}));scene.add(miniMoon);
    const ringedPlanet=new THREE.Group();
    const rp=new THREE.Mesh(new THREE.SphereGeometry(.48,32,24),new THREE.MeshStandardMaterial({color:0xb68c6c,roughness:.76}));ringedPlanet.add(rp);
    const rpRing=new THREE.Mesh(new THREE.TorusGeometry(.72,.035,8,80),new THREE.MeshBasicMaterial({color:0xe3c08e,transparent:true,opacity:.6}));rpRing.rotation.x=1.15;ringedPlanet.add(rpRing);scene.add(ringedPlanet);

    // 2,600 background stars and a drifting dust/particle field.
    const starCount=isSmall()?1050:2600,starPositions=new Float32Array(starCount*3),starColors=new Float32Array(starCount*3);
    for(let i=0;i<starCount;i++){const k=i*3;starPositions[k]=rand(-34,34);starPositions[k+1]=rand(-23,23);starPositions[k+2]=rand(-34,-6);const tint=Math.random();starColors[k]=tint>.86?.9:.43;starColors[k+1]=tint>.72?.82:.78;starColors[k+2]=1;}
    const starGeo=new THREE.BufferGeometry();starGeo.setAttribute('position',new THREE.BufferAttribute(starPositions,3));starGeo.setAttribute('color',new THREE.BufferAttribute(starColors,3));
    const starField=new THREE.Points(starGeo,new THREE.PointsMaterial({size:isSmall()?.045:.052,vertexColors:true,transparent:true,opacity:.78,sizeAttenuation:true,depthWrite:false}));scene.add(starField);
    const dustCount=isSmall()?150:360,dust=new Float32Array(dustCount*3),dustSpeed=[];
    for(let i=0;i<dustCount;i++){dust[i*3]=rand(-12,12);dust[i*3+1]=rand(-8,8);dust[i*3+2]=rand(-4,4);dustSpeed.push(rand(.04,.19));}
    const dustGeo=new THREE.BufferGeometry();dustGeo.setAttribute('position',new THREE.BufferAttribute(dust,3));
    const dustCloud=new THREE.Points(dustGeo,new THREE.PointsMaterial({color:0x83e8d5,size:.026,transparent:true,opacity:.46,sizeAttenuation:true,depthWrite:false}));scene.add(dustCloud);

    const pointer={x:0,y:0,tx:0,ty:0};
    if(!isSmall())window.addEventListener('pointermove',e=>{pointer.tx=(e.clientX/innerWidth-.5)*.28;pointer.ty=-(e.clientY/innerHeight-.5)*.2;},{passive:true});
    const resize=()=>{const w=Math.max(1,innerWidth),h=Math.max(1,innerHeight);camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false);const small=isSmall();earthSystem.position.set(small?1.55:4.55,small?-.95:-.3,-1.7);earthSystem.scale.setScalar(small?.78:1.08);sunGroup.position.set(small?-2.8: -5.3,small?3.2:3.25,-3.2);};
    if(window.ResizeObserver){resizeObserver=new ResizeObserver(resize);resizeObserver.observe(document.documentElement);}else window.addEventListener('resize',resize,{passive:true});resize();

    const clock=new THREE.Clock();const frameInterval=isSmall()?1000/30:1000/45;
    const animate=(now=performance.now())=>{
      raf=requestAnimationFrame(animate);
      if(document.hidden||now-lastFrame<frameInterval)return;
      lastFrame=now;const t=clock.getElapsedTime();
      if(!prefersReduced){
        pointer.x+=(pointer.tx-pointer.x)*.025;pointer.y+=(pointer.ty-pointer.y)*.025;camera.position.x=pointer.x;camera.position.y=pointer.y;camera.lookAt(0,0,0);
        earth.rotation.y=t*.075;wire.rotation.y=-t*.025;clouds.rotation.y=t*.045;
        satellite.position.set(earthSystem.position.x+Math.cos(t*.46)*3.25,earthSystem.position.y+Math.sin(t*.46)*1.48,Math.sin(t*.46)*.55);satellite.rotation.set(.28,Math.sin(t*.28)*.3,-.34+Math.sin(t*.46)*.22);
        sunWire.rotation.y=t*.12;sunWire.rotation.x=t*.08;orbitPlanet.position.set(-2.4+Math.cos(t*.24)*.85,1.75+Math.sin(t*.24)*.48,-2.8);orbitPlanet.rotation.y=t*.36;
        moon.position.set(earthSystem.position.x+Math.cos(t*.33)*3.8,earthSystem.position.y+Math.sin(t*.33)*2.3,-1.2);miniMoon.position.set(earthSystem.position.x+Math.cos(t*.52+2)*2.8,earthSystem.position.y+Math.sin(t*.52+2)*1.5,-.7);
        ringedPlanet.position.set(earthSystem.position.x+Math.cos(t*.18+3)*4.2,-2.5+Math.sin(t*.18+3)*.8,-3.1);ringedPlanet.rotation.y=t*.16;starField.rotation.y=t*.004;dustCloud.rotation.y=-t*.012;
        const pos=dustGeo.attributes.position.array;for(let i=0;i<dustCount;i++){pos[i*3+1]+=dustSpeed[i]*.004;if(pos[i*3+1]>8)pos[i*3+1]=-8;}dustGeo.attributes.position.needsUpdate=true;
      }
      renderer.render(scene,camera);
    };
    if(prefersReduced){camera.lookAt(0,0,0);renderer.render(scene,camera);}else raf=requestAnimationFrame(animate);
    document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);}else if(!prefersReduced){clock.start();raf=requestAnimationFrame(animate);}});
    renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();cancelAnimationFrame(raf);document.documentElement.classList.remove('three-space-ready');document.documentElement.classList.add('space-fallback');},{passive:false});
    window.addEventListener('pagehide',()=>{cancelAnimationFrame(raf);resizeObserver?.disconnect();renderer?.dispose();earthTexture.dispose();starGeo.dispose();dustGeo.dispose();},{once:true});
  } catch(err) {
    console.warn('KTP 3D background unavailable; using the lightweight starfield fallback.',err);
    cancelAnimationFrame(raf);try{renderer?.dispose();}catch(_){}host.replaceChildren();
    document.documentElement.classList.remove('three-space-ready');document.documentElement.classList.add('space-fallback');
  }
})();
