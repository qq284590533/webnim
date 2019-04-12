<template>
    <div class="chat-editor">
        <div class="tool">
            <span class="icon" title="选择表情" @click.stop="isEmojiShown = true">
                <i class="icon-img1"></i>
            </span>
            <span class="icon" title="选择图片">
                <input id="file1" type="file" accept="image/*" ref="imageToSent" @change="sendFileMsg('imageToSent')">
                <label for="file1" class="icon-img2"></label>
            </span>
            <span class="icon" title="选择文件">
                <input id="file2" type="file" ref="fileToSent" @change="sendFileMsg('fileToSent')">
                <label for="file2" class="icon-img3"></label>
            </span>
        </div>
        <chat-emoji v-show="isEmojiShown" @add-emoji="addEmoji"></chat-emoji>
        <div class="textarea-box">
            <textarea
                ref="textarea"
                class="scroll"
                v-model="msgToSent"
                @keyup.ctrl.enter="ctrlEnter"
                @keydown.enter.exact="sendTextMsg"
            ></textarea>
        </div>
        <span class="send" @click="sendTextMsg">发送(Enter)</span>
    </div>
</template>
<script>
import config from "configs";
import ChatEmoji from "./ChatEmoji";
export default {
    data() {
        return {
            msgToSent: "",
            isEmojiShown: false,
        };
    },
    props: {
        type: String,
        scene: {
            type: String,
            default: "p2p"
        },
        to: String
    },
    components: {
        ChatEmoji
    },
    methods: {
        addEmoji(emojiName) {
            this.msgToSent += emojiName;
            this.isEmojiShown = false;
            this.$refs.textarea.focus();
        },
        sendTextMsg(event) {
            event.cancelBubble = true;
            event.preventDefault();
            event.stopPropagation();
            console.log("发送");
            if (/^\s*$/.test(this.msgToSent)) {
                this.$message.error("请不要发送空消息");
                return;
            }
            this.msgToSent = this.msgToSent.trim();
            this.$store.dispatch("sendMsg", {
                type: "text",
                scene: this.scene,
                to: this.to,
                text: this.msgToSent
            });
            this.msgToSent = "";
        },
        sendFileMsg(refName) {
            let ipt =  this.$refs[refName];
            if (ipt.value) {
                if (this.type === "session") {
                    this.$store.dispatch("sendFileMsg", {
                        scene: this.scene,
                        to: this.to,
                        fileInput: ipt
                    });
                } else if (this.type === "chatroom") {
                    this.$store.dispatch("sendChatroomFileMsg", {
                        fileInput: ipt
                    });
                }
            }
        },
        ctrlEnter() {
            this.msgToSent = this.msgToSent + "\r\n";
            console.log("ctrl-enter");
        }
    }
};
</script>

<style lang="scss" scoped>
.chat-editor {
    position: absolute;
    bottom: 1px;
    width: 100%;
    height: 180px;
    .tool {
        position: absolute;
        width: 100%;
        height: 40px;
        display: flex;
        padding: 0 10px;
        box-sizing: border-box;
        background: #fff;
        .icon {
            position: relative;
            width: 40px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            i,
            label {
                cursor: pointer;
                display: block;
                width: 30px;
                height: 30px;
                background-image: url("~assets/static/im/icons.png");
                background-repeat: no-repeat;
            }
            .icon-img1 {
                background-position: 3px -188px;
            }
            .icon-img2 {
                background-position: 3px -75px;
            }
            .icon-img3 {
                background-position: -33px -74px;
            }
            input {
                width: 0;
                height: 0;
                opacity: 0;
            }
        }
    }
    .textarea-box {
        position: absolute;
        top: 40px;
        width: 100%;
        padding: 4px 10px 0;
        box-sizing: border-box;
        overflow: hidden;
        textarea {
            float: left;
            width: 100%;
            height: 86px;
            box-sizing: border-box;
            padding: 0;
            border: none;
            resize: none;
            outline: none;
            font-size: 14px;
        }
    }
    .send {
        position: absolute;
        cursor: pointer;
        bottom: 10px;
        right: 20px;
        display: block;
        padding: 4px 10px;
        border-radius: 4px;
        border: 1px solid #eee;
        line-height: 20px;
        font-size: 12px;
        background: #3598dc;
        color: #fff;
    }
}
</style>

