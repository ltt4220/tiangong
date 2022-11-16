<template>
  <div class="three-common">
    <img v-show="isLoading" src="../../assets/images/culture-gather/load.gif" alt="" class="loading-common">
  </div>
</template>

<script>
import * as THREE from 'three';
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js';
import {
    GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {
    RoomEnvironment
} from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
    FXAAShader
} from 'three/examples/jsm/shaders/FXAAShader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
let camera, scene, renderer, controls, clock, elf,composer;
export default {
    name: 'threeCommon',
    props: {
        type: {
            type: String,
            default: 'obj'
        },
        url: {
            type: String,
            default: 'https://culturecloud-whg.oss-cn-shanghai.aliyuncs.com/SheenChair.glb'
        }
    },
    data() {
        return {
            camera: null,
            scene: null,
            renderer: null,
            controls: null,
            isLoading:true,
        }
    },
    mounted() {
        this.init();
        this.animate();
        // this.render();

    },
    methods: {
        init() {
            const container = document.querySelector('.three-common');
            //透视相机
            camera = new THREE.PerspectiveCamera(45, 1.27, 1, 20);
            // 设置相机位置(眼睛位置或者说相机篇拍照位置)
            camera.position.set(25, 5, 15);
            camera.up.y=1;
            camera.lookAt(0,0,0);
            // console.log(camera.getFilmHeight (),camera.getFilmWidth ())
            //创建一个新的场景对象
            scene = new THREE.Scene();
            //旋转
            clock = new THREE.Clock();

            //环境光
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
            scene.add(ambientLight);
            //平行光
            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
            //设置光源的位置
            directionalLight.position.set(5, 1, 0).normalize();
            //将光源加入场景
            scene.add(directionalLight);
            //法线添加
            // scene.add( new THREE.AxesHelper( 50 ) );
            new GLTFLoader().setPath('static/gltf/gltf1/').load('GLTF.gltf',  (gltf)=> {
                scene.add(gltf.scene);
                elf = gltf.scene;
                 this.isLoading =false;
            });
            //创建WebGLRenderer渲染器
            renderer = new THREE.WebGLRenderer({
                antialias: true,
                alpha: true,
            });
            
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerWidth-55);
            //光源的设置真实度
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            //色调映射曝光度
            renderer.toneMappingExposure = 0.1;
            renderer.outputEncoding = THREE.sRGBEncoding;
           
            //去掉锯齿
            composer = new EffectComposer(renderer);
            var FXAAShaderPass = new ShaderPass(FXAAShader);
            FXAAShaderPass.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / (window.innerWidth-55));
            FXAAShaderPass.renderToScreen = true;
            composer.addPass(FXAAShaderPass);
            container.appendChild(renderer.domElement);
            
            const environment = new RoomEnvironment();
            const pmremGenerator = new THREE.PMREMGenerator(renderer);
            scene.environment = pmremGenerator.fromScene(environment).texture;
          
            //轨道控制器
            controls = new OrbitControls(camera, renderer.domElement);
            // 使用阻尼,指定是否有惯性
            controls.enableDamping = true;
            // 是否可以缩放
            controls.enableZoom = true;
            //是否自动旋转
            controls.autoRotate = false;
            //设置相机距离原点的最近距离
            controls.minDistance = 2.5;
            //设置相机距离原点的最远距离
            controls.maxDistance = 2;
            //绽放中心点
            // controls.target.set(0, 0.35, 0);
            //上下翻转最大角度
            // controls.maxPolarAngle = Math.PI / 2;
            controls.update();
            //是否开启右键拖拽
            controls.enablePan = false;
            window.addEventListener('resize', this.onWindowResize);

        },
        onWindowResize() {
            camera.aspect = 1.27;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerWidth - 55);

        },
        animate() {

            requestAnimationFrame(this.animate);

            controls.update(); // required if damping enabled
           
            this.render();
           
        },
        render() {
            const delta = clock.getDelta();

            if (elf !== undefined) {

                elf.rotation.y += delta * 0.5;

            }
            // composer.render();
            renderer.render(scene, camera);
             

        }
    },
}
</script>
<style lang="scss">
.loading-common {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%);
  width: 80px;
  height: 80px;
}
</style>
