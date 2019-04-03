<template>
    <div class="chat-editor">
        <div class="tool">
            <span class="icon" title="选择表情" @click.stop="isEmojiShown = true">
                <i class="icon-img1"></i>
            </span>
            <span class="icon" title="选择图片">
                <input id="file1" type="file" ref="fileToSent" @change="sendFileMsg">
                <label for="file1" class="icon-img2"></label>
            </span>
            <span class="icon" title="选择文件">
                <input id="file2" type="file" ref="fileToSent" @change="sendFileMsg">
                <label for="file2" class="icon-img3"></label>
            </span>
        </div>
        <chat-emoji v-show="isEmojiShown" @add-emoji="addEmoji"></chat-emoji>
        <div class="textarea-box">
            <textarea class="scroll"  v-model="msgToSent"></textarea>
        </div>
        <span class="send" @click="sendTextMsg">发 送</span>
    </div>
</template>
<script>
import config from "configs"
import ChatEmoji from './ChatEmoji'
export default {
    data () {
        return {
            msgToSent: "",
            isEmojiShown: false,
        }
    },
    props: {
        type: String,
        scene: String,
        to: String,
        isRobot: {
            type: Boolean,
            default() {
                return false;
            }
        },
        invalid: {
            type: Boolean,
            default: false
        },
        invalidHint: {
            type: String,
            default: "您无权限发送消息"
        },
        advancedTeam: {
            type: Boolean,
            default: false
        }
    },
    components: {
        ChatEmoji,
    },
    methods: {
        addEmoji(emojiName) {
            this.msgToSent += emojiName;
            this.isEmojiShown = false;
        },
        sendTextMsg() {
            console.log('发送')
            if (/^\s*$/.test(this.msgToSent)) {
                this.$message.error('请不要发送空消息');
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
        sendFileMsg() {

        }
    },
}
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
            i,label {
                cursor: pointer;
                display: block;
                width: 30px;
                height: 30px;
                background-image: url('~assets/static/im/icons.png');
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
    .textarea-box{
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
        padding: 4px 14px;
        border-radius: 4px;
        border: 1px solid #eee;
        font-size: 14px;
        background: #3598dc;
        color: #fff;
    }
}
</style>

