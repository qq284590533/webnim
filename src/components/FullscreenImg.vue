<template>
    <div class="chat-fullscreen" :class="{active:showImg}" @click.stop="hideFullscreenImg">
        <div class="chat-mask"></div>
        <div class="chat-image" ref="chatImg"></div>
    </div>
</template>

<script type="text/javascript">
export default {
    // 兼容性处理，图片加载时间可能比较慢
    watch: {
        isFullscreenImgShow(val, oldVal) {
            var self = this;
            let chatImg = this.$refs.chatImg;
            if (val === true) {
                chatImg.innerHTML = "";
                let img = new Image();
                img.src = this.$store.state.fullscreenImgSrc;
                img.alt = "图片尺寸较大，正在加载中...";
                img.onload = function() {
                    chatImg.appendChild(img);
                    self.showImg = val;
                };
            } else {
                self.showImg = false;
                chatImg.innerHTML = "";
            }
        }
    },
    data() {
        return {
            showImg: false
        };
    },
    computed: {
        isFullscreenImgShow() {
            return this.$store.state.isFullscreenImgShow;
        }
    },
    methods: {
        hideFullscreenImg() {
            this.$store.dispatch("hideFullscreenImg");
        }
    }
};
</script>

