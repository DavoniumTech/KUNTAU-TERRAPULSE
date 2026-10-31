/* KUNTAU TERRAPULSE v0.7.0 — immersive Earth-observation space stage.
   Decorative 3D scene only: it is not a live satellite tracker or a NISAR data layer. */
(() => {
  'use strict';
  const host = document.getElementById('spaceCanvas');
  const fallback = document.getElementById('cosmosCanvas');
  if (!host) return;

  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false;
  const smallScreen = () => window.matchMedia?.('(max-width: 760px)').matches || window.innerWidth < 760;
  const rand = (a, b) => a + Math.random() * (b - a);
  const choice = (() => { try { return localStorage.getItem('ktp_3d_quality_v1') || 'auto'; } catch (_) { return 'auto'; } })();
  const mobile = smallScreen();
  let quality = choice === 'auto' ? (mobile ? 'balanced' : 'cinematic') : choice;
  const qualityConfig = () => ({
    cinematic: { stars: 5200, dust: 980, motes: 210, fps: 50, ratio: 1.35, opacity: .78 },
    balanced:  { stars: mobile ? 1900 : 3400, dust: mobile ? 300 : 620, motes: mobile ? 42 : 96, fps: mobile ? 28 : 42, ratio: mobile ? 1.05 : 1.2, opacity: .68 },
    lite:      { stars: 900, dust: 140, motes: 24, fps: 24, ratio: .9, opacity: .42 }
  }[quality] || { stars: 3400, dust: 620, motes: 38, fps: 42, ratio: 1.2, opacity: .68 });

  // Lightweight 2D fallback stars keep the screen alive where WebGL is unavailable.
  if (fallback) {
    const ctx = fallback.getContext('2d');
    if (ctx) {
      let w = 0, h = 0, stars = [], frame = 0;
      const resize = () => {
        const d = Math.min(window.devicePixelRatio || 1, 1.2); w = innerWidth; h = innerHeight;
        fallback.width = Math.round(w * d); fallback.height = Math.round(h * d); ctx.setTransform(d, 0, 0, d, 0, 0);
        stars = Array.from({ length: smallScreen() ? 150 : 320 }, () => ({ x: rand(0, w), y: rand(0, h), r: rand(.35, 1.4), a: rand(.12, .58), p: rand(0, 6.28), v: rand(.018, .075) }));
      };
      resize(); window.addEventListener('resize', resize, { passive: true });
      const draw = () => {
        ctx.clearRect(0, 0, w, h);
        for (const s of stars) {
          s.p += .012; if (!reduceMotion) { s.y -= s.v; if (s.y < -2) s.y = h + 2; }
          ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(154,226,218,${s.a * (.62 + .38 * Math.sin(s.p))})`; ctx.fill();
        }
        if (!reduceMotion) frame = requestAnimationFrame(draw);
      };
      draw();
    }
  }
  if (!window.THREE) { document.documentElement.classList.add('space-fallback'); return; }

  const THREE = window.THREE;
  let renderer, scene, camera, raf = 0, resizeObserver, lastFrame = 0, disposed = false;
  let earthSystem, earth, clouds, starField, dustCloud, moteField, satellite, secondSatellite, orbitPlanet, moon, miniMoon, ringedPlanet, asteroidBelt, scanBeam;
  let earthTexture, cloudTexture, starMaterial, dustMaterial, config = qualityConfig();

  try {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(47, innerWidth / innerHeight, .1, 180);
    camera.position.set(0, 0, 15);
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !mobile, powerPreference: mobile ? 'low-power' : 'high-performance' });
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, config.ratio));
    renderer.setSize(innerWidth, innerHeight, false);
    renderer.setClearColor(0x000000, 0);
    if ('outputColorSpace' in renderer) renderer.outputColorSpace = THREE.SRGBColorSpace;
    if ('toneMapping' in renderer) { renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.15; }
    host.replaceChildren(renderer.domElement);
    document.documentElement.classList.add('three-space-ready');

    // Lighting and distant haze.
    scene.add(new THREE.AmbientLight(0x9cc9dc, 1.1));
    const keyLight = new THREE.DirectionalLight(0xffe4bd, 2.8); keyLight.position.set(-7, 6, 10); scene.add(keyLight);
    const blueRim = new THREE.PointLight(0x2b9ee9, 4.2, 45); blueRim.position.set(8, 2, 4); scene.add(blueRim);
    const warmRim = new THREE.PointLight(0xff7768, 1.4, 32); warmRim.position.set(5, -6, -2); scene.add(warmRim);
    const tealRim = new THREE.PointLight(0x42e0c1, 1.8, 28); tealRim.position.set(-8, -3, 0); scene.add(tealRim);

    // Soft nebula sprites add depth without large external images.
    const nebulaCanvas = document.createElement('canvas'); nebulaCanvas.width = nebulaCanvas.height = 256;
    const nctx = nebulaCanvas.getContext('2d');
    const nebulaTexture = (() => {
      const g = nctx.createRadialGradient(128, 128, 4, 128, 128, 126);
      g.addColorStop(0, 'rgba(64,173,181,.32)'); g.addColorStop(.35, 'rgba(62,108,166,.18)'); g.addColorStop(1, 'rgba(16,30,68,0)');
      nctx.fillStyle = g; nctx.fillRect(0, 0, 256, 256);
      return new THREE.CanvasTexture(nebulaCanvas);
    })();
    [
      [-6.2, 1.8, -8, 7.5, 4.2, 0x5c9fc0], [1.2, -4.4, -9, 8.2, 3.7, 0x4f9a87],
      [7.7, 3.7, -10, 6.6, 3.5, 0x7b70bb], [-3.2, -6.2, -9, 7.2, 3.2, 0xb26e69]
    ].forEach(([x, y, z, sx, sy, color]) => {
      const mat = new THREE.SpriteMaterial({ map: nebulaTexture, color, transparent: true, opacity: .42, depthWrite: false, blending: THREE.AdditiveBlending });
      const sprite = new THREE.Sprite(mat); sprite.position.set(x, y, z); sprite.scale.set(sx, sy, 1); scene.add(sprite);
    });

    // High-quality Earth surface. The texture is a bundled, compact NASA Blue Marble-derived base map.
    const texLoader = new THREE.TextureLoader();
    earthTexture = texLoader.load('assets/earth-blue-marble.jpg', undefined, undefined, () => {
      document.documentElement.classList.add('earth-texture-fallback');
    });
    earthTexture.colorSpace = THREE.SRGBColorSpace;
    earthTexture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    earthTexture.wrapS = THREE.RepeatWrapping;
    earthTexture.wrapT = THREE.ClampToEdgeWrapping;

    earthSystem = new THREE.Group(); scene.add(earthSystem);
    const earthGeo = new THREE.SphereGeometry(2.42, 96, 72);
    const earthMat = new THREE.MeshStandardMaterial({ map: earthTexture, color: 0xffffff, roughness: .94, metalness: .015 });
    earth = new THREE.Mesh(earthGeo, earthMat); earthSystem.add(earth);
    const grid = new THREE.Mesh(new THREE.SphereGeometry(2.438, 36, 24), new THREE.MeshBasicMaterial({ color: 0xb0f5f1, wireframe: true, transparent: true, opacity: .045, depthWrite: false })); earthSystem.add(grid);

    // Thin atmospheric shell with a fresnel-like rim.
    const atmosphereMat = new THREE.ShaderMaterial({
      transparent: true, side: THREE.BackSide, depthWrite: false,
      vertexShader: 'varying vec3 vNormal; varying vec3 vView; void main(){ vec4 mv=modelViewMatrix*vec4(position,1.0); vNormal=normalize(normalMatrix*normal); vView=normalize(-mv.xyz); gl_Position=projectionMatrix*mv; }',
      fragmentShader: 'varying vec3 vNormal; varying vec3 vView; void main(){ float rim=pow(1.0-max(dot(normalize(vNormal),normalize(vView)),0.0),2.6); gl_FragColor=vec4(0.19,0.77,0.91,rim*0.46); }'
    });
    earthSystem.add(new THREE.Mesh(new THREE.SphereGeometry(2.53, 64, 48), atmosphereMat));
    earthSystem.add(new THREE.Mesh(new THREE.SphereGeometry(2.67, 48, 32), new THREE.MeshBasicMaterial({ color: 0x298ed6, transparent: true, opacity: .035, side: THREE.BackSide, depthWrite: false })));

    // Independent cloud veil made procedurally; it is decorative, not weather data.
    const cloudCanvas = document.createElement('canvas'); cloudCanvas.width = 1024; cloudCanvas.height = 512;
    const cctx = cloudCanvas.getContext('2d'); cctx.clearRect(0, 0, 1024, 512);
    for (let i = 0; i < 260; i++) {
      const x = rand(0, 1024), y = rand(18, 494), rx = rand(10, 54), ry = rand(3, 12);
      const grad = cctx.createRadialGradient(x, y, 1, x, y, rx);
      grad.addColorStop(0, `rgba(221,245,248,${rand(.035,.12)})`); grad.addColorStop(1, 'rgba(221,245,248,0)');
      cctx.fillStyle = grad; cctx.beginPath(); cctx.ellipse(x, y, rx, ry, rand(-.4,.4), 0, Math.PI * 2); cctx.fill();
    }
    cloudTexture = new THREE.CanvasTexture(cloudCanvas); cloudTexture.colorSpace = THREE.SRGBColorSpace;
    clouds = new THREE.Mesh(new THREE.SphereGeometry(2.465, 64, 48), new THREE.MeshBasicMaterial({ map: cloudTexture, transparent: true, opacity: .47, depthWrite: false })); earthSystem.add(clouds);

    // Several orbital paths around the globe.
    const orbitDefs = [
      [3.05, .014, 0x75e1cc, .62, .16, .28, .5], [3.42, .008, 0x6aaee4, 1.12, .3, -.28, .32],
      [2.82, .006, 0xf0bf82, .28, .72, .85, .35], [3.72, .005, 0x9e91db, .83, -.5, .48, .22]
    ];
    orbitDefs.forEach(([radius, tube, color, rx, ry, rz, opacity]) => {
      const line = new THREE.Mesh(new THREE.TorusGeometry(radius, tube, 8, 260), new THREE.MeshBasicMaterial({ color, transparent: true, opacity, depthWrite: false }));
      line.rotation.set(rx, ry, rz); earthSystem.add(line);
    });

    // NISAR-inspired spacecraft model: gold bus, blue solar wings and large radar reflector.
    // This model is an illustration and not to engineering scale.
    const buildSatellite = (scale = 1) => {
      const group = new THREE.Group();
      const bus = new THREE.Mesh(new THREE.BoxGeometry(.46, .36, .38), new THREE.MeshStandardMaterial({ color: 0xd5b17d, metalness: .78, roughness: .25 })); group.add(bus);
      const busFace = new THREE.Mesh(new THREE.BoxGeometry(.39, .29, .025), new THREE.MeshStandardMaterial({ color: 0x243d4b, metalness: .4, roughness: .34, emissive: 0x092a3b, emissiveIntensity: .28 })); busFace.position.z = .205; group.add(busFace);
      const panelMat = new THREE.MeshStandardMaterial({ color: 0x174b83, metalness: .66, roughness: .3, emissive: 0x0b2e61, emissiveIntensity: .24, side: THREE.DoubleSide });
      for (const side of [-1, 1]) {
        const wing = new THREE.Group(); wing.position.x = side * .98;
        const panel = new THREE.Mesh(new THREE.BoxGeometry(1.15, .54, .035), panelMat); wing.add(panel);
        const frame = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1.15, .54, .04)), new THREE.LineBasicMaterial({ color: 0x9cd7f0, transparent: true, opacity: .75 })); wing.add(frame);
        for (let k = -3; k <= 3; k++) { const stripe = new THREE.Mesh(new THREE.BoxGeometry(.014, .54, .042), new THREE.MeshBasicMaterial({ color: 0x8ac7e8 })); stripe.position.x = k * .16; wing.add(stripe); }
        group.add(wing);
      }
      const dishGroup = new THREE.Group(); dishGroup.position.set(.04, -.53, -.06); dishGroup.rotation.set(-.22, .14, .18);
      const reflector = new THREE.Mesh(new THREE.SphereGeometry(.68, 36, 22, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0xc6d7d6, metalness: .78, roughness: .24, side: THREE.DoubleSide, wireframe: true }));
      reflector.scale.set(1, .18, 1); dishGroup.add(reflector);
      const rim = new THREE.Mesh(new THREE.TorusGeometry(.68, .025, 8, 72), new THREE.MeshStandardMaterial({ color: 0xe1c48f, metalness: .82, roughness: .26 })); rim.rotation.x = Math.PI / 2; dishGroup.add(rim);
      const mast = new THREE.Mesh(new THREE.CylinderGeometry(.018, .024, .54, 10), new THREE.MeshStandardMaterial({ color: 0xc8d5d0, metalness: .78, roughness: .3 })); mast.position.y = .24; dishGroup.add(mast);
      for (let i = 0; i < 8; i++) { const a = (Math.PI * 2 * i) / 8; const spoke = new THREE.Mesh(new THREE.CylinderGeometry(.008, .008, .66, 6), new THREE.MeshBasicMaterial({ color: 0xd9e6e1 })); spoke.position.set(Math.cos(a) * .34, .1, Math.sin(a) * .34); spoke.rotation.z = Math.PI / 2; spoke.rotation.y = a; dishGroup.add(spoke); }
      group.add(dishGroup);
      const antenna = new THREE.Mesh(new THREE.ConeGeometry(.09, .2, 20), new THREE.MeshStandardMaterial({ color: 0xd1ad79, metalness: .7, roughness: .3 })); antenna.position.y = -.34; antenna.rotation.x = Math.PI; group.add(antenna);
      group.scale.setScalar(scale);
      return group;
    };
    satellite = buildSatellite(.92); scene.add(satellite);
    secondSatellite = buildSatellite(.34); scene.add(secondSatellite); secondSatellite.rotation.set(.7, .3, -.2);

    // Orbital bodies, tiny moons, ringed planet and a sparse asteroid belt.
    const sunGroup = new THREE.Group(); sunGroup.position.set(-5.8, 3.4, -4); scene.add(sunGroup);
    sunGroup.add(new THREE.Mesh(new THREE.SphereGeometry(.62, 36, 28), new THREE.MeshBasicMaterial({ color: 0xffcc83 })));
    sunGroup.add(new THREE.Mesh(new THREE.IcosahedronGeometry(.82, 2), new THREE.MeshBasicMaterial({ color: 0xf5a36d, wireframe: true, transparent: true, opacity: .48 })));
    sunGroup.add(new THREE.Mesh(new THREE.SphereGeometry(1.05, 30, 24), new THREE.MeshBasicMaterial({ color: 0xffa26c, transparent: true, opacity: .07, side: THREE.BackSide })));
    orbitPlanet = new THREE.Mesh(new THREE.SphereGeometry(.34, 32, 24), new THREE.MeshStandardMaterial({ color: 0x8d87c6, roughness: .78 })); scene.add(orbitPlanet);
    moon = new THREE.Mesh(new THREE.SphereGeometry(.19, 24, 18), new THREE.MeshStandardMaterial({ color: 0xd7dedc, roughness: .96 })); scene.add(moon);
    miniMoon = new THREE.Mesh(new THREE.SphereGeometry(.085, 16, 12), new THREE.MeshStandardMaterial({ color: 0xd7a57a, roughness: .92 })); scene.add(miniMoon);
    ringedPlanet = new THREE.Group();
    ringedPlanet.add(new THREE.Mesh(new THREE.SphereGeometry(.43, 32, 24), new THREE.MeshStandardMaterial({ color: 0xb68c6c, roughness: .78 })));
    const rpRing = new THREE.Mesh(new THREE.TorusGeometry(.68, .045, 8, 88), new THREE.MeshBasicMaterial({ color: 0xe3c08e, transparent: true, opacity: .72 })); rpRing.rotation.x = 1.15; ringedPlanet.add(rpRing);
    const rpRing2 = new THREE.Mesh(new THREE.TorusGeometry(.86, .012, 6, 88), new THREE.MeshBasicMaterial({ color: 0x9c8bd1, transparent: true, opacity: .5 })); rpRing2.rotation.x = 1.15; ringedPlanet.add(rpRing2); scene.add(ringedPlanet);

    const asteroidCount = mobile ? 90 : 220, asteroidPositions = new Float32Array(asteroidCount * 3), asteroidSizes = [];
    for (let i = 0; i < asteroidCount; i++) {
      const angle = Math.random() * Math.PI * 2, radius = rand(8.5, 12.7);
      asteroidPositions[i * 3] = Math.cos(angle) * radius;
      asteroidPositions[i * 3 + 1] = rand(-2.6, 2.6);
      asteroidPositions[i * 3 + 2] = rand(-9, -3.4);
      asteroidSizes.push(rand(.018, .048));
    }
    const asteroidGeo = new THREE.BufferGeometry(); asteroidGeo.setAttribute('position', new THREE.BufferAttribute(asteroidPositions, 3));
    const asteroidMaterial = new THREE.PointsMaterial({ color: 0xd7c09a, size: .045, transparent: true, opacity: .56, sizeAttenuation: true, depthWrite: false });
    asteroidBelt = new THREE.Points(asteroidGeo, asteroidMaterial); scene.add(asteroidBelt);

    // Dense pin-star field and smaller moving dust grains.
    const starCount = config.stars, starPositions = new Float32Array(starCount * 3), starColors = new Float32Array(starCount * 3), starPhase = new Float32Array(starCount);
    for (let i = 0; i < starCount; i++) {
      const k = i * 3, tint = Math.random();
      starPositions[k] = rand(-39, 39); starPositions[k + 1] = rand(-25, 25); starPositions[k + 2] = rand(-38, -7);
      starColors[k] = tint > .9 ? .95 : tint > .72 ? .54 : .38;
      starColors[k + 1] = tint > .86 ? .74 : .86; starColors[k + 2] = 1;
      starPhase[i] = rand(0, Math.PI * 2);
    }
    const starGeo = new THREE.BufferGeometry(); starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3)); starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    starMaterial = new THREE.PointsMaterial({ size: mobile ? .055 : .068, vertexColors: true, transparent: true, opacity: config.opacity, sizeAttenuation: true, depthWrite: false });
    starField = new THREE.Points(starGeo, starMaterial); scene.add(starField);

    const dustCount = config.dust, dust = new Float32Array(dustCount * 3), dustVelocity = new Float32Array(dustCount), dustPhase = new Float32Array(dustCount);
    for (let i = 0; i < dustCount; i++) { dust[i * 3] = rand(-15, 15); dust[i * 3 + 1] = rand(-9, 9); dust[i * 3 + 2] = rand(-3, 5); dustVelocity[i] = rand(.0006, .003); dustPhase[i] = rand(0, Math.PI * 2); }
    const dustGeo = new THREE.BufferGeometry(); dustGeo.setAttribute('position', new THREE.BufferAttribute(dust, 3));
    dustMaterial = new THREE.PointsMaterial({ color: 0x8ce7da, size: mobile ? .032 : .042, transparent: true, opacity: .58, sizeAttenuation: true, depthWrite: false, blending: THREE.AdditiveBlending });
    dustCloud = new THREE.Points(dustGeo, dustMaterial); scene.add(dustCloud);

    // Small glowing 3D motes drift at different depths to make the space environment feel alive.
    const moteCount = config.motes, moteGeo = new THREE.SphereGeometry(.026, 8, 8);
    const moteMat = new THREE.MeshBasicMaterial({ color: 0xa8f0df, transparent: true, opacity: .74 });
    moteField = new THREE.InstancedMesh(moteGeo, moteMat, moteCount);
    const motePositions = new Float32Array(moteCount * 3), moteSpeeds = new Float32Array(moteCount), motePhases = new Float32Array(moteCount), moteScales = new Float32Array(moteCount);
    const moteDummy = new THREE.Object3D();
    for (let i = 0; i < moteCount; i++) {
      const k = i * 3; motePositions[k] = rand(-13, 13); motePositions[k + 1] = rand(-8, 8); motePositions[k + 2] = rand(-10, 4);
      moteSpeeds[i] = rand(.0009, .0038); motePhases[i] = rand(0, Math.PI * 2); moteScales[i] = rand(.35, 1.65);
      moteDummy.position.set(motePositions[k], motePositions[k + 1], motePositions[k + 2]); moteDummy.scale.setScalar(moteScales[i]); moteDummy.updateMatrix(); moteField.setMatrixAt(i, moteDummy.matrix);
    }
    moteField.instanceMatrix.needsUpdate = true; scene.add(moteField);

    // A soft radar sweep line follows the primary satellite; it is an animation, not a real observation.
    const beamGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -2.2, 0)]);
    scanBeam = new THREE.Line(beamGeo, new THREE.LineDashedMaterial({ color: 0x7ee1d4, dashSize: .12, gapSize: .08, transparent: true, opacity: .5 })); scene.add(scanBeam);

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    if (!mobile) window.addEventListener('pointermove', e => { pointer.tx = (e.clientX / innerWidth - .5) * .55; pointer.ty = -(e.clientY / innerHeight - .5) * .32; }, { passive: true });
    const resize = () => {
      const w = Math.max(1, innerWidth), h = Math.max(1, innerHeight); camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h, false);
      const small = smallScreen(); earthSystem.position.set(small ? 1.48 : 4.65, small ? -1.1 : -.16, -1.95); earthSystem.scale.setScalar(small ? .78 : 1.08);
      sunGroup.position.set(small ? -3.2 : -5.8, small ? 3.5 : 3.4, -4);
      if (small) { camera.position.z = 16.2; } else { camera.position.z = 15; }
    };
    if (window.ResizeObserver) { resizeObserver = new ResizeObserver(resize); resizeObserver.observe(document.documentElement); } else window.addEventListener('resize', resize, { passive: true });
    resize();

    let t0 = performance.now();
    const clock = new THREE.Clock();
    const frameInterval = 1000 / config.fps;
    const animate = (now = performance.now()) => {
      if (disposed) return;
      raf = requestAnimationFrame(animate);
      if (document.hidden || now - lastFrame < frameInterval) return;
      lastFrame = now; const t = clock.getElapsedTime();
      if (!reduceMotion) {
        pointer.x += (pointer.tx - pointer.x) * .022; pointer.y += (pointer.ty - pointer.y) * .022;
        camera.position.x = pointer.x; camera.position.y = pointer.y; camera.lookAt(0, 0, 0);
        earth.rotation.y = t * .055; grid.rotation.y = -t * .018; clouds.rotation.y = t * .075;
        const orbit = t * .34;
        satellite.position.set(earthSystem.position.x + Math.cos(orbit) * 3.2, earthSystem.position.y + Math.sin(orbit) * 1.58, Math.sin(orbit) * .5);
        satellite.rotation.set(.26, Math.sin(t * .22) * .34, -.38 + Math.sin(orbit) * .18);
        secondSatellite.position.set(earthSystem.position.x + Math.cos(-t * .24 + 2.2) * 3.9, earthSystem.position.y + Math.sin(-t * .24 + 2.2) * 2.1, -2.4 + Math.sin(t * .18) * .6);
        secondSatellite.rotation.set(.5, t * .18, .22);
        const beamStart = satellite.position.clone().add(new THREE.Vector3(0, -.42, 0)); const beamEnd = earthSystem.position.clone().add(new THREE.Vector3(.12, .1, 0));
        scanBeam.geometry.setFromPoints([beamStart, beamEnd]); scanBeam.computeLineDistances(); scanBeam.material.opacity = .28 + .2 * (1 + Math.sin(t * 2.2));
        orbitPlanet.position.set(-2.5 + Math.cos(t * .22) * .9, 1.9 + Math.sin(t * .22) * .52, -3.4); orbitPlanet.rotation.y = t * .32;
        moon.position.set(earthSystem.position.x + Math.cos(t * .3) * 3.8, earthSystem.position.y + Math.sin(t * .3) * 2.4, -1.4);
        miniMoon.position.set(earthSystem.position.x + Math.cos(t * .52 + 2) * 2.9, earthSystem.position.y + Math.sin(t * .52 + 2) * 1.7, -.8);
        ringedPlanet.position.set(earthSystem.position.x + Math.cos(t * .17 + 3) * 4.5, -2.7 + Math.sin(t * .17 + 3) * .8, -3.5); ringedPlanet.rotation.y = t * .12;
        starField.rotation.y = t * .003; dustCloud.rotation.y = -t * .018; asteroidBelt.rotation.y = t * .016; sunGroup.rotation.y = t * .08;
        const dp = dustGeo.attributes.position.array;
        for (let i = 0; i < dustCount; i++) { dp[i * 3 + 1] += dustVelocity[i] * 2; dp[i * 3] += Math.sin(t * .3 + dustPhase[i]) * .0007; if (dp[i * 3 + 1] > 9.5) dp[i * 3 + 1] = -9.5; }
        dustGeo.attributes.position.needsUpdate = true;
        for (let i = 0; i < moteCount; i++) {
          const k = i * 3; motePositions[k + 1] += moteSpeeds[i] * 2.2;
          motePositions[k] += Math.sin(t * .45 + motePhases[i]) * .0015;
          if (motePositions[k + 1] > 9) motePositions[k + 1] = -9;
          moteDummy.position.set(motePositions[k], motePositions[k + 1], motePositions[k + 2]);
          const twinkle = moteScales[i] * (.78 + .22 * Math.sin(t * 1.6 + motePhases[i]));
          moteDummy.scale.setScalar(twinkle); moteDummy.updateMatrix(); moteField.setMatrixAt(i, moteDummy.matrix);
        }
        moteField.instanceMatrix.needsUpdate = true;
        starMaterial.opacity = config.opacity * (.88 + .12 * Math.sin(t * .7));
      }
      renderer.render(scene, camera);
    };
    if (reduceMotion) { camera.lookAt(0, 0, 0); renderer.render(scene, camera); }
    else raf = requestAnimationFrame(animate);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else if (!reduceMotion && !disposed) { clock.start(); raf = requestAnimationFrame(animate); }
    });
    window.addEventListener('ktp:visual-quality', e => {
      quality = e.detail?.quality || quality; config = qualityConfig();
      starMaterial.opacity = config.opacity; starMaterial.size = quality === 'cinematic' ? .072 : quality === 'lite' ? .045 : .06;
      dustMaterial.opacity = quality === 'lite' ? .28 : quality === 'cinematic' ? .72 : .58;
      dustMaterial.size = quality === 'lite' ? .026 : quality === 'cinematic' ? .048 : .038;
      moteField.scale.setScalar(quality === 'lite' ? .78 : quality === 'cinematic' ? 1.18 : 1);
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, config.ratio)); renderer.setSize(innerWidth, innerHeight, false);
    });
    renderer.domElement.addEventListener('webglcontextlost', e => {
      e.preventDefault(); cancelAnimationFrame(raf); document.documentElement.classList.remove('three-space-ready'); document.documentElement.classList.add('space-fallback');
    }, { passive: false });
    window.addEventListener('pagehide', () => {
      disposed = true; cancelAnimationFrame(raf); resizeObserver?.disconnect(); renderer?.dispose();
      earthGeo.dispose(); earthMat.dispose(); earthTexture?.dispose(); cloudTexture?.dispose(); nebulaTexture?.dispose(); starGeo.dispose(); dustGeo.dispose(); asteroidGeo.dispose(); moteGeo.dispose(); moteMat.dispose();
    }, { once: true });
  } catch (err) {
    console.warn('KTP 3D stage unavailable; lightweight starfield fallback enabled.', err);
    cancelAnimationFrame(raf); try { renderer?.dispose(); } catch (_) {}
    host.replaceChildren(); document.documentElement.classList.remove('three-space-ready'); document.documentElement.classList.add('space-fallback');
  }
})();
