<template>
  <div class="sa-chat">
    <div class="sa-float-icon-wrap">
      <el-badge
        is-dot
        :hidden="connection.status != 'connect' || !allChatDot"
        @click="onShowDrawer"
      >
        <sa-svg
          v-if="connection.status === 'reconnect_failed'"
          class="sa-float-icon"
          name="sa-chat-icon1"
          size="20"
        ></sa-svg>
        <sa-svg v-else class="sa-float-icon" name="sa-chat-icon" size="24"></sa-svg>
      </el-badge>
    </div>

    <!-- 聊天弹窗 -->
    <el-drawer
      v-model="showChat"
      direction="rtl"
      custom-class="chat-drawer"
      modal-class="chat-drawer-overlay"
      :show-close="false"
      :with-header="false"
    >
      <el-container class="chat-container">
        <!-- 连接成功 -->
        <template v-if="connection.status == 'connect'">
          <el-header class="chat-header sa-flex">
            <div class="sa-flex">
              <el-popover
                v-if="customerService.name"
                placement="bottom-start"
                trigger="click"
                popper-class="support-popover"
                :show-arrow="false"
              >
                <template #reference>
                  <div class="avatar-wrap">
                    <el-avatar :size="36" :src="checkUrl(customerService.avatar)">
                      <img src="/static/images/chat/head.png" />
                    </el-avatar>
                    <div class="avatar-bage sa-flex sa-col-center sa-row-center">
                      <sa-svg
                        :name="serviceStateColorMap[customerService.status]"
                        size="8"
                      ></sa-svg>
                    </div>
                  </div>
                </template>
                <ul class="sa-flex-col sa-col-center sa-row-center">
                  <li
                    class="sa-flex sa-col-center sa-row-center sa-p-b-6 sa-p-t-6 service-state cursor-pointer"
                    :class="{ 'is-active': serviceState == 'onLine' }"
                    @click="changeServiceState('onLine')"
                  >
                    <sa-svg name="sa-success" size="12"></sa-svg>
                    <span class="sa-p-l-12">在线</span>
                  </li>
                  <li
                    class="sa-flex sa-col-center sa-row-center sa-p-b-6 sa-p-t-6 service-state cursor-pointer"
                    :class="{ 'is-active': serviceState == 'busy' }"
                    @click="changeServiceState('busy')"
                  >
                    <sa-svg name="sa-time" size="12"></sa-svg>
                    <span class="sa-p-l-12">忙碌</span>
                  </li>
                  <li
                    class="sa-flex sa-col-center sa-row-center sa-p-b-6 sa-p-t-6 service-state cursor-pointer"
                    :class="{ 'is-active': serviceState == 'leave' }"
                    @click="changeServiceState('leave')"
                  >
                    <sa-svg name="sa-lixian-01" size="12"></sa-svg>
                    <span class="sa-p-l-12">离开</span>
                  </li>
                </ul>
              </el-popover>
              <!-- 切换客服身份 -->
              <div v-if="customerServiceIdentityList.length == 0" class="support-wrap sa-flex">
                <div class="sa-flex-col cursor-pointer sa-p-l-8 sa-p-r-8">
                  <div class="support-name">
                    {{ customerService.name }}
                  </div>
                  <div class="room-name">{{ customerService.room_name }}</div>
                </div>
                <!-- <el-icon class="room-icon"><ArrowDown /></el-icon> -->
              </div>
              <el-dropdown v-if="customerServiceIdentityList.length > 0" trigger="click">
                <div class="support-wrap sa-flex">
                  <template>
                    <div class="sa-flex-col cursor-pointer sa-p-l-8 sa-p-r-8">
                      <div class="support-name">
                        {{ customerService.name }}
                      </div>
                      <div class="room-name">{{ customerService.room_name }}</div>
                    </div>
                    <el-icon class="room-icon"><ArrowDown /></el-icon>
                  </template>
                </div>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      v-for="item in customerServiceIdentityList"
                      :key="item.value"
                      @click="changeCustomerServiceIdentity(item.value)"
                      >{{ item.label }}</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
            <div class="sa-flex">
              <ul class="chat-status-wrap sa-flex sa-col-center">
                <li class="bg" :style="{ left: statusObj[sessionType] }"></li>
                <li
                  class="chat-status"
                  :class="{ 'is-active': sessionType == 'ing' }"
                  @click="changeSessionType('ing')"
                >
                  会话中
                </li>
                <el-badge is-dot :hidden="!hasWaiting">
                  <li
                    class="chat-status"
                    :class="{ 'is-active': sessionType == 'waiting' }"
                    @click="changeSessionType('waiting')"
                  >
                    排队中
                  </li>
                </el-badge>
                <li
                  class="chat-status"
                  :class="{ 'is-active': sessionType == 'history' }"
                  @click="changeSessionType('history')"
                >
                  历史
                </li>
              </ul>
              <el-icon class="close" @click="hideChat">
                <CircleCloseFilled />
              </el-icon>
            </div>
          </el-header>
          <el-main class="chat-main sa-p-0">
            <div class="chat-content sa-flex sa-flex-1">
              <!-- 会话列表 -->
              <div class="content-left">
                <el-scrollbar class="session-scroll" :min-size="10">
                  <ul class="sa-flex-col sa-row-center sa-col-center">
                    <li
                      class="session-item sa-flex sa-col-center sa-row-center"
                      :class="{
                        'session-active': curSessionIndex[sessionType] == index,
                      }"
                      :tabindex="item.id"
                      v-for="(item, index) in sessionList"
                      :key="item.id"
                      @click="onSession(index)"
                    >
                      <template v-if="sessionType == 'ing'">
                        <el-popconfirm
                          width="fit-content"
                          title="确定结束当前会话吗？"
                          @confirm="changeSession(item.session_id, index, sessionType)"
                        >
                          <template #reference>
                            <el-icon class="session-close-icon sa-reset-button">
                              <Close />
                            </el-icon>
                          </template>
                        </el-popconfirm>
                      </template>

                      <template v-if="sessionType == 'history'">
                        <el-popover
                          popper-class="history-delete-popover"
                          v-model:visible="historyDeletePopover.flag[index]"
                          placement="bottom"
                          trigger="click"
                        >
                          <div class="history-delete-content">
                            <div>
                              <el-icon><QuestionFilled /></el-icon>确定删除此顾客吗？
                            </div>
                            <el-checkbox
                              v-model="historyDeletePopover.is_del_record"
                              :true-label="1"
                              :false-label="0"
                              label="删除聊天记录"
                            />
                            <div class="history-delete-button">
                              <el-button
                                size="small"
                                link
                                @click="onCancelHistoryDeletePopover(index)"
                                >取消</el-button
                              >
                              <el-button
                                type="primary"
                                size="small"
                                @click="
                                  onConfirmHistoryDeletePopover(item.session_id, index, sessionType)
                                "
                                >确定</el-button
                              >
                            </div>
                          </div>
                          <template #reference>
                            <el-icon class="session-close-icon sa-reset-button" @click.stop>
                              <Close />
                            </el-icon>
                          </template>
                        </el-popover>
                      </template>

                      <el-tooltip :content="item.nickname" placement="right" effect="dark">
                        <el-badge
                          :value="item.unread_num"
                          type="danger"
                          :max="99"
                          :hidden="!item.unread_num"
                          class="session-badge"
                        >
                          <el-avatar :size="36" :src="checkUrl(item.avatar)">
                            <img src="/static/images/chat/head.png" />
                          </el-avatar>
                          <div
                            class="avatar-bage sa-flex sa-col-center sa-row-center"
                            style="bottom: 4px"
                          >
                            <sa-svg
                              :name="item.status ? 'sa-success' : 'sa-duankailianjie'"
                              size="8"
                            ></sa-svg>
                          </div>
                        </el-badge>
                      </el-tooltip>
                    </li>
                  </ul>
                </el-scrollbar>
              </div>
              <!-- 会话窗口 -->
              <div class="content-right">
                <!-- 客户信息 -->
                <div v-show="curCustomerInfo" class="customer-box sa-flex sa-col-center sa-p-l-17">
                  <div v-if="curCustomerInfo?.session_id" class="sa-flex sa-flex-1 sa-row-between">
                    <div class="customer-name sa-m-l-10 sa-flex sa-flex-1" @click="toDetail">
                      {{ curCustomerInfo?.nickname || '' }}
                    </div>
                    <div
                      v-if="sessionType == 'ing' && customerList.length"
                      class="transfer-select-wrap"
                    >
                      <el-dropdown trigger="click" @command="handleCommand">
                        <div class="el-dropdown-link sa-flex">
                          <div class="transfer-label sa-line-1">
                            {{
                              customerList.find((item) => item.value == selectCustomerService)
                                ?.label || '选择转接的客服'
                            }}
                          </div>
                          <el-icon class="el-icon--right"><arrow-down /></el-icon>
                        </div>
                        <template #dropdown>
                          <el-dropdown-menu>
                            <el-dropdown-item
                              v-for="item in customerList"
                              :key="item.value"
                              :command="item.value"
                              :disabled="item.disabled"
                            >
                              {{ item.label }}
                            </el-dropdown-item>
                          </el-dropdown-menu>
                        </template>
                      </el-dropdown>
                      <el-button
                        v-show="selectCustomerService"
                        class="transfer-chat-button"
                        type="primary"
                        link
                        size="small"
                        @click="changeCustomerService"
                      >
                        转接
                      </el-button>
                    </div>
                    <button
                      v-if="sessionType == 'waiting'"
                      class="sa-reset-button access-btn"
                      @click="accessCustomer"
                    >
                      立即接入
                    </button>
                  </div>
                </div>
                <el-alert
                  v-show="!curCustomerInfo"
                  title="暂无顾客会话"
                  type="warning"
                  center
                  show-icon
                >
                </el-alert>
                <el-scrollbar
                  class="chat-scroll"
                  :min-size="10"
                  id="chatScroll"
                  ref="chatScrollRef"
                >
                  <div v-loading="messageLoading">
                    <button
                      class="loadmore-btn sa-reset-button"
                      v-show="chatList.length && chatHistoryPagination.lastPage > 1"
                      @click="onLoadMore"
                    >
                      {{ loadingMap[chatHistoryPagination.loadStatus].title
                      }}<i
                        class="loadmore-icon sa-m-l-6"
                        :class="loadingMap[chatHistoryPagination.loadStatus].icon"
                      ></i>
                    </button>
                    <!-- 会话栏 -->
                    <chat-message></chat-message>
                    <div class="sa-flex sa-row-center sa-col-center" v-show="!chatList.length">
                      <el-empty>
                        <template #image>
                          <sa-svg className="empty-svg" name="sa-kongkongruye" size="150"></sa-svg>
                        </template>
                        <template #description>
                          <div class="empty-description">暂时没有会话哦！</div>
                        </template>
                      </el-empty>
                    </div>
                  </div>
                </el-scrollbar>
              </div>
            </div>
          </el-main>
          <el-footer v-if="curCustomerInfo" class="chat-footer">
            <div class="chat-input-wrap sa-flex">
              <div
                class="chat-input"
                contenteditable="true"
                id="chat-input"
                @input="getDemoVal"
                placeholder="请输入内容，按Enter直接发送消息"
                ref="chatInputRef"
                @keydown="chatInputKeyDown($event)"
                @paste="onPaste($event)"
                @dragover.prevent
                @drop="onDrop($event)"
              ></div>
            </div>
            <div class="sa-flex sa-row-between sa-p-l-12 sa-p-r-12">
              <!-- 会话工具栏 -->
              <chat-toolbar :showChat="showChat" @change="toolbarSelect"></chat-toolbar>
              <el-button
                class="send-btn"
                type="primary"
                :disabled="!messageVal || !curCustomerInfo"
                @click="sendMessage"
                >发送</el-button
              >
            </div>
          </el-footer>
        </template>

        <!-- 未连接 -->
        <el-main v-if="connection.status != 'connect'" class="connect-status sa-flex sa-row-center">
          <sa-svg class="sa-m-b-30" name="sa-chat-reconnect-failed" size="150"></sa-svg>
          <div v-if="connection.status === 'error'">请检查您的网络连接</div>
          <div v-if="connection.status === 'connecting'">
            正在连接Websocket服务
            <span class="connect-status-dot">...</span>
          </div>
          <div v-if="connection.status === 'reconnecting'">
            ({{ connection.attempts }}/{{
              connection.reconnectionAttempts
            }})正在重新连接Websocket服务
            <span class="connect-status-dot">...</span>
          </div>
          <template v-if="connection.status === 'reconnect_error'">
            <div>
              ({{ connection.attempts }}/{{ connection.reconnectionAttempts }})
              WebSocket服务连接失败
            </div>
            <div class="sa-m-t-8">
              {{ connection.delay }} 秒后尝试重新连接
              <span class="connect-status-dot">...</span>
            </div>
          </template>
          <template v-if="connection.status === 'reconnect_failed'">
            <div>Websocket服务连接失败,请检查您的环境后点击 </div>
            <div class="reconnect-button sa-m-t-8" @click="onReconnect">重新连接</div>
          </template>
        </el-main>
      </el-container>
    </el-drawer>
  </div>
</template>
<script setup>
  /**
   * Chat 聊天组件
   */
  import {
    computed,
    onMounted,
    reactive,
    ref,
    unref,
    inject,
    defineComponent,
    nextTick,
  } from 'vue';
  import sheep from '@/sheep';
  import ChatMessage from './message.vue';
  import ChatToolbar from './toolbar.vue';
  import { readImg, compressImg, xssFilter } from '../../utils/socket.utils';
  import { checkUrl } from '@/sheep/utils/checkUrlSuffix';
  import admin from '@/app/admin/api';
  import { ElMessage } from 'element-plus';
  import { useModal } from '@/sheep/hooks';
  import UserEdit from '@/app/user/admin/detail.vue';

  const chatStore = sheep.$store('socket');
  const sessionList = computed(() => chatStore.sessionList);
  const chatList = computed(() => chatStore.chatList);
  const customerList = computed(() => chatStore.avaliableServicerList);
  const customerServiceIdentityList = computed(
    () => chatStore.avaliableCustomerServiceIdentityList,
  );
  const customerService = computed(() => chatStore.customerService);
  const curCustomerInfo = computed(() => chatStore.curCustomerInfo);
  const allChatDot = computed(() => chatStore.allChatDot);
  const hasWaiting = computed(() => chatStore.hasWaiting);
  const connection = computed(() => chatStore.connection);

  // 是否显示客服弹窗
  const showChat = ref(false);

  async function onShowDrawer() {
    // TODO: 1.弹出客服面板
    // 2.检测是否初始化 并且连接socket
    // 2.1没有初始化发起请求
    // 2.2初始化失败或socket连接失败 显示重新连接
    // 3.展示聊天界面
    showChat.value = !showChat.value;

    // 初始化聊天
    if (connection.value.status != 'connect') {
      await chatStore.chatInit();
      chatStore.open_chat();
    }
  }

  function onReconnect() {
    if (chatStore.chatService) chatStore.chatService.disconnect();
    chatStore.chatInit();
  }

  // 组件通信
  const mitt = inject('mitt');

  const statusObj = {
    ing: '2px',
    waiting: '52px',
    history: '102px',
  };

  function onShowTip() {
    chatStore.showConnectionTip(true);
  }

  // 关闭弹窗
  const hideChat = () => {
    showChat.value = false;
    chatStore.socket_reset();
  };

  // 历史消息加载完毕
  const messageLoading = ref(true);
  mitt.on('CHAT_HISTORY', () => {
    messageLoading.value = false;
  });

  // 切换会话列表
  const sessionType = computed(() => chatStore.sessionType);
  const changeSessionType = (state, type = '') => {
    if (sessionType.value == state) return;
    // sessionType.value = state;
    if (!curSessionIndex.hasOwnProperty(state)) {
      curSessionIndex[state] = 0;
    }
    chatStore.socket_change_customer_list({
      state,
      type,
      index: curSessionIndex[state],
    });
  };

  // 选中当前 session
  const curSessionIndex = reactive({});
  const onSession = (index) => {
    if (curSessionIndex[sessionType.value] == index) return;
    curSessionIndex[sessionType.value] = index;
    chatStore.socket_change_customer_info(index);
  };

  // 客服状态颜色映射
  const serviceStateColorMap = {
    online: 'sa-success',
    offline: 'sa-lixian-01',
    busy: 'sa-time',
    disconnect: 'sa-duankailianjie',
  };

  // 客服状态
  const serviceState = ref('onLine'); //busy | leave
  const changeServiceState = (state) => {
    if (state == serviceState.value) return;
    serviceState.value = state;
    chatStore.socket_change_service_state(state);
  };

  // 删除 | 删除会话顾客
  const changeSession = (sessionId, index, customerState) => {
    chatStore.socket_change_customer(sessionId, index, customerState);
  };

  // 接入顾客
  const accessCustomer = () => {
    chatStore.socket_customer_access();
    // 跳转列表 获取历史记录
    changeSessionType('ing', 'access');
  };

  // 转接客服
  const selectCustomerService = ref(null);
  const changeCustomerService = () => {
    chatStore.socket_transfer(selectCustomerService.value);
  };

  // 切换客服身份
  const changeCustomerServiceIdentity = (e) => {
    chatStore.socket_change_customer_identity(e);
  };

  // 加载历史会话
  const chatHistoryPagination = computed(() => chatStore.chatHistoryPagination);
  const onLoadMore = () => {
    chatHistoryPagination.value.page < chatHistoryPagination.value.lastPage &&
      chatStore.socket_customer_history();
  };

  // 底部保持
  const chatScrollRef = ref(null);
  const scrollBottom = () => {
    connection.value.status == 'connect' &&
      nextTick(() => {
        unref(chatScrollRef).setScrollTop(unref(chatScrollRef)['wrapRef'].scrollHeight + 500);
      });
  };

  // 获取输入框内容
  const messageVal = ref('');
  const getDemoVal = (e) => {
    if (
      e.target.innerHTML.replace(/&nbsp;|\s/g, '') &&
      e.target.innerHTML.replace(/&nbsp;|\s/g, '').indexOf('<br>') != 0
    ) {
      messageVal.value = e.target;
    } else {
      messageVal.value = '';
    }
  };
  // 获取焦点
  const chatInputRef = ref(null);
  const getFocus = () => {
    if (window.getSelection) {
      let chatInput = unref(chatInputRef);
      chatInput.focus();
      let range = window.getSelection();
      range.selectAllChildren(chatInput);
      range.collapseToEnd();
    } else if (document.selection) {
      let range = document.selection.createRange();
      range.moveToElementText(chatInput);
      range.collapse(false);
      range.select();
    }
  };
  // 聊天工具栏
  const toolbarSelect = (e) => {
    !messageVal.value && getFocus(); // 输入框为空时默认获取焦点
    switch (e.mode) {
      case 'emoji':
        let img = `<img src="${checkUrl(
          '/static/img/chat/emoji/' + e.content.url,
        )}" name="emoji" style="object-fit: cover;vertical-align:bottom; display: inline-block;width:20px;height:20px;margin:2px">`;
        document.execCommand('insertHTML', false, img);
        break;
      case 'text':
      case 'image':
        chatStore.socket_send(e);
        scrollBottom();
        break;
      case 'goods':
        chatStore.socket_send(e);
        scrollBottom();
        break;
      default:
        break;
    }
  };
  // 发送消息
  const sendMessage = () => {
    if (!messageVal.value || !curCustomerInfo) return;
    formatChatInput(messageVal.value);
  };
  // ctrl + enter 换行 ,enter发送
  const chatInputKeyDown = (e) => {
    if (e.ctrlKey && e.keyCode == 13) {
      document.execCommand('insertHTML', false, '<br></br>');
    } else if (e.keyCode == 13) {
      // 阻止默认enter
      e.preventDefault();
      sendMessage();
      return false;
    }
  };
  // 粘贴到输入框
  const onPaste = async (e) => {
    let paste = e.clipboardData || window.clipboardData;
    let filesArr = Array.from(paste.files);
    filesArr.forEach(async (child) => {
      if (child?.type.includes('image')) {
        e.preventDefault(); //阻止默认
        let file = child;
        const img = await readImg(file);
        const blob = await compressImg(img, file.type);
        let formData = new FormData();
        formData.append('file', blob, file.name);
        const { data } = await admin.file.upload('chat', formData);
        let url = checkUrl(data.path);
        let imgele = `<img src="${url}"  style="object-fit: cover;width:100px;height:100px;border-radius:6px">`;
        document.execCommand('insertHTML', false, imgele);
      } else {
        document.execCommand('insertHTML', false, paste.getData('text'));
      }
    });
  };
  // 拖拽到输入框
  const onDrop = async (e) => {
    getFocus(); //获取焦点
    e.preventDefault(); //阻止默认
    let filesArr = Array.from(e.dataTransfer.files);
    filesArr.forEach(async (child) => {
      if (child?.type.includes('image')) {
        let file = child;
        const img = await readImg(file);
        const blob = await compressImg(img, file.type);
        let formData = new FormData();
        formData.append('file', blob, file.name);
        const { data } = await admin.file.upload('chat', formData);
        let url = checkUrl(data.path);
        let imgele = `<img src="${url}"   style="object-fit: cover;width:100px;height:100px;border-radius:6px">`;
        document.execCommand('insertHTML', false, imgele);
      } else {
        ElMessage({
          message: '禁止拖拽非图片资源',
          type: 'warning',
        });
      }
    });
  };
  // 解析输入框内容
  const formatChatInput = (elem) => {
    let res = '';
    let elemArr = Array.from(elem.childNodes);
    elemArr.forEach((child, index) => {
      if (child.nodeName == '#text') {
        res += child.nodeValue;
        if (elemArr[index + 1]?.nodeName == 'IMG' && elemArr[index + 1]?.name != 'emoji') {
          const data = {
            from: 'customer_service',
            mode: 'text',
            date: new Date().getTime(),
            content: {
              text: xssFilter(res),
            },
          };
          chatStore.socket_send(data);
          scrollBottom();
          res = '';
        }
      } else if (child.nodeName == 'BR') {
        res += '<br/>';
      } else if (child.nodeName == 'IMG') {
        if (child.name != 'emoji') {
          let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
          let src = child.outerHTML.match(srcReg);
          const data = {
            from: 'customer_service',
            mode: 'image',
            date: new Date().getTime(),
            content: {
              url: checkUrl(src[1].replace(/http:\/\/[^\/]*/, '')),
              path: src[1].replace(/http:\/\/[^\/]*/, ''),
            },
          };
          chatStore.socket_send(data);
          scrollBottom();
        } else {
          res += child.outerHTML;
        }
      } else if (child.nodeName == 'DIV') {
        res += `<div style="width:200px; white-space: nowrap;">${child.outerHTML}</div>`;
      }
    });
    if (res) {
      const data = {
        from: 'customer_service',
        mode: 'text',
        date: new Date().getTime(),
        content: {
          text: xssFilter(res),
        },
      };
      chatStore.socket_send(data);
    }
    messageVal.value = '';
    unref(chatInputRef).innerHTML = '';
    scrollBottom();
  };
  //todo-jj
  // 打开用户详情
  const toDetail = () => {
    let info = unref(curCustomerInfo);
    info.auth == 'user' &&
      info.auth_id &&
      useModal(
        UserEdit,
        {
          title: '查看',
          type: 'edit',
          id: info.auth_id,
        },
        {
          confirm: () => {
            getData();
          },
        },
      );
  };

  function handleCommand(e) {
    selectCustomerService.value = e;
  }

  const loadingMap = {
    loadmore: {
      title: '查看更多',
      icon: 'el-icon-d-arrow-left',
    },
    nomore: {
      title: '没有更多了',
      icon: '',
    },
    loading: {
      title: '加载中... ',
      icon: 'el-icon-loading',
    },
  };

  const historyDeletePopover = reactive({
    flag: {},
    // type: null,
    data: {},
    is_del_record: 0,
  });

  function onCancelHistoryDeletePopover(index) {
    historyDeletePopover.flag[index] = false;
    historyDeletePopover.is_del_record = 0;
  }

  function onConfirmHistoryDeletePopover(sessionId, index, customerState) {
    chatStore.socket_change_customer(
      sessionId,
      index,
      customerState,
      historyDeletePopover.is_del_record,
    );
    onCancelHistoryDeletePopover(index);
  }

  // 挂载完毕
  onMounted(() => {
    mitt.on('CHAT_BOTTOM', () => {
      scrollBottom();
    });
  });
</script>
<style lang="scss">
  .support-popover {
    padding: 10px 0 !important;
    width: 104px !important;
    min-width: 104px !important;
  }
  .support-wrap {
    width: 138px;
    font-size: 16px;
    color: var(--sa-background-assist);
    .support-name {
      line-height: 16px;
      font-size: 14px;
      font-weight: 400;
      margin-bottom: 4px;
    }
    .room-name {
      line-height: 14px;
      font-weight: 400;
      font-size: 12px;
    }
    .room-icon {
      font-size: 12px;
      @media only screen and (max-width: 768px) {
        font-size: 16px;
      }
    }
  }

  .history-delete-popover {
    width: fit-content !important;
    .history-delete-content {
      .el-icon {
        color: rgb(255, 153, 0);
        margin-right: 5px;
      }
      .history-delete-button {
        margin-top: 8px;
        text-align: right;
      }
    }
  }
</style>
<style lang="scss" scoped>
  .sa-chat {
    :deep() {
      .chat-drawer-overlay {
        background-color: transparent;
      }
      .el-select-v2__wrapper {
        background: none;
      }
      .el-badge__content.is-dot {
        height: 6px;
        width: 6px;
      }
      .chat-drawer {
        width: 380px !important;
        height: unset;
        border-radius: 8px;
        top: 48px;
        bottom: 30px;
        @media only screen and (max-width: 768px) {
          width: 100% !important;
          border-radius: 0;
          top: 0;
          bottom: 0;
        }
        .el-drawer__body {
          padding: 0;
          overflow: hidden;
          display: flex;
          flex-direction: column;

          .chat-content {
            flex: 1;
            height: 100%;
            .content-left {
              // width: 60px;
              height: 100%;
              border-right: 1px solid var(--sa-space);
              flex-shrink: 0;
              .session-scroll {
                width: 100%;
              }
              .session-item {
                width: 60px;
                transition: all 0.3s linear;
                padding: 10px 0;
                .el-tooltip__trigger {
                  width: fit-content !important;
                }
                .session-badge {
                  width: fit-content !important;
                  .el-badge__content {
                    top: -8px;
                    right: -6px;
                    transform: scale(0.9);
                  }
                }
                &:hover {
                  background-color: var(--t-bg-active);
                  transition: all 0.3s linear;
                  .session-close-icon {
                    transform: scale(1);
                    margin-left: 0;
                    transition: all 0.2s linear;
                    &:active {
                      transform: translate(1px, 1px);
                    }
                    &:hover {
                      color: #fff;
                      background-color: var(--el-color-primary);
                    }
                  }
                }
                &:focus {
                  background-color: var(--t-bg-active);
                }
                .session-close-icon {
                  border-radius: 50%;
                  font-size: 12px;
                  color: var(--el-color-primary);
                  margin-right: 4px;
                  transform: scale(0) translate(0, 0);
                  margin-left: -16px;
                  transition: all 0.2s linear;
                }
              }
              .session-active {
                background-color: var(--t-bg-active);
                transition: all 0.3s linear;
              }
            }
            .content-right {
              width: 100%;
              height: 100%;
              .customer-box {
                width: 100%;
                height: 40px;
                background-color: var(--sa-card-background);
                border-bottom: 1px solid var(--sa-space);
                :deep(.el-input__inner) {
                  border: none;
                  height: 38px;
                  width: 140px;
                  color: #8c8c8c;
                }
                .customer-name {
                  font-size: 14px;
                  color: var(--sa-font);
                }
                .customer-from {
                  font-size: 14px;
                  color: #999999;
                }
                .access-btn {
                  color: var(--el-color-primary);
                  font-size: 12px;
                  padding: 10px 20px;
                }
              }
            }
          }
          // 输入框
        }

        display: flex;
        .el-drawer__body {
          flex: 1;
        }
      }
    }
    .el-textarea__inner {
      border: none;
      background: #fff;
    }
  }
  .chat-drawer {
    .chat-container {
      flex-direction: column;
      overflow: hidden;
    }
    .avatar-bage {
      position: absolute;
      height: 10px;
      width: 10px;
      padding: 0;
      right: 0;
      bottom: 2px;
      background: #fff;
      border-radius: 50%;
    }
    .chat-header {
      --el-header-padding: 0 12px;
      --el-header-height: 56px;
      background: var(--t-btn-hover);
      color: var(--sa-background-assist);
      margin-bottom: 0;
      justify-content: space-between;
      .avatar-wrap {
        position: relative;
      }
      .service-state {
        width: 100%;
        &:hover {
          background-color: var(--t-bg-hover);
        }
        &.is-active {
          background-color: var(--t-bg-active);
        }
      }
      .chat-status-wrap {
        height: 36px;
        padding: 0 2px;
        border-radius: 8px;
        background: var(--t-bg-focus);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        .bg {
          // content: "";
          position: absolute;
          top: 2px;
          left: 2px;
          width: 50px;
          height: 32px;
          background: var(--sa-background-assist);
          border-radius: 6px;
          transition: all 0.2s;
        }
        .chat-status {
          min-width: 50px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 1;
          padding: 0 7px;
          font-size: 12px;
          color: var(--t-color-primary);
          cursor: pointer;
        }
      }
      .close {
        font-size: 16px;
        margin-left: 12px;
        &:hover {
          color: var(--t-color-primary);
        }
        @media only screen and (max-width: 768px) {
          font-size: 20px;
        }
      }
    }
    .chat-main {
      flex: unset;
      flex-shrink: 0;
      height: calc(100% - 200px) !important;
      .loadmore-btn {
        width: 100%;
        height: 40px;
        font-size: 12px;
        color: #8c8c8c;
      }
      .loadmore-icon {
        transform: rotate(90deg);
      }
      .empty-description {
        font-size: 16px;
        color: var(--sa-subfont);
      }
      .chat-content {
        // height: calc(100% - 300px) !important;
      }
      .chat-scroll {
        height: calc(100% - 40px) !important;
      }
      .transfer-select-wrap {
        position: relative;
        margin-right: 10px;
        .transfer-label {
          width: 140px;
          color: var(--sa-subfont);
          padding-right: 50px;
        }
        .transfer-chat-button {
          position: absolute;
          top: 50%;
          right: 30px;
          z-index: 1;
          margin-top: -9px;
        }
      }
      .transfer-select {
        --el-select-border-color-hover: transparent;
        --el-select-input-focus-border-color: transparent;
        :deep() {
          .el-input {
            --el-input-border-color: transparent;
          }
        }
      }
    }
    .connect-status {
      display: flex;
      flex-direction: column;
      div {
        color: var(--sa-subtitle);
        font-size: 14px;
      }
      .connect-status-dot {
        font-family: simsun;
        display: inline-block;
        width: 1.5em;
        vertical-align: bottom;
        overflow: hidden;
        animation: dot 3s infinite step-start;
      }
      @-webkit-keyframes dot {
        0% {
          width: 0;
          margin-right: 1.5em;
        }
        33% {
          width: 0.5em;
          margin-right: 1em;
        }
        66% {
          width: 1em;
          margin-right: 0.5em;
        }
        100% {
          width: 1.5em;
          margin-right: 0;
        }
      }
      .reconnect-button {
        color: var(--t-color-primary);
        cursor: pointer;
      }
    }
    .chat-footer {
      --el-footer-padding: 0;
      --el-footer-height: 140px;
      border-top: 1px solid var(--sa-space);
      background-color: var(--sa-card-background);
      .chat-input-wrap {
        padding-bottom: 10px;
        .chat-input {
          width: 420px;
          height: 84px;
          overflow-y: auto;
          padding: 10px;
          font-size: 14px;
          line-height: 20px;
          color: var(--sa-font);
          border: none;
          outline: none;
          &:hover {
            border: none;
          }
        }
        .chat-input:empty::before {
          content: attr(placeholder);
          font-size: 14px;
          color: #ccc;
          line-height: 21px;
          padding-top: 10px;
        }
        .send-btn {
          align-self: flex-end;
        }
      }
    }
  }
</style>
