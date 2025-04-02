<template>
  <div class="left-view">
    <div class="logo">
      <img src="@/assets/images/logo.svg" alt="logo" class="logo-img" />
      <h1 class="title">{{ systemName }}</h1>
    </div>
    
    <div class="content">
      <div class="world-map">
        <img src="@/assets/images/login/world-map.svg" alt="world-map" class="world-map-img" />
      </div>
      
      <div class="airplane-container">
        <img src="@/assets/images/login/airplane.svg" alt="airplane" class="airplane airplane-1" />
        <img src="@/assets/images/login/airplane.svg" alt="airplane" class="airplane airplane-2" />
        <img src="@/assets/images/login/airplane.svg" alt="airplane" class="airplane airplane-3" />
      </div>
      
      <div class="map-container">
        <div class="route-line"></div>
        <div class="location-markers">
          <div class="marker marker-1"></div>
          <div class="marker marker-2"></div>
          <div class="marker marker-3"></div>
        </div>
      </div>
      
      <div class="notam-cards">
        <div class="notam-card">
          <div class="notam-header">
            <span class="notam-id">A1234/23</span>
            <span class="notam-type">机场</span>
          </div>
          <div class="notam-content">跑道维护通知</div>
        </div>
        <div class="notam-card">
          <div class="notam-header">
            <span class="notam-id">B5678/23</span>
            <span class="notam-type">导航</span>
          </div>
          <div class="notam-content">导航设备升级</div>
        </div>
      </div>
    </div>

    <div class="text-wrap">
      <h1>{{ $t('login.leftView.title') }}</h1>
      <p>{{ $t('login.leftView.subTitle') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SystemInfo } from '@/config/setting'

const systemName = SystemInfo.name
</script>

<style lang="scss" scoped>
.left-view {
  height: 100%;
  padding: 40px;
  position: relative;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, var(--el-color-primary-light-9) 0%, var(--el-color-primary-light-7) 100%);
  overflow: hidden;

  .logo {
    display: flex;
    align-items: center;
    gap: 12px;
    z-index: 2;

    .logo-img {
      width: 40px;
      height: 40px;
    }

    .title {
      font-size: 24px;
      font-weight: 600;
      color: var(--el-color-primary);
      margin: 0;
    }
  }

  .content {
    flex: 1;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
    overflow: hidden;

    .world-map {
      position: absolute;
      width: 100%;
      height: 100%;
      opacity: 0.15;
    }

    .airplane-container {
      position: absolute;
      width: 100%;
      height: 100%;

      .airplane {
        position: absolute;
        width: 32px;
        height: 32px;
        color: var(--el-color-primary);
        
        &-1 {
          top: 30%;
          left: -32px;
          animation: flight-path-1 20s linear infinite;
        }
        
        &-2 {
          top: 50%;
          left: -32px;
          animation: flight-path-2 25s linear infinite;
          animation-delay: 5s;
        }
        
        &-3 {
          top: 70%;
          left: -32px;
          animation: flight-path-3 22s linear infinite;
          animation-delay: 10s;
        }
      }
    }

    .map-container {
      position: absolute;
      width: 100%;
      height: 100%;
      opacity: 0.2;

      .route-line {
        position: absolute;
        width: 80%;
        height: 2px;
        background: var(--el-color-primary);
        top: 50%;
        left: 10%;
        transform: rotate(-30deg);
        
        &::before {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, var(--el-color-primary) 50%, transparent 50%);
          background-size: 20px 100%;
          animation: dash 20s linear infinite;
        }
      }

      .location-markers {
        .marker {
          position: absolute;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--el-color-primary);
          transform: translate(-50%, -50%);

          &::before {
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: var(--el-color-primary);
            animation: pulse 2s ease-out infinite;
          }

          &-1 { top: 30%; left: 20%; }
          &-2 { top: 50%; left: 50%; }
          &-3 { top: 70%; left: 80%; }
        }
      }
    }

    .notam-cards {
      position: absolute;
      right: 40px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      
      .notam-card {
        width: 240px;
        padding: 16px;
        background: var(--el-bg-color-overlay);
        border-radius: 8px;
        box-shadow: var(--el-box-shadow-light);
        transform: translateX(100%);
        animation: slideIn 0.5s ease forwards;
        
        &:nth-child(2) {
          animation-delay: 0.2s;
        }

        .notam-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;

          .notam-id {
            font-size: 14px;
            font-weight: 500;
            color: var(--el-color-primary);
          }

          .notam-type {
            padding: 2px 8px;
            font-size: 12px;
            color: var(--el-color-primary);
            background: var(--el-color-primary-light-9);
            border-radius: 12px;
          }
        }

        .notam-content {
          font-size: 14px;
          color: var(--el-text-color-primary);
        }
      }
    }
  }

  .text-wrap {
    text-align: center;
    z-index: 2;
    margin-bottom: 40px;

    h1 {
      font-size: 32px;
      font-weight: 600;
      color: var(--el-color-primary);
      margin: 0 0 16px;
    }

    p {
      font-size: 16px;
      color: var(--el-text-color-secondary);
      margin: 0;
    }
  }
}

@keyframes flight-path-1 {
  0% {
    transform: translate(0, 0) rotate(-15deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translate(calc(100vw + 32px), -100px) rotate(-15deg);
    opacity: 0;
  }
}

@keyframes flight-path-2 {
  0% {
    transform: translate(0, 0) rotate(-5deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translate(calc(100vw + 32px), -50px) rotate(-5deg);
    opacity: 0;
  }
}

@keyframes flight-path-3 {
  0% {
    transform: translate(0, 0) rotate(5deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translate(calc(100vw + 32px), 50px) rotate(5deg);
    opacity: 0;
  }
}

@keyframes dash {
  to {
    background-position: -20px 0;
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(3);
    opacity: 0;
  }
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
