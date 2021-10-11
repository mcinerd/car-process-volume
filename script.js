import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { GLTFLoader, GLTFParser } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { MeshStandardMaterial, TextureEncoding } from 'three'
import { gsap } from 'gsap'
import Stats from 'stats.js'

document.addEventListener("DOMContentLoaded", function () {
    const stats = new Stats()
    stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(stats.dom)
    
    /**
     * Base
     */
    // Debug
    const gui = new dat.GUI()
    
    // Canvas
    const canvas = document.querySelector('canvas.webgl')
    
    // Scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color('black')
    
    /**
     * Loaders
     */
    const loadingBarElement = document.querySelector('.loading-bar')
    const loadingManager = new THREE.LoadingManager(
        // Loaded
        () =>
        {
            window.setTimeout(() =>
            {
                loadingBarElement.classList.add('ended')
                loadingBarElement.style.transform = ''
                gsap.to(overlayMaterial.uniforms.uAlpha, { duration: 3, value: 0, delay: 2 })
            }, 500)
        },
    
        // Progress
        (itemUrl, itemsLoaded, itemsTotal) =>
        {
            const progressRatio = itemsLoaded / itemsTotal
            loadingBarElement.style.transform = `scaleX(${progressRatio})`
        })
    const dracoLoader = new DRACOLoader(loadingManager)
    dracoLoader.setDecoderPath('/draco/')
    const gltfLoader = new GLTFLoader(loadingManager)
    gltfLoader.setDRACOLoader(dracoLoader)
    
    /**
     * Overlay
     */
    const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1)
    const overlayMaterial = new THREE.ShaderMaterial({
        // wireframe: true,
        transparent: true,
        uniforms:
        {
            uAlpha: { value: 1 }
        },
        vertexShader: `
            void main()
            {
                gl_Position = vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float uAlpha;
    
            void main()
            {
                gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
            }
        `
    })
    const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial)
    scene.add(overlay)
    
    // Driving Plates
    
    // Day - Left
    const dayVideoLeft = document.getElementById('day-video-left')
    dayVideoLeft.mediaGroup = "day-driving-plates"
    console.log(dayVideoLeft.mediaGroup)
    const dayVideoLeftTexture = new THREE.VideoTexture(dayVideoLeft)
    dayVideoLeftTexture.encoding = THREE.sRGBEncoding
    const dayVideoLeftMaterial = new THREE.MeshStandardMaterial({
        map: dayVideoLeftTexture
    })
    dayVideoLeftMaterial.map.flipY = false
    
    // Day - Right
    const dayVideoRight = document.getElementById('day-video-right')
    dayVideoRight.mediaGroup = "day-driving-plates"
    const dayVideoRightTexture = new THREE.VideoTexture(dayVideoRight)
    dayVideoRightTexture.encoding = THREE.sRGBEncoding
    const dayVideoRightMaterial = new THREE.MeshStandardMaterial({
        map: dayVideoRightTexture
    })
    dayVideoRightMaterial.map.flipY = false
    
    // Day - Front
    const dayVideoFront = document.getElementById('day-video-front')
    dayVideoFront.mediaGroup = "day-driving-plates"
    const dayVideoFrontTexture = new THREE.VideoTexture(dayVideoFront)
    dayVideoRightTexture.encoding = THREE.sRGBEncoding
    const dayVideoFrontMaterial = new THREE.MeshStandardMaterial({
        map: dayVideoFrontTexture
    })
    dayVideoFrontMaterial.map.flipY = false
    
    // Day - Ceiling
    const dayVideoCeiling = document.getElementById('day-video-ceiling')
    dayVideoCeiling.mediaGroup = "day-driving-plates"
    const dayVideoCeilingTexture = new THREE.VideoTexture(dayVideoCeiling)
    dayVideoCeilingTexture.encoding = THREE.sRGBEncoding
    const dayVideoCeilingMaterial = new THREE.MeshStandardMaterial({
        map: dayVideoCeilingTexture
    })
    dayVideoCeilingMaterial.map.flipY = false
    
    // Night - Left
    const nightVideoLeft = document.getElementById('night-video-left')
    nightVideoLeft.mediaGroup = "night-driving-plates"
    const nightVideoLeftTexture = new THREE.VideoTexture(nightVideoLeft)
    nightVideoLeftTexture.encoding = THREE.sRGBEncoding
    const nightVideoLeftMaterial = new THREE.MeshStandardMaterial({
        map: nightVideoLeftTexture
    })
    nightVideoLeftMaterial.map.flipY = false
    
    // Night - Right
    const nightVideoRight = document.getElementById('night-video-right')
    nightVideoRight.mediaGroup = "night-driving-plates"
    const nightVideoRightTexture = new THREE.VideoTexture(nightVideoRight)
    nightVideoRightTexture.encoding = THREE.sRGBEncoding
    const nightVideoRightMaterial = new THREE.MeshStandardMaterial({
        map: nightVideoRightTexture
    })
    nightVideoRightMaterial.map.flipY = false
    
    // Night - Front
    const nightVideoFront = document.getElementById('night-video-front')
    nightVideoFront.mediaGroup = "night-driving-plates"
    const nightVideoFrontTexture = new THREE.VideoTexture(nightVideoFront)
    nightVideoFrontTexture.encoding = THREE.sRGBEncoding
    const nightVideoFrontMaterial = new THREE.MeshStandardMaterial({
        map: nightVideoFrontTexture
    })
    nightVideoFrontMaterial.map.flipY = false
    
    // Night - Ceiling
    const nightVideoCeiling = document.getElementById('night-video-ceiling')
    nightVideoCeiling.mediaGroup = "night-driving-plates"
    const nightVideoCeilingTexture = new THREE.VideoTexture(nightVideoCeiling)
    nightVideoCeilingTexture.encoding = THREE.sRGBEncoding
    const nightVideoCeilingMaterial = new THREE.MeshStandardMaterial({
        map: nightVideoCeilingTexture
    })
    nightVideoCeilingMaterial.map.flipY = false
    
    /**
     * Models
     */
    let mixer = null
    
    // Platform
    const planeGeometry = new THREE.CircleBufferGeometry(1, 60)
    const planeMaterial = new THREE.MeshStandardMaterial({ color: 'grey' })
    const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
    planeMesh.rotation.x = - Math.PI * 0.5
    planeMesh.scale.set(4, 4, 4)
    planeMesh.position.y = 0.1
    scene.add(planeMesh)
    
    // Vehicles
    let mercedes
    gltfLoader.load(
        '/models/BGI/Mercedes-draco.glb',
        (gltf) =>
        {
            mercedes = gltf
            //scene.add(mercedes.scene)
        })
    
    let motorcycle
    gltfLoader.load(
        '/models/BGI/Motorcycle-draco.glb',
        (gltf) =>
        {
            motorcycle = gltf
            scene.add(motorcycle.scene)
        })

    // Volume
    let ledVolume
    gltfLoader.load(
        '/models/BGI/LEDVolume-draco.glb',
        (gltf) =>
        {
            ledVolume = gltf
            scene.add(ledVolume.scene)
        })
    
    // Video Walls
    let leftWallVideo
    gltfLoader.load(
        'models/BGI/LeftWall-Video-draco.glb',
        (gltf) =>
        {
            leftWallVideo = gltf
            leftWallVideo.scene.traverse((child) =>
            {
                if(child instanceof THREE.Mesh && child.material instanceof MeshStandardMaterial)
                {
                    child.material = nightVideoLeftMaterial
                }            
            })
            scene.add(leftWallVideo.scene)
        })
    
    let rightWallVideo
    gltfLoader.load(
        'models/BGI/RightWall-Video-draco.glb',
        (gltf) =>
        {
            rightWallVideo = gltf
            rightWallVideo.scene.traverse((child) =>
            {
                if(child instanceof THREE.Mesh && child.material instanceof MeshStandardMaterial)
                {
                    child.material = nightVideoRightMaterial
                }
            })
            scene.add(rightWallVideo.scene)
        })
    
    let frontWallVideo
    gltfLoader.load(
        'models/BGI/FrontWall-Video-draco.glb',
        (gltf) =>
        {
            frontWallVideo = gltf
            frontWallVideo.scene.traverse((child) =>
            {
                if(child instanceof THREE.Mesh && child.material instanceof MeshStandardMaterial)
                {
                    child.material = nightVideoFrontMaterial
                }
            })
            scene.add(frontWallVideo.scene)
        })
    let ceilingWallVideo
    gltfLoader.load(
        'models/BGI/CeilingWall-Video-draco.glb',
        (gltf) =>
        {
            ceilingWallVideo = gltf
            ceilingWallVideo.scene.traverse((child) =>
            {
                if(child instanceof THREE.Mesh && child.material instanceof MeshStandardMaterial)
                {
                    child.material = nightVideoCeilingMaterial
                }
            })
            scene.add(ceilingWallVideo.scene)
        })
    
    // Driving Plate Controls
    const parameters = {
        dayDrivingPlate: () =>
        {
            frontWallVideo.scene.traverse((child) =>
            {
                if(child instanceof THREE.Mesh && child.material instanceof MeshStandardMaterial)
                {
                    child.material = dayVideoFrontMaterial
                }
            }),
            leftWallVideo.scene.traverse((child) =>
            {
                if(child instanceof THREE.Mesh && child.material instanceof MeshStandardMaterial)
                {
                    child.material = dayVideoLeftMaterial
                }
            }),
            rightWallVideo.scene.traverse((child) =>
            {
                if(child instanceof THREE.Mesh && child.material instanceof MeshStandardMaterial)
                {
                    child.material = dayVideoRightMaterial
                }
            }),
            ceilingWallVideo.scene.traverse((child) =>
            {
                if(child instanceof THREE.Mesh && child.material instanceof MeshStandardMaterial)
                {
                    child.material = dayVideoCeilingMaterial
                }
            })
            console.log('Day')
        },
        nightDrivingPlate: () =>
        {
            frontWallVideo.scene.traverse((child) =>
            {
                if(child instanceof THREE.Mesh && child.material instanceof MeshStandardMaterial)
                {
                    child.material = nightVideoFrontMaterial
                }
            }),
            leftWallVideo.scene.traverse((child) =>
            {
                if(child instanceof THREE.Mesh && child.material instanceof MeshStandardMaterial)
                {
                    child.material = nightVideoLeftMaterial
                }
            }),
            rightWallVideo.scene.traverse((child) =>
            {
                if(child instanceof THREE.Mesh && child.material instanceof MeshStandardMaterial)
                {
                    child.material = nightVideoRightMaterial
                }
            }),
            ceilingWallVideo.scene.traverse((child) =>
            {
                if(child instanceof THREE.Mesh && child.material instanceof MeshStandardMaterial)
                {
                    child.material = nightVideoCeilingMaterial
                }
            })
            console.log('Night')
        },
        backSeatView: () =>
        {
            if (tickMainCameraRunning == true)
            {
                tickMainCameraRunning = false
                tickAngle1()
            }
            console.log('Back Seat View')
        },
        mainCameraView: () =>
        {
            if (tickAngle1Running == true)
            {
                tickAngle1Running = false
                tickMainCamera()
            }
            console.log('Main Camera View')
        },
        mercedes: () =>
        {
            scene.remove(motorcycle.scene)
            scene.add(mercedes.scene)
        },
        motorcycle: () =>
        {
            scene.remove(mercedes.scene)
            scene.add(motorcycle.scene)
        },
        removeVehicles: () =>
        {
            scene.remove(mercedes.scene)
            scene.remove(motorcycle.scene)
        },
        syncVideos: () =>
        {
            console.log('Videos Synced')
        },
        playVideos: () =>
        {
            nightVideoLeft.play(),
            nightVideoRight.play(),
            nightVideoFront.play(),
            nightVideoCeiling.play(),
            dayVideoLeft.play(),
            dayVideoRight.play(),
            dayVideoFront.play(),
            dayVideoCeiling.play()
        },
        pauseVideos: () =>
        {
            nightVideoLeft.pause(),
            nightVideoRight.pause(),
            nightVideoFront.pause(),
            nightVideoCeiling.pause(),
            dayVideoLeft.pause(),
            dayVideoRight.pause(),
            dayVideoFront.pause(),
            dayVideoCeiling.pause()
        }
    }
    gui.add(parameters, 'dayDrivingPlate').name('Day')
    gui.add(parameters, 'nightDrivingPlate').name('Night')
    gui.add(parameters, 'mainCameraView').name('Main Camera View')
    gui.add(parameters, 'backSeatView').name('Back Seat View')
    gui.add(parameters, 'mercedes').name('Mercedes')
    gui.add(parameters, 'motorcycle').name('Motorcycle')
    gui.add(parameters, 'removeVehicles').name('Remove Vehicles')
    gui.add(parameters, 'syncVideos').name('Sync Videos')
    gui.add(parameters, 'playVideos').name('Play Videos')
    gui.add(parameters, 'pauseVideos').name('Pause Videos')

    /**
     * Lights
     */
    const ambientLight = new THREE.AmbientLight(0xffffff, 2)
    scene.add(ambientLight)
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
    directionalLight.position.set(- 5, 5, 0)
    scene.add(directionalLight)
    
    
    /**
     * Sizes
     */
    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    }
    
    window.addEventListener('resize', () =>
    {
        // Update sizes
        sizes.width = window.innerWidth
        sizes.height = window.innerHeight
    
        // Update camera
        mainCamera.aspect = sizes.width / sizes.height
        mainCamera.updateProjectionMatrix()
    
        angle1.aspect = sizes.width / sizes.height
        angle1.updateProjectionMatrix()
    
        // Update renderer
        renderer.setSize(sizes.width, sizes.height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })
    
    /**
     * Camera
     */
    // Base camera
    const mainCamera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
    mainCamera.position.set(0, 2, 5)
    scene.add(mainCamera)
    
    const angle1 = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
    angle1.position.set(0, 1, 1.35)
    scene.add(angle1)
    
    // Controls
    const controls1 = new OrbitControls(mainCamera, canvas)
    controls1.target.set(0, 0.75, 0)
    controls1.enableDamping = true
    controls1.enablePan = false
    controls1.maxDistance = 10
    controls1.minDistance = 1
    
    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
    })
    renderer.physicallyCorrectLights = true
    renderer.outputEncoding = THREE.sRGBEncoding
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    
    /**
     * Animate
     */
    const clock = new THREE.Clock()
    let previousTime = 0
    
    let tickMainCameraRunning
    let tickAngle1Running
    const tickMainCamera = () =>
    {
        tickMainCameraRunning = true
        stats.begin()
        const elapsedTime = clock.getElapsedTime()
        const deltaTime = elapsedTime - previousTime
        previousTime = elapsedTime
    
        // Model animation
        if(mixer)
        {
            mixer.update(deltaTime)
        }
    
        // Update controls
        controls1.update()
    
        // Render
        renderer.render(scene, mainCamera)
    
        // Call tick again on the next frame
        window.requestAnimationFrame(tickMainCamera)
    
        stats.end()
        if (tickMainCameraRunning == false)
        {
            tickMainCameraRunning = false
            return
        }   
    }
    const tickAngle1 = () =>
    {
        tickAngle1Running = true
        const elapsedTime = clock.getElapsedTime()
        const deltaTime = elapsedTime - previousTime
        previousTime = elapsedTime
    
        // Model animation
        if(mixer)
        {
            mixer.update(deltaTime)
        }
    
        // Update controls
    
        // Render
        renderer.render(scene, angle1)
    
        // Call tick again on the next frame
        window.requestAnimationFrame(tickAngle1)
    
        if (tickAngle1Running == false)
        {
            tickAngle1Running = false
            return
        }
    }
    
    tickMainCamera()
})