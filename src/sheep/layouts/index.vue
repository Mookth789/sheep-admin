<template>
  <el-container v-if="appInited" class="app-layout" :class="{ collapse: appLayout.collapse }">
    <div class="app-layout__mask" @click="onChangeCollapse(true)"></div>
    <el-main class="sa-p-0">
      <el-container>
        <el-aside class="app-layout__left">
          <app-menu />
          <!-- <app-children-menu v-if="appChildrenMenu.length > 0" :menuStyle="menuStyle" /> -->
        </el-aside>
        <el-main class="app-layout__right sa-p-0">
          <div v-if="appLayout.showTaskbar" class="app-layout__taskbar">
            <taskbar />
          </div>
          <div class="app-layout__container">
            <div class="app-layout__view" v-loading="appLayout.pageLoading">
              <router-view v-slot="{ Component, route }">
                <keep-alive :include="taskbarHistory">
                  <component :is="Component" :key="route.fullPath" />
                </keep-alive>
              </router-view>
            </div>
          </div>
        </el-main>
      </el-container>
    </el-main>
    <el-footer class="app-layout__footer">
      <div class="sa-flex sa-flex-1">
        <div
          class="oper-icon sa-m-r-12"
          :class="appLayout.collapse ? 'fold' : 'open'"
          @click="onChangeCollapse"
        >
          <sa-icon icon="sa-first_page" size="16" />
        </div>
        <div class="app-name">{{ appInfo.name }}</div>
        <el-divider direction="vertical" />
      </div>
      <div class="sa-flex">
        <el-divider direction="vertical" />
        <sa-svg
          class="oper-icon"
          :style="{
            '-webkit-animation': `rotating ${rotateSpeed}s linear infinite`,
            animation: `rotating ${rotateSpeed}s linear infinite`,
          }"
          name="sa-shop-refresh"
          size="16"
        ></sa-svg>
      </div>
    </el-footer>
    <sa-file-modal />
    <sa-modal />
    <sa-drawer />
    <div class="sa-float">
      <sa-notice />
      <sa-chat />
    </div>
  </el-container>
</template>

<script setup>
  import { computed } from 'vue';
  import { useApp } from '@/sheep/hooks';
  import AppMenu from './menu/index.vue';
  import Taskbar from './taskbar/index.vue';
  import SaModal from '@/sheep/components/sa-modal/sa-modal.vue';
  import SaFileModal from '@/sheep/components/sa-file/sa-file-modal.vue';
  import SaDrawer from '@/sheep/components/sa-drawer/sa-drawer.vue';
  import SaChat from '@/app/chat/components/chat/index.vue';
  import SaNotice from '@/app/chat/components/notice/index.vue';
  import sheep from '@/sheep';

  const appStore = sheep.$store('app');
  const { appInited, appInfo, appLayout, requestCounter, menuStyle, appChildrenMenu } = useApp();
  const taskbarHistory = computed(() => appStore.taskbar.history);
  const rotateSpeed = computed(() => {
    let speed = 0;
    if (requestCounter.value == 0) return speed;
    if (3 - requestCounter.value * 0.6 <= 0) return 0.5;
    return (3 - requestCounter.value * 0.6).toFixed(2);
  });

  function onChangeCollapse() {
    appStore.menuCollapse(!appLayout.value.collapse);
  }
</script>

<style lang="scss" scoped>
  .el-container {
    height: 100%;
    position: relative;
    .sa-float {
      position: absolute;
      right: 24px;
      bottom: 54px;
      z-index: 100;
      & > div {
        margin-bottom: 12px;
      }
      & > div:last-of-type {
        margin-bottom: 0;
      }
      :deep() {
        .sa-float-icon-wrap {
          width: 40px;
          height: 40px;
          background: var(--sa-background-assist);
          box-shadow: 0px 1px 16px #e4e4e4;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          .sa-float-icon {
            color: var(--el-color-primary);
          }
          &:hover {
            background: var(--sa-table-header-bg);
          }
        }
      }
    }
  }
  .app-layout {
    height: 100%;
    background: var(--sa-background-assist);

    &__mask {
      width: 100%;
      height: 100%;
      background: rgba(100, 100, 100, 0.7);
      backdrop-filter: blur(2px);
      position: fixed;
      left: 0;
      top: 0;
      z-index: 10000;
    }

    &__left {
      width: unset;
      max-width: 300px;
      height: 100%;
      display: flex;
      overflow: hidden;
      z-index: 100;
      transition: all 0.2s ease-in-out;

      * {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
    }

    &__right {
      height: 100%;
      display: flex;
      flex-direction: column;
      position: relative;
    }

    &__taskbar {
      // border-bottom: 1px solid var(--sa-border);
    }

    &__container {
      width: 100%;
      box-sizing: border-box;
      flex: 1;
      overflow: hidden;
    }

    &__view {
      height: 100%;
      width: 100%;
      padding: 0 16px;
      display: flex;
      flex-direction: column;
      overflow: hidden auto;
    }

    &__modal {
      // height: 36px;
      // border-top: 1px solid var(--sa-space);
    }

    &__footer {
      --el-footer-padding: 0 16px;
      --el-footer-height: 30px;
      color: var(--sa-footer-color);
      background: var(--sa-footer-bg);
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
      overflow: hidden;
      .app-name {
        font-weight: 400;
      }
      .el-divider--vertical {
        --el-border-color: var(--sa-footer-color-1);
        margin: 0 16px;
      }
      .oper-icon {
        cursor: pointer;
        &.fold {
          transform: rotateZ(180deg);
          transition: transform 0.25s linear;
        }
        &.open {
          transform: rotateZ(0deg);
          transition: transform 0.25s linear;
        }

        &.refresh {
          -webkit-animation: rotating 3s linear infinite;
          animation: rotating 3s linear infinite;
        }
      }
      .modal-oper {
        position: relative;
        flex: 1;
        height: 32px;
      }

      @media only screen and (max-width: 768px) {
        --el-footer-height: 36px;
        .modal-oper {
          display: none;
        }
      }
    }

    @media only screen and (max-width: 768px) {
      .app-layout__left {
        position: absolute;
        left: 0;
        z-index: 10000;
        transition: transform 0.3s ease-in-out;
      }
      &.collapse {
        .app-layout__left {
          transform: translateX(-100%);
        }

        .app-layout__mask {
          display: none;
        }
      }
    }
    @media only screen and (min-width: 768px) {
      .app-layout__mask {
        display: none;
      }
      &.collapse {
        .app-layout__left {
          max-width: 56px;
        }
      }
    }

    @-webkit-keyframes rotating {
      0% {
        transform: rotateZ(0);
      }

      100% {
        transform: rotateZ(360deg);
      }
    }

    @keyframes rotating {
      0% {
        transform: rotateZ(0);
      }

      100% {
        transform: rotateZ(360deg);
      }
    }
  }
</style>
