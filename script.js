// script.js
console.log("Script execution started");
document.addEventListener('DOMContentLoaded', () => {
    // --- 1. SPA Navigation Logic ---
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const cloudOverlay = document.getElementById('cloud-overlay');
    
    let currentSlide = 0;
    const totalSlides = slides.length;

    function updateNav() {
        slides.forEach((slide, index) => {
            if (index === currentSlide) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });

        prevBtn.disabled = currentSlide === 0;
        nextBtn.disabled = currentSlide === totalSlides - 1;
    }

    let isAnimating = false;

    function goToNextSlide() {
        if (isAnimating || currentSlide >= totalSlides - 1) return;
        
        isAnimating = true;
        if (currentSlide === 0) {
            // Trigger cloud transition from slide 1
            cloudOverlay.classList.add('active');
            setTimeout(() => {
                currentSlide++;
                updateNav();
                cloudOverlay.style.opacity = '0';
                setTimeout(() => {
                    cloudOverlay.classList.remove('active');
                    cloudOverlay.style.opacity = '1';
                    isAnimating = false;
                }, 1000);
            }, 800); // switch slide at peak of cloud
        } else if (currentSlide === 1) {
            // Card Scatter transition from slide 2 to 3
            const grid = document.querySelector('#slide-2 .model-grid');
            grid.classList.add('scattering');
            setTimeout(() => {
                currentSlide++;
                updateNav();
                // Remove class after slide has faded out
                setTimeout(() => grid.classList.remove('scattering'), 1200);
                isAnimating = false;
            }, 1200);
        } else if (currentSlide === 2) {
            // Cyberpunk Glitch transition from slide 3 to 4
            const slide3 = document.getElementById('slide-3');
            slide3.classList.add('glitching');
            setTimeout(() => {
                currentSlide++;
                updateNav();
                slide3.classList.remove('glitching');
                isAnimating = false;
            }, 400);
        } else {
            currentSlide++;
            updateNav();
            isAnimating = false;
        }
    }

    function goToPrevSlide() {
        if (isAnimating || currentSlide <= 0) return;
        currentSlide--;
        updateNav();
    }

    nextBtn.addEventListener('click', goToNextSlide);
    prevBtn.addEventListener('click', goToPrevSlide);

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' || e.code === 'ArrowRight') {
            goToNextSlide();
        } else if (e.code === 'ArrowLeft') {
            goToPrevSlide();
        }
    });

    updateNav();

    // --- 2. Slide 1: Three.js Intro (OpenClaw Mock) ---
    function initThreeJS() {
        if (typeof THREE === 'undefined') {
            console.log("THREE not yet defined, waiting...");
            setTimeout(initThreeJS, 100);
            return;
        }
        
        console.log("Initializing Three.js...");
        try {
            const container = document.getElementById('canvas-container');
            if (!container) {
                console.error("Canvas container not found!");
                return;
            }
            
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            
            renderer.setSize(container.clientWidth, container.clientHeight);
            container.appendChild(renderer.domElement);
            console.log("Renderer appended to container.");

            // Create a group to hold everything
            const headGroup = new THREE.Group();
            headGroup.scale.set(4, 4, 4);
            scene.add(headGroup);

            // 1. Body (Red)
            const bodyGeo = new THREE.SphereGeometry(2, 32, 32);
            const bodyMat = new THREE.MeshPhongMaterial({ color: 0xda3732 });
            const body = new THREE.Mesh(bodyGeo, bodyMat);
            headGroup.add(body);

            // 2. Eyes
            const eyeGeo = new THREE.SphereGeometry(0.35, 16, 16);
            const eyeMat = new THREE.MeshBasicMaterial({ color: 0x0a0a0a });
            const tealGeo = new THREE.SphereGeometry(0.18, 16, 16);
            const tealMat = new THREE.MeshBasicMaterial({ color: 0x00ffd8 });

            const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
            leftEye.position.set(-0.8, 0.4, 1.7);
            const leftTeal = new THREE.Mesh(tealGeo, tealMat);
            leftTeal.position.set(-0.8, 0.4, 1.95);
            
            const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
            rightEye.position.set(0.8, 0.4, 1.7);
            const rightTeal = new THREE.Mesh(tealGeo, tealMat);
            rightTeal.position.set(0.8, 0.4, 1.95);

            headGroup.add(leftEye, leftTeal, rightEye, rightTeal);

            // 3. Antennae
            const antGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.8, 8);
            const antL = new THREE.Mesh(antGeo, bodyMat);
            antL.position.set(-0.7, 2.1, 0);
            antL.rotation.z = 0.4;
            const antR = new THREE.Mesh(antGeo, bodyMat);
            antR.position.set(0.7, 2.1, 0);
            antR.rotation.z = -0.4;
            headGroup.add(antL, antR);

            // 4. Claws
            const clawGeo = new THREE.SphereGeometry(0.6, 16, 16);
            const clawL = new THREE.Mesh(clawGeo, bodyMat);
            clawL.position.set(-2.1, 0, 0);
            clawL.scale.set(1.3, 0.8, 1);
            const clawR = new THREE.Mesh(clawGeo, bodyMat);
            clawR.position.set(2.1, 0, 0);
            clawR.scale.set(1.3, 0.8, 1);
            headGroup.add(clawL, clawR);

            // 5. Legs
            const legGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.8, 8);
            const legL = new THREE.Mesh(legGeo, bodyMat);
            legL.position.set(-0.6, -1.9, 0);
            const legR = new THREE.Mesh(legGeo, bodyMat);
            legR.position.set(0.6, -1.9, 0);
            headGroup.add(legL, legR);

            // Lighting
            scene.add(new THREE.AmbientLight(0xffffff, 0.8));
            const dl = new THREE.DirectionalLight(0xffffff, 1);
            dl.position.set(5, 5, 10);
            scene.add(dl);

            camera.position.set(0, 0, 15);
            camera.lookAt(0, 0, 0);

            // Click-to-squish interaction
            container.addEventListener('mousedown', () => headGroup.scale.set(4.8, 3.2, 4.8));
            container.addEventListener('mouseup', () => headGroup.scale.set(4, 4, 4));
            container.addEventListener('mouseleave', () => headGroup.scale.set(4, 4, 4));

            function animate() {
                requestAnimationFrame(animate);
                
                // Smooth, continuous, pseudo-random rotation using time
                const time = Date.now() * 0.001;
                const targetRotX = Math.sin(time * 0.5) * 0.3 + Math.cos(time * 0.8) * 0.2;
                const targetRotY = Math.cos(time * 0.4) * 0.4 + Math.sin(time * 0.7) * 0.3;
                
                headGroup.rotation.y += (targetRotY - headGroup.rotation.y) * 0.05;
                headGroup.rotation.x += (targetRotX - headGroup.rotation.x) * 0.05;
                
                headGroup.scale.x += (4 - headGroup.scale.x) * 0.1;
                headGroup.scale.y += (4 - headGroup.scale.y) * 0.1;
                headGroup.scale.z += (4 - headGroup.scale.z) * 0.1;
                
                renderer.render(scene, camera);
            }
            animate();

            window.addEventListener('resize', () => {
                camera.aspect = container.clientWidth / container.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(container.clientWidth, container.clientHeight);
            });
            console.log("Three.js initialization complete.");
        } catch (e) {
            console.error("Three.js Error:", e);
        }
    }
    initThreeJS();

    // --- 3. Slide 3: QWOP Logic ---
    const character = document.getElementById('qwop-character');
    const coachBtn = document.getElementById('btn-coach');

    if (character && coachBtn) {
        let runTimeout;
        let runMoveInterval;
        let flailTimers = [];
        let charX = 10;

        const head       = character.querySelector('.head');
        const torso      = character.querySelector('.torso');
        const thighL     = character.querySelector('.left-leg .thigh');
        const calfL      = character.querySelector('.left-leg .calf');
        const thighR     = character.querySelector('.right-leg .thigh');
        const calfR      = character.querySelector('.right-leg .calf');
        const upperArmL  = character.querySelector('.left-arm .upper-arm');
        const forearmL   = character.querySelector('.left-arm .forearm');
        const upperArmR  = character.querySelector('.right-arm .upper-arm');
        const forearmR   = character.querySelector('.right-arm .forearm');
        const limbs      = [head, torso, thighL, calfL, thighR, calfR, upperArmL, forearmL, upperArmR, forearmR];

        function rand(min, max) { return min + Math.random() * (max - min); }

        function stopFlailTimers() {
            flailTimers.forEach(id => clearTimeout(id));
            flailTimers = [];
        }

        // Each limb twitches on its own independent random schedule
        function twitch(el, minDeg, maxDeg, minMs, maxMs) {
            function fire() {
                if (!character.classList.contains('flailing')) return;
                el.style.transform = `rotate(${rand(minDeg, maxDeg).toFixed(1)}deg)`;
                flailTimers.push(setTimeout(fire, rand(minMs, maxMs)));
            }
            // Stagger start so limbs don't all move in sync
            flailTimers.push(setTimeout(fire, rand(0, 150)));
        }

        function startFlailingTimers() {
            stopFlailTimers();
            twitch(head,      -30,  30, 100, 500);
            twitch(torso,     -40,  70,  90, 420);
            twitch(thighL,    -90, 110,  55, 300);
            twitch(calfL,       5, 145,  65, 280);
            twitch(thighR,    -85, 105,  70, 340);
            twitch(calfR,      10, 135,  80, 310);
            twitch(upperArmL, -80, 100,  60, 360);
            twitch(forearmL,    0, 120,  70, 290);
            twitch(upperArmR, -95, 110,  75, 330);
            twitch(forearmR,    0, 130,  65, 310);
        }

        function fallOver() {
            // Keep 'flailing' class so twitchers keep running — body still writhes on the floor
            character.className = 'character flailing fallen';
            character.style.transform = 'translateY(40px) rotate(80deg)';
        }

        function startFlailing() {
            stopFlailTimers();
            stopRunning();
            clearTimeout(runTimeout);
            character.className = 'character flailing';
            character.style.transform = '';
            startFlailingTimers();
            runTimeout = setTimeout(fallOver, rand(1200, 1900));
        }

        function clearLimbTransforms() {
            limbs.forEach(el => el.style.transform = '');
        }

        function stopRunning() {
            clearInterval(runMoveInterval);
            runMoveInterval = null;
        }

        coachBtn.addEventListener('click', () => {
            stopFlailTimers();
            stopRunning();
            clearTimeout(runTimeout);
            clearLimbTransforms();
            character.style.transform = '';
            character.className = 'character running';

            // Move forward continuously — ~0.35% per 16ms ≈ ~21%/s, matches 0.5s leg cycle
            runMoveInterval = setInterval(() => {
                charX += 0.35;
                if (charX > 90) charX = 10;
                character.style.left = `${charX}%`;
            }, 16);

            // After coaching fades, drift back to flailing
            runTimeout = setTimeout(() => {
                stopRunning();
                startFlailing();
            }, 600);
        });

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.target.id === 'slide-3') {
                    if (mutation.target.classList.contains('active')) {
                        charX = 10;
                        character.style.left = `${charX}%`;
                        startFlailing();
                    } else {
                        stopFlailTimers();
                        stopRunning();
                        clearTimeout(runTimeout);
                        clearLimbTransforms();
                        character.style.transform = '';
                        character.className = 'character flailing';
                    }
                }
            });
        });

        observer.observe(document.getElementById('slide-3'), { attributes: true, attributeFilter: ['class'] });
    }

    // --- 4. Slide 4: Evaluation Logic ---
    const btnRelease = document.getElementById('btn-release');
    const evalFeedback = document.getElementById('eval-feedback');
    const cage = document.getElementById('the-cage');
    const basilisk = document.getElementById('the-basilisk');
    const eyes = document.querySelector('.basilisk-eyes');

    if (btnRelease) {
        btnRelease.addEventListener('click', () => {
            evalFeedback.classList.remove('hidden');
            evalFeedback.innerHTML = "<span style='color: #ef4444;'>Without your evaluation, the agent slithers out of control.</span>";
            evalFeedback.style.backgroundColor = "rgba(239, 68, 68, 0.1)";
            evalFeedback.style.border = "1px solid #ef4444";
            
            // Trigger animation
            if (cage && basilisk && eyes) {
                cage.classList.add('open');
                eyes.style.opacity = '0';
                setTimeout(() => {
                    basilisk.classList.add('moving');
                }, 500);
            }
            
            btnRelease.disabled = true;
            btnRelease.textContent = "Agent Released";
        });
        
        // Reset when leaving slide
        const observerEval = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.target.id === 'slide-4' && !mutation.target.classList.contains('active')) {
                    evalFeedback.classList.add('hidden');
                    if (cage && basilisk && eyes) {
                        cage.classList.remove('open');
                        eyes.style.opacity = '1';
                        basilisk.classList.remove('moving');
                    }
                    btnRelease.disabled = false;
                    btnRelease.textContent = "Release the Agent";
                }
            });
        });
        observerEval.observe(document.getElementById('slide-4'), { attributes: true, attributeFilter: ['class'] });
    }
});