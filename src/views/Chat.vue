<template>
    <div class="chat-box">
        <div class="top">
            <p class="name">鼎天修理厂</p>
        </div>
        <chat-list class="chat-main"
            type="session"
            :msglist="msglist"
            :userInfos="userInfos"
            :myInfo="myInfo"
            @msgs-loaded="msgsLoaded"
        ></chat-list>
        <chat-editor></chat-editor>
        <!-- <div class="chat-editor">
            <div class="tool-box"></div>
        </div>-->
    </div>
</template>

<script>
import getParamsFromHref from "utils/href-resolver";
import cookie from "utils/cookie";
import chatEditor from "components/ChatEditor";
import chatList from "components/ChatList"
import pageUtil from 'utils/page'

export default {
    data() {
        return {
            account: "",
            sdktoken: "",
            loading: null
        };
    },
    components: {
        chatEditor,
        chatList
    },
    /**
     * http://127.0.0.1:8080/#/chat?account=13215651001&token=123456
     *
     **/
    created() {
        // 提交sdk连接请求
        console.log(window.location.href);
        let params = getParamsFromHref(window.location.href);
        this.account = params.account;
        this.sdktoken = params.token;
        console.log(params);
        cookie.setCookie("uid", this.account.toLowerCase());
        cookie.setCookie("sdktoken", this.sdktoken);
        this.$store.dispatch("connect");
        this.$store.dispatch("updateRefreshState");
    },
    computed: {
        msglist () {
            let msgs = this.$store.state.currSessionMsgs
            return msgs
        },
        myInfo () {
            return this.$store.state.myInfo
        },
        userInfos () {
            return this.$store.state.userInfos
        },
    },
    watch: {
        // isLoading(newvalue, oldvalue) {
        //     if (newvalue) {
        //         this.loading = this.$loading({
        //             lock: true,
        //             text: "Loading",
        //             spinner: "el-icon-loading",
        //             background: "rgba(0, 0, 0, 0.7)"
        //         });
        //     } else {
        //         if (this.loading) {
        //             this.loading.close();
        //         }
        //     }
        // }
    },
    methods: {
        msgsLoaded () {
        pageUtil.scrollChatListDown()
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
