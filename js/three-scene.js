/**
 * Three-scene.js - Three.js 3D scenes and animations
 * Creates interactive 3D elements and animations for various sections of the website
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize 3D scenes based on page content
    if (document.getElementById('hero-3d-container')) {
        initHeroScene();
    }
    
    if (document.getElementById('loading-3d-container')) {
        initLoadingScene();
    }
    
    if (document.getElementById('map-3d-container')) {
        initMapScene();
    }
});

// Hero section 3D scene
function initHeroScene() {
    const container = document.getElementById('hero-3d-container');
    if (!container || typeof THREE === 'undefined') return;
    
    let scene, camera, renderer;
    let buildings = [];
    let frameId;
    let raycaster, mouse, hoveredBuilding;
    let buildingModel, mixer, buildingClock;
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;
    
    // Scene setup
    function init() {
        // Create scene
        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x000000, 0.002);
        
        // Camera setup
        camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.set(0, 15, 30);
        camera.lookAt(0, 0, 0);
        
        // Renderer setup
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);
        
        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 7);
        scene.add(directionalLight);
        
        const pointLight = new THREE.PointLight(0xff9900, 1, 50);
        pointLight.position.set(-5, 10, 5);
        scene.add(pointLight);
        
        // Ground plane
        const groundGeometry = new THREE.PlaneGeometry(100, 100);
        const groundMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x333333,
            roughness: 0.8,
            metalness: 0.2,
            transparent: true,
            opacity: 0.5
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -2;
        ground.receiveShadow = true;
        scene.add(ground);
        
        // Grid helper
        const gridHelper = new THREE.GridHelper(100, 50, 0x444444, 0x222222);
        gridHelper.position.y = -1.99;
        scene.add(gridHelper);
        
        // Load 3D building model or create one if loading fails
        loadBuildingModel();
        
        // Create skyline buildings in the background
        createSkylineBuildings();
        
        // Setup raycaster for interactivity
        raycaster = new THREE.Raycaster();
        mouse = new THREE.Vector2();
        
        // Event listeners
        window.addEventListener('resize', onWindowResize);
        container.addEventListener('mousemove', onMouseMove);
        
        // Initialize clock for animations
        buildingClock = new THREE.Clock();
        
        // Start animation loop
        animate();
    }
    
    // Load 3D building model
    function loadBuildingModel() {
        // Using GLTFLoader to load a model
        // Example model needs to be in your assets folder
        // If loading fails, create a fallback building
        
        try {
            // Try to load GLTF model if available
            const loader = new THREE.GLTFLoader();
            loader.load('assets/models/modern_building.glb', 
                // onLoad callback
                function(gltf) {
                    buildingModel = gltf.scene;
                    buildingModel.scale.set(5, 5, 5);
                    buildingModel.position.set(0, -2, 0);
                    
                    // Setup model materials and shadows
                    buildingModel.traverse(function(child) {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                            child.material.metalness = 0.4;
                            child.material.roughness = 0.6;
                        }
                    });
                    
                    scene.add(buildingModel);
                    
                    // Setup animation mixer if model has animations
                    if (gltf.animations && gltf.animations.length) {
                        mixer = new THREE.AnimationMixer(buildingModel);
                        const clip = gltf.animations[0];
                        const action = mixer.clipAction(clip);
                        action.play();
                    }
                },
                // onProgress callback
                function(xhr) {
                    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                },
                // onError callback
                function(error) {
                    console.error('Error loading model:', error);
                    // Create fallback building if model loading fails
                    createFallbackBuilding();
                }
            );
        } catch (error) {
            console.error('Error with GLTF loader, using fallback:', error);
            // Create fallback building
            createFallbackBuilding();
        }
    }
    
    // Create fallback building if 3D model can't be loaded
    function createFallbackBuilding() {
        const buildingGroup = new THREE.Group();
        
        // Main building tower
        const towerGeometry = new THREE.BoxGeometry(10, 20, 10);
        const towerMaterial = new THREE.MeshPhongMaterial({
            color: 0x778899,
            transparent: true,
            opacity: 0.9,
            shininess: 50,
            specular: 0x111111
        });
        const tower = new THREE.Mesh(towerGeometry, towerMaterial);
        tower.position.y = 10;
        tower.castShadow = true;
        tower.receiveShadow = true;
        buildingGroup.add(tower);
        
        // Glass panels on building
        const glassGeometry = new THREE.PlaneGeometry(9.5, 19.5);
        const glassMaterial = new THREE.MeshPhongMaterial({
            color: 0x88ccee,
            transparent: true,
            opacity: 0.5,
            shininess: 100,
            specular: 0xffffff,
            side: THREE.DoubleSide
        });
        
        // Front glass
        const frontGlass = new THREE.Mesh(glassGeometry, glassMaterial);
        frontGlass.position.set(0, 10, 5.01);
        buildingGroup.add(frontGlass);
        
        // Back glass
        const backGlass = new THREE.Mesh(glassGeometry, glassMaterial);
        backGlass.position.set(0, 10, -5.01);
        buildingGroup.add(backGlass);
        
        // Left glass
        const leftGlass = new THREE.Mesh(glassGeometry, glassMaterial);
        leftGlass.rotation.y = Math.PI / 2;
        leftGlass.position.set(-5.01, 10, 0);
        buildingGroup.add(leftGlass);
        
        // Right glass
        const rightGlass = new THREE.Mesh(glassGeometry, glassMaterial);
        rightGlass.rotation.y = Math.PI / 2;
        rightGlass.position.set(5.01, 10, 0);
        buildingGroup.add(rightGlass);
        
        // Base of building
        const baseGeometry = new THREE.BoxGeometry(16, 4, 16);
        const baseMaterial = new THREE.MeshPhongMaterial({
            color: 0x555555,
            shininess: 30
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = -2;
        base.castShadow = true;
        base.receiveShadow = true;
        buildingGroup.add(base);
        
        // Roof accent
        const roofGeometry = new THREE.CylinderGeometry(2, 2, 4, 8);
        const roofMaterial = new THREE.MeshPhongMaterial({
            color: 0xf9b000,
            shininess: 80
        });
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.y = 22;
        roof.castShadow = true;
        buildingGroup.add(roof);
        
        // Add windows to the building
        addBuildingWindows(buildingGroup);
        
        buildingModel = buildingGroup;
        scene.add(buildingGroup);
    }
    
    // Add windows to the fallback building
    function addBuildingWindows(buildingGroup) {
        const windowGeometry = new THREE.PlaneGeometry(1, 1);
        const windowMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffcc,
            transparent: true,
            opacity: 0.7,
            shininess: 100,
            specular: 0xffffff,
            side: THREE.DoubleSide
        });
        
        // Add windows in a grid pattern to all sides
        for (let i = -4; i <= 4; i += 2) {
            for (let j = 0; j <= 6; j += 2) {
                // Front windows
                const frontWindow = new THREE.Mesh(windowGeometry, windowMaterial);
                frontWindow.position.set(i, j + 6, 5.02);
                buildingGroup.add(frontWindow);
                
                // Back windows
                const backWindow = new THREE.Mesh(windowGeometry, windowMaterial);
                backWindow.position.set(i, j + 6, -5.02);
                buildingGroup.add(backWindow);
                
                // Left windows
                const leftWindow = new THREE.Mesh(windowGeometry, windowMaterial);
                leftWindow.rotation.y = Math.PI / 2;
                leftWindow.position.set(-5.02, j + 6, i);
                buildingGroup.add(leftWindow);
                
                // Right windows
                const rightWindow = new THREE.Mesh(windowGeometry, windowMaterial);
                rightWindow.rotation.y = Math.PI / 2;
                rightWindow.position.set(5.02, j + 6, i);
                buildingGroup.add(rightWindow);
            }
        }
    }
    
    // Create background skyline buildings
    function createSkylineBuildings() {
        const buildingCount = 20;
        const buildingColors = [0x555555, 0x666666, 0x777777, 0x888888];
        
        for (let i = 0; i < buildingCount; i++) {
            // Random building properties
            const width = Math.random() * 8 + 3;
            const height = Math.random() * 30 + 10;
            const depth = Math.random() * 8 + 3;
            
            const geometry = new THREE.BoxGeometry(width, height, depth);
            const material = new THREE.MeshPhongMaterial({
                color: buildingColors[Math.floor(Math.random() * buildingColors.length)],
                transparent: true,
                opacity: 0.7 + Math.random() * 0.3,
                shininess: 30
            });
            
            const building = new THREE.Mesh(geometry, material);
            
            // Position buildings in a circle around the main building
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 30 + 25;
            building.position.x = Math.sin(angle) * radius;
            building.position.z = Math.cos(angle) * radius;
            building.position.y = height / 2 - 2;
            
            building.castShadow = true;
            building.receiveShadow = true;
            
            // Add windows to the building
            addRandomWindows(building, width, height, depth);
            
            buildings.push(building);
            scene.add(building);
        }
    }
    
    // Add random windows to skyline buildings
    function addRandomWindows(building, width, height, depth) {
        const windowGeometry = new THREE.PlaneGeometry(0.5, 0.5);
        const windowMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffcc,
            transparent: true,
            opacity: 0.7,
            shininess: 100,
            specular: 0xffffff,
            side: THREE.DoubleSide
        });
        
        // Window grid
        const windowsX = Math.floor(width / 1.2);
        const windowsY = Math.floor(height / 1.5);
        
        // Add windows to front and back
        for (let x = 0; x < windowsX; x++) {
            for (let y = 0; y < windowsY; y++) {
                if (Math.random() > 0.3) { // 70% chance to add a window
                    // Front windows
                    const frontWindow = new THREE.Mesh(windowGeometry, windowMaterial);
                    frontWindow.position.set(
                        (x - windowsX / 2 + 0.5) * 1.2,
                        (y - windowsY / 2 + 0.5) * 1.5,
                        depth / 2 + 0.01
                    );
                    building.add(frontWindow);
                    
                    // Back windows
                    const backWindow = new THREE.Mesh(windowGeometry, windowMaterial);
                    backWindow.position.set(
                        (x - windowsX / 2 + 0.5) * 1.2,
                        (y - windowsY / 2 + 0.5) * 1.5,
                        -depth / 2 - 0.01
                    );
                    building.add(backWindow);
                }
            }
        }
        
        // Add windows to sides
        const windowsZ = Math.floor(depth / 1.2);
        
        for (let z = 0; z < windowsZ; z++) {
            for (let y = 0; y < windowsY; y++) {
                if (Math.random() > 0.3) { // 70% chance to add a window
                    // Left windows
                    const leftWindow = new THREE.Mesh(windowGeometry, windowMaterial);
                    leftWindow.rotation.y = Math.PI / 2;
                    leftWindow.position.set(
                        -width / 2 - 0.01,
                        (y - windowsY / 2 + 0.5) * 1.5,
                        (z - windowsZ / 2 + 0.5) * 1.2
                    );
                    building.add(leftWindow);
                    
                    // Right windows
                    const rightWindow = new THREE.Mesh(windowGeometry, windowMaterial);
                    rightWindow.rotation.y = Math.PI / 2;
                    rightWindow.position.set(
                        width / 2 + 0.01,
                        (y - windowsY / 2 + 0.5) * 1.5,
                        (z - windowsZ / 2 + 0.5) * 1.2
                    );
                    building.add(rightWindow);
                }
            }
        }
    }
    
    // Handle window resize
    function onWindowResize() {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;
        
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
    
    // Handle mouse movement
    function onMouseMove(event) {
        const rect = container.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;
        
        // Store mouse position for camera movement
        mouseX = (event.clientX - windowHalfX) / 50;
        mouseY = (event.clientY - windowHalfY) / 50;
    }
    
    // Animation loop
    function animate() {
        frameId = requestAnimationFrame(animate);
        
        // Smooth camera movement following mouse
        targetX = mouseX * 0.3;
        targetY = mouseY * 0.3;
        
        camera.position.x += (targetX - camera.position.x) * 0.05;
        camera.position.y += (-targetY - camera.position.y + 15) * 0.05;
        camera.lookAt(scene.position);
        
        // Update animation mixer if available
        if (mixer) {
            mixer.update(buildingClock.getDelta());
        }
        
        // Rotate the main building slightly
        if (buildingModel) {
            buildingModel.rotation.y += 0.001;
        }
        
        // Check for hover interactions
        checkHoverInteraction();
        
        // Render the scene
        renderer.render(scene, camera);
    }
    
    // Check for hover interaction with buildings
    function checkHoverInteraction() {
        raycaster.setFromCamera(mouse, camera);
        
        // Create array of objects to check (main building + skyline buildings)
        const objectsToCheck = [...buildings];
        if (buildingModel) {
            objectsToCheck.push(buildingModel);
        }
        
        const intersects = raycaster.intersectObjects(objectsToCheck, true);
        
        if (intersects.length > 0) {
            if (hoveredBuilding !== intersects[0].object) {
                // Reset previously hovered building
                if (hoveredBuilding) {
                    hoveredBuilding.material.emissive.setHex(0x000000);
                }
                
                // Set new hovered building
                hoveredBuilding = intersects[0].object;
                
                // Only highlight if it's a mesh with material
                if (hoveredBuilding.material && hoveredBuilding.material.emissive) {
                    hoveredBuilding.material.emissive.setHex(0x333333);
                }
            }
        } else {
            // Reset hovered building when not hovering any
            if (hoveredBuilding && hoveredBuilding.material && hoveredBuilding.material.emissive) {
                hoveredBuilding.material.emissive.setHex(0x000000);
            }
            hoveredBuilding = null;
        }
    }
    
    // Initialize scene
    init();
    
    // Cleanup function for window events
    return function cleanup() {
        if (frameId) {
            cancelAnimationFrame(frameId);
        }
        
        window.removeEventListener('resize', onWindowResize);
        container.removeEventListener('mousemove', onMouseMove);
        
        if (renderer) {
            renderer.dispose();
            container.removeChild(renderer.domElement);
        }
    };
}

// Initialize scene when document is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Hero scene initialization
    const heroCleanup = initHeroScene();
    
    // Cleanup on window unload
    window.addEventListener('beforeunload', function() {
        if (heroCleanup) {
            heroCleanup();
        }
    });
});

// Loading screen 3D animation
function initLoadingScene() {
    const container = document.getElementById('loading-3d-container');
    if (!container) return;
    
    // Check if THREE is defined, if not create a simple animation instead
    if (typeof THREE === 'undefined') {
        createFallbackLoadingAnimation(container);
        return;
    }
    
    try {
        let scene, camera, renderer;
        let constructionVehicle;
        let frameId;
        
        // Scene setup
        function init() {
            try {
                // Create scene
                scene = new THREE.Scene();
                
                // Camera setup
                camera = new THREE.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 0.1, 1000);
                camera.position.set(0, 3, 5);
                
                // Renderer setup
                renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
                renderer.setSize(container.clientWidth, container.clientHeight);
                renderer.setPixelRatio(window.devicePixelRatio);
                renderer.setClearColor(0x000000, 0);
                container.appendChild(renderer.domElement);
                
                // Lights
                const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
                scene.add(ambientLight);
                
                const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
                directionalLight.position.set(0, 10, 5);
                scene.add(directionalLight);
                
                // Create simplified construction vehicle
                createConstructionVehicle();
                
                // Start animation loop
                animate();
            } catch (error) {
                console.error("Error initializing loading scene:", error);
                createFallbackLoadingAnimation(container);
            }
        }
        
        // Create simplified construction vehicle
        function createConstructionVehicle() {
            // Group for entire vehicle
            constructionVehicle = new THREE.Group();
            
            // Vehicle body
            const bodyGeometry = new THREE.BoxGeometry(2, 0.8, 3);
            const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xFFCC00 });
            const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
            constructionVehicle.add(body);
            
            // Cabin
            const cabinGeometry = new THREE.BoxGeometry(1.5, 1, 1);
            const cabinMaterial = new THREE.MeshStandardMaterial({ 
                color: 0x333333,
                metalness: 0.3,
                roughness: 0.6
            });
            const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
            cabin.position.set(0, 0.9, -0.8);
            constructionVehicle.add(cabin);
            
            // Create wheels
            const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 16);
            const wheelMaterial = new THREE.MeshStandardMaterial({ 
                color: 0x333333,
                roughness: 0.9
            });
            
            // Add four wheels
            const wheelPositions = [
                [-0.8, -0.4, -1],  // Front left
                [0.8, -0.4, -1],   // Front right
                [-0.8, -0.4, 1],   // Rear left
                [0.8, -0.4, 1]     // Rear right
            ];
            
            wheelPositions.forEach(position => {
                const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
                wheel.rotation.z = Math.PI / 2;
                wheel.position.set(...position);
                constructionVehicle.add(wheel);
            });
            
            // Add excavator arm
            const armGeometry = new THREE.BoxGeometry(0.2, 0.2, 2);
            const armMaterial = new THREE.MeshStandardMaterial({ color: 0xFFCC00 });
            const arm = new THREE.Mesh(armGeometry, armMaterial);
            arm.position.set(0, 0.5, 1.5);
            constructionVehicle.add(arm);
            
            // Add bucket
            const bucketGeometry = new THREE.BoxGeometry(0.6, 0.5, 0.6);
            const bucket = new THREE.Mesh(bucketGeometry, armMaterial);
            bucket.position.set(0, 0.5, 2.5);
            constructionVehicle.add(bucket);
            
            // Add to scene
            scene.add(constructionVehicle);
        }
        
        // Animation loop
        function animate() {
            frameId = requestAnimationFrame(animate);
            
            try {
                if (constructionVehicle) {
                    // Rotate the vehicle
                    constructionVehicle.rotation.y += 0.01;
                    
                    // Gentle bobbing motion
                    constructionVehicle.position.y = Math.sin(Date.now() * 0.002) * 0.1;
                }
                
                // Render scene
                renderer.render(scene, camera);
            } catch (error) {
                console.error("Error in loading animation:", error);
                cancelAnimationFrame(frameId);
            }
        }
        
        // Cleanup function
        function cleanup() {
            if (frameId) {
                cancelAnimationFrame(frameId);
            }
            if (renderer && container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
                renderer.dispose();
            }
        }
        
        // Initialize scene
        init();
        
        // Cleanup when loading screen is hidden
        const loadingScreen = document.querySelector('.loading-screen');
        if (loadingScreen) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.target.classList.contains('hidden')) {
                        cleanup();
                        observer.disconnect();
                    }
                });
            });
            
            observer.observe(loadingScreen, { attributes: true, attributeFilter: ['class'] });
            
            // Fallback cleanup - ensure the loading animation is stopped after a certain time
            setTimeout(cleanup, 5000);
        }
    } catch (error) {
        console.error("Error setting up loading scene:", error);
        createFallbackLoadingAnimation(container);
    }
}

// Create a fallback loading animation when Three.js is not available or fails
function createFallbackLoadingAnimation(container) {
    container.innerHTML = ''; // Clear container
    
    // Create a simple animation using CSS
    const animation = document.createElement('div');
    animation.style.width = '50px';
    animation.style.height = '50px';
    animation.style.margin = '0 auto';
    animation.style.border = '5px solid rgba(249, 176, 0, 0.3)';
    animation.style.borderRadius = '50%';
    animation.style.borderTop = '5px solid #f9b000';
    animation.style.animation = 'spin 1s linear infinite';
    
    // Add the animation keyframes if they don't exist
    if (!document.getElementById('loading-keyframes')) {
        const style = document.createElement('style');
        style.id = 'loading-keyframes';
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
    
    container.appendChild(animation);
}

// 3D map for contact page
function initMapScene() {
    const container = document.getElementById('map-3d-container');
    if (!container || typeof THREE === 'undefined') return;
    
    let scene, camera, renderer;
    let frameId;
    let city;
    
    // Scene setup
    function init() {
        // Create scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x2C3E50);
        
        // Camera setup
        camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.set(0, 15, 20);
        camera.lookAt(0, 0, 0);
        
        // Renderer setup
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        container.appendChild(renderer.domElement);
        
        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 20, 10);
        directionalLight.castShadow = true;
        scene.add(directionalLight);
        
        // Create city map
        createCity();
        
        // Add marker for company location
        addCompanyMarker();
        
        // Window resize handler
        window.addEventListener('resize', onWindowResize);
        
        // Start animation loop
        animate();
    }
    
    // Create city map
    function createCity() {
        city = new THREE.Group();
        
        // Ground plane
        const groundGeometry = new THREE.PlaneGeometry(50, 50);
        const groundMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x333333,
            roughness: 0.8
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        city.add(ground);
        
        // Create grid of streets
        const streetMaterial = new THREE.MeshStandardMaterial({ color: 0x666666 });
        
        // Horizontal streets
        for (let i = -25; i <= 25; i += 10) {
            const streetH = new THREE.Mesh(
                new THREE.PlaneGeometry(50, 3),
                streetMaterial
            );
            streetH.rotation.x = -Math.PI / 2;
            streetH.position.set(0, 0.01, i);
            city.add(streetH);
        }
        
        // Vertical streets
        for (let i = -25; i <= 25; i += 10) {
            const streetV = new THREE.Mesh(
                new THREE.PlaneGeometry(3, 50),
                streetMaterial
            );
            streetV.rotation.x = -Math.PI / 2;
            streetV.position.set(i, 0.01, 0);
            city.add(streetV);
        }
        
        // Add buildings
        for (let x = -20; x <= 20; x += 10) {
            for (let z = -20; z <= 20; z += 10) {
                // Skip center block for company building
                if (x === 0 && z === 0) continue;
                
                createBlock(x, z);
            }
        }
        
        // Add to scene
        scene.add(city);
    }
    
    // Create city block
    function createBlock(x, z) {
        // Building dimensions
        const blockSize = 8; // Block size
        const maxBuildings = 4; // Max buildings per block
        
        // Create random number of buildings in the block
        const buildingCount = Math.floor(Math.random() * maxBuildings) + 1;
        
        for (let i = 0; i < buildingCount; i++) {
            // Building dimensions
            const width = Math.random() * 3 + 1;
            const depth = Math.random() * 3 + 1;
            const height = Math.random() * 5 + 1;
            
            // Random position within block
            const offsetX = (Math.random() - 0.5) * (blockSize - width);
            const offsetZ = (Math.random() - 0.5) * (blockSize - depth);
            
            // Building geometry
            const buildingGeometry = new THREE.BoxGeometry(width, height, depth);
            
            // Building material with gray color variations
            const gray = Math.floor(Math.random() * 100) + 100;
            const buildingMaterial = new THREE.MeshStandardMaterial({ 
                color: new THREE.Color(`rgb(${gray}, ${gray}, ${gray})`),
                roughness: 0.7
            });
            
            // Create mesh
            const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
            building.position.set(
                x + offsetX,
                height / 2,
                z + offsetZ
            );
            building.castShadow = true;
            building.receiveShadow = true;
            
            // Add to city
            city.add(building);
        }
    }
    
    // Add marker for company location
    function addCompanyMarker() {
        // Company building is special and stands out
        const buildingGeometry = new THREE.BoxGeometry(6, 8, 6);
        const buildingMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xFFCC00, // JRD Constructions & Builders yellow
            roughness: 0.5,
            metalness: 0.2
        });
        
        const companyBuilding = new THREE.Mesh(buildingGeometry, buildingMaterial);
        companyBuilding.position.set(0, 4, 0);
        companyBuilding.castShadow = true;
        companyBuilding.receiveShadow = true;
        city.add(companyBuilding);
        
        // Add pulsing marker above the building
        const markerGeometry = new THREE.SphereGeometry(0.5, 16, 16);
        const markerMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xFF0000,
            transparent: true,
            opacity: 0.8
        });
        
        const marker = new THREE.Mesh(markerGeometry, markerMaterial);
        marker.position.set(0, 10, 0);
        city.add(marker);
        
        // Store reference for animation
        city.userData = { marker };
    }
    
    // Window resize handler
    function onWindowResize() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
    
    // Animation loop
    function animate() {
        frameId = requestAnimationFrame(animate);
        
        // Rotate camera slowly
        camera.position.x = 20 * Math.sin(Date.now() * 0.0005);
        camera.position.z = 20 * Math.cos(Date.now() * 0.0005);
        camera.lookAt(0, 0, 0);
        
        // Animate marker
        if (city && city.userData && city.userData.marker) {
            const marker = city.userData.marker;
            
            // Pulsing animation
            const scale = 1 + Math.sin(Date.now() * 0.01) * 0.2;
            marker.scale.set(scale, scale, scale);
            
            // Floating animation
            marker.position.y = 10 + Math.sin(Date.now() * 0.002) * 0.5;
        }
        
        // Render scene
        renderer.render(scene, camera);
    }
    
    // Cleanup function
    function cleanup() {
        if (frameId) {
            cancelAnimationFrame(frameId);
        }
        window.removeEventListener('resize', onWindowResize);
        if (renderer) {
            container.removeChild(renderer.domElement);
            renderer.dispose();
        }
    }
    
    // Initialize scene
    init();
    
    // Cleanup on page navigation
    window.addEventListener('beforeunload', cleanup);
} 