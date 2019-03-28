<template>
    <div class="chat-box">
        <img src="~static/emoji/ajmd/ajmd016.png" alt="">
    </div>
</template>

<script>
import getParamsFromHref from 'utils/href-resolver'
import cookie from 'utils/cookie'
export default {
    data() {
        return {
            account: '',
            sdktoken: '',
            loading:null,
        }
    },
    created() {
        // 提交sdk连接请求
        console.log(window.location.href);
        let params = getParamsFromHref(window.location.href)
        this.account = params.account;
        this.sdktoken = params.token;
        console.log(params)
        cookie.setCookie('uid', this.account.toLowerCase())
        cookie.setCookie('sdktoken', this.sdktoken)
        this.$store.dispatch('connect')
        this.$store.dispatch('updateRefreshState')

    },
    computed: {
      isLoading () {
        return this.$store.state.isLoading
      }
    },
    watch: {
        isLoading (newvalue, oldvalue) {
            if(newvalue) {
                this.loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
            } else {
                if(this.loading) {
                    this.loading.close()
                }
            }
        }
    },
    methods: {
        login() {

        }
    },
};
</script>
<style lang="scss" scoped>
.chat-box{
    width: 700px;
    background: #009688;
}
</style>
