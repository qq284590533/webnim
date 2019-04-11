<template>
    <div class="nim">
        <div class="layout">
            <left-siade :currSessionId="currSessionId" :sessionlist="sessionlist" @enterChat="enterChat"></left-siade>
            <chat></chat>
        </div>
        <fullscreen-img></fullscreen-img>
    </div>
</template>

<script>
import getParamsFromHref from "utils/href-resolver";
import cookie from "utils/cookie";
import FullscreenImg from "components/FullscreenImg";
import LeftSiade from "components/LeftSiade";
import Chat from "components/Chat";
import util from 'utils'

export default {
    data() {
        return {
            loading: null,
            account: null,
            sdktoken: null,
            currSessionId: null
        };
    },
    components: {
        FullscreenImg,
        LeftSiade,
        Chat
    },
    computed: {
        userInfos () {
            return this.$store.state.userInfos
        },
        sessionlist() {
            let sessionlist = this.$store.state.sessionlist.filter(item => {
                item.name = "";
                item.avatar = "";
                if (item.scene === "p2p") {
                    let userInfo = null;
                    if (item.to !== this.myPhoneId) {
                        userInfo = this.userInfos[item.to];
                    } else {
                        // userInfo = this.myInfo
                        // userInfo.alias = '我的手机'
                        // userInfo.avatar = `${config.myPhoneIcon}`
                        return false;
                    }
                    if (userInfo) {
                        item.name = util.getFriendAlias(userInfo);
                        item.avatar = userInfo.avatar;
                    }
                } else if (item.scene === "team") {
                    let teamInfo = null;
                    teamInfo = this.$store.state.teamlist.find(team => {
                        return team.teamId === item.to;
                    });
                    if (teamInfo) {
                        item.name = teamInfo.name;
                        item.avatar =
                            teamInfo.avatar ||
                            (teamInfo.type === "normal"
                                ? this.myGroupIcon
                                : this.myAdvancedIcon);
                    } else {
                        item.name = `群${item.to}`;
                        item.avatar = item.avatar || this.myGroupIcon;
                    }
                }
                let lastMsg = item.lastMsg || {};
                if (lastMsg.type === "text") {
                    item.lastMsgShow = lastMsg.text || "";
                } else if (lastMsg.type === "custom") {
                    item.lastMsgShow = util.parseCustomMsg(lastMsg);
                } else if (
                    lastMsg.scene === "team" &&
                    lastMsg.type === "notification"
                ) {
                    item.lastMsgShow = util.generateTeamSysmMsg(lastMsg);
                } else if (util.mapMsgType(lastMsg)) {
                    item.lastMsgShow = `[${util.mapMsgType(lastMsg)}]`;
                } else {
                    item.lastMsgShow = "";
                }
                if (item.updateTime) {
                    item.updateTimeShow = util.formatDate(
                        item.updateTime,
                        true
                    );
                }
                return item;
            });
            return sessionlist;
        }
    },
    methods: {
        enterChat(session) {
            // 此时设置当前会话
            this.$store.dispatch("setCurrSession", session.id);
            console.log(session);
        }
    },
    created() {

        /**
         * http://127.0.0.1:8080/#/index?account=13215651001&token=123456&sessionId=p2p-15205518392
         *
         **/
        // 提交sdk连接请求
        console.log(window.location.href);
        let params = getParamsFromHref(window.location.href);
        this.account = params.account;
        this.sdktoken = params.token;
        this.currSessionId = params.sessionId||null;

        // 此时设置当前会话
        this.$store.dispatch("setCurrSession", this.currSessionId);
        console.log(params);
        cookie.setCookie("uid", this.account.toLowerCase());
        cookie.setCookie("sdktoken", this.sdktoken);
        this.$store.dispatch("connect");
        this.$store.dispatch("updateRefreshState");

        console.log(window.innerWidth);
    }
};
</script>


<style lang="scss">
.nim {
    height: 100%;
    .layout {
        display: flex;
        justify-content: space-between;
        height: 100%;
    }
    p {
        margin: 0;
    }
}
</style>
