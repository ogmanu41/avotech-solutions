"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export function ShaderAnimation() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<{
    camera: THREE.Camera
    scene: THREE.Scene
    renderer: THREE.WebGLRenderer
    uniforms: {
      time: { type: string; value: number }
      resolution: { type: string; value: THREE.Vector2 }
    }
    animationId: number
  } | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current

    const vertexShader = `
      void main() {
        gl_Position = vec4( position, 1.0 );
      }
    `

    // Light-mode concentric ring waves tinted toward soft blue
    const fragmentShader = `
      #define TWO_PI 6.2831853072
      #define PI 3.14159265359

      precision highp float;
      uniform vec2 resolution;
      uniform float time;

      void main(void) {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
        float t = time * 0.02;
        float lineWidth = 0.0025;

        // Base light blue-white background
        vec3 baseBg = vec3(0.98, 0.99, 1.0);

        float ringIntensity = 0.0;
        for(int j = 0; j < 3; j++){
          for(int i = 0; i < 5; i++){
            ringIntensity += lineWidth * float(i * i) / abs(
              fract(t - 0.015 * float(j) + float(i) * 0.012) * 5.0
              - length(uv)
              + mod(uv.x + uv.y, 0.25)
            );
          }
        }

        // Draw rings in primary brand blue (rgb(29, 78, 216) -> vec3(0.11, 0.31, 0.85))
        vec3 ringColor = vec3(0.11, 0.31, 0.85);

        // Blend with max 12% opacity so text remains highly readable
        vec3 finalColor = mix(baseBg, ringColor, clamp(ringIntensity * 0.12, 0.0, 0.08));

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `

    const camera = new THREE.Camera()
    camera.position.z = 1

    const scene = new THREE.Scene()
    const geometry = new THREE.PlaneGeometry(2, 2)

    const uniforms = {
      time: { type: "f", value: 1.0 },
      resolution: { type: "v2", value: new THREE.Vector2() },
    }

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
    })

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    const onResize = () => {
      const width = container.clientWidth
      const height = container.clientHeight
      renderer.setSize(width, height)
      uniforms.resolution.value.x = renderer.domElement.width
      uniforms.resolution.value.y = renderer.domElement.height
    }

    onResize()
    window.addEventListener("resize", onResize, false)

    let animationId = 0

    const animate = () => {
      animationId = requestAnimationFrame(animate)
      uniforms.time.value += 0.03
      renderer.render(scene, camera)
      if (sceneRef.current) {
        sceneRef.current.animationId = animationId
      }
    }

    sceneRef.current = { camera, scene, renderer, uniforms, animationId: 0 }
    animate()

    return () => {
      window.removeEventListener("resize", onResize)
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId)
        if (container && sceneRef.current.renderer.domElement.parentNode === container) {
          container.removeChild(sceneRef.current.renderer.domElement)
        }
        sceneRef.current.renderer.dispose()
        geometry.dispose()
        material.dispose()
        sceneRef.current = null
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        inset: 0,
        background: "#F8FAFC",
        overflow: "hidden",
      }}
    />
  )
}
