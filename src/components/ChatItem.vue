<template>
    <li
        class="u-msg"
        :class="{
      'item-me': msg.flow==='out',
      'item-you': msg.flow==='in',
      'item-time': msg.type==='timeTag',
      'item-tip': msg.type==='tip',
      'session-chat': type==='session'
    }"
    >
        <div v-if="msg.type==='timeTag'">---- {{msg.showText}} ----</div>
        <div v-else-if="msg.type==='tip'" class="tip">{{msg.showText}}</div>
        <div
            v-else-if="msg.type==='notification' && msg.scene==='team'"
            class="notification"
        >{{msg.showText}}</div>
        <div
            v-else-if="msg.flow==='in' || msg.flow==='out'"
            :idClient="msg.idClient"
            :time="msg.time"
            :flow="msg.flow"
            :type="msg.type"
            class="msg-item"
        >
            <a class="msg-head" v-if="msg.avatar">
                <img class="icon u-circle" :src="msg.avatar">
            </a>
            <p class="msg-user" v-else-if="msg.type!=='notification'">
                <em>{{msg.showTime}}</em>
                {{msg.from}}
            </p>

            <span v-if="msg.type==='text'" class="msg-text" v-html="msg.showText"></span>
            <span v-else-if="msg.type==='custom-type1'" class="msg-text" ref="mediaMsg"></span>
            <span v-else-if="msg.type==='custom-type3'" class="msg-text" ref="mediaMsg"></span>
            <span
                v-else-if="msg.type==='image'"
                class="msg-text"
                ref="mediaMsg"
                @click.stop="showFullImg(msg.originLink)"
            ></span>
            <span v-else-if="msg.type==='video'" class="msg-text" ref="mediaMsg"></span>
            <span
                v-else-if="msg.type==='audio'"
                class="msg-text msg-audio"
                :class="{'unreadAudio': msg.unreadAudio}"
                :style="'width: ' + msg.width"
                @click="playAudio(msg, $event)"
                v-html="msg.showText"
            ></span>
            <span v-else-if="msg.type==='file'" class="msg-text">
                <a class="file-link" :href="msg.fileLink" target="_blank">
                    <i class="u-icon icon-file"></i>
                    {{msg.showText}}
                </a>
            </span>
            <span
                v-else-if="msg.type==='robot'"
                class="msg-text"
                :class="{'msg-robot': msg.robotFlow!=='out' && !isRobot}"
            >
                <div v-if="msg.robotFlow==='out'">{{msg.showText}}</div>
                <div v-else-if="msg.subType==='bot'">
                    <!-- 多次下发的机器人消息 -->
                    <div v-for="(tmsgs,index) in msg.message" :key="index">
                        <!-- 多个机器人模板 -->
                        <div v-for="(tmsg,index) in tmsgs" :key="index">
                            <div v-if="tmsg.type==='text'">
                                <p>{{tmsg.text}}</p>
                            </div>
                            <div v-else-if="tmsg.type==='image'">
                                <p>
                                    <img :src="tmsg.url">
                                </p>
                            </div>
                            <div v-else-if="tmsg.type==='url'">
                                <a :class="tmsg.style" :href="tmsg.target" target="_blank">
                                    <div v-if="tmsg.image">
                                        <p v-for="(tmsg2,index) in tmsg.image"  :key="index">
                                            <img :src="tmsg2.url">
                                        </p>
                                    </div>
                                    <div v-if="tmsg.text">
                                        <p v-for="(tmsg2,index) in tmsg.text"  :key="index">{{tmsg2.text}}</p>
                                    </div>
                                </a>
                            </div>
                            <div v-else-if="tmsg.type==='block'">
                                <a
                                    :class="tmsg.style"
                                    :params="tmsg.params"
                                    :target="tmsg.target"
                                    @click="sendRobotBlockMsg(tmsg, msg)"
                                >
                                    <div v-if="tmsg.image">
                                        <p v-for="(tmsg2,index) in tmsg.image"  :key="index">
                                            <img :src="tmsg2.url">
                                        </p>
                                    </div>
                                    <div v-if="tmsg.text">
                                        <p v-for="(tmsg2,index) in tmsg.text"  :key="index">{{tmsg2.text}}</p>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else-if="msg.subType==='faq'">
                    <!--p>{{msg.message.question}}</p-->
                    <p>{{msg.message.answer}}</p>
                </div>
                <span v-if="msg.robotFlow!=='out' && !isRobot" class="msg-link">
                    <a class="link-right" @click="continueRobotMsg(msg.content.robotAccid)">继续对话</a>
                </span>
            </span>
            <span v-else-if="msg.type==='notification'" class="msg-text notify">{{msg.showText}}</span>
            <span v-else class="msg-text" v-html="msg.showText"></span>
            <span v-if="msg.status==='fail'" class="msg-failed">
                <i class="weui-icon-warn"></i>
            </span>
            <a
                v-if="teamMsgUnRead >=0"
                class="msg-unread"
                :href="`#/msgReceiptDetail/${msg.to}-${msg.idServer}`"
            >{{teamMsgUnRead>0 ? `${teamMsgUnRead}人未读`: '全部已读'}}</a>
        </div>
    </li>
</template>

<script type="text/javascript">
import util from "utils";
import config from "configs";
import emojiObj from "configs/emoji";
var audio = {
    // 正在播放音频的 audio、target
    $node: null,
    $audio: null,
    timeout: "",
    imgPlay0:
        "https://yx-web-nosdn.netease.im/quickhtml%2Fassets%2Fyunxin%2Fdefault%2Fplay0.gif",
    imgPlay1:
        "https://yx-web-nosdn.netease.im/quickhtml%2Fassets%2Fyunxin%2Fdefault%2Fplay1.gif"
};
export default {
    props: {
        type: String, // 类型，chatroom, session
        rawMsg: {
            type: Object,
            default() {
                return {};
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
        isRobot: {
            type: Boolean,
            default() {
                return false;
            }
        },
        isHistory: {
            type: Boolean,
            default() {
                return false;
            }
        }
        // robotInfos: {
        //   type: Object,
        //   default () {
        //     return {}
        //   }
        // }
    },
    data() {
        return {
            msg: "",
            isFullImgShow: false
        };
    },
    computed: {
        robotInfos() {
            return this.$store.state.robotInfos;
        },
        teamMsgUnRead() {
            var obj =
                !this.isHistory &&
                this.msg.needMsgReceipt &&
                this.msg.flow === "out" &&
                this.$store.state.teamMsgReads.find(
                    item => item.idServer === this.msg.idServer
                );

            return obj ? parseInt(obj.unread) : -1;
        }
    },
    watch: {
        rawMsg(newVal, oldVal) {
            let newCustom = newVal && newVal.localCustom;
            if (!newCustom || !newVal || newVal.type !== "audio") {
                return;
            }
            let oldCustom = oldVal && oldVal.localCustom;
            if (newCustom !== oldCustom) {
                this.computedItem();
            }
        }
    },
    beforeMount() {
        this.computedItem();
    },
    mounted() {
        let item = this.msg;
        window.stopPlayAudio = this.stopPlayAudio.bind(this);
        // 有时序问题的操作
        this.$nextTick(() => {
            let media = null;
            if (item.type === "image") {
                // 图片消息缩略图
                media = new Image();
                media.src =
                    item.file.url + "?imageView&thumbnail=180x0&quality=85";
            } else if (item.type === "custom-type1") {
                // 猜拳消息
                media = new Image();
                media.className = "emoji-middle";
                media.src = item.imgUrl;
            } else if (item.type === "custom-type3") {
                // 贴图表情
                media = new Image();
                media.className = "emoji-big";
                media.src = item.imgUrl;
            } else if (item.type === "video") {
                if (/(mov|mp4|ogg|webm)/i.test(item.file.ext)) {
                    media = document.createElement("video");
                    media.src = item.file.url;
                    media.width = 640;
                    media.height = 480;
                    media.autoStart = false;
                    media.preload = "metadata";
                    media.controls = "controls";
                } else {
                    let aLink = document.createElement("a");
                    aLink.href = item.file.url;
                    aLink.target = "_blank";
                    aLink.innerHTML = `<i class="u-icon icon-file"></i>${
                        video.name
                    }`;
                    this.$refs.mediaMsg.appendChild(aLink);
                }
            }
            if (media) {
                if (this.$refs.mediaMsg) {
                    this.$refs.mediaMsg.appendChild(media);
                }
                media.onload = () => {
                    this.$emit("msg-loaded");
                };
                media.onerror = () => {
                    this.$emit("msg-loaded");
                };
            } else {
                this.$emit("msg-loaded");
            }
        }); // end this.nextTick
    },
    methods: {
        computedItem() {
            let item = Object.assign({}, this.rawMsg);
            // 标记用户，区分聊天室、普通消息
            if (this.type === "session") {
                if (item.flow === "in") {
                    if (
                        item.type === "robot" &&
                        item.content &&
                        item.content.msgOut
                    ) {
                        // 机器人下行消息
                        let robotAccid = item.content.robotAccid;
                        item.avatar = this.robotInfos[robotAccid].avatar;
                        item.isRobot = true;
                        // item.link = `#/namecard/${robotAccid}`;
                    } else if (item.from !== this.$store.state.userUID) {
                        item.avatar =
                            (this.userInfos[item.from] &&
                                this.userInfos[item.from].avatar) ||
                            config.defaultUserIcon;
                        // item.link = `#/namecard/${item.from}`;
                        //todo  如果是未加好友的人发了消息，是否能看到名片
                    } else {
                        item.avatar = this.myInfo.avatar;
                    }
                } else if (item.flow === "out") {
                    item.avatar = this.myInfo.avatar;
                }
            } else {
                // 标记时间，聊天室中
                item.showTime = util.formatDate(item.time);
            }
            if (item.type === "timeTag") {
                // 标记发送的时间
                item.showText = item.text;
            } else if (item.type === "text") {
                // 文本消息
                item.showText = util.escape(item.text);
                if (/\[[^\]]+\]/.test(item.showText)) {
                    let emojiItems = item.showText.match(/\[[^\]]+\]/g);
                    emojiItems.forEach(text => {
                        console.log(emojiObj);
                        if (emojiObj[text]) {
                            item.showText = item.showText.replace(
                                text,
                                `<img class="emoji-small" src="${
                                    emojiObj[text].img
                                }">`
                            );
                        }
                    });
                }
            } else if (item.type === "custom") {
                let content = JSON.parse(item.content);
                // type 1 为猜拳消息
                if (content.type === 1) {
                    let data = content.data;
                    let resourceUrl = config.resourceUrl;
                    // item.showText = `<img class="emoji-middle" src="${resourceUrl}/im/play-${data.value}.png">`
                    item.type = "custom-type1";
                    item.imgUrl = `${resourceUrl}/im/play-${data.value}.png`;
                    // type 3 为贴图表情
                } else if (content.type === 3) {
                    let data = content.data;
                    let emojiCnt = "";
                    if (emojiObj.pinupList[data.catalog]) {
                        emojiCnt =
                            emojiObj.pinupList[data.catalog][data.chartlet];
                        // item.showText = `<img class="emoji-big" src="${emojiCnt.img}">`
                        item.type = "custom-type3";
                        item.imgUrl = `${emojiCnt.img}`;
                    }
                } else {
                    item.showText = util.parseCustomMsg(item);
                    if (item.showText !== "[自定义消息]") {
                        item.showText += ",请到手机或电脑客户端查看";
                    }
                }
            } else if (item.type === "image") {
                // 原始图片全屏显示
                item.originLink = item.file.url;
            } else if (item.type === "video") {
                // ...
            } else if (item.type === "audio") {
                item.width =
                    (5.3 + Math.round(item.file.dur / 1000) * 0.03).toFixed(2) +
                    "rem";
                item.audioSrc = item.file.mp3Url;
                item.showText =
                    "<i>" + Math.round(item.file.dur / 1000) + '"</i> 点击播放';
                if (!this.isHistory && nim.useDb) {
                    item.unreadAudio = !item.localCustom;
                }
            } else if (item.type === "file") {
                item.fileLink = item.file.url;
                item.showText = item.file.name;
            } else if (item.type === "notification") {
                if (item.scene === "team") {
                    item.showText = util.generateTeamSysmMsg(item);
                } else {
                    //对于系统通知，更新下用户信息的状态
                    item.showText = util.generateChatroomSysMsg(item);
                }
            } else if (item.type === "tip") {
                //对于系统通知，更新下用户信息的状态
                item.showText = item.tip;
            } else if (item.type === "robot") {
                let content = item.content || {};
                let message = content.message || [];
                if (!content.msgOut) {
                    // 机器人上行消息
                    item.robotFlow = "out";
                    item.showText = item.text;
                } else if (content.flag === "bot") {
                    item.subType = "bot";
                    message = message.map(item => {
                        if (item.type === "template") {
                            // 在vuex(store/actions/msgs.js)中已调用sdk方法做了转换
                            return item.content.json;
                        } else if (
                            item.type === "text" ||
                            item.type === "answer"
                        ) {
                            // 保持跟template结构一致
                            return [
                                {
                                    type: "text",
                                    text: item.content
                                }
                            ];
                        } else if (item.type === "image") {
                            // 保持跟template结构一致
                            return [
                                {
                                    type: "image",
                                    url: item.content
                                }
                            ];
                        }
                    });
                    item.message = message;
                } else if (item.content.flag === "faq") {
                    item.subType = "faq";
                    item.query = message.query;
                    let match = message.match.sort((a, b) => {
                        // 返回最匹配的答案
                        return b.score - a.score;
                    });
                    item.message = match[0];
                }
            } else {
                item.showText = `[${util.mapMsgType(
                    item
                )}],请到手机或电脑客户端查看`;
            }
            this.msg = item;
        },
        revocateMsg(vNode) {
            // 在会话聊天页
            if (this.$store.state.currSessionId) {
                if (vNode && vNode.data && vNode.data.attrs) {
                    let attrs = vNode.data.attrs;
                    if (attrs.type === "robot") {
                        return;
                    }
                    // 自己发的消息
                    if (attrs.flow === "out") {
                        let that = this;
                        this.$vux.confirm.show({
                            title: "确定需要撤回消息",
                            onCancel() {},
                            onConfirm() {
                                that.$store.dispatch("revocateMsg", {
                                    idClient: attrs.idClient
                                });
                            }
                        });
                    }
                }
            }
        },
        sendRobotBlockMsg(msg, originMsg) {
            if (this.isHistory) {
                // 在历史消息中，不进行机器人交互
                return;
            }
            let body = "[复杂按钮模板触发消息]";
            if (msg.text && msg.text.length === 1) {
                body = msg.text[0].text;
            }
            let robotAccid = originMsg.content.robotAccid;
            if (!this.isRobot) {
                body = `@${this.robotInfos[robotAccid].nick} ${body}`;
            }
            if (this.type === "session") {
                this.$store.dispatch("sendRobotMsg", {
                    type: "link",
                    scene: originMsg.scene,
                    to: originMsg.to,
                    robotAccid,
                    // 机器人后台消息
                    params: msg.params,
                    target: msg.target,
                    // 显示的文本消息
                    body
                });
            } else if (this.type === "chatroom") {
                this.$store.dispatch("sendChatroomRobotMsg", {
                    type: "link",
                    robotAccid,
                    // 机器人后台消息
                    params: msg.params,
                    target: msg.target,
                    // 显示的文本消息
                    body
                });
            }
        },
        continueRobotMsg(robotAccid) {
            this.$store.dispatch("continueRobotMsg", robotAccid);
        },
        showFullImg(src) {
            console.log(src);
            this.$store.dispatch("showFullscreenImg", {
                src
            });
        },
        autoPlayNextUnreadAudio() {
            var parentNode = audio.$node && audio.$node.parentElement;
            if (!parentNode) {
                return;
            }
            var currentMsgNode = parentNode.parentElement;
            var nextMsgNode = currentMsgNode.nextElementSibling;
            var nextAudioNode;
            while (nextMsgNode) {
                if (~nextMsgNode.className.indexOf("item-you")) {
                    nextAudioNode = nextMsgNode.querySelector(".msg-audio");
                    if (nextAudioNode) {
                        break;
                    }
                }
                nextMsgNode = nextMsgNode.nextElementSibling;
            }
            if (
                nextMsgNode &&
                ~nextAudioNode.className.indexOf("unreadAudio")
            ) {
                nextAudioNode.click();
            }
        },
        playAudio(msg, event) {
            var $target;
            if (!~event.target.className.indexOf("msg-audio")) {
                $target = event.target.parentElement;
            } else {
                $target = event.target;
            }
            if (audio.$audio) {
                var targetChild1 = $target.childNodes[2];
                var sameNode = targetChild1 && targetChild1.tagName === "IMG";
                this.stopPlayAudio();
                if (sameNode) {
                    return;
                }
            }
            var duration = msg.file.dur;
            if (!duration) {
                return;
            }
            audio.$audio = document.createElement("audio");
            var $source = document.createElement("source");
            var audioType = msg.file.ext;
            $source.src = msg.file.url;
            $source.type =
                "audio/" + (audioType === "mp3" ? "mpeg" : audioType);
            audio.$audio.appendChild($source);
            audio.$audio.play();
            audio.$node = $target;
            $target.innerHTML = $target.innerHTML.replace(
                "点击播放",
                '<img src="' +
                    (msg.flow === "in" ? audio.imgPlay1 : audio.imgPlay0) +
                    '">'
            );
            audio.timeout = setTimeout(() => {
                audio.$audio = null;
                this.canclePlayAudio();
            }, duration);
            if (~audio.$node.className.indexOf("unreadAudio")) {
                msg.localCustom = '{"audio": "played"}';
                this.$store.dispatch("updateLocalMsg", msg);
                audio.$node.className = audio.$node.className.replace(
                    "unreadAudio",
                    ""
                );
                audio.$audio.onended = this.autoPlayNextUnreadAudio.bind(this);
            }
        },
        canclePlayAudio() {
            if (audio.$node.childNodes[2]) {
                audio.$node.removeChild(audio.$node.childNodes[2]);
            }
            audio.$node.innerHTML += "点击播放";
        },
        stopPlayAudio() {
            if (audio.$audio) {
                audio.$audio.pause();
                this.canclePlayAudio();
                clearTimeout(audio.timeout);
                audio.$audio = null;
                audio.$node = null;
                audio.timeout = "";
            }
        },
        toMsgUnReadDetail() {
            this.href = "#/msgReceiptDetail/" + this.msg.idServer;
        }
    }
};
</script>

<style lang="scss" scoped>
.p-chat-history {
    .u-msg {
        .msg-link {
            display: none;
        }
    }
}
.p-chat-list {
    .u-msg {
        overflow: hidden;
        margin-bottom: 20px;
        .msg-item {
            display: flex;
            max-width: 90%;
            overflow: hidden;
        }
        .msg-text {
            display: block;
            flex: 1;
            padding: 14px 20px;
            background: #bae0ff;
            position: relative;
            border-radius: 5px;
            text-align: left;
            line-height: 1.2em;
            min-height: 1.2em;
            &::after {
                position: absolute;
                top: 15px;
                content: "";
                display: block;
                border: 10px solid #fff;
            }
            .emoji-small {
                width: 1.4rem;
                height: 1.4rem;
                vertical-align: bottom;
            }
        }
        .msg-link {
            bottom: 0;
            right: -4rem;
            font-size: 0.9rem;
        }
        .msg-head {
            display: inline-block;
            width: 48px;
            height: 48px;
            img {
                width: 100%;
                height: 100%;
            }
        }
    }

    .item-time {
        // padding-top: 15px;
        color: #999;
    }

    .item-you {
        .msg-head {
            float: left;
        }

        .msg-text {
            float: left;
            margin-left: 14px;
            &::after {
                left: -20px;
                border-color: transparent #b9e0ff transparent transparent;
            }
        }
        .msg-item {
            float: left;
        }
    }
    .item-me {
        .msg-head {
            float: right;
        }
        .msg-text {
            float: right;
            margin-right: 14px;
            &::after {
                right: -20px;
                border-color: transparent transparent transparent #b9e0ff;
            }
        }
        .msg-item {
            float: right;
            flex-direction: row-reverse;
        }
    }
}

.msg-unread {
    position: relative;
    float: right;
    top: 0.3rem;
    right: 0.5rem;
    font-size: 0.9rem;
    color: #0091e4;
}
</style>
