/* KUNTAU TERRAPULSE — local-first NISAR GeoTIFF workspace */
(() => {
  'use strict';

  const AOI = {
    name: 'Kura test AOI, Kano State, Nigeria',
    ring: [[8.4003,11.7414],[8.4603,11.7414],[8.4603,11.8014],[8.4003,11.8014],[8.4003,11.7414]]
  };
  const PRODUCT = {
    before: {
      date: '2026-10-08', label: '8 October 2026', mode: 'SHSH',
      id: 'NISAR_L2_PR_GCOV_032_123_D_083_2005_SHSH_A_20261008T175433_20261008T175508_P05023_N_F_J_001',
      time: '2026-10-08T17:54:33Z'
    },
    after: {
      date: '2026-10-20', label: '20 October 2026', mode: 'DHDH',
      id: 'NISAR_L2_PR_GCOV_033_123_D_083_2005_DHDH_A_20261020T175433_20261020T175508_P05023_N_F_J_001',
      time: '2026-10-20T17:54:33Z'
    }
  };
  const state = { before: null, after: null, difference: null, map: null, baseLayer: null, satelliteLayer: null, tileFailureNotified: false, aoiLayer: null, gridLayer: null, overlays: {}, published: null, compareMode: 'swipe', split: 50, mapView: 'change', currentRoute: 'home', deferredInstall: null, metadata: null, themeChoice: 'dark', paletteChoice: 'ocean' };
  const $ = (id) => document.getElementById(id);
  const libraryPromises = new Map();
  function loadScriptOnce(src, globalName) {
    if (globalName && window[globalName]) return Promise.resolve(window[globalName]);
    if (libraryPromises.has(src)) return libraryPromises.get(src);
    const promise = new Promise((resolve, reject) => {
      const existing = [...document.scripts].find(script => script.src === src);
      const script = existing || document.createElement('script');
      const done = () => globalName && !window[globalName] ? reject(new Error(`The ${globalName} library did not initialise.`)) : resolve(globalName ? window[globalName] : true);
      script.addEventListener('load', done, {once:true});
      script.addEventListener('error', () => { script.remove(); reject(new Error(`Could not load ${src}. Check the internet connection and retry.`)); }, {once:true});
      if (!existing) { script.src = src; script.async = true; script.crossOrigin = 'anonymous'; document.head.appendChild(script); }
      else if (globalName && window[globalName]) resolve(window[globalName]);
    }).catch(error => { libraryPromises.delete(src); throw error; });
    libraryPromises.set(src,promise);
    return promise;
  }
  function loadStyleOnce(href) {
    if ([...document.styleSheets].some(sheet => sheet.href === href)) return Promise.resolve();
    if (libraryPromises.has(href)) return libraryPromises.get(href);
    const promise = new Promise((resolve,reject)=>{
      const link=document.createElement('link');link.rel='stylesheet';link.href=href;
      link.onload=()=>resolve();link.onerror=()=>{link.remove();reject(new Error('Map styles could not load. Check the internet connection and retry.'));};
      document.head.appendChild(link);
    }).catch(error=>{libraryPromises.delete(href);throw error;});
    libraryPromises.set(href,promise);return promise;
  }
  let mapToolsPromise=null, rasterToolsPromise=null;
  function ensureMapTools(){
    if(window.L) return Promise.resolve(window.L);
    if(!mapToolsPromise) mapToolsPromise=Promise.all([
      loadStyleOnce('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'),
      loadScriptOnce('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js','L')
    ]).then(()=>window.L).catch(error=>{mapToolsPromise=null;throw error;});
    return mapToolsPromise;
  }
  function ensureRasterTools(){
    if(window.GeoTIFF && window.proj4) return Promise.resolve();
    if(!rasterToolsPromise) rasterToolsPromise=Promise.all([
      loadScriptOnce('https://cdn.jsdelivr.net/npm/geotiff@2.1.3/dist-browser/geotiff.js','GeoTIFF'),
      loadScriptOnce('https://cdnjs.cloudflare.com/ajax/libs/proj4js/2.12.1/proj4.min.js','proj4')
    ]).then(()=>{if(!proj4.defs('EPSG:32632'))proj4.defs('EPSG:32632','+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs +type=crs');}).catch(error=>{rasterToolsPromise=null;throw error;});
    return rasterToolsPromise;
  }
  function showMapLoading(message,visible=true){const panel=$('mapLoadingState');if(!panel)return;panel.hidden=!visible;if($('mapLoadingText'))$('mapLoadingText').textContent=message;}
  const number = (v, digits = 4) => Number.isFinite(v) ? v.toLocaleString(undefined,{maximumFractionDigits:digits}) : '—';

  // Primary appearance modes and independent accent palettes persist on this device.
  const PALETTES = new Set(['ocean','aurora','emerald','solar','amethyst','rose','ember','arctic','monsoon','graphite','sandstone','cobalt']);
  function applyTheme(choice, announce=false) {
    const effective = choice === 'light' ? 'light' : 'dark';
    state.themeChoice = effective;
    document.documentElement.dataset.theme = effective;
    document.documentElement.style.colorScheme = effective;
    const themeMeta = $('themeColorMeta');
    if (themeMeta) themeMeta.setAttribute('content', effective === 'light' ? '#f3f7f5' : '#05080e');
    document.querySelectorAll('[data-theme-choice]').forEach(button => {
      const active = button.dataset.themeChoice === effective;
      button.classList.toggle('selected', active);
      button.setAttribute('aria-pressed', String(active));
    });
    const toggle = $('themeToggle');
    if (toggle) {
      toggle.textContent = effective === 'dark' ? '☼' : '☾';
      toggle.title = `Switch to ${effective === 'dark' ? 'light' : 'dark'} mode`;
      toggle.setAttribute('aria-label', toggle.title);
    }
    try { localStorage.setItem('ktp_theme_v2', effective); } catch (_) {}
    if (announce) toast(`${effective === 'dark' ? 'Dark' : 'Light'} mode enabled.`);
  }
  function applyPalette(choice, announce=false) {
    const palette = PALETTES.has(choice) ? choice : 'ocean';
    state.paletteChoice = palette;
    document.documentElement.dataset.palette = palette;
    document.querySelectorAll('[data-palette-choice]').forEach(button => {
      const active = button.dataset.paletteChoice === palette;
      button.classList.toggle('selected', active);
      button.setAttribute('aria-pressed', String(active));
    });
    try { localStorage.setItem('ktp_palette_v1', palette); } catch (_) {}
    if (announce) toast(`${palette[0].toUpperCase()+palette.slice(1)} colour theme applied.`);
  }
  try { applyTheme(localStorage.getItem('ktp_theme_v2') || 'dark'); } catch (_) { applyTheme('dark'); }
  try { applyPalette(localStorage.getItem('ktp_palette_v1') || 'ocean'); } catch (_) { applyPalette('ocean'); }
  $('themeToggle')?.addEventListener('click', () => applyTheme(state.themeChoice === 'dark' ? 'light' : 'dark', true));
  $('settingsButton')?.addEventListener('click', () => route('settings'));
  document.querySelectorAll('[data-theme-choice]').forEach(button => button.addEventListener('click', () => applyTheme(button.dataset.themeChoice, true)));
  document.querySelectorAll('[data-palette-choice]').forEach(button => button.addEventListener('click', () => applyPalette(button.dataset.paletteChoice, true)));

  function toast(message, kind='ok') {
    const el = document.createElement('div'); el.className = `toast ${kind === 'error' ? 'error' : ''}`; el.textContent = message;
    $('toastRegion').appendChild(el); window.setTimeout(() => el.remove(), 4300);
  }
  function setMessage(message, kind='') { const el = $('loadMessage'); el.textContent = message; el.className = `loading-line ${kind}`.trim(); }
  function route(name) {
    if (!$( `page-${name}` )) return;
    if ($('moreNavSheet')) $('moreNavSheet').hidden = true;
    $('moreNavButton')?.setAttribute('aria-expanded','false');
    state.currentRoute = name;
    document.querySelectorAll('.page').forEach(p => p.classList.toggle('active', p.id === `page-${name}`));
    document.querySelectorAll('[data-route]').forEach(b => b.classList.toggle('active', b.dataset.route === name));
    $('moreNavButton')?.classList.toggle('active',['learn','data','settings'].includes(name));
    const titles = {home:'Overview',explore:'Explore map',compare:'Compare',insights:'Insights',learn:'Learn & field guide',data:'Data & methods',settings:'Settings'};
    $('pageCrumb').textContent = titles[name] || 'Overview';
    if (name === 'explore') {
      showMapLoading('Loading map controls…',true);
      ensureMapTools().then(()=>{if(state.currentRoute!=='explore')return;initMap();showRasterOnMap();if(state.map)state.map.invalidateSize();showMapLoading('',false);})
        .catch(error=>{showMapLoading('Map controls could not load. Reconnect and tap Explore map again.',true);toast(error.message,'error');});
    }
    if (name === 'compare') drawComparison();
    if (name === 'learn') activateLearnAudience(document.querySelector('.audience-tab.active')?.dataset.learnAudience || 'farmer');
    window.scrollTo({top:0,behavior:'smooth'});
  }
  document.querySelectorAll('[data-route]').forEach(el => el.addEventListener('click', () => route(el.dataset.route)));
  $('moreNavButton')?.addEventListener('click',()=>{ $('moreNavSheet').hidden=false; $('moreNavButton').setAttribute('aria-expanded','true'); });
  $('closeMoreNav')?.addEventListener('click',()=>{ $('moreNavSheet').hidden=true; $('moreNavButton').setAttribute('aria-expanded','false'); });
  $('moreNavSheet')?.addEventListener('click',e=>{if(e.target===$('moreNavSheet')){$('moreNavSheet').hidden=true;$('moreNavButton').setAttribute('aria-expanded','false');}});

  function initMap() {
    if (state.map || !window.L || !$('exploreMap')) return;
    state.map = L.map('exploreMap', {zoomControl:false, scrollWheelZoom:false, preferCanvas:true, attributionControl:false}).setView([11.7714,8.4303], 12);
    L.control.zoom({position:'topright'}).addTo(state.map);
    L.control.scale({imperial:false,metric:true,position:'bottomleft',maxWidth:130}).addTo(state.map);
    // No third-party tile server is requested. A local coordinate grid keeps the map usable on low-data connections.
    state.gridLayer = L.layerGroup();
    const west=8.4003,east=8.4603,south=11.7414,north=11.8014;
    for(let lat=south;lat<=north+0.0001;lat+=0.015){
      L.polyline([[lat,west],[lat,east]],{color:'#8ab9aa',weight:1,opacity:.22,dashArray:'3 7'}).addTo(state.gridLayer);
      L.marker([lat,west],{interactive:false,icon:L.divIcon({className:'ktp-coordinate-label',html:`${lat.toFixed(3)}°N`,iconSize:[52,14],iconAnchor:[0,7]})}).addTo(state.gridLayer);
    }
    for(let lon=west;lon<=east+0.0001;lon+=0.015){
      L.polyline([[south,lon],[north,lon]],{color:'#8ab9aa',weight:1,opacity:.22,dashArray:'3 7'}).addTo(state.gridLayer);
      L.marker([north,lon],{interactive:false,icon:L.divIcon({className:'ktp-coordinate-label',html:`${lon.toFixed(3)}°E`,iconSize:[55,14],iconAnchor:[27,0]})}).addTo(state.gridLayer);
    }
    state.gridLayer.addTo(state.map);
    state.baseLayer=state.gridLayer;
    const coords = AOI.ring.map(([lon,lat]) => [lat,lon]);
    state.aoiLayer = L.polygon(coords,{color:'#e9bd78',weight:2,dashArray:'6 6',fillColor:'#e9bd78',fillOpacity:.025}).addTo(state.map);
    state.aoiLayer.bindTooltip('Kura test AOI · not a surveyed river or floodplain boundary');
    L.circleMarker([11.7714,8.4303],{radius:4,color:'#a4e7c8',weight:2,fillColor:'#a4e7c8',fillOpacity:1}).addTo(state.map).bindTooltip('Approximate study-area centre');
    setTimeout(() => { if(state.map){state.map.invalidateSize();showRasterOnMap();} }, 180);
    updateMapBase($('mapBaseSelect')?.value || 'grid');
  }
  function updateMapBase(mode) {
    if (!state.map || !state.gridLayer) return;
    if (state.map.hasLayer(state.gridLayer)) state.map.removeLayer(state.gridLayer);
    if (state.satelliteLayer && state.map.hasLayer(state.satelliteLayer)) state.map.removeLayer(state.satelliteLayer);
    const attribution = $('mapAttribution');
    if (mode === 'satellite') {
      if (!state.satelliteLayer) {
        state.satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          maxZoom: 19, maxNativeZoom: 19, crossOrigin: true,
          attribution: 'Sources: Esri, Maxar, Earthstar Geographics, and the GIS User Community'
        });
        state.satelliteLayer.on('tileerror', () => {
          if (state.tileFailureNotified) return;
          state.tileFailureNotified = true;
          if ($('mapBaseSelect')) $('mapBaseSelect').value = 'grid';
          updateMapBase('grid');
          toast('Satellite basemap could not load. Returned to the offline coordinate grid; your NISAR overlay is unchanged.', 'error');
        });
      }
      state.satelliteLayer.addTo(state.map);
      if (attribution) attribution.textContent = 'Sources: Esri, Maxar, Earthstar Geographics, and the GIS User Community · internet/data required';
    } else {
      state.gridLayer.addTo(state.map);
      if (attribution) attribution.textContent = 'Local coordinate grid · no tile requests';
    }
  }
  $('mapBaseSelect')?.addEventListener('change', e => {
    if (e.target.value === 'satellite') {
      state.tileFailureNotified = false;
      toast('Loading satellite basemap. This uses internet data; choose Coordinate grid for offline use.');
    }
    updateMapBase(e.target.value);
  });
  $('mapFitButton')?.addEventListener('click', () => { if (state.map) state.map.fitBounds(state.aoiLayer.getBounds(),{padding:[25,25]}); });

  function quantile(sorted, q) {
    if (!sorted.length) return 0;
    const pos = (sorted.length - 1) * q, base = Math.floor(pos), rest = pos - base;
    return sorted[base + 1] !== undefined ? sorted[base] + rest * (sorted[base + 1] - sorted[base]) : sorted[base];
  }
  function readSample(image, index) {
    return image.readRasters({samples:[index], interleave:false}).then(result => Array.isArray(result) ? result[0] : result);
  }
  function computeStats(values, valid, noData) {
    const items = [];
    let sum = 0, min = Infinity, max = -Infinity;
    for (let i=0;i<values.length;i++) {
      const v = Number(values[i]);
      if (!valid[i] || !Number.isFinite(v) || (noData !== null && noData !== undefined && Object.is(v, Number(noData)))) continue;
      items.push(v); sum += v; if (v < min) min = v; if (v > max) max = v;
    }
    items.sort((a,b)=>a-b);
    return {count:items.length,min:items.length?min:null,max:items.length?max:null,mean:items.length?sum/items.length:null,median:items.length?quantile(items,.5):null,p02:items.length?quantile(items,.02):null,p98:items.length?quantile(items,.98):null,sorted:items};
  }
  function makeGrayCanvas(values, valid, stats, width, height) {
    const canvas = document.createElement('canvas'); canvas.width=width; canvas.height=height;
    const ctx=canvas.getContext('2d',{willReadFrequently:true}); const pixels=ctx.createImageData(width,height);
    let low=stats.p02, high=stats.p98;
    if (!Number.isFinite(low) || !Number.isFinite(high) || high<=low) { low=stats.min ?? 0; high=stats.max ?? 1; }
    if (high<=low) high=low+1;
    for(let i=0;i<values.length;i++){
      const v=Number(values[i]), offset=i*4;
      if(!valid[i]||!Number.isFinite(v)){pixels.data[offset+3]=0;continue;}
      let t=Math.max(0,Math.min(1,(v-low)/(high-low))); t=Math.pow(t,.78);
      const shade=Math.round(24+t*220);
      pixels.data[offset]=Math.round(shade*.78); pixels.data[offset+1]=Math.round(shade*.94); pixels.data[offset+2]=Math.round(shade*.86); pixels.data[offset+3]=235;
    }
    ctx.putImageData(pixels,0,0); return canvas;
  }
  function makeDiffCanvas(before, after, valid, values) {
    const canvas=document.createElement('canvas'); canvas.width=before.width; canvas.height=before.height;
    const ctx=canvas.getContext('2d'); const pixels=ctx.createImageData(canvas.width,canvas.height);
    const abs=values.filter((v,i)=>valid[i]&&Number.isFinite(v)).map(v=>Math.abs(v)).sort((a,b)=>a-b);
    let cap=quantile(abs,.98); if(!Number.isFinite(cap)||cap<=0) cap=1;
    for(let i=0;i<values.length;i++){
      const o=i*4, d=values[i];
      if(!valid[i]||!Number.isFinite(d)){pixels.data[o+3]=0;continue;}
      const t=Math.min(1,Math.abs(d)/cap), eased=Math.pow(t,.72);
      // Negative: cool teal/blue. Positive: warm amber. Neutral: dark slate.
      if(d<0){pixels.data[o]=Math.round(22+35*eased);pixels.data[o+1]=Math.round(53+152*eased);pixels.data[o+2]=Math.round(67+175*eased);}
      else{pixels.data[o]=Math.round(48+207*eased);pixels.data[o+1]=Math.round(54+111*eased);pixels.data[o+2]=Math.round(50+33*eased);}
      pixels.data[o+3]=Math.round(110+145*eased);
    }
    ctx.putImageData(pixels,0,0); return {canvas,cap};
  }
  async function parseGeoTiff(file, key) {
    if (!window.GeoTIFF || typeof window.GeoTIFF.fromArrayBuffer !== 'function') throw new Error('The GeoTIFF reader did not load. Connect to the internet, refresh the app, and try again.');
    if (file.size > 500 * 1024 * 1024) throw new Error('This file is larger than the 500 MB browser safety limit. Use your cropped Kura GeoTIFF, not the full HDF5 source file.');
    const buffer=await file.arrayBuffer();
    const tiff=await window.GeoTIFF.fromArrayBuffer(buffer);
    const image=await tiff.getImage(0);
    const width=image.getWidth(), height=image.getHeight(), samples=image.getSamplesPerPixel();
    if(width*height>50_000_000) throw new Error('This raster is too large for this browser workspace.');
    const band=await readSample(image,0);
    let alpha=null;
    if(samples>=2){try{alpha=await readSample(image,1);}catch(_){alpha=null;}}
    const directory=image.getFileDirectory ? image.getFileDirectory() : image.fileDirectory;
    let noData=null;
    try{ noData=image.getGDALNoData ? image.getGDALNoData() : (directory && directory.GDAL_NODATA !== undefined ? directory.GDAL_NODATA : null); }catch(_){noData=null;}
    const valid=new Uint8Array(width*height);
    for(let i=0;i<valid.length;i++){
      const v=Number(band[i]);
      valid[i]=(!alpha || Number(alpha[i])>0) && Number.isFinite(v) && !(noData!==null && noData!==undefined && Object.is(v,Number(noData))) ? 1 : 0;
    }
    const stats=computeStats(band,valid,noData);
    if(!stats.count) throw new Error('No valid pixels were found in Band 1. Check that you selected the original cropped GeoTIFF.');
    const bbox=image.getBoundingBox();
    const geoKeys=image.getGeoKeys ? image.getGeoKeys() : (image.geoKeys || {});
    const epsg=geoKeys.ProjectedCSTypeGeoKey || geoKeys.GeographicTypeGeoKey || null;
    const origin=image.getOrigin ? image.getOrigin() : null;
    const resolution=image.getResolution ? image.getResolution() : null;
    const canvas=makeGrayCanvas(band,valid,stats,width,height);
    const noDataText=noData===null?'Not specified':String(noData);
    return {key,fileName:file.name,fileSize:file.size,width,height,samples,band,alpha,valid,stats,bbox,epsg,origin,resolution,noData:noDataText,canvas,dataUrl:canvas.toDataURL('image/png'),date:PRODUCT[key].date,mode:PRODUCT[key].mode};
  }
  function sameGrid(a,b) {
    if(a.width!==b.width || a.height!==b.height) return {ok:false,reason:'Raster dimensions do not match.'};
    if(a.epsg && b.epsg && a.epsg!==b.epsg) return {ok:false,reason:`Coordinate systems differ (EPSG:${a.epsg} and EPSG:${b.epsg}).`};
    const tol=.05;
    if(a.bbox.some((v,i)=>Math.abs(v-b.bbox[i])>tol)) return {ok:false,reason:'Raster geographic extents do not match closely enough.'};
    if(a.resolution&&b.resolution&&a.resolution.some((v,i)=>Math.abs(v-b.resolution[i])>1e-6)) return {ok:false,reason:'Pixel resolutions differ.'};
    if(a.origin&&b.origin&&a.origin.some((v,i)=>Math.abs(v-b.origin[i])>tol)) return {ok:false,reason:'Raster origins differ.'};
    return {ok:true,reason:'Dimensions, bounds, origin and resolution match within tolerance.'};
  }
  function calcDifference() {
    const a=state.before,b=state.after;
    const values=new Float32Array(a.width*a.height), valid=new Uint8Array(values.length);
    let sum=0,min=Infinity,max=-Infinity,pos=0,neg=0,zero=0,count=0;
    for(let i=0;i<values.length;i++){
      const av=Number(a.band[i]),bv=Number(b.band[i]);
      const ok=a.valid[i]&&b.valid[i]&&Number.isFinite(av)&&Number.isFinite(bv);
      if(!ok){values[i]=NaN;continue;}
      const d=bv-av; values[i]=d;valid[i]=1;count++;sum+=d;
      if(d<min)min=d;if(d>max)max=d;if(d>0)pos++;else if(d<0)neg++;else zero++;
    }
    const diffDisplay=makeDiffCanvas(a,b,valid,Array.from(values));
    const stats={count,mean:count?sum/count:null,min:count?min:null,max:count?max:null,positive:pos,negative:neg,zero};
    state.difference={values,valid,stats,canvas:diffDisplay.canvas,cap:diffDisplay.cap,dataUrl:diffDisplay.canvas.toDataURL('image/png')};
  }
  function boundsFor(raster) {
    const bbox=raster.bbox;
    let minX=bbox[0],minY=bbox[1],maxX=bbox[2],maxY=bbox[3];
    const epsg=raster.epsg;
    if(epsg===32632 && window.proj4){
      const p1=proj4('EPSG:32632','EPSG:4326',[minX,minY]);
      const p2=proj4('EPSG:32632','EPSG:4326',[maxX,maxY]);
      return [[p1[1],p1[0]],[p2[1],p2[0]]];
    }
    if(epsg===4326 || epsg===null) return [[minY,minX],[maxY,maxX]];
    throw new Error(`Unsupported raster CRS EPSG:${epsg}. This first build expects the Kura output in EPSG:32632.`);
  }
  function showRasterOnMap() {
    if(!window.L) return;
    if(!state.map && state.currentRoute==='explore') initMap();
    if(!state.map) return;
    Object.values(state.overlays).forEach(layer=>{try{state.map.removeLayer(layer);}catch(_){}});state.overlays={};
    let dataUrl=null, label='', bounds=null, isChange=false;
    if(state.mapView==='change' && state.difference && state.after){
      bounds=boundsFor(state.after); dataUrl=state.difference.canvas.toDataURL('image/png'); label='Calculated locally from loaded original GeoTIFFs · exploratory'; isChange=true;
    } else if(state.mapView==='before' && state.before){
      bounds=boundsFor(state.before); dataUrl=state.before.dataUrl; label='8 October · local source GeoTIFF preview';
    } else if(state.mapView==='after' && state.after){
      bounds=boundsFor(state.after); dataUrl=state.after.dataUrl; label='20 October · local source GeoTIFF preview';
    } else if(state.published?.manifest?.layers){
      const manifest=state.published.manifest, extent=manifest.studyArea.extentWgs84;
      bounds=[[extent.south,extent.west],[extent.north,extent.east]];
      const layerKey=state.mapView==='before'?'before':state.mapView==='after'?'after':'change';
      dataUrl=state.published.images[layerKey]?.src || manifest.layers[layerKey];
      label=layerKey==='before'?'Packaged 8 October HHHH preview · 20 m grid':layerKey==='after'?'Packaged 20 October HHHH preview · 20 m grid':'Packaged exploratory difference preview · 20 m grid';
      isChange=layerKey==='change';
    }
    if(!dataUrl||!bounds){$('mapLayerStatus').textContent='Packaged map layer is not available';if($('mapChangeLegend'))$('mapChangeLegend').hidden=true;return;}
    try{
      state.overlays.active=L.imageOverlay(dataUrl,bounds,{opacity:.92,interactive:false}).addTo(state.map);
      state.map.fitBounds(bounds,{padding:[25,25],maxZoom:15});
      $('mapLayerStatus').textContent=label;
      if($('mapChangeLegend'))$('mapChangeLegend').hidden=!isChange;
      setTimeout(()=>state.map.invalidateSize(),100);
    }catch(err){$('mapLayerStatus').textContent='Raster map overlay unavailable';toast(err.message,'error');}
  }
  $('mapLayerSelect')?.addEventListener('change', e=>{
    state.mapView=e.target.value;
    showRasterOnMap();
  });
  function renderCanvas(mode=state.compareMode) {
    const canvas=$('compareCanvas'),empty=$('rasterEmpty');
    // Packaged, georeferenced preview imagery is immediately available. Original GeoTIFFs remain optional for local recalculation.
    if(!(state.before&&state.after)){
      const p=state.published?.images;
      if(p?.before&&p?.after&&p?.change){
        const imgA=p.before,imgB=p.after,imgD=p.change;
        const active=mode==='before'?imgA:mode==='after'?imgB:mode==='change'?imgD:imgA;
        canvas.width=active.naturalWidth||327;canvas.height=active.naturalHeight||332;
        const ctx=canvas.getContext('2d');ctx.clearRect(0,0,canvas.width,canvas.height);
        if(mode==='change')ctx.drawImage(imgD,0,0,canvas.width,canvas.height);
        else if(mode==='before')ctx.drawImage(imgA,0,0,canvas.width,canvas.height);
        else if(mode==='after')ctx.drawImage(imgB,0,0,canvas.width,canvas.height);
        else{
          ctx.drawImage(imgA,0,0,canvas.width,canvas.height);
          ctx.save();ctx.beginPath();const split=Math.round(canvas.width*(state.split/100));ctx.rect(split,0,canvas.width-split,canvas.height);ctx.clip();ctx.drawImage(imgB,0,0,canvas.width,canvas.height);ctx.restore();
          ctx.fillStyle='rgba(234,244,239,.92)';ctx.fillRect(Math.round(canvas.width*(state.split/100))-1,0,2,canvas.height);
          ctx.beginPath();ctx.arc(Math.round(canvas.width*(state.split/100)),canvas.height/2,7,0,Math.PI*2);ctx.fillStyle='#a4e7c8';ctx.fill();
        }
        canvas.hidden=false;empty.hidden=true;
        $('rasterLabelBefore').hidden=!(mode==='swipe'||mode==='before');$('rasterLabelAfter').hidden=!(mode==='swipe'||mode==='after');$('rasterLabelChange').hidden=mode!=='change';
        $('sliderRow').style.opacity=mode==='swipe'?'1':'.35';$('splitSlider').disabled=mode!=='swipe';
        $('compareLegend').innerHTML=mode==='change'?'<span><i class="legend-swatch" style="background:#3ca5d0"></i>Lower later measurement</span><span><i class="legend-swatch" style="background:#e66b59"></i>Higher later measurement</span><span class="legend-explain">Preview colour scale is relative to this pair.</span>':'<span><i class="legend-swatch before-swatch"></i>8 Oct · Earlier</span><span><i class="legend-swatch after-swatch"></i>20 Oct · Later</span><span class="legend-explain">Same pooled 2nd–98th percentile display stretch.</span>';
        return;
      }
      canvas.hidden=true;empty.hidden=false;return;
    }
    const a=state.before,b=state.after,d=state.difference;
    if(!d){canvas.hidden=true;empty.hidden=false;return;}
    const active=mode==='before'?a.canvas:mode==='after'?b.canvas:mode==='change'?d.canvas:a.canvas;
    canvas.width=active.width;canvas.height=active.height;
    const ctx=canvas.getContext('2d');ctx.clearRect(0,0,canvas.width,canvas.height);
    if(mode==='change') ctx.drawImage(d.canvas,0,0);
    else if(mode==='before') ctx.drawImage(a.canvas,0,0);
    else if(mode==='after') ctx.drawImage(b.canvas,0,0);
    else {
      ctx.drawImage(a.canvas,0,0);
      ctx.save();ctx.beginPath();const split=Math.round(canvas.width*(state.split/100));ctx.rect(split,0,canvas.width-split,canvas.height);ctx.clip();ctx.drawImage(b.canvas,0,0);ctx.restore();
      ctx.fillStyle='rgba(234,244,239,.88)';ctx.fillRect(Math.round(canvas.width*(state.split/100))-1,0,2,canvas.height);
      ctx.beginPath();ctx.arc(Math.round(canvas.width*(state.split/100)),canvas.height/2,7,0,Math.PI*2);ctx.fillStyle='#a4e7c8';ctx.fill();
    }
    canvas.hidden=false;empty.hidden=true;
    $('rasterLabelBefore').hidden=!(mode==='swipe'||mode==='before');$('rasterLabelAfter').hidden=!(mode==='swipe'||mode==='after');$('rasterLabelChange').hidden=mode!=='change';
    $('sliderRow').style.opacity=mode==='swipe'?'1':'.35';$('splitSlider').disabled=mode!=='swipe';
    $('compareLegend').innerHTML=mode==='change'?'<span><i class="legend-swatch" style="background:#4bb8d9"></i>Lower later measurement</span><span><i class="legend-swatch" style="background:#e6a74c"></i>Higher later measurement</span><span class="legend-explain">Colour scale is relative to this pair.</span>':'<span><i class="legend-swatch before-swatch"></i>8 Oct · Earlier</span><span><i class="legend-swatch after-swatch"></i>20 Oct · Later</span><span class="legend-explain">Same pooled display stretch.</span>';
  }
  function setCompareMode(mode){state.compareMode=mode;document.querySelectorAll('[data-compare-mode]').forEach(b=>b.classList.toggle('active',b.dataset.compareMode===mode));renderCanvas(mode);}
  function drawComparison(){renderCanvas(state.compareMode);}
  document.querySelectorAll('[data-compare-mode]').forEach(b=>b.addEventListener('click',()=>setCompareMode(b.dataset.compareMode)));
  $('splitSlider').addEventListener('input',e=>{state.split=Number(e.target.value);$('splitValue').textContent=`${state.split}%`;renderCanvas('swipe');});
  function updateLoadedUI(){
    const previewReady=!!state.published;
    const count=previewReady?2:Number(!!state.before)+Number(!!state.after);
    $('observationCount').innerHTML=`${count} <small>/ 2</small>`;$('observationProgress').style.width=`${count*50}%`;
    $('beforeMiniState').textContent=state.before?'Loaded locally':previewReady?'Preview ready':'Waiting';$('beforeMiniState').classList.toggle('ready',!!state.before||previewReady);
    $('afterMiniState').textContent=state.after?'Loaded locally':previewReady?'Preview ready':'Waiting';$('afterMiniState').classList.toggle('ready',!!state.after||previewReady);
    $('beforeStatus').textContent=state.before?'Loaded':previewReady?'Preview ready':'Not loaded';$('beforeStatus').classList.toggle('ready',!!state.before||previewReady);
    $('afterStatus').textContent=state.after?'Loaded':previewReady?'Preview ready':'Not loaded';$('afterStatus').classList.toggle('ready',!!state.after||previewReady);
    $('metaBeforeState').textContent=state.before?`${state.before.width} × ${state.before.height} · ${state.before.fileName}`:(previewReady?'Catalogue record included · preview ready · source raster not loaded':'GeoTIFF not loaded');$('metaBeforeState').classList.toggle('ready',!!state.before||previewReady);
    $('metaAfterState').textContent=state.after?`${state.after.width} × ${state.after.height} · ${state.after.fileName}`:(previewReady?'Catalogue record included · preview ready · source raster not loaded':'GeoTIFF not loaded');$('metaAfterState').classList.toggle('ready',!!state.after||previewReady);
    $('compareNavDot').classList.toggle('show',previewReady||count===2);
    $('exportChangeButton').disabled=!(state.before&&state.after&&state.difference) && !previewReady;
    $('exportReportButton').disabled=!(state.before&&state.after&&state.difference) && !previewReady;
    $('downloadMetadataButton').disabled=false; if($('downloadMetadataCsvButton'))$('downloadMetadataCsvButton').disabled=false;
    if($('mapLayerSelect')){const sel=$('mapLayerSelect');sel.querySelector('[value=change]').disabled=!(state.before&&state.after&&state.difference)&&!previewReady;sel.querySelector('[value=before]').disabled=!state.before&&!previewReady;sel.querySelector('[value=after]').disabled=!state.after&&!previewReady;}
  }
  function updateAnalyticsChart(c){
    const negative=Number(c?.negativePercent ?? (c?.negative && c?.validPixels ? 100*c.negative/c.validPixels : 72.729));
    const positive=Number(c?.positivePercent ?? (c?.positive && c?.validPixels ? 100*c.positive/c.validPixels : 27.270));
    const total=Number(c?.validPixels ?? c?.count ?? 108555);
    const unchanged=Number(c?.zeroPixels ?? Math.max(0,total-Math.round(total*negative/100)-Math.round(total*positive/100)));
    const n=$('chartNegativeBar'),p=$('chartPositiveBar');
    if(!n||!p)return;
    const maxHeight=130,base=162;
    const nh=maxHeight*Math.max(0,Math.min(100,negative))/100,ph=maxHeight*Math.max(0,Math.min(100,positive))/100;
    n.setAttribute('height',nh.toFixed(1));n.setAttribute('y',(base-nh).toFixed(1));
    p.setAttribute('height',ph.toFixed(1));p.setAttribute('y',(base-ph).toFixed(1));
    $('chartNegativeValue').setAttribute('y',String(Math.max(22,base-nh-9)));$('chartNegativeValue').textContent=`${negative.toFixed(1)}%`;
    $('chartPositiveValue').setAttribute('y',String(Math.max(22,base-ph-9)));$('chartPositiveValue').textContent=`${positive.toFixed(1)}%`;
    $('analyticsPixelCount').textContent=`${total.toLocaleString()} shared valid pixels`;
    const unchangedLabel=$('analyticsFootUnchanged');if(unchangedLabel)unchangedLabel.textContent=`${unchanged.toLocaleString()} effectively unchanged`;
  }
  function updateStats(){
    const s=state.difference.stats, total=s.count||1;
    $('comparisonStats').innerHTML=`<div><span>VALID PIXELS</span><strong>${s.count.toLocaleString()}</strong></div><div><span>MEAN Δ (AFTER − BEFORE)</span><strong>${number(s.mean,6)}</strong></div><div><span>POSITIVE Δ</span><strong>${number(100*s.positive/total,1)}%</strong></div><div><span>NEGATIVE Δ</span><strong>${number(100*s.negative/total,1)}%</strong></div>`;
    $('insightState').innerHTML=`<div class="insight-empty-icon">⌁</div><div><div class="eyebrow">EXPLORATORY MEASUREMENT SUMMARY</div><h3>Radar returns differed between the two dates</h3><p>${s.count.toLocaleString()} pixels were valid in both rasters. The mean later-minus-earlier difference was <strong>${number(s.mean,6)}</strong> in the stored raster values. ${number(100*s.negative/total,1)}% of valid pixels had a lower later value and ${number(100*s.positive/total,1)}% had a higher later value.</p><p>This tells us the measured radar return changed. It does not identify the cause or prove flooding, crop damage, soil moisture or river level. Product QA and cross-mode comparability review remain open.</p><button class="button button-outline" data-route="compare">Review comparison →</button></div>`;
    $('insightState').querySelector('[data-route]').addEventListener('click',()=>route('compare'));
    updateAnalyticsChart({validPixels:s.count,meanDifference:s.mean,positivePercent:100*s.positive/total,negativePercent:100*s.negative/total,zeroPixels:s.zero});
  }
  function renderPublishedSummary(){
    const c=state.published?.manifest?.comparison;if(!c)return;
    const count=c.validPixels||0;
    $('comparisonStats').innerHTML=`<div><span>COMMON VALID PIXELS</span><strong>${count.toLocaleString()}</strong></div><div><span>MEAN Δ (AFTER − BEFORE)</span><strong>${number(c.meanDifference,6)}</strong></div><div><span>POSITIVE Δ</span><strong>${number(c.positivePercent,1)}%</strong></div><div><span>NEGATIVE Δ</span><strong>${number(c.negativePercent,1)}%</strong></div>`;
    $('insightState').innerHTML=`<div class="insight-empty-icon">⌁</div><div><div class="eyebrow">SAVED EXPLORATORY ANALYSIS · 31 OCT 2026</div><h3>Radar returns differed between the two dates</h3><p>${count.toLocaleString()} pixels were valid in both observations. The average later-minus-earlier difference was <strong>${number(c.meanDifference,6)}</strong> in the stored raster values; ${number(c.negativePercent,1)}% of valid pixels had a lower later value and ${number(c.positivePercent,1)}% had a higher later value.</p><p>In everyday language: the satellite measured a different radar response in parts of this test area. The images cannot tell us by themselves whether the cause was water, vegetation, soil wetness or another surface or acquisition condition.</p><button class="button button-outline" data-route="compare">View the two observations →</button></div>`;
    $('insightState').querySelector('[data-route]').addEventListener('click',()=>route('compare'));
    updateAnalyticsChart(c);
  }
  async function loadPublishedEvidence(){
    try{
      const response=await fetch('data/kura/ktp_data_manifest.json',{cache:'no-cache'});
      if(!response.ok)throw new Error(`Evidence manifest request failed (${response.status})`);
      const manifest=await response.json();
      const loadImage=src=>new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(new Error(`Could not load ${src}`));img.src=src;});
      const [before,after,change]=await Promise.all([loadImage(manifest.layers.before),loadImage(manifest.layers.after),loadImage(manifest.layers.change)]);
      state.published={manifest,images:{before,after,change}};
      updateLoadedUI();
      $('packagedPreviewNotice')?.classList.add('notice-ready');
      $('loadMessage').textContent='Packaged NISAR previews are ready. Select original GeoTIFFs below only if you want to recalculate the analysis on this device.';
      $('loadMessage').className='loading-line success';
      renderCanvas(state.compareMode);renderPublishedSummary();
      if(state.mapView==='change'&&$('mapLayerSelect'))$('mapLayerSelect').value='change';
      if(state.currentRoute==='explore'){initMap();showRasterOnMap();}
      toast('Included NISAR evidence previews loaded. No download required.');
    }catch(err){console.warn('Packaged KUNTAU evidence could not be loaded:',err);}
  }
  async function loadFile(file,key){
    if(!file) return;
    const expected=key==='before'?'2026-10-08':'2026-10-20';
    setMessage(`Reading ${file.name} locally…`);
    try{
      await ensureRasterTools();
      const parsed=await parseGeoTiff(file,key);
      if(parsed.epsg && parsed.epsg!==32632) throw new Error(`This file reports EPSG:${parsed.epsg}; the selected Kura extraction is expected to use EPSG:32632.`);
      state[key]=parsed;
      $(key==='before'?'beforeFilename':'afterFilename').textContent=file.name;
      updateLoadedUI();
      setMessage(`${file.name} loaded locally · ${parsed.width} × ${parsed.height} · ${parsed.stats.count.toLocaleString()} valid Band 1 pixels.`, 'success');
      toast(`${key==='before'?'October 8':'October 20'} observation loaded.`);
      if(state.before&&state.after){
        const grid=sameGrid(state.before,state.after);
        if(!grid.ok){state.difference=null;setMessage(`Both files loaded, but comparison is blocked: ${grid.reason} Please align the rasters before calculating a difference.`,'error');toast(grid.reason,'error');renderCanvas();updateLoadedUI();showRasterOnMap();return;}
        calcDifference();updateStats();state.mapView='change';if($('mapLayerSelect'))$('mapLayerSelect').value='change';updateLoadedUI();setMessage(`Both rasters loaded. ${grid.reason} Pixel-wise difference calculated for exploration.`, 'success');
        $('rasterEmpty').hidden=true;setCompareMode('swipe');$('splitSlider').disabled=false;
      } else {state.difference=null;state.mapView=key;if($('mapLayerSelect'))$('mapLayerSelect').value=key;setMessage('First observation loaded. Select the other original GeoTIFF to compare.','success');}
      showRasterOnMap();
    }catch(err){setMessage(err.message,'error');toast(err.message,'error');}
  }
  $('connectDataFolderButton')?.addEventListener('click', async () => {
    if (!window.showDirectoryPicker) {
      toast('This browser does not support folder selection here. Use the two Choose file buttons below instead.', 'error');
      return;
    }
    const button = $('connectDataFolderButton');
    button.disabled = true;
    const originalLabel = button.innerHTML;
    button.textContent = 'Opening folder picker…';
    try {
      const directory = await window.showDirectoryPicker({ id: 'kuntau-terrapulse-data', mode: 'read' });
      const beforeHandle = await directory.getFileHandle('Kura_Before_2026-10-08.tif');
      const afterHandle = await directory.getFileHandle('Kura_After_2026-10-20.tif');
      const beforeFile = await beforeHandle.getFile();
      const afterFile = await afterHandle.getFile();
      await loadFile(beforeFile, 'before');
      await loadFile(afterFile, 'after');
      if (state.before && state.after) {
        if (state.difference) toast('Both original Kura GeoTIFF files were read. The exploratory comparison is ready.');
        else toast('Both files were read, but the app has not enabled a difference view. Review the comparison message.', 'error');
      } else {
        toast('The folder was selected, but one or both TIFFs did not load. Review the status message.', 'error');
      }
    } catch (err) {
      if (err && err.name !== 'AbortError') {
        const message = err && err.name === 'NotFoundError'
          ? 'I could not find both expected original TIFF filenames in that folder. Open C:\\KUNTAU_TERRAPULSE\\data and check the filenames.'
          : (err.message || 'The folder could not be read.');
        setMessage(message, 'error');
        toast(message, 'error');
      }
    } finally {
      button.disabled = false;
      button.innerHTML = originalLabel;
    }
  });
  async function loadCopiedKuraFiles() {
    const button = $('loadAppDataButton');
    const original = button.innerHTML;
    button.disabled = true;
    button.textContent = 'Reading copied Kura files…';
    try {
      const names = [
        ['Kura_Before_2026-10-08.tif', 'before'],
        ['Kura_After_2026-10-20.tif', 'after']
      ];
      for (const [name, key] of names) {
        const response = await fetch(`./data/${encodeURIComponent(name)}?nocache=${Date.now()}`, { cache: 'no-store' });
        if (!response.ok) {
          throw new Error(`Could not find ${name} inside this app's data folder. First run CONNECT_KURA_DATA_AND_START.bat from the app folder.`);
        }
        const blob = await response.blob();
        if (!blob.size) throw new Error(`${name} is empty. Copy the original GeoTIFF again.`);
        const file = new File([blob], name, { type: 'image/tiff' });
        await loadFile(file, key);
        if (!state[key]) throw new Error(`The app could not read ${name}. Please share the message shown above the comparison panel.`);
      }
      if (state.before && state.after && state.difference) {
        toast('Both original Kura observations loaded from the app data folder.');
      }
    } catch (err) {
      const message = err && err.message === 'Failed to fetch' ? 'The local data request failed. Keep the local server window open, refresh this page, then use the two Choose file buttons to select the original TIFFs from C:\\KUNTAU_TERRAPULSE\\data.' : (err.message || 'The copied Kura files could not be loaded.');
      setMessage(message, 'error');
      toast(message, 'error');
    } finally {
      button.disabled = false;
      button.innerHTML = original;
    }
  }
  $('loadAppDataButton')?.addEventListener('click', loadCopiedKuraFiles);
  $('beforeFile').addEventListener('change',e=>loadFile(e.target.files[0],'before'));
  $('afterFile').addEventListener('change',e=>loadFile(e.target.files[0],'after'));
  document.querySelectorAll('.upload-card').forEach(card=>{
    card.addEventListener('dragover',e=>{e.preventDefault();card.classList.add('dragover');});
    card.addEventListener('dragleave',()=>card.classList.remove('dragover'));
    card.addEventListener('drop',e=>{e.preventDefault();card.classList.remove('dragover');const f=e.dataTransfer.files[0];if(!f)return;const key=card.htmlFor==='beforeFile'?'before':'after';loadFile(f,key);});
  });
  $('exportChangeButton').addEventListener('click',()=>{
    const a=document.createElement('a');
    if(state.difference){a.href=state.difference.dataUrl;a.download='KUNTAU_TERRAPULSE_Kura_exploratory_difference.png';a.click();return;}
    if(state.published?.manifest?.figures?.change){a.href=state.published.manifest.figures.change;a.download='KTP_CHANGE_LABELLED_EXPLORATORY.png';a.click();}
  });
  $('exportReportButton').addEventListener('click',()=>{
    if(!state.difference){if(state.published){const a=document.createElement('a');a.href='data/kura/catalogue/KTP_ANALYSIS_SUMMARY.csv';a.download='KTP_ANALYSIS_SUMMARY.csv';a.click();}return;}
    const s=state.difference.stats;
    const rows=[['field','value'],['project','KUNTAU TERRAPULSE'],['study_area',AOI.name],['before_product_id',PRODUCT.before.id],['after_product_id',PRODUCT.after.id],['before_mode','SHSH (HH single-pol)'],['after_mode','DHDH (HH/HV dual-pol)'],['band','frequencyA/HHHH'],['operation','after minus before; raw raster values'],['valid_pixel_count',s.count],['mean_difference',s.mean],['minimum_difference',s.min],['maximum_difference',s.max],['positive_difference_pixels',s.positive],['negative_difference_pixels',s.negative],['zero_difference_pixels',s.zero],['interpretation_limit','Exploratory pixel difference; not a water mask, river-stage estimate or flood forecast']];
    const csv=rows.map(r=>r.map(v=>`"${String(v??'').replaceAll('"','""')}"`).join(',')).join('\r\n');downloadBlob(csv,'KUNTAU_TERRAPULSE_exploratory_analysis.csv','text/csv');
  });
  function buildMetadata(){
    const saved=state.published?.manifest||{};
    const toMeta=r=>r?({fileName:r.fileName,fileSizeBytes:r.fileSize,width:r.width,height:r.height,samplesPerPixel:r.samples,epsg:r.epsg,boundingBox:r.bbox,origin:r.origin,resolution:r.resolution,band1Statistics:{validPixels:r.stats.count,min:r.stats.min,max:r.stats.max,mean:r.stats.mean,median:r.stats.median,p02:r.stats.p02,p98:r.stats.p98},nodata:r.noData}):null;
    const savedCmp=saved.comparison||null;
    const liveCmp=state.difference?{operation:'after minus before',validPixelCount:state.difference.stats.count,meanDifference:state.difference.stats.mean,minDifference:state.difference.stats.min,maxDifference:state.difference.stats.max,positivePixels:state.difference.stats.positive,negativePixels:state.difference.stats.negative,zeroPixels:state.difference.stats.zero,interpretation:'Exploratory radar-measurement difference only; product mode differs (SHSH vs DHDH); no water mask, river-stage estimate or flood classification.'}:null;
    const comparison=liveCmp|| (savedCmp?{operation:savedCmp.operation,validPixelCount:savedCmp.validPixels,meanDifference:savedCmp.meanDifference,medianDifference:savedCmp.medianDifference,minDifference:savedCmp.minDifference,maxDifference:savedCmp.maxDifference,positivePixels:savedCmp.positivePixels,negativePixels:savedCmp.negativePixels,zeroPixels:savedCmp.zeroPixels,positivePercent:savedCmp.positivePercent,negativePercent:savedCmp.negativePercent,interpretation:'Saved exploratory pixel difference. Product mode differs (SHSH vs DHDH); not a water mask, river-stage estimate or flood classification.'}:null);
    return {project:'KUNTAU TERRAPULSE',version:'0.8.2',useCase:'River corridor and floodplain observation concept; not a flood forecast',generatedAt:new Date().toISOString(),studyArea:saved.studyArea||{name:AOI.name,footprintWKT:'POLYGON((8.4003 11.7414,8.4603 11.7414,8.4603 11.8014,8.4003 11.8014,8.4003 11.7414))',footprintStatus:'Test extraction AOI; not a surveyed river channel or floodplain boundary'},source:'NASA-ISRO NISAR L2 PR GCOV provisional L-band',dataset:'frequencyA / HHHH',track:123,frame:83,orbitDirection:'Descending',crid:'P05023',observations:{before:{...PRODUCT.before,parsed:toMeta(state.before),catalogueRecordIncluded:!!saved.observations?.[0]},after:{...PRODUCT.after,parsed:toMeta(state.after),catalogueRecordIncluded:!!saved.observations?.[1]}},comparison,qa:saved.qa||{status:'Review required; inspect source QA reports'},publishedEvidence:{previewAvailable:!!state.published,sourceGeoTiffsLoadedLocally:!!(state.before&&state.after),catalogue:saved.catalogue||{},qa:saved.qa||{}},processingNotes:['Source rasters were cropped locally using GDAL from the NISAR GCOV HDF5 products; the full source HDF5 products are not included in this app package.','Browser display previews are supplied as derived PNGs. They are not the original science rasters and do not replace the Float32 GeoTIFFs.','A fresh difference is calculated only after raster dimensions, EPSG, bounds, origin and pixel resolution pass the application grid check.','Product polarization configuration differs between observations (SHSH vs DHDH); scientific comparability requires additional assessment.','Both supplied QA summaries contain an identification-group check failure; the exact diagnostic cause has not yet been established.','This prototype highlights radar measurement differences; it does not measure river depth, flow rate, water level, crop health, or forecast floods.','The current Kura test AOI has not yet been verified against a surveyed river centreline or floodplain boundary.']};
  }
  function downloadBlob(content,name,type){const blob=new Blob([content],{type});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  $('downloadMetadataButton').addEventListener('click',()=>downloadBlob(JSON.stringify(buildMetadata(),null,2),'KUNTAU_TERRAPULSE_metadata.json','application/json'));
  $('downloadMetadataCsvButton')?.addEventListener('click',()=>{
    const m=buildMetadata();
    const rows=[
      ['field','value'],['project',m.project],['use_case','River corridor and floodplain observation concept'],['study_area',m.studyArea.name],['footprint_status',m.studyArea.footprintStatus],['footprint_wkt',m.studyArea.footprintWKT],['source',m.source],['science_product','L2 PR GCOV · Provisional'],['frequency_layer',m.dataset],
      ['before_date',m.observations.before.date],['before_product_id',m.observations.before.id],['before_mode',m.observations.before.mode],['before_file',m.observations.before.parsed?.fileName||(state.published?'Packaged preview; raw GeoTIFF not loaded':'Not loaded')],
      ['after_date',m.observations.after.date],['after_product_id',m.observations.after.id],['after_mode',m.observations.after.mode],['after_file',m.observations.after.parsed?.fileName||(state.published?'Packaged preview; raw GeoTIFF not loaded':'Not loaded')],
      ['comparison_operation','October 20 minus October 8'],['valid_pixel_count',m.comparison?.validPixelCount??'Not calculated'],['mean_difference',m.comparison?.meanDifference??'Not calculated'],['before_qa_status',m.qa?.beforeStatus||'Review required'],['after_qa_status',m.qa?.afterStatus||'Review required'],
      ['polarization_caveat','SHSH (before) vs DHDH (after); shared HHHH layer only; comparability review required'],['interpretation_limit','Not a river-stage measurement, flood forecast, or validated water classification']
    ];
    const csv=rows.map(r=>r.map(v=>`"${String(v??'').replaceAll('"','""')}"`).join(',')).join('\r\n');
    downloadBlob(csv,'KUNTAU_TERRAPULSE_metadata.csv','text/csv');
  });
  $('helpButton').addEventListener('click',()=>$('helpModal').hidden=false);
  $('resetIntroButton')?.addEventListener('click', () => { slideIndex = 0; showSlide(); $('onboarding').hidden = false; });
  document.querySelectorAll('[data-close-modal]').forEach(b=>b.addEventListener('click',()=>$('helpModal').hidden=true));
  $('helpModal').addEventListener('click',e=>{if(e.target===$('helpModal'))$('helpModal').hidden=true;});

  const VISUALS = {
    farmland: 'https://worldbank.scene7.com/is/image/worldbankprod/IrrigationcanalKano?hei=439&qlt=85%2C0&resMode=sharp&wid=780',
    nisar: 'assets/earth-blue-marble.jpg',
    farmer: 'data/kura/visualizations/KTP_CHANGE_LABELLED_EXPLORATORY.png'
  };
  const fallbackVisual = 'assets/hero-terrain.svg';
  document.querySelectorAll('.visual-story-card img').forEach(img => img.addEventListener('error', () => {
    if (img.dataset.fallbackApplied) return;
    img.dataset.fallbackApplied = '1';
    img.src = img.dataset.fallbackSrc || fallbackVisual;
    if(img.dataset.fallbackSrc) img.alt='Generated illustrative river-and-farming context artwork · not a photograph of the Kura test area';
  }));
  document.querySelectorAll('img[data-fallback-src]:not(.onboard-visual)').forEach(img => img.addEventListener('error', () => {
    if (img.dataset.fallbackApplied) return;
    img.dataset.fallbackApplied = '1';
    img.src = img.dataset.fallbackSrc;
    img.alt='Generated illustrative river-and-farming context artwork · not a photograph of the Kura test area';
    const tag=img.closest('.community-feature-image')?.querySelector('.image-context-tag');if(tag)tag.textContent='ILLUSTRATIVE CONTEXT ARTWORK';
    const note=img.closest('.community-feature')?.querySelector('.image-source-note');if(note)note.textContent='The bundled generated image is an illustrative offline fallback, not a field photograph, satellite observation or picture of the Kura test area.';
  }));
  $('onboardVisual')?.addEventListener('error', () => {
    const img = $('onboardVisual');
    if (img.dataset.fallbackApplied) return;
    img.dataset.fallbackApplied = '1';
    img.src = img.dataset.fallbackSrc || fallbackVisual;
    $('onboardVisualCaption').textContent = 'Illustrative river-and-farming context artwork · not a photograph of the Kura test area';
    $('onboardVisual').alt = 'Generated illustrative river-and-farming context artwork, not a photograph of the Kura test area';
  });
  const slides=[
    {icon:'◉',image:VISUALS.farmland,caption:'Rehabilitated irrigation canal in Kano State · Photo credit: David Shonowo for the World Bank · not the Kura test site',kicker:'WELCOME TO THE STUDIO',title:'Explore Earth<br><em>with evidence.</em>',text:'KUNTAU TERRAPULSE brings satellite observations, map comparisons and local context into one friendly workspace.'},
    {icon:'⌁',image:VISUALS.nisar,caption:'Blue Marble Earth texture used for the 3D globe · illustrative, not live data',kicker:'RADAR IS A MEASUREMENT',title:'See beyond<br><em>ordinary images.</em>',text:'NISAR sends radar signals and measures the energy returned from the surface. It can observe through clouds and in darkness.'},
    {icon:'◫',image:'data/kura/overlays/before.png',caption:'Packaged 8 October 2026 NISAR browse preview for the Kura test area',kicker:'TWO OBSERVATION DATES',title:'Compare<br><em>8 and 20 October.</em>',text:'The included pair is 12 days apart. Compare the same HHHH measurement layer and read the metadata before interpreting the difference.'},
    {icon:'◇',image:'assets/education/river-community-context.webp',caption:'Kano irrigation canal photograph · regional context only, not the monitored Kura test site',kicker:'CONNECT DATA TO PEOPLE',title:'Make every signal<br><em>understandable.</em>',text:'Use simple explanations, local reports and field checks to understand what a satellite measurement can—and cannot—tell us.'},
    {icon:'⌂',image:'data/kura/overlays/change.png',caption:'Exploratory 8–20 October radar-difference preview · not a flood classification',kicker:'YOUR WORKSPACE',title:'Explore. Compare.<br><em>Learn together.</em>',text:'Start with the included previews. When original GeoTIFFs are available, select them locally to recalculate and export your result.'}
  ];
  let slideIndex=0;
  function showSlide(){
    const s=slides[slideIndex];
    $('onboardIllustration').textContent=s.icon;
    $('onboardVisual').src=s.image;
    $('onboardVisual').alt=s.caption;
    $('onboardVisualCaption').textContent=s.caption;
    $('onboardKicker').textContent=s.kicker;
    $('onboardTitle').innerHTML=s.title;
    $('onboardText').textContent=s.text;
    $('onboardCount').textContent=`0${slideIndex+1} / 05`;
    document.querySelectorAll('.onboard-progress i').forEach((e,i)=>e.classList.toggle('active',i<=slideIndex));
    $('nextIntro').innerHTML=slideIndex===4?'Enter workspace <span>→</span>':'Continue <span>→</span>';
  }
  function finishIntro(){ $('onboarding').hidden=true;try{localStorage.setItem('ktp_intro_seen_v2','1');}catch(_){} }
  $('nextIntro').addEventListener('click',()=>{if(slideIndex<4){slideIndex++;showSlide();}else finishIntro();});$('skipIntro').addEventListener('click',finishIntro);
  try{if(!localStorage.getItem('ktp_intro_seen_v2')){$('onboarding').hidden=false;showSlide();}}catch(_){$('onboarding').hidden=false;showSlide();}

  // Audience switcher keeps learning content simple and lets technical users open the science notes.
  function activateLearnAudience(audience) {
    document.querySelectorAll('[data-learn-audience]').forEach(button => {
      const active = button.dataset.learnAudience === audience;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    document.querySelectorAll('[data-learn-panel]').forEach(panel => {
      const active = panel.dataset.learnPanel === audience;
      panel.classList.toggle('active', active);
      panel.hidden = !active;
    });
  }
  document.querySelectorAll('[data-learn-audience]').forEach(button => button.addEventListener('click', () => activateLearnAudience(button.dataset.learnAudience)));

  // Tiny quiz feedback for students. No tracking or external service is used.
  document.querySelectorAll('.quiz-question').forEach(question => {
    question.querySelectorAll('[data-correct]').forEach(option => option.addEventListener('click', () => {
      const correct = option.dataset.correct === 'true';
      question.querySelectorAll('[data-correct]').forEach(btn => { btn.disabled = true; btn.classList.toggle('answer-correct', btn.dataset.correct === 'true'); });
      const feedback = question.querySelector('.quiz-feedback');
      if (feedback) feedback.textContent = correct ? 'Correct — a radar image shows measurements, not an ordinary photograph.' : 'Not quite. The highlighted answer explains the idea.';
    }));
  });
  $('resetQuizButton')?.addEventListener('click', () => {
    document.querySelectorAll('.quiz-question').forEach(question => {
      question.querySelectorAll('[data-correct]').forEach(btn => { btn.disabled = false; btn.classList.remove('answer-correct'); });
      const feedback = question.querySelector('.quiz-feedback'); if (feedback) feedback.textContent = '';
    });
  });

  // Guided five-step presentation; users can screen-record it as a lightweight demo video.
  const tourSteps = [
    {title:'Meet KUNTAU TERRAPULSE', text:'TERRAPULSE is an Earth-observation workspace. It helps people inspect radar measurements and decide where local checks may be useful.', image:'assets/education/story-orbit.svg', caption:'Decorative satellite illustration — not a live satellite track.'},
    {title:'Choose a place to investigate', text:'The first study is a small test area near Kura in Kano State. Its exact overlap with the river channel has not yet been verified.', image:'assets/education/story-river.svg', caption:'Illustrative river landscape — not a surveyed river boundary.'},
    {title:'Compare two observation dates', text:'The included previews show 8 October and 20 October 2026. The colours represent radar measurements, not ordinary camera photographs.', image:'assets/education/compare-dates.svg', caption:'Teaching illustration — open Compare to see the NISAR evidence.'},
    {title:'Understand what changed', text:'A higher or lower radar response can have several causes. These two products also have different acquisition modes and unresolved QA checks.', image:'assets/education/radar-echo.svg', caption:'Radar echo illustration — not a measurement graphic.'},
    {title:'Check on the ground', text:'Talk with local observers, record dates and locations, and compare rainfall or river records. Do not treat this prototype as a flood forecast.', image:'assets/education/field-check.svg', caption:'Field-check illustration — verify observations locally.'}
  ];
  let tourIndex = 0;
  const tourModal = $('guidedTourModal');
  function renderTour() {
    const step = tourSteps[tourIndex];
    $('tourStepCount').textContent = `STEP 0${tourIndex + 1} / 05`;
    $('tourTitle').textContent = step.title; $('tourText').textContent = step.text;
    $('tourVisual').src = step.image; $('tourVisual').alt = step.caption; $('tourCaption').textContent = step.caption;
    $('tourProgress').style.width = `${(tourIndex + 1) / tourSteps.length * 100}%`;
    $('tourPrevious').disabled = tourIndex === 0;
    $('tourNext').textContent = tourIndex === tourSteps.length - 1 ? 'Finish' : 'Next step';
  }
  $('startGuidedTour')?.addEventListener('click', () => { tourIndex = 0; renderTour(); tourModal.hidden = false; $('tourNext').focus(); });
  $('tourPrevious')?.addEventListener('click', () => { if (tourIndex > 0) { tourIndex--; renderTour(); } });
  $('tourNext')?.addEventListener('click', () => { if (tourIndex < tourSteps.length - 1) { tourIndex++; renderTour(); } else tourModal.hidden = true; });
  $('tourClose')?.addEventListener('click', () => { tourModal.hidden = true; });
  tourModal?.addEventListener('click', e => { if (e.target === tourModal) tourModal.hidden = true; });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && tourModal && !tourModal.hidden) tourModal.hidden = true; });

  // Device-aware 3D quality setting. Selection is stored locally; no analytics.
  const qualitySelect = $('visualQualitySelect');
  if (qualitySelect) {
    try { qualitySelect.value = localStorage.getItem('ktp_3d_quality_v1') || 'auto'; } catch (_) {}
    qualitySelect.addEventListener('change', () => {
      try { localStorage.setItem('ktp_3d_quality_v1', qualitySelect.value); } catch (_) {}
      window.dispatchEvent(new CustomEvent('ktp:visual-quality', { detail: { quality: qualitySelect.value } }));
      toast(`3D rendering quality set to ${qualitySelect.options[qualitySelect.selectedIndex].text}.`);
    });
  }

  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();state.deferredInstall=e;$('installButton').hidden=false;});
  $('installButton').addEventListener('click',async()=>{if(!state.deferredInstall){toast('Use your browser menu and choose “Install app” or “Add to Home screen”.');return;}state.deferredInstall.prompt();await state.deferredInstall.userChoice;state.deferredInstall=null;$('installButton').hidden=true;});
  if('serviceWorker' in navigator && (location.protocol==='https:' || location.hostname==='localhost' || location.hostname==='127.0.0.1')) {
    const appBase = new URL('./', document.baseURI);
    const workerUrl = new URL('sw.js', appBase);
    navigator.serviceWorker.register(workerUrl.href,{scope:appBase.pathname,updateViaCache:'none'}).then(reg=>reg.update().catch(()=>{})).catch(err=>console.warn('Offline app shell registration failed:',err));
  }
  window.addEventListener('offline',()=>toast('You are offline. Cached pages and included previews remain available. Map tiles and external links may be unavailable.'));
  window.addEventListener('online',()=>toast('Connection restored. TERRAPULSE is online.'));
  $('downloadMetadataButton').disabled=false;
  const originLabel=$('installOriginText');
  if(originLabel){originLabel.textContent=window.location.origin;originLabel.title=window.location.href;}
  const localOnlyHost=['localhost','127.0.0.1'].includes(window.location.hostname);
  if(localOnlyHost){console.info('Local preview only: install the phone PWA from the deployed HTTPS Cloudflare address.');}
  const requestedView=new URLSearchParams(window.location.search).get('view');
  if(requestedView && $('page-'+requestedView)) route(requestedView);
  updateLoadedUI();
  // Packaged scientific preview images and catalogue metadata load locally; no NASA download is triggered.
  loadPublishedEvidence();
})();
