<template>
  <div class="chat-tools sa-flex">
    <!-- 表情 -->
    <el-popover v-model:visible="emojiVisible" placement="top-start" :width="260" trigger="click">
      <template #reference>
        <button class="sa-reset-button tool-btn">
          <sa-svg class="tool-icon" name="sa-biaoqing" size="18"></sa-svg>
        </button>
      </template>
      <ul class="sa-flex sa-flex-wrap">
        <li
          class="sa-flex sa-row-center sa-col-center emoji-icon"
          @click="onEmoji(item)"
          @mousedown.prevent
          v-for="(item, index) in emojiData"
          :key="index"
        >
          <el-avatar
            shape="square"
            style="background: transparent"
            :size="20"
            :src="checkUrl('/static/img/chat/emoji/' + item.file)"
          ></el-avatar>
        </li>
      </ul>
    </el-popover>

    <!-- 常用语 -->
    <el-popover placement="top-start" :width="200" trigger="click" popper-class="popover-box">
      <template #reference>
        <button class="sa-reset-button tool-btn">
          <sa-svg class="tool-icon" name="sa-changyongyu-011" size="18"></sa-svg>
        </button>
      </template>
      <h5 class="popover-title">常用语</h5>
      <ul class="hot-box">
        <li
          class="hot-example sa-line-1"
          @click="onHotItem(item.content)"
          v-for="item in commonWords"
          :key="item.id"
        >
          {{ item.name }}
        </li>
      </ul>
    </el-popover>

    <!-- 文件 -->
    <button class="sa-reset-button tool-btn" @click="selectFile">
      <sa-svg class="tool-icon" name="sa-wenjian-01" size="18"></sa-svg>
    </button>
  </div>
</template>

<script>
  /**
   * SaToolbar - chat的工具栏
   * @event change - return,返回数据的类型，data.
   */
  import { defineComponent, ref, computed, watch } from 'vue';
  import { checkUrl } from '@/sheep/utils/checkUrlSuffix';
  import emojiData from './emoji.json';
  import { useFile, useModal } from '@/sheep/hooks';
  import sheep from '@/sheep';

  export default defineComponent({
    name: 'ChatToolbar',
    props: {
      showChat: Boolean,
    },
    setup(props, { emit }) {
      const chatStore = sheep.$store('socket');

      // 发送表情
      const emojiVisible = ref(false);
      const onEmoji = (item) => {
        let data = {
          from: 'customer_service',
          mode: 'emoji',
          date: new Date().getTime(),
          content: {
            url: item.file,
          },
        };
        emit('change', data);
        emojiVisible.value = false;
      };
      watch(
        () => props.showChat,
        () => {
          if (!props.showChat) {
            emojiVisible.value = false;
          }
        },
      );

      const commonWords = computed(() => chatStore.commonWords);
      // 点击常用语
      const onHotItem = (content) => {
        let data = {
          from: 'customer_service',
          mode: 'text',
          date: new Date().getTime(),
          content: {
            text: content,
          },
        };
        emit('change', data);
      };

      // 输入链接
      const inputLink = ref('');

      // 选择文件
      const selectFile = () => {
        useFile(
          {
            fileType: 'image',
          },
          {
            confirm: (data) => {
              let chatData = {
                from: 'customer_service',
                mode: 'image',
                date: new Date().getTime(),
                content: {
                  url: checkUrl(data.url),
                  path: data.url,
                },
              };
              emit('change', chatData);
            },
          },
        );
      };

      return {
        emojiVisible,
        onHotItem,
        onEmoji,
        commonWords,
        emojiData,
        inputLink,
        checkUrl,
        selectFile,
      };
    },
  });
</script>
<style>
  .popover-box {
    padding: 0 !important;
  }
</style>
<style lang="scss" scoped>
  .popover-title {
    font-size: 14px;
    color: #8c8c8c;
    height: 40px;
    line-height: 40px;
    padding-left: 17px;
    border-bottom: 1px solid var(--sa-border);
  }

  .emoji-icon {
    width: 25px;
    height: 25px;
  }

  // 工具栏
  .chat-tools {
    .tool-btn {
      width: fit-content;
      padding: 0;
      margin-right: 12px;
    }

    .tool-icon {
      color: var(--sa-font);
      font-size: 22px;
    }
  }

  //   常用语
  .hot-box {
    .hot-example {
      color: var(--sa-font);
      font-size: 14px;
      height: 40px;
      line-height: 40px;
      border-bottom: 1px solid var(--sa-border);
      padding-left: 20px;

      &:hover {
        background: rgba(128, 106, 246, 0.08);
      }
    }
  }

  //   商品
  .goods-box {
    .goods-list {
      padding: 11px 17px;

      &:hover {
        background: rgba(128, 106, 246, 0.08);
      }

      .card-title {
        width: 200px;
        font-size: 14px;
        color: var(--sa-font);
      }

      .tag-text {
        color: #ff4d4f;
        font-size: 12px;
      }

      .price-text {
        color: #ff4d4f;
        font-size: 12px;
      }

      .stock-num {
        color: #999999;
        font-size: 12px;
      }
    }
  }
</style>
