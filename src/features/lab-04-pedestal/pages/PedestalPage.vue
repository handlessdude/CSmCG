<template>
  <q-page padding>
    <div class="
        column
        q-gutter-lg
        items-center
        justify-center
      ">
      <q-card flat class="q-pa-xs">
        <GLCanvas ref="glCanvas" />
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import GLCanvas from 'src/shared/components/webgl/GLCanvas.vue';
import { fragmentShaderSource, vertexShaderSource } from 'src/shared/resources/basic-shaders';
import { onMounted, Ref, ref } from 'vue';
import { MaybeUndefined } from 'src/shared/models/generic';
import { glMatrix, mat4, ReadonlyVec3 } from 'gl-matrix';
import { usePedestalScene } from 'src/features/lab-04-pedestal/hooks/use-pedestal-scene';
import { BaseShaderProgram } from 'src/shared/utils/webgl/base-shader-program';

const glCanvas: Ref<MaybeUndefined<typeof GLCanvas>> = ref(undefined);

enum UserControls {
  CubeRotateClockwise = '1',
  CubeRotateCounterclockwise = '2',
  GroupSelfRotateClockwise = '3',
  GroupSelfRotateCounterclockwise = '4',
  GroupAbsRotateClockwise = '5',
  GroupAbsRotateCounterclockwise = '6',
}

const setupCamera = (
  program: BaseShaderProgram,
  viewConfig: {
    eye: ReadonlyVec3,
    center: ReadonlyVec3,
    up: ReadonlyVec3,
  },
  projectionConfig: {
    fovy: number,
    aspect: number,
    nearPlane: number,
    farPlane: number
  },
) => {
  const viewMatrix = new Float32Array(16);
  mat4.lookAt(viewMatrix,
    viewConfig.eye,
    viewConfig.center,
    viewConfig.up,
  );

  const projMatrix = new Float32Array(16);
  mat4.perspective(
    projMatrix,
    projectionConfig.fovy,
    projectionConfig.aspect,
    projectionConfig.nearPlane,
    projectionConfig.farPlane
  );

  program.setViewMat(viewMatrix);
  program.setProjMat(projMatrix)

  return {
    viewMatrix,
    projMatrix,
  }
}

const setupAnimation = () => {
  if (!glCanvas.value || !glCanvas.value.glContext) {
    throw new Error('No canvas context found')
  }

  const glContext = glCanvas.value.glContext as WebGL2RenderingContext;

  const program = new BaseShaderProgram(
    vertexShaderSource,
    fragmentShaderSource,
    glContext
  );

  setupCamera(program,{
      eye: [0, 5, -15],
      center: [0, 0, 0],
      up: [0, 1, 0],
    },
    {
      fovy: glMatrix.toRadian(45),
      aspect: glCanvas.value.width / glCanvas.value.height,
      nearPlane: 0.1,
      farPlane: 1000.0,
    }
  )

  const {
    runSceneLoop,
    cubeRotate,
    groupSelfRotate,
    groupAbsRotate
  } = usePedestalScene(program)

  document.addEventListener(
    'keydown',
    (event: KeyboardEvent) => {
      const key = event.key;
      if (key === UserControls.CubeRotateClockwise) cubeRotate.dec();
      if (key === UserControls.CubeRotateCounterclockwise) cubeRotate.inc();

      if (key === UserControls.GroupSelfRotateClockwise) groupSelfRotate.dec();
      if (key === UserControls.GroupSelfRotateCounterclockwise) groupSelfRotate.inc();

      if (key === UserControls.GroupAbsRotateClockwise) groupAbsRotate.dec();
      if (key === UserControls.GroupAbsRotateCounterclockwise) groupAbsRotate.inc();
    },
    false,
  );
  runSceneLoop()
};

onMounted(setupAnimation)
</script>
