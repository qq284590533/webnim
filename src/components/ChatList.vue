<template>
    <ul id="chat-list" class="scroll m-chat-list p-chat-list">
        <chat-item
            v-for="(msg, index) in msglist"
            :type="type"
            :rawMsg="msg"
            :isRobot="isRobot"
            :userInfos="userInfos"
            :myInfo="myInfo"
            :key="(msg.idClient || index)"
            :isHistory="isHistory"
            @msg-loaded="msgLoaded"
        ></chat-item>
    </ul>
</template>
<script type="text/javascript">
import util from "utils";
import config from "configs";
import emojiObj from "configs/emoji";
import ChatItem from "./ChatItem";

export default {
    components: {
        ChatItem
    },
    props: {
        type: String, // 类型，chatroom, session
        canLoadMore: [String, Boolean],
        isRobot: {
            type: Boolean,
            default() {
                return false;
            }
        },
        msglist: {
            type: Array,
            default() {
                return [];
            }
        },
        userInfos: {
            type: Object,
            default() {
                return {};
            }
        },
        myInfo: {
            type: Object,
            default() {
                return {};
            }
        },
        isHistory: {
            type: Boolean,
            default() {
                return false;
            }
        }
    },
    data() {
        return {
            isFullImgShow: false,
            msgLoadedTimer: null
        };
    },
    methods: {
        showFullImg(src) {
            this.$store.dispatch("showFullscreenImg", {
                src
            });
        },
        msgLoaded() {
            clearTimeout(this.msgLoadedTimer);
            this.msgLoadedTimer = setTimeout(() => {
                this.$emit("msgs-loaded");
            }, 20);
        }
    }
};
</script>

<style lang="scss" scoped>
.p-chat-list {
    list-style: none;
    padding: 1rem 2%;
    margin: 0;
    .u-icon {
        width: 1.4rem;
        height: 1.6rem;
        margin-right: 0.2rem;
        vertical-align: bottom;
    }
}
.scroll {
    &::-webkit-scrollbar {
        width: 10px;
        height: 10px;
    }
    &::-webkit-scrollbar-track-piece {
        background-color: #ebeef3;
        -webkit-border-radius: 4px;
    }
    &::-webkit-scrollbar-thumb:vertical {
        height: 32px;
        background-color: #d8dce4;
        -webkit-border-radius: 4px;
    }
    &::-webkit-scrollbar-thumb:horizontal {
        width: 32px;
        background-color: #d8dce4;
        -webkit-border-radius: 4px;
    }
}
</style>
