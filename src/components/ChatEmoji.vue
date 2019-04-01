<template>
    <div class="chat-emoji">
        <div class="scroll content">
            <span
                class="emoji-item"
                v-for="(item,index) in emojiList"
                @click.stop="selectEmoji(item)"
                :key="index"
                :title="item.key"
            >
                <img :src="item.img" >
            </span>
        </div>
    </div>
</template>

<script>
import emojiObj from "configs/emoji";
export default {
    data () {
        return {
            emojiList:[],
        }
    },
    props: {

    },
    methods: {
        selectEmoji(emoji) {
            // 由触发父组件事件，增加表情文案
            this.$emit("add-emoji", emoji.key);
        },
        clickHandle(e) {
            this.$parent.isEmojiShown = false;
        }
    },
    created() {
        console.log(emojiObj)
        for (let key in emojiObj) {
            this.emojiList.push({
                type:'emoji',
                name:'emoji',
                key,
                img: emojiObj[key].img
            })
        }
        let _this = this;
        document.addEventListener('click', _this.clickHandle)
    },
    beforeDestroy() {
        let _this = this;
        document.removeEventListener('click', _this.clickHandle)
    }
};
</script>

<style lang="scss" scoped>
.chat-emoji {
    position: absolute;
    width: 63%;
    min-width: 300px;
    box-sizing: border-box;
    padding: 10px;
    bottom: 178px;
    left: 20px;
    border: 1px solid #eee;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    .content {
        display: flex;
        width: 100%;
        flex-wrap: wrap;
        max-height: 200px;
        overflow: auto;
        .emoji-item {
            display: inline-block;
            width: 36px;
            height: 36px;
            padding: 3px;
            box-sizing: border-box;
            cursor: pointer;
            border: 1px solid #fff;
            &:hover {
                border-color: #eee;
            }
            img {
                width: 100%;
                height: 100%;
            }
        }
    }
}
.scroll {
    &::-webkit-scrollbar {
        width: 6px;
        height: 6px;
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
