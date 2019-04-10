<template>
    <div class="chat-box" v-if="currSessionId!=null">
        <div class="top">
            <p class="name" v-if="userInfos[to]">{{userInfos[to].nick}}</p>
        </div>
        <chat-list
            class="chat-main"
            type="session"
            :msglist="msglist"
            :userInfos="userInfos"
            :myInfo="myInfo"
            @msgs-loaded="msgsLoaded"
        ></chat-list>
        <chat-editor
        type="session" :scene="scene" :to="to"></chat-editor>
        <!-- <div class="chat-editor">
            <div class="tool-box"></div>
        </div>-->
    </div>
</template>

<script>
import chatEditor from "components/ChatEditor";
import chatList from "components/ChatList";
import pageUtil from "utils/page";
import util from "utils";

export default {
    data() {
        return {
            account: "",
            sdktoken: "",
            loading: null
        };
    },
    props: {
        currSessionId: {
            type: String,
            default: null
        }
    },
    components: {
        chatEditor,
        chatList
    },
    created() {},
    // 进入该页面，文档被挂载
    mounted() {
        this.$store.dispatch("showLoading");
        // 此时设置当前会话
        this.$store.dispatch("setCurrSession", this.currSessionId);
        console.log(this.currSessionId);
        pageUtil.scrollChatListDown();

        setTimeout(() => {
            this.$store.dispatch("hideLoading");
        }, 1000);

        // 获取群成员
        if (this.scene === "team") {
            var teamMembers = this.$store.state.teamMembers[this.to];
            if (
                teamMembers === undefined ||
                teamMembers.length < this.teamInfo.memberNum
            ) {
                this.$store.dispatch("getTeamMembers", this.to);
            }
        }
    },
    updated() {
        pageUtil.scrollChatListDown();
    },
    computed: {
        msglist() {
            let msgs = this.$store.state.currSessionMsgs;
            return msgs;
        },
        myInfo() {
            return this.$store.state.myInfo;
        },
        userInfos() {
            return this.$store.state.userInfos;
        },
        sessionId() {
            return this.$store.state.currSessionId;
        },
        scene() {
            return util.parseSession(this.sessionId).scene || null;
        },
        to() {
            return util.parseSession(this.sessionId).to;
        }
    },
    watch: {},
    methods: {
        msgsLoaded() {
            pageUtil.scrollChatListDown();
        },
        login() {}
    }
};
</script>
<style lang="scss" scoped>
.chat-box {
    position: relative;
    flex: 1;
    background: #ffffff;
    .top {
        position: absolute;
        top: 0;
        width: 100%;
        display: flex;
        height: 48px;
        border-bottom: 1px solid #eee;
        padding: 0 20px;
        box-sizing: border-box;
        align-items: center;
    }
    .chat-main {
        position: absolute;
        top: 49px;
        bottom: 181px;
        width: 100%;
        background: #fff;
        overflow: auto;
        border-bottom: 1px solid #eee;
        box-sizing: border-box;
    }
}
</style>
