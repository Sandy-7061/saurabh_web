/**
 * Projects.js - JRD Constructions & Builders Projects Page Scripts
 * Contains functionality for the projects page including filtering,
 * searching, and interactive elements
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the 3D hero scene
    initHero3DScene();
    
    // Initialize project data and grid
    initProjectsGrid();
    
    // Initialize filter functionality
    initFilterTabs();
    
    // Initialize search functionality
    initSearchAndSort();
    
    // Initialize project modals
    initProjectModals();
    
    // Initialize testimonials
    initTestimonialSlider();
    
    // Initialize animations
    initAnimations();
});

/**
 * Initialize the 3D hero scene using Three.js
 */
function initHero3DScene() {
    const container = document.getElementById('hero-3d-container');
    if (!container || typeof THREE === 'undefined') return;
    
    let scene, camera, renderer;
    let buildingModel;
    let frameId;
    let mouse = { x: 0, y: 0 };
    let targetRotation = { x: 0, y: 0 };
    
    // Scene setup
    function init() {
        // Create scene
        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x1a1a2e, 0.002);
        
        // Camera setup
        camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.set(0, 15, 30);
        camera.lookAt(0, 0, 0);
        
        // Renderer setup
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setClearColor(0x1a1a2e, 0.9);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(renderer.domElement);
        
        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 7);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        scene.add(directionalLight);
        
        const pointLight = new THREE.PointLight(0xf9b000, 1, 50);
        pointLight.position.set(-5, 10, 5);
        pointLight.castShadow = true;
        scene.add(pointLight);
        
        // Try to load 3D model or create fallback city
        try {
            if (typeof THREE.GLTFLoader !== 'undefined') {
                loadBuildingModel();
            } else {
                createFallbackCity();
            }
        } catch (error) {
            console.error('Error initializing 3D scene:', error);
            createFallbackCity();
        }
        
        // Handle window resize
        window.addEventListener('resize', onWindowResize);
        
        // Track mouse movement
        container.addEventListener('mousemove', onMouseMove);
        
        // Start animation loop
        animate();
    }
    
    // Try to init the scene
    try {
        init();
    } catch (error) {
        console.error('Error in 3D scene initialization:', error);
        // Create a fallback background if 3D fails
        container.style.background = 'linear-gradient(135deg, #1a1a2e, #0f3460)';
    }
    
    // Load 3D building model
    function loadBuildingModel() {
        const loader = new THREE.GLTFLoader();
        
        try {
            // First try to load the model file
            loader.load('assets/models/modern_building.glb', 
                function(gltf) {
                    buildingModel = gltf.scene;
                    buildingModel.scale.set(5, 5, 5);
                    buildingModel.position.set(0, -2, 0);
                    
                    // Set materials and shadows
                    buildingModel.traverse(function(child) {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                            
                            // Enhance materials
                            if (child.material) {
                                child.material.metalness = 0.4;
                                child.material.roughness = 0.6;
                            }
                        }
                    });
                    
                    scene.add(buildingModel);
                },
                // Progress callback
                function(xhr) {
                    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                },
                // Error callback
                function(error) {
                    console.log('Error loading model:', error);
                    // Always create fallback city when there's an error loading the model
                    createFallbackCity();
                }
            );
        } catch (error) {
            console.log('Error attempting to load 3D model:', error);
            createFallbackCity();
        }
    }
    
    // Create a fallback city if 3D model can't be loaded
    function createFallbackCity() {
        // Create a collection of buildings
        const cityGroup = new THREE.Group();
        
        // Create ground
        const groundGeometry = new THREE.PlaneGeometry(100, 100);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            roughness: 0.8,
            metalness: 0.2
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.5;
        ground.receiveShadow = true;
        cityGroup.add(ground);
        
        // Create multiple buildings
        for (let i = 0; i < 30; i++) {
            // Random position in a circular layout
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 30 + 5;
            const posX = Math.sin(angle) * radius;
            const posZ = Math.cos(angle) * radius;
            
            // Random building dimensions
            const width = Math.random() * 5 + 2;
            const height = Math.random() * 15 + 5;
            const depth = Math.random() * 5 + 2;
            
            // Create building
            const geometry = new THREE.BoxGeometry(width, height, depth);
            
            // Randomize color but keep in architectural tones
            const colorValue = Math.random() * 0.3 + 0.2;
            const color = new THREE.Color(colorValue, colorValue, colorValue);
            
            // Building material
            const material = new THREE.MeshPhongMaterial({
                color: color,
                specular: 0x111111,
                shininess: 30
            });
            
            const building = new THREE.Mesh(geometry, material);
            building.position.set(posX, height / 2, posZ);
            building.castShadow = true;
            building.receiveShadow = true;
            
            // Add windows to building
            addWindowsToBuilding(building, width, height, depth);
            
            cityGroup.add(building);
        }
        
        // Featured building in center (represents JRD Constructions & Builders project)
        const mainBuilding = createMainBuilding();
        mainBuilding.position.set(0, 8, 0);
        cityGroup.add(mainBuilding);
        
        buildingModel = cityGroup;
        scene.add(cityGroup);
    }
    
    // Create the main featured building
    function createMainBuilding() {
        const buildingGroup = new THREE.Group();
        
        // Main structure
        const mainGeometry = new THREE.BoxGeometry(8, 16, 8);
        const mainMaterial = new THREE.MeshPhongMaterial({
            color: 0x3a7bd5,
            specular: 0xffffff,
            shininess: 100,
            transparent: true,
            opacity: 0.9
        });
        const mainMesh = new THREE.Mesh(mainGeometry, mainMaterial);
        mainMesh.castShadow = true;
        mainMesh.receiveShadow = true;
        buildingGroup.add(mainMesh);
        
        // Add golden accent on top
        const topGeometry = new THREE.BoxGeometry(10, 1, 10);
        const topMaterial = new THREE.MeshPhongMaterial({
            color: 0xf9b000,
            specular: 0xffffff,
            shininess: 100
        });
        const topMesh = new THREE.Mesh(topGeometry, topMaterial);
        topMesh.position.y = 8.5;
        topMesh.castShadow = true;
        buildingGroup.add(topMesh);
        
        // Add windows
        const rows = 8;
        const cols = 4;
        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const sides = [
                    [0, 0, 1, Math.PI/2, 0, 0], // Front
                    [0, 0, -1, Math.PI/2, 0, Math.PI], // Back
                    [1, 0, 0, Math.PI/2, 0, Math.PI/2], // Right
                    [-1, 0, 0, Math.PI/2, 0, -Math.PI/2] // Left
                ];
                
                sides.forEach(side => {
                    const windowGeo = new THREE.PlaneGeometry(0.8, 0.8);
                    const windowMat = new THREE.MeshPhongMaterial({
                        color: 0xffffcc,
                        transparent: true,
                        opacity: 0.7,
                        emissive: 0xffffcc,
                        emissiveIntensity: Math.random() * 0.2 + 0.1
                    });
                    
                    const window = new THREE.Mesh(windowGeo, windowMat);
                    
                    const posX = side[0] * 4.01;
                    const posY = row * 1.8 - 7 + 1;
                    const posZ = side[2] * 4.01;
                    
                    window.position.set(
                        posX + (side[0] === 0 ? (col - 1.5) * 1.6 : 0),
                        posY,
                        posZ + (side[2] === 0 ? (col - 1.5) * 1.6 : 0)
                    );
                    
                    window.rotation.set(side[3], side[4], side[5]);
                    
                    buildingGroup.add(window);
                });
            }
        }
        
        return buildingGroup;
    }
    
    // Add windows to a building
    function addWindowsToBuilding(building, width, height, depth) {
        // Determine number of windows based on building size
        const windowRows = Math.floor(height / 2);
        const windowCols = Math.floor(width);
        
        // Window material
        const windowMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffcc,
            transparent: true,
            opacity: 0.7,
            emissive: 0xffffcc,
            emissiveIntensity: Math.random() * 0.2
        });
        
        // Add windows to front and back
        for (let row = 0; row < windowRows; row++) {
            for (let col = 0; col < windowCols; col++) {
                if (Math.random() > 0.3) { // 70% chance to add a window
                    // Window geometry
                    const windowGeometry = new THREE.PlaneGeometry(0.5, 0.8);
                    
                    // Front window
                    const frontWindow = new THREE.Mesh(windowGeometry, windowMaterial);
                    frontWindow.position.set(
                        (col - windowCols/2 + 0.5) * 0.8,
                        row * 1.5 + 1,
                        depth/2 + 0.01
                    );
                    building.add(frontWindow);
                    
                    // Back window
                    const backWindow = new THREE.Mesh(windowGeometry, windowMaterial);
                    backWindow.position.set(
                        (col - windowCols/2 + 0.5) * 0.8,
                        row * 1.5 + 1,
                        -depth/2 - 0.01
                    );
                    backWindow.rotation.y = Math.PI;
                    building.add(backWindow);
                }
            }
        }
        
        // Add windows to sides
        const sideWindowCols = Math.floor(depth);
        
        for (let row = 0; row < windowRows; row++) {
            for (let col = 0; col < sideWindowCols; col++) {
                if (Math.random() > 0.3) { // 70% chance to add a window
                    // Window geometry
                    const windowGeometry = new THREE.PlaneGeometry(0.5, 0.8);
                    
                    // Left window
                    const leftWindow = new THREE.Mesh(windowGeometry, windowMaterial);
                    leftWindow.position.set(
                        -width/2 - 0.01,
                        row * 1.5 + 1,
                        (col - sideWindowCols/2 + 0.5) * 0.8
                    );
                    leftWindow.rotation.y = Math.PI/2;
                    building.add(leftWindow);
                    
                    // Right window
                    const rightWindow = new THREE.Mesh(windowGeometry, windowMaterial);
                    rightWindow.position.set(
                        width/2 + 0.01,
                        row * 1.5 + 1,
                        (col - sideWindowCols/2 + 0.5) * 0.8
                    );
                    rightWindow.rotation.y = -Math.PI/2;
                    building.add(rightWindow);
                }
            }
        }
    }
    
    // Handle window resize
    function onWindowResize() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
    
    // Handle mouse movement
    function onMouseMove(event) {
        // Calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // Update target rotation based on mouse position
        targetRotation.y = mouse.x * 0.5;
        targetRotation.x = mouse.y * 0.2;
    }
    
    // Animation loop
    function animate() {
        frameId = requestAnimationFrame(animate);
        
        // Smoothly rotate model toward target rotation
        if (buildingModel) {
            buildingModel.rotation.y += (targetRotation.y - buildingModel.rotation.y) * 0.05;
            
            // Limit vertical rotation
            const targetX = THREE.MathUtils.clamp(targetRotation.x, -0.2, 0.2);
            buildingModel.rotation.x += (targetX - buildingModel.rotation.x) * 0.05;
        }
        
        // Render scene
        renderer.render(scene, camera);
    }
    
    // Initialize the scene
    init();
    
    // Return cleanup function
    return function cleanup() {
        if (frameId) {
            cancelAnimationFrame(frameId);
        }
        
        // Remove event listeners
        window.removeEventListener('resize', onWindowResize);
        container.removeEventListener('mousemove', onMouseMove);
        
        // Clean up renderer
        if (renderer) {
            renderer.dispose();
            try {
                container.removeChild(renderer.domElement);
            } catch (e) {
                console.warn('Error removing renderer element:', e);
            }
        }
    };
}

/**
 * Project data - Normally this would be loaded from a server
 */
const projectsData = [
    {
        id: 'project1',
        title: 'Lakeside Villa',
        category: 'residential',
        description: 'Luxurious waterfront residential project with stunning views and premium finishes.',
        image: 'assets/modern-house-exterior-evening-view-with-lawn-grass3d-rendering_1216305-388.jpg',
        location: 'Marina District',
        year: 2023,
        featured: true
    },
    {
        id: 'project2',
        title: 'Urban Heights',
        category: 'residential',
        description: 'Multi-purpose commercial complex with offices, retail spaces and recreational areas.',
        image: 'assets/3d-rendering-individual-modern-house_21255-20.jpg',
        location: 'Downtown',
        year: 2022,
        featured: false
    },
    {
        id: 'project3',
        title: 'Green Meadows',
        category: 'renovation',
        description: 'Eco-friendly community development with sustainable features and green spaces.',
        image: 'assets/hosue_board.png',
        location: 'Greendale',
        year: 2023,
        featured: true
    },
    {
        id: 'project4',
        title: 'Modern Interiors',
        category: 'renovation',
        description: 'Complete renovation of luxury apartments with modern design and smart home features.',
        image: 'assets/interior-bed-room-kitchen-lobby-front-elevation-architecture-design_1022782-351.webp',
        location: 'Highland Park',
        year: 2022,
        featured: false
    },
    {
        id: 'project5',
        title: 'Skyline Hotel',
        category: 'residential',
        description: '5-star hotel with 120 rooms, conference facilities, and rooftop infinity pool.',
        image: 'assets/big-hotel-luangprabang-laos_1127771-3143.jpg',
        location: 'Harborfront',
        year: 2021,
        featured: true
    },
    {
        id: 'project6',
        title: 'Tech Hub',
        category: 'commercial',
        description: 'Modern industrial facility with technology research centers and production areas.',
        image: 'assets/construction-multi-storey-brick-house-drone-view_160152-537.webp',
        location: 'Innovation District',
        year: 2022,
        featured: false
    },
    {
        id: 'project7',
        title: 'Hillside Retreat',
        category: 'residential',
        description: 'Contemporary home designed to integrate with the natural hillside environment.',
        image: 'assets/3d-rendering-individual-modern-house_21255-27.webp',
        location: 'Cliffside Heights',
        year: 2021,
        featured: false
    },
    {
        id: 'project8',
        title: 'Heritage Revival',
        category: 'renovation',
        description: 'Restoration of historical building while preserving architectural details and heritage.',
        image: 'assets/odern-duplex-house-garden_848676-4235.jpg',
        location: 'Old Town',
        year: 2023,
        featured: false
    },
    {
        id: 'project9',
        title: 'Corporate HQ',
        category: 'commercial',
        description: 'Modern corporate headquarters with sustainable design and collaborative spaces.',
        image: 'assets/dusk-building-site_11208-643.webp',
        location: 'Business Bay',
        year: 2020,
        featured: true
    }
];

/**
 * Testimonial data
 */
const testimonialData = [
    {
        quote: "JRD Constructions & Builders transformed our vision into a stunning reality. Their attention to detail and commitment to quality exceeded our expectations. The team was professional, responsive, and truly passionate about creating our dream home.",
        client: "Mr. Manmohan Kushwaha Ji",
        project: "Residential Building",
        image: "assets/civil-engineer-construction-worker-architects-wearing-hardhats-safety-vests-are-working-together-construction-site-building-home-cooperation-teamwork-concept_640221-172.webp"
    },
    {
        quote: "Working with JRD Constructions & Builders on our commercial complex was a seamless experience. Their expertise in construction management and innovative solutions helped us overcome challenges and complete the project ahead of schedule.",
        client: "Michael Roberts",
        project: "Urban Heights",
        image: "assets/construction-workers-working-development-construction-site_136354-8772.jpg"
    },
    {
        quote: "The renovation of our historic building was handled with extraordinary care and respect for its heritage. JRD Constructions & Builders' team combined traditional craftsmanship with modern techniques to preserve its character while updating it for modern use.",
        client: "Elizabeth Chen",
        project: "Heritage Revival",
        image: "assets/female-working-environment-projects_23-2148829296.webp"
    }
];

/**
 * Initialize the projects grid with data
 */
function initProjectsGrid() {
    const gridContainer = document.getElementById('projects-grid');
    if (!gridContainer) return;
    
    // Clear any existing content
    gridContainer.innerHTML = '';
    
    // Immediately populate grid with ALL project items
    projectsData.forEach(project => {
        const projectItem = createProjectItem(project);
        gridContainer.appendChild(projectItem);
        
        // Make sure items are visible without animations
        projectItem.style.opacity = '1';
        projectItem.style.visibility = 'visible';
        projectItem.style.display = 'block';
    });
    
    // Force layout update
    window.setTimeout(() => {
        document.querySelectorAll('.project-item').forEach(item => {
            item.style.opacity = '1';
            item.style.visibility = 'visible';
            item.style.display = 'block';
        });
    }, 100);
}

/**
 * Create a project item element
 */
function createProjectItem(project) {
    const projectItem = document.createElement('div');
    projectItem.className = 'project-item';
    projectItem.dataset.category = project.category;
    projectItem.dataset.id = project.id;
    projectItem.dataset.year = project.year;
    projectItem.style.opacity = '1';
    projectItem.style.visibility = 'visible';
    projectItem.style.display = 'block';
    
    projectItem.innerHTML = `
        <div class="project-image">
            <img src="${project.image}" alt="${project.title}" style="opacity:1; visibility:visible;">
            <span class="project-category-tag">${capitalizeFirstLetter(project.category)}</span>
        </div>
        <div class="project-content" style="opacity:1; visibility:visible; display:flex;">
            <div>
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
            </div>
            <div class="project-meta" style="opacity:1; visibility:visible;">
                <div class="project-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${project.location}</span>
                </div>
                <button class="project-link" data-project="${project.id}">View Details</button>
            </div>
        </div>
    `;
    
    // Add click handler for view details button
    const viewButton = projectItem.querySelector('.project-link');
    viewButton.addEventListener('click', function() {
        openProjectModal(project.id);
    });
    
    return projectItem;
}

/**
 * Initialize filter tabs functionality
 */
function initFilterTabs() {
    const filterTabs = document.querySelectorAll('.category-tab');
    if (!filterTabs.length) return;
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            filterTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Get filter category
            const filterCategory = this.dataset.filter;
            
            // Filter projects
            filterProjects(filterCategory);
        });
    });
}

/**
 * Filter projects by category
 */
function filterProjects(category) {
    const projectItems = document.querySelectorAll('.project-item');
    const emptyState = document.querySelector('.projects-empty');
    let visibleCount = 0;
    
    projectItems.forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
            item.style.display = 'block';
            visibleCount++;
            
            // Add animation if GSAP is available
            if (typeof gsap !== 'undefined') {
                gsap.to(item, {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    delay: 0.1,
                    ease: 'power2.out'
                });
            }
        } else {
            item.style.display = 'none';
            
            // Add animation if GSAP is available
            if (typeof gsap !== 'undefined') {
                gsap.to(item, {
                    opacity: 0,
                    y: 20,
                    duration: 0.3,
                    ease: 'power2.in'
                });
            }
        }
    });
    
    // Show/hide empty state
    if (emptyState) {
        emptyState.style.display = visibleCount > 0 ? 'none' : 'block';
    }
}

/**
 * Initialize search and sort functionality
 */
function initSearchAndSort() {
    const sortSelect = document.getElementById('project-sort');
    const resetButton = document.getElementById('reset-filters');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const sortBy = this.value;
            sortProjects(sortBy);
        });
    }
    
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            // Reset sort
            if (sortSelect) {
                sortSelect.value = 'newest';
            }
            
            // Reset category filter
            const allFilter = document.querySelector('.category-tab[data-filter="all"]');
            if (allFilter) {
                allFilter.click();
            } else {
                filterProjects('all');
            }
        });
    }
}

/**
 * Sort projects by various criteria
 */
function sortProjects(sortBy) {
    const projectGrid = document.getElementById('projects-grid');
    if (!projectGrid) return;
    
    const projectItems = Array.from(document.querySelectorAll('.project-item'));
    
    // Sort projects based on criteria
    projectItems.sort((a, b) => {
        switch (sortBy) {
            case 'newest':
                return parseInt(b.dataset.year) - parseInt(a.dataset.year);
            case 'oldest':
                return parseInt(a.dataset.year) - parseInt(b.dataset.year);
            case 'nameAsc':
                return a.querySelector('.project-title').textContent.localeCompare(
                    b.querySelector('.project-title').textContent
                );
            case 'nameDesc':
                return b.querySelector('.project-title').textContent.localeCompare(
                    a.querySelector('.project-title').textContent
                );
            default:
                return 0;
        }
    });
    
    // Clear and re-append items in sorted order
    projectGrid.innerHTML = '';
    projectItems.forEach(item => {
        projectGrid.appendChild(item);
    });
}

/**
 * Initialize project modals
 */
function initProjectModals() {
    const projectModal = document.getElementById('project-modal');
    const modalClose = document.getElementById('modal-close');
    const modalContent = document.getElementById('modal-content');
    const modalOverlay = document.querySelector('.modal-overlay');
    
    if (!projectModal || !modalContent) return;
    
    // Close modal when clicking close button
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    // Close modal when clicking overlay
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }
    
    // Close modal with escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeModal();
        }
    });
    
    // Open modal when clicking view project button in project highlight
    const featuredProjectBtn = document.querySelector('.highlight-text .view-project-btn');
    if (featuredProjectBtn) {
        featuredProjectBtn.addEventListener('click', function() {
            openProjectModal('project1'); // Assuming feature project is project1
        });
    }
    
    // Function to open the modal
    function openProjectModal(projectId) {
        const project = projectsData.find(p => p.id === projectId);
        if (!project) return;
        
        // Populate modal content
        modalContent.innerHTML = createModalContent(project);
        
        // Show modal with animation
        projectModal.classList.add('active');
        
        // Disable body scroll
        document.body.style.overflow = 'hidden';
        
        // Initialize gallery click handlers
        initGalleryZoom();
    }
    
    // Function to close the modal
    function closeModal() {
        projectModal.classList.remove('active');
        
        // Re-enable body scroll
        document.body.style.overflow = '';
    }
    
    // Create modal content HTML
    function createModalContent(project) {
        // Create random project details for demo
        const completionDate = `${project.year}-${Math.floor(Math.random() * 12) + 1}`;
        const area = `${Math.floor(Math.random() * 10000) + 5000} sq ft`;
        const budget = `$${Math.floor(Math.random() * 10) + 1} Million`;
        const duration = `${Math.floor(Math.random() * 18) + 6} months`;
        
        // Generate gallery images - in real app these would come from the server
        const galleryImages = [];
        const imagePool = [
            'assets/modern-house-exterior-evening-view-with-lawn-grass3d-rendering_1216305-388.jpg',
            'assets/interior-bed-room-kitchen-lobby-front-elevation-architecture-design_1022782-351.webp',
            'assets/high-angle-house-project-table_23-2148346293.webp',
            'assets/discussing-building-plan_1098-16479.webp',
            'assets/construction-residential-new-house-progress-building-site_293060-986.webp',
            'assets/construction-multi-storey-brick-house-drone-view_160152-537.webp'
        ];
        
        // Select 3 random images from pool
        for (let i = 0; i < 3; i++) {
            const randomIndex = Math.floor(Math.random() * imagePool.length);
            galleryImages.push(imagePool[randomIndex]);
        }
        
        return `
            <div class="modal-header">
                <img src="${project.image}" alt="${project.title}">
                <div class="modal-header-overlay">
                    <span class="modal-category">${capitalizeFirstLetter(project.category)}</span>
                    <h2 class="modal-title">${project.title}</h2>
                    <div class="modal-location">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${project.location}</span>
                    </div>
                </div>
            </div>
            <div class="modal-body">
                <div class="modal-stats">
                    <div class="modal-stat">
                        <div class="modal-stat-icon">
                            <i class="fas fa-calendar-alt"></i>
                        </div>
                        <span class="modal-stat-label">Completion</span>
                        <span class="modal-stat-value">${completionDate}</span>
                    </div>
                    <div class="modal-stat">
                        <div class="modal-stat-icon">
                            <i class="fas fa-ruler-combined"></i>
                        </div>
                        <span class="modal-stat-label">Area</span>
                        <span class="modal-stat-value">${area}</span>
                    </div>
                    <div class="modal-stat">
                        <div class="modal-stat-icon">
                            <i class="fas fa-coins"></i>
                        </div>
                        <span class="modal-stat-label">Budget</span>
                        <span class="modal-stat-value">${budget}</span>
                    </div>
                    <div class="modal-stat">
                        <div class="modal-stat-icon">
                            <i class="fas fa-hourglass-half"></i>
                        </div>
                        <span class="modal-stat-label">Duration</span>
                        <span class="modal-stat-value">${duration}</span>
                    </div>
                </div>
                
                <div class="modal-description">
                    <h3>Project Overview</h3>
                    <p>${project.description}</p>
                    <p>This ${project.category} project showcases our commitment to quality and attention to detail. We worked closely with the client to understand their needs and delivered a solution that exceeded expectations.</p>
                    <p>The design incorporates modern construction techniques while focusing on sustainability and energy efficiency. Every aspect of the project was carefully planned and executed by our experienced team.</p>
                </div>
                
                <div class="modal-gallery">
                    <h3>Project Gallery</h3>
                    <div class="gallery-grid">
                        ${galleryImages.map(img => `
                            <div class="gallery-item">
                                <img src="${img}" alt="Project Image">
                                <div class="gallery-zoom">
                                    <i class="fas fa-search-plus"></i>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }
    
    // Initialize gallery zoom functionality
    function initGalleryZoom() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        galleryItems.forEach(item => {
            item.addEventListener('click', function() {
                const img = this.querySelector('img');
                
                // In a real implementation, this would open a lightbox or fullscreen gallery
                // For this demo, we'll just log it
                console.log('Gallery image clicked:', img.src);
                
                // You could create a fullscreen modal or use a library like Lightbox
                alert('Gallery image clicked. In a real implementation, this would open a lightbox gallery.');
            });
        });
    }
}

/**
 * Initialize testimonial slider
 */
function initTestimonialSlider() {
    const sliderWrapper = document.getElementById('testimonials-wrapper');
    const dotsContainer = document.getElementById('testimonial-dots');
    const prevBtn = document.getElementById('testimonial-prev');
    const nextBtn = document.getElementById('testimonial-next');
    
    if (!sliderWrapper) return;
    
    let currentSlide = 0;
    
    // Populate testimonial slider
    testimonialData.forEach((testimonial, index) => {
        // Create testimonial slide
        const slide = document.createElement('div');
        slide.className = 'testimonial-slide';
        slide.innerHTML = `
            <div class="testimonial-image">
                <img src="${testimonial.image}" alt="${testimonial.client}">
            </div>
            <div class="testimonial-content">
                <p class="testimonial-quote">${testimonial.quote}</p>
                <div class="testimonial-client">
                    <div class="client-avatar">
                        <img src="${testimonial.image}" alt="${testimonial.client}">
                    </div>
                    <div class="client-info">
                        <h4>${testimonial.client}</h4>
                        <p>${testimonial.project}</p>
                    </div>
                </div>
            </div>
        `;
        
        sliderWrapper.appendChild(slide);
        
        // Add dot indicator
        if (dotsContainer) {
            const dot = document.createElement('div');
            dot.className = 'dot' + (index === 0 ? ' active' : '');
            dot.dataset.slide = index;
            
            dot.addEventListener('click', function() {
                goToSlide(parseInt(this.dataset.slide));
            });
            
            dotsContainer.appendChild(dot);
        }
    });
    
    // Show first slide
    if (sliderWrapper.children.length > 0) {
        sliderWrapper.children[0].classList.add('active');
    }
    
    // Previous button
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            goToSlide(currentSlide - 1);
        });
    }
    
    // Next button
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            goToSlide(currentSlide + 1);
        });
    }
    
    // Go to specific slide
    function goToSlide(slideIndex) {
        const slides = sliderWrapper.children;
        const dots = dotsContainer ? dotsContainer.children : [];
        
        if (slideIndex < 0) {
            slideIndex = slides.length - 1;
        } else if (slideIndex >= slides.length) {
            slideIndex = 0;
        }
        
        // Update current slide
        currentSlide = slideIndex;
        
        // Hide all slides
        for (let i = 0; i < slides.length; i++) {
            slides[i].classList.remove('active');
            if (dots.length > 0) {
                dots[i].classList.remove('active');
            }
        }
        
        // Show current slide
        slides[currentSlide].classList.add('active');
        if (dots.length > 0) {
            dots[currentSlide].classList.add('active');
        }
    }
    
    // Auto-play functionality
    let slideInterval;
    
    function startSlideInterval() {
        slideInterval = setInterval(function() {
            goToSlide(currentSlide + 1);
        }, 5000);
    }
    
    // Start autoplay
    startSlideInterval();
    
    // Pause on hover
    sliderWrapper.addEventListener('mouseenter', function() {
        clearInterval(slideInterval);
    });
    
    // Resume on mouseleave
    sliderWrapper.addEventListener('mouseleave', function() {
        startSlideInterval();
    });
}

/**
 * Helper function to animate project grid with GSAP
 */
function animateProjectGrid() {
    if (typeof gsap === 'undefined') return;
    
    const projectItems = document.querySelectorAll('.project-item');
    
    gsap.from(projectItems, {
        opacity: 0,
        y: 50,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.projects-showcase',
            start: 'top bottom-=100',
            toggleActions: 'play none none none'
        }
    });
    
    // Animate highlight section
    gsap.from('.highlight-text', {
        opacity: 0,
        x: -50,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.project-highlight',
            start: 'top bottom-=100',
            toggleActions: 'play none none none'
        }
    });
    
    gsap.from('.highlight-image', {
        opacity: 0,
        x: 50,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.project-highlight',
            start: 'top bottom-=100',
            toggleActions: 'play none none none'
        }
    });
}

/**
 * Helper functions
 */
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Initialize animations for the projects page
 */
function initAnimations() {
    // Use GSAP if available
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        // Animate project cards on scroll
        gsap.utils.toArray('.project-item').forEach((card, i) => {
            gsap.from(card, {
                y: 50,
                opacity: 0,
                duration: 0.6,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: card,
                    start: "top bottom-=100",
                    toggleActions: "play none none none"
                },
                delay: i * 0.1
            });
        });
        
        // Animate highlight section
        gsap.from('.highlight-text', {
            x: -50,
            opacity: 0,
            duration: 0.8,
            scrollTrigger: {
                trigger: '.project-highlight',
                start: 'top bottom-=100',
                toggleActions: 'play none none none'
            }
        });
        
        gsap.from('.highlight-image', {
            x: 50,
            opacity: 0,
            duration: 0.8,
            scrollTrigger: {
                trigger: '.project-highlight',
                start: 'top bottom-=100',
                toggleActions: 'play none none none'
            }
        });
        
        // Animate CTA section
        gsap.from('.project-cta .cta-content', {
            y: 30,
            opacity: 0,
            duration: 0.8,
            scrollTrigger: {
                trigger: '.project-cta',
                start: 'top bottom-=100',
                toggleActions: 'play none none none'
            }
        });
    } else {
        // Fallback for browsers without GSAP
        // Add CSS classes for animation
        document.querySelectorAll('.project-item').forEach((card, index) => {
            card.classList.add('animate-on-scroll');
            card.style.animationDelay = `${index * 0.1}s`;
        });
        
        document.querySelector('.highlight-text')?.classList.add('animate-fade-right');
        document.querySelector('.highlight-image')?.classList.add('animate-fade-left');
        document.querySelector('.project-cta .cta-content')?.classList.add('animate-fade-up');
        
        // Add scroll observer
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, { threshold: 0.1 });
            
            document.querySelectorAll('.animate-on-scroll, .animate-fade-right, .animate-fade-left, .animate-fade-up').forEach(el => {
                observer.observe(el);
            });
        }
    }
    
    // Add hover effects for project cards
    document.querySelectorAll('.project-item').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.classList.add('hover');
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('hover');
        });
    });
}
