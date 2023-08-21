<template>
  <!-- 消息列表 -->
  <div class="sa-message sa-flex-col" v-if="chatList.length">
    <div class="message-list sa-m-b-20" v-for="(item, index) in chatList" :key="index">
      <!-- 系统+日期 -->
      <div class="sa-flex sa-col-center sa-row-center">
        <div v-if="item.from == 'system'" class="message-system sa-m-b-20">
          {{ item.content.text }}
        </div>
        <div v-if="item.from != 'system' && showTime(item, index)" class="message-date sa-m-b-20">
          {{ formatTime(item.date) }}
        </div>
      </div>

      <!-- 其他 -->
      <div
        class="sa-flex"
        :class="[
          item.from == 'customer_service'
            ? `sa-row-right`
            : item.from == 'customer'
            ? `sa-row-left`
            : '',
        ]"
      >
        <span
          v-if="
            item.from === 'customer_service' &&
            index == chatStore.chatList.length - 1 &&
            chatStore.isSendSucces != 0
          "
          class="send-status"
        >
          <!-- <image
                v-if="chatStore.isSendSucces == -1"
                class="loading"
                :src="sheep.$url.static('/static/images/chat/loading.png')"
                mode="aspectFill"
              ></image>
              <image
                v-if="chatStore.isSendSucces == 1"
                class="warning"
                :src="sheep.$url.static('/static/images/chat/warning.png')"
                mode="aspectFill"
                @click="onAgainSendMessage(item)"
              ></image> -->
          <img
            v-if="chatStore.isSendSucces == -1"
            class="loading"
            src="/static/images/chat/loading.png"
          />
          <img
            v-if="chatStore.isSendSucces == 1"
            class="warning"
            src="/static/images/chat/warning.png"
            @click="onAgainSendMessage(item)"
          />
        </span>
        <!-- <sa-image
          v-if="item.from == 'customer'"
          class="sa-m-r-12"
          :url="checkUrl(item?.sender?.avatar)"
          size="40"
        ></sa-image> -->
        <div
          :class="[
            item.from == 'customer_service'
              ? `message-right`
              : item.from == 'customer'
              ? ` message-left`
              : '',
            `message-${item.mode}`,
          ]"
        >
          <!-- 文本 -->
          <template v-if="item.mode == 'text'">
            <div
              class="message-text"
              @click="onRichtext"
              v-html="replaceEmoji(item.content.text)"
            ></div>
          </template>

          <!-- 图片预览 -->
          <el-image-viewer
            v-if="showViewer"
            ref="elImageViewer"
            @close="onClose"
            :url-list="viewerUrlList"
          />

          <!-- 图片 -->
          <template v-if="item.mode == 'image'">
            <el-image
              class="message-img"
              fit="cover"
              :src="item.content.url"
              :preview-src-list="[item.content.url]"
              hide-on-click-modal
            >
            </el-image>
          </template>

          <!-- 商品 -->
          <template v-if="item.mode == 'goods'">
            <div class="message-card" @click="onGoodsDetail(item.content.item.id)">
              <div class="sa-flex sa-col-center">
                <el-avatar
                  class="sa-m-r-8"
                  shape="square"
                  :size="40"
                  fit="cover"
                  :src="checkUrl(item.content.item.image)"
                >
                  <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
                </el-avatar>
                <div class="">
                  <div class="card-title sa-m-b-8 sa-line-1">
                    {{ item.content.item.title }}
                  </div>
                  <div class="sa-flex sa-col-center">
                    <!-- <span class="tag-text sa-m-r-8">{{item.content.tag}}</span> -->
                    <span class="price-text">
                      {{
                        isArray(item.content.item.price)
                          ? item.content.item.price[0]
                          : item.content.item.price
                      }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <!-- 订单 -->
          <template v-if="item.mode == 'order'">
            <div class="message-card" @click="onOrderDetail(item.content.item.id)">
              <div class="order-sn sa-line-1 sa-m-b-10">
                订单号:{{ item.content.item.order_sn }}
              </div>
              <div class="order-goods sa-flex sa-col-center">
                <el-avatar
                  class="sa-m-r-8"
                  shape="square"
                  :size="40"
                  fit="cover"
                  :src="checkUrl(item.content.item.items[0].goods_image)"
                >
                  <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
                </el-avatar>
                <div class="sa-flex-1">
                  <div class="card-title sa-m-b-8 sa-line-1">
                    {{ item.content.item.items[0].goods_title }}
                  </div>
                  <div class="sa-flex sa-row-between">
                    <span>共{{ item.content.item.items.length }}件商品</span>
                    <span>合计 ¥{{ item.content.item.pay_fee }}</span>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
        <!-- <sa-image
          v-if="item.from == 'customer_service'"
          class="sa-m-l-12"
          :url="checkUrl(item?.sender?.avatar || customerService.avatar)"
          size="40"
        ></sa-image> -->
      </div>
    </div>
  </div>
</template>

<script>
  /**
   * SaMessage -chat组件的聊天窗口列表
   * @property {Array} chatList -vuex里面获取聊天列表
   */
  import {
    computed,
    defineComponent,
    inject,
    nextTick,
    onUnmounted,
    reactive,
    ref,
    unref,
    watch,
  } from 'vue';

  import { ElImageViewer } from 'element-plus';
  import dayjs from 'dayjs';
  import emojiData from './emoji.json';
  import { checkUrl } from '@/sheep/utils/checkUrlSuffix';
  import { isArray } from 'lodash';
  import { useModal } from '@/sheep/hooks';
  import sheep from '@/sheep';
  import GoodsEdit from '@/app/shop/admin/goods/goods/edit.vue';
  import OrderDetail from '@/app/shop/admin/order/order/detail.vue';

  export default defineComponent({
    name: 'ChatMessage',
    components: { ElImageViewer },
    setup() {
      const chatStore = sheep.$store('socket');
      // 消息列表
      const chatList = computed(() => chatStore.chatList);

      const customerService = computed(() => chatStore.customerService);

      // 图片预览
      const showViewer = ref(false);
      let viewerUrlList = reactive([]);

      // 点击富文本内容
      const onRichtext = (e) => {
        if (e.target.nodeName == 'IMG') {
          showViewer.value = true;
          viewerUrlList = [e.target.currentSrc];
        }
      };
      // 关闭预览
      const onClose = () => {
        showViewer.value = false;
      };

      // 是否显示时间
      let dateString = '';
      watch(chatList, (cur, pre) => {
        if (chatList.length) {
          dateString = dayjs(unref(chatList)[0].date).fromNow();
        }
      });
      const showTime = (item, index) => {
        if (unref(chatList)[index + 1]) {
          if (dateString == dayjs(unref(item).date).fromNow()) {
            return false;
          } else {
            dateString = dayjs(unref(item).date).fromNow();
            return true;
          }
        }
        return false;
      };

      // 格式化时间
      const formatTime = (time) => {
        let diffTime = new Date().getTime() - time;
        if (diffTime > 28 * 24 * 60 * 1000) {
          return dayjs(time).format('MM/DD HH:mm');
        }
        if (diffTime > 360 * 28 * 24 * 60 * 1000) {
          return dayjs(time).format('YYYY/MM/DD HH:mm');
        }
        return dayjs(time).fromNow();
      };

      function selEmojiFile(name) {
        for (let index in emojiData) {
          if (emojiData[index].name == name) {
            return emojiData[index].file;
          }
        }
        return false;
      }

      function replaceEmoji(data) {
        let newData = data;
        if (typeof newData != 'object') {
          let reg = /\[(.+?)\]/g; // [] 中括号
          let zhEmojiName = newData.match(reg);
          if (zhEmojiName) {
            zhEmojiName.forEach((item) => {
              let emojiFile = selEmojiFile(item);
              newData = newData.replace(
                item,
                `<img class="chat-img" style="width:25px;height:25px;margin:0 3px" src="${checkUrl(
                  '/static/img/chat/emoji/' + emojiFile,
                )}"/>`,
              );
            });
          }
        }
        return newData;
      }

      function onGoodsDetail(id) {
        useModal(
          GoodsEdit,
          {
            title: `商品`,
            type: 'edit',
            id,
          },
          {
            confirm: () => {},
          },
        );
      }

      function onOrderDetail(id) {
        useModal(
          OrderDetail,
          {
            title: `订单`,
            id,
          },
          {
            confirm: () => {},
          },
        );
      }

      function onAgainSendMessage(item) {
        chatStore.socket_send(item);
      }

      return {
        sheep,
        chatStore,
        isArray,
        checkUrl,
        showViewer,
        viewerUrlList,
        chatList,
        onRichtext,
        onClose,
        showTime,
        formatTime,
        replaceEmoji,
        onGoodsDetail,
        onOrderDetail,
        customerService,
        onAgainSendMessage,
      };
    },
  });
</script>
<style lang="scss">
  .message-text {
    div,
    span,
    p {
      white-space: normal;
    }
    img {
      width: 100%;
    }
  }
</style>

<style lang="scss" scoped>
  .sa-message {
    padding: 17px;
    .send-status {
      color: #333;
      height: 40px;
      margin-right: 4px;
      display: flex;
      align-items: center;

      .loading {
        width: 16px;
        height: 16px;
        -webkit-animation: rotating 2s linear infinite;
        animation: rotating 2s linear infinite;

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

      .warning {
        width: 16px;
        height: 16px;
        color: #ff3000;
      }
    }
    .message-right {
      background: var(--t-bg-active);
      border-radius: 8px 2px 8px 8px;
      padding: 12px;
      color: var(--sa-font);
    }
    .message-left {
      background: var(--sa-table-header-bg);
      border-radius: 2px 8px 8px 8px;
      padding: 12px;
      align-self: flex-start;
      color: var(--sa-font);
    }
    .message-list {
      // 日期
      .message-date {
        color: var(--sa-subfont);
        font-size: 12px;
      }

      // 普通文本
      .message-text {
        max-width: 200px;
        font-size: 14px;
        color: var(--sa-font);
        white-space: normal;
        word-break: break-all;
        word-wrap: break-word;
      }

      // 图片
      .message-img {
        width: 100px;
        height: 100px;
        border-radius: 6px;
      }

      // 商品订单
      .message-card {
        .order-sn {
          width: 200px;
          font-size: 12px;
          color: var(--t-color-primary);
        }
        .card-title {
          width: 180px;
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
        .order-goods {
          background: var(--sa-background-assist);
          padding: 8px;
        }
        .order-total {
          width: 100%;
          line-height: 14px;
          font-size: 12px;
          font-weight: 400;
          color: var(--sa-font);
        }
      }
    }
  }
</style>
