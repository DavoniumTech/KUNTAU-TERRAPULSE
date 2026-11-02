/* QUENTA TERAPOST 0.9.0 — interactive Three.js Earth viewer.
   The globe is an educational overview. The georeferenced NISAR rasters remain in the science map. */
(() => {
  'use strict';
  const host = document.getElementById('heroThreeScene');
  if (!host) return;
  if (!window.THREE) {
    host.classList.add('globe-library-loading');
    host.setAttribute('aria-label', 'Loading the interactive 3D Earth viewer. A lightweight Earth illustration is available while it loads.');
    const script=document.createElement('script');
    script.src='https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.min.js';
    script.async=true;script.crossOrigin='anonymous';
    script.onload=()=>{if(window.THREE){host.classList.remove('globe-library-loading');bootGlobe();}else failGlobe();};
    script.onerror=failGlobe;
    document.head.appendChild(script);
    return;
  }
  bootGlobe();
  function failGlobe(){host.classList.add('globe-unavailable');host.classList.remove('globe-library-loading');host.setAttribute('aria-label','The interactive globe library could not load. The Earth illustration remains available.');}
  function bootGlobe(){
  const THREE = window.THREE;
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  const compactDevice = window.matchMedia?.('(max-width: 760px)').matches ?? false;
  let renderer, scene, camera, earthRoot, earth, clouds, satellite, satelliteOrbit, marker, markerHalo;
  let frame = 0, running = true, autoSpin = !reducedMotion, dragging = false, lastX = 0, lastY = 0;
  let targetZoom = 6.2, zoom = targetZoom, quality = 'auto';
  let lastTime = 0, width = 0, height = 0;
  const KURA = {lat:11.7714, lon:8.4303};
  const clamp = (v,min,max) => Math.max(min,Math.min(max,v));

  function makeStars() {
    const count = compactDevice ? 520 : 1250, positions = new Float32Array(count * 3);
    for (let i=0;i<count;i++) {
      const u=Math.random()*2-1, a=Math.random()*Math.PI*2, r=8+Math.random()*24;
      const s=Math.sqrt(1-u*u);
      positions[i*3]=r*s*Math.cos(a); positions[i*3+1]=r*u; positions[i*3+2]=r*s*Math.sin(a);
    }
    const geometry = new THREE.BufferGeometry(); geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));
    const material = new THREE.PointsMaterial({color:0x9bc8da,size:.035,transparent:true,opacity:.7,sizeAttenuation:true,depthWrite:false});
    const points = new THREE.Points(geometry,material); scene.add(points); return points;
  }

  function makeCloudTexture() {
    const canvas=document.createElement('canvas'); canvas.width=1024; canvas.height=512;
    const ctx=canvas.getContext('2d');
    let seed=713;
    const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
    for(let i=0;i<330;i++){
      const x=rnd()*canvas.width,y=rnd()*canvas.height,rx=12+rnd()*62,ry=4+rnd()*18;
      const g=ctx.createRadialGradient(x,y,1,x,y,rx);
      g.addColorStop(0,`rgba(235,247,255,${.08+rnd()*.13})`);g.addColorStop(1,'rgba(220,240,255,0)');
      ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(x,y,rx,ry,rnd()*.4,0,Math.PI*2);ctx.fill();
    }
    const t=new THREE.CanvasTexture(canvas); t.colorSpace=THREE.SRGBColorSpace; return t;
  }

  function makeSatellite() {
    const group=new THREE.Group();
    const body=new THREE.Mesh(new THREE.BoxGeometry(.16,.14,.22),new THREE.MeshStandardMaterial({color:0xe3e9e8,metalness:.78,roughness:.3}));group.add(body);
    const panelMat=new THREE.MeshStandardMaterial({color:0x286a91,metalness:.55,roughness:.35,emissive:0x081c31});
    for(const side of [-1,1]){
      const panel=new THREE.Mesh(new THREE.BoxGeometry(.52,.018,.19),panelMat);panel.position.x=side*.37;group.add(panel);
      const bar=new THREE.Mesh(new THREE.BoxGeometry(.52,.035,.012),new THREE.MeshStandardMaterial({color:0x879da6,metalness:.8,roughness:.35}));bar.position.set(side*.37,0,.105);group.add(bar);
    }
    const dish=new THREE.Mesh(new THREE.SphereGeometry(.075,16,12,0,Math.PI*2,0,Math.PI/2),new THREE.MeshStandardMaterial({color:0xcfd9d7,metalness:.65,roughness:.25,side:THREE.DoubleSide}));dish.position.set(0,.14,0);dish.rotation.x=-Math.PI/2;group.add(dish);
    const glow=new THREE.PointLight(0x70e5d0,.45,2);glow.position.set(0,0,.25);group.add(glow);
    group.scale.setScalar(.92);return group;
  }

  function init() {
    try {
      scene=new THREE.Scene();
      camera=new THREE.PerspectiveCamera(38,1,.1,100); camera.position.set(0,.15,zoom);
      renderer=new THREE.WebGLRenderer({alpha:true,antialias:!compactDevice,powerPreference:'low-power'});
      renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,compactDevice?1.2:1.6));
      renderer.outputColorSpace=THREE.SRGBColorSpace;
      renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=1.16;
      renderer.setClearColor(0x000000,0);
      renderer.domElement.setAttribute('aria-hidden','true');
      renderer.domElement.style.display='block';host.appendChild(renderer.domElement);

      scene.add(new THREE.AmbientLight(0x9fc6d0,1.18));
      const key=new THREE.DirectionalLight(0xffffff,2.45);key.position.set(-5,3,5);scene.add(key);
      const rim=new THREE.DirectionalLight(0x3a9fe0,1.18);rim.position.set(4,-2,-5);scene.add(rim);
      const fill=new THREE.PointLight(0x7ce5d2,.5,12);fill.position.set(2,1,4);scene.add(fill);
      makeStars();

      earthRoot=new THREE.Group();earthRoot.rotation.y=-Math.PI/2;scene.add(earthRoot);
      const texture=new THREE.TextureLoader().load('assets/earth-blue-marble.jpg',()=>{host.closest('.hero-art')?.classList.add('three-ready');});
      texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
      const earthMat=new THREE.MeshStandardMaterial({map:texture,roughness:.94,metalness:0});
      earth=new THREE.Mesh(new THREE.SphereGeometry(2,compactDevice?76:104,compactDevice?52:72),earthMat);earthRoot.add(earth);
      const cloudMat=new THREE.MeshStandardMaterial({map:makeCloudTexture(),transparent:true,opacity:.24,depthWrite:false,side:THREE.DoubleSide});
      clouds=new THREE.Mesh(new THREE.SphereGeometry(2.016,compactDevice?48:64,compactDevice?32:44),cloudMat);earthRoot.add(clouds);

      const atmosphere=new THREE.Mesh(new THREE.SphereGeometry(2.13,compactDevice?48:64,compactDevice?32:44),new THREE.ShaderMaterial({vertexShader:`varying vec3 vNormal; varying vec3 vView; void main(){vNormal=normalize(normalMatrix*normal);vec4 mv=modelViewMatrix*vec4(position,1.0);vView=-mv.xyz;gl_Position=projectionMatrix*mv;}`,fragmentShader:`varying vec3 vNormal;varying vec3 vView;void main(){float f=pow(1.0-max(dot(normalize(vNormal),normalize(vView)),0.0),2.25);gl_FragColor=vec4(0.18,0.68,0.94,f*0.42);}`,blending:THREE.AdditiveBlending,transparent:true,depthWrite:false,side:THREE.BackSide}));earthRoot.add(atmosphere);
      const glow=new THREE.Mesh(new THREE.SphereGeometry(2.045,compactDevice?48:64,compactDevice?32:44),new THREE.MeshBasicMaterial({color:0x65bde1,transparent:true,opacity:.055,side:THREE.BackSide,blending:THREE.AdditiveBlending,depthWrite:false}));earthRoot.add(glow);

      const lat=THREE.MathUtils.degToRad(KURA.lat),lon=THREE.MathUtils.degToRad(KURA.lon),r=2.025;
      const pos=new THREE.Vector3(r*Math.cos(lat)*Math.cos(lon),r*Math.sin(lat),-r*Math.cos(lat)*Math.sin(lon));
      marker=new THREE.Group();marker.position.copy(pos);marker.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),pos.clone().normalize());earthRoot.add(marker);
      const pin=new THREE.Mesh(new THREE.SphereGeometry(.035,18,14),new THREE.MeshBasicMaterial({color:0xffce80}));marker.add(pin);
      markerHalo=new THREE.Mesh(new THREE.RingGeometry(.055,.085,40),new THREE.MeshBasicMaterial({color:0xffd08c,transparent:true,opacity:.9,side:THREE.DoubleSide}));markerHalo.position.z=.006;marker.add(markerHalo);
      const stem=new THREE.Mesh(new THREE.CylinderGeometry(.005,.005,.11,8),new THREE.MeshBasicMaterial({color:0xffd08c}));stem.position.y=.065;marker.add(stem);

      satelliteOrbit=new THREE.Group();scene.add(satelliteOrbit);satellite=makeSatellite();satelliteOrbit.add(satellite);
      const orbitCurve=new THREE.EllipseCurve(0,0,2.88,2.5,0,Math.PI*2,false,0);
      const pts=orbitCurve.getPoints(compactDevice?96:150).map(p=>new THREE.Vector3(p.x,p.y*.55,p.y*.5));
      const orbitGeom=new THREE.BufferGeometry().setFromPoints(pts);
      const orbitLine=new THREE.LineLoop(orbitGeom,new THREE.LineBasicMaterial({color:0x5fd6d1,transparent:true,opacity:.25}));satelliteOrbit.add(orbitLine);

      resize();new ResizeObserver(resize).observe(host);
      bindControls();host.closest('.hero-art')?.classList.add('three-ready');
      document.documentElement.classList.add('ktp-globe-ready');
      let qualitySaved='auto';try{qualitySaved=localStorage.getItem('ktp_3d_quality_v1')||'auto';}catch(_){}quality=qualitySaved;applyQuality();
      if(document.hidden)running=false;
      document.addEventListener('visibilitychange',()=>{running=!document.hidden;});
      window.addEventListener('ktp:visual-quality',e=>{quality=e.detail?.quality||'auto';applyQuality();});
      frame=requestAnimationFrame(animate);
    } catch(error) {
      console.warn('Quenta TeraPost interactive globe could not initialise:',error);
      host.classList.add('globe-unavailable');host.closest('.hero-art')?.classList.remove('three-ready');
      renderer?.dispose();renderer?.domElement.remove();
    }
  }

  function resize(){
    if(!renderer||!camera)return;const rect=host.getBoundingClientRect();width=Math.max(1,rect.width);height=Math.max(1,rect.height);
    renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();
  }
  function applyQuality(){
    if(!renderer)return;const scale=quality==='cinematic'?2:quality==='balanced'?1.35:quality==='lite'?.85:Math.min(window.devicePixelRatio||1,1.6);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,scale));
    // Antialiasing is selected when WebGLRenderer is created; quality presets adjust pixel density here.
  }
  function setZoom(next){targetZoom=clamp(next,3.25,8.1);}
  function focusKura(){
    if(!earthRoot)return;earthRoot.rotation.y=-Math.PI/2-THREE.MathUtils.degToRad(KURA.lon);earthRoot.rotation.x=THREE.MathUtils.degToRad(-KURA.lat*.35);setZoom(5.85);
    autoSpin=false;updateSpinButton();
  }
  function resetView(){earthRoot.rotation.set(0,-Math.PI/2,0);setZoom(6.2);autoSpin=!reducedMotion;updateSpinButton();}
  function updateSpinButton(){const b=document.querySelector('[data-globe-action="spin"]');if(!b)return;b.setAttribute('aria-pressed',String(autoSpin));b.textContent=autoSpin?'Ⅱ':'▶';b.title=autoSpin?'Pause globe rotation':'Resume globe rotation';}
  function bindControls(){
    host.addEventListener('pointerdown',e=>{dragging=true;lastX=e.clientX;lastY=e.clientY;host.setPointerCapture?.(e.pointerId);host.classList.add('is-dragging');});
    host.addEventListener('pointermove',e=>{if(!dragging||!earthRoot)return;const dx=e.clientX-lastX,dy=e.clientY-lastY;lastX=e.clientX;lastY=e.clientY;earthRoot.rotation.y+=dx*.005;earthRoot.rotation.x=clamp(earthRoot.rotation.x+dy*.004,-1.1,1.1);autoSpin=false;updateSpinButton();});
    const stop=()=>{dragging=false;host.classList.remove('is-dragging');};host.addEventListener('pointerup',stop);host.addEventListener('pointercancel',stop);host.addEventListener('lostpointercapture',stop);
    host.addEventListener('wheel',e=>{e.preventDefault();setZoom(targetZoom+Math.sign(e.deltaY)*.35);},{passive:false});
    document.querySelectorAll('[data-globe-action]').forEach(button=>button.addEventListener('click',()=>{
      switch(button.dataset.globeAction){case'zoom-in':setZoom(targetZoom-.45);break;case'zoom-out':setZoom(targetZoom+.45);break;case'focus':focusKura();break;case'reset':resetView();break;case'spin':autoSpin=!autoSpin;updateSpinButton();break;}
    }));
    updateSpinButton();
  }
  function animate(now){
    frame=requestAnimationFrame(animate);if(!running||!renderer||!scene)return;
    const dt=Math.min(.05,(now-lastTime)/1000||0);lastTime=now;
    if(autoSpin&&!dragging)earthRoot.rotation.y+=dt*.055;
    if(clouds)clouds.rotation.y+=dt*.012;
    if(markerHalo)markerHalo.scale.setScalar(1+Math.sin(now*.0024)*.13);
    zoom+=(targetZoom-zoom)*Math.min(1,dt*4.5);camera.position.z=zoom;
    const t=now*.00022; satellite.position.set(2.88*Math.cos(t),1.375*Math.sin(t),1.25*Math.sin(t));satellite.lookAt(0,0,0);satelliteOrbit.rotation.y=t*.18;
    renderer.render(scene,camera);
  }
  init();
  window.addEventListener('beforeunload',()=>{cancelAnimationFrame(frame);renderer?.dispose();});
  }
})();
