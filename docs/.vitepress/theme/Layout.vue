<script setup>
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { nextTick, provide,ref} from 'vue'
import  Twikoo  from './Twikoo.vue'
import './rain.scss'
const { isDark } = useData()

const enableTransitions = () =>
  'startViewTransition' in document &&
  window.matchMedia('(prefers-reduced-motion: no-preference)').matches

provide('toggle-appearance', async ({ clientX: x, clientY: y }) => {
  if (!enableTransitions()) {
    isDark.value = !isDark.value
    return
  }

  const clipPath = [
    `circle(0px at ${x}px ${y}px)`,
    `circle(${Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y)
    )}px at ${x}px ${y}px)`
  ]

  await document.startViewTransition(async () => {
    isDark.value = !isDark.value
    await nextTick()
  }).ready

  document.documentElement.animate(
    { clipPath: isDark.value ? clipPath.reverse() : clipPath },
    {
      duration: 300,
      easing: 'ease-in',
      pseudoElement: `::view-transition-${isDark.value ? 'old' : 'new'}(root)`
    }
  )
})

// mouse event
const cursorPosition = ref({
  x: -50,
  y: -50
})

function updateCursorPosition(e){
  cursorPosition.value = {
    x: e.clientX,
    y: e.clientY + window.scrollY
  };
}

const windowWidth = ref(window.innerWidth);

</script>

<template>
  <DefaultTheme.Layout @mousemove="updateCursorPosition">
    <template #layout-top>
      <div v-for="i in 20" :key="i" class="rain" :class="['drop' + i,isDark ? 'dark' : 'light']" :style="{ left: i * (windowWidth / 21) + 'px' }"></div>
      <img class="hidden md:block myCursor" src="/cursor.png" :style="{ left: cursorPosition.x+'px', top: cursorPosition.y+'px' }" >
    </template>
    <template #doc-after>
      <Twikoo></Twikoo>
    </template>
    <template #nav-bar-title-after>
      <div>
        <img style="margin-left:8px" src="https://visitor-badge.laobi.icu/badge?page_id=zihyinhsu.visitor-badge&left_color=%23797d63&right_color=green&left_text=visitors" alt="visitor-count">
      </div>
    </template>
  </DefaultTheme.Layout>

</template>

<style lang="scss">
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

::view-transition-old(root),
.dark::view-transition-new(root) {
  z-index: 1;
}

::view-transition-new(root),
.dark::view-transition-old(root) {
  z-index: 9999;
}

.VPSwitchAppearance {
  width: 22px !important;
}

.VPSwitchAppearance .check {
  transform: none !important;
}


.embed-container {
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
  max-width: 100%;

  iframe,
  object,
  embed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
</style>