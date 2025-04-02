<template>
  <div class="theme-switch">
    <el-button
      :type="isDark ? 'primary' : 'default'"
      @click="handleThemeSwitch"
      class="switch-btn"
    >
      <el-icon>
        <Sunny v-if="isDark" />
        <Moon v-else />
      </el-icon>
      {{ isDark ? '浅色模式' : '深色模式' }}
    </el-button>
    <div ref="maskRef" class="theme-mask"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Sunny, Moon } from '@element-plus/icons-vue'
import { useSettingStore } from '@/store/modules/setting'

const settingStore = useSettingStore()
const maskRef = ref<HTMLElement | null>(null)

const isDark = computed(() => settingStore.systemThemeType === 'dark')

// 处理主题切换
const handleThemeSwitch = (event: MouseEvent) => {
  const { clientX, clientY } = event
  const mask = maskRef.value
  
  if (mask) {
    // 设置动画起始点
    const maskBefore = mask.querySelector('::before') as HTMLElement
    if (maskBefore) {
      maskBefore.style.left = `${clientX}px`
      maskBefore.style.top = `${clientY}px`
    }
    
    // 添加扩展动画类
    mask.classList.add('expanding')
    
    // 切换主题
    setTimeout(() => {
      settingStore.systemThemeType = isDark.value ? 'light' : 'dark'
      
      // 移除动画类，准备下一次切换
      setTimeout(() => {
        mask.classList.remove('expanding')
      }, 1000)
    }, 100)
  }
}
</script>

<style lang="scss" scoped>
.theme-switch {
  position: relative;
  
  .switch-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    
    .el-icon {
      font-size: 16px;
    }
  }
}
</style> 