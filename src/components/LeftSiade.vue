<template>
    <div class="left-siade">
        <div class="message-box">
            <h4 class="title">消息</h4>
            <div class="message-list">
                <div class="cell" v-for="(session,index) in sessionlist" :key="index" @click.native="enterChat(session)">
                    <p>{{session.name}}</p>
                </div>
            </div>
        </div>
        <div ref="demandBox" class="demand-box">
            <el-collapse v-model="activeName" accordion  v-if="currSessionId!=null">
                <el-collapse-item name="1">
                    <h4 class="collapse-title" slot="title">当前需求</h4>
                    <div class="demand-item" :style="{height:collapseItemHeight}">
                        <h4>车架号：</h4>
                        <p>LFV2A21K6A3092399</p>
                        <h4>车型车系：</h4>
                        <p>2013 大众（一汽大众） CC 1.8TSI 双离合 尊贵型</p>
                        <h4>需求品质：</h4>
                        <p><span class="tag">原厂件</span><span class="tag">品牌件</span></p>
                        <h4>需求产品：</h4>
                        <table class="demand-table" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                                <td>前刹车片</td>
                                <td>1J0698151M</td>
                                <td>×2</td>
                            </tr>
                            <tr>
                                <td>前刹车片</td>
                                <td>1J0698151M</td>
                                <td>×2</td>
                            </tr>
                        </table>
                        <h4>需求描述：</h4>
                        <p>2013 大众（一汽大众）  CC  1.8TSI 双离合 尊贵型  前后刹车片等等等一堆描述文字</p>
                        <h4>收货信息：</h4>
                        <p>安徽省合肥市瑶海区明皇路与广德路交口西北角 鼎天修理厂
 张总 13399690927</p>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="历史需求" name="2">
                    <h4 class="collapse-title" slot="title">历史需求</h4>
                    <div class="demand-item" :style="{height:collapseItemHeight}">
                        <div class="item-box">
                            <div class="top">
                                <p>XQ201903011646001</p>
                                <p>
                                    <span>2019-02-28 18:00</span> |
                                    <span class="status">已成交</span>
                                </p>
                            </div>
                            <p class="describe">2013 大众（一汽大众）  CC  1.8TSI 双离合 尊贵型</p>
                            <div class="goods">
                                <p><span>前刹车片</span><span>x2</span></p>
                                <p><span>前刹车片</span><span>x2</span></p>
                            </div>
                        </div>
                        <div class="item-box">
                            <div class="top">
                                <p>XQ201903011646001</p>
                                <p>
                                    <span>2019-02-28 18:00</span> |
                                    <span class="status">已成交</span>
                                </p>
                            </div>
                            <p class="describe">2013 大众（一汽大众）  CC  1.8TSI 双离合 尊贵型</p>
                            <div class="goods">
                                <p><span>前刹车片</span><span>x2</span></p>
                                <p><span>前刹车片</span><span>x2</span></p>
                            </div>
                        </div>
                        <div class="item-box">
                            <div class="top">
                                <p>XQ201903011646001</p>
                                <p>
                                    <span>2019-02-28 18:00</span> |
                                    <span class="status">已成交</span>
                                </p>
                            </div>
                            <p class="describe">2013 大众（一汽大众）  CC  1.8TSI 双离合 尊贵型</p>
                            <div class="goods">
                                <p><span>前刹车片</span><span>x2</span></p>
                                <p><span>前刹车片</span><span>x2</span></p>
                            </div>
                        </div>
                        <div class="item-box">
                            <div class="top">
                                <p>XQ201903011646001</p>
                                <p>
                                    <span>2019-02-28 18:00</span> |
                                    <span class="status">已成交</span>
                                </p>
                            </div>
                            <p class="describe">2013 大众（一汽大众）  CC  1.8TSI 双离合 尊贵型</p>
                            <div class="goods">
                                <p><span>前刹车片</span><span>x2</span></p>
                                <p><span>前刹车片</span><span>x2</span></p>
                            </div>
                        </div>
                    </div>
                </el-collapse-item>
            </el-collapse>
            <div v-else>
                请选择聊天对象
            </div>
        </div>
    </div>
</template>

<script>

export default {
    data() {
        return {
            activeName: "1",
            collapseItemHeight: 0,
            messageList: [{
                name:'鼎天修理厂',
                id:'15205518392'
            },{
                name:'车之行汽车维修',
                id:'15205518392'
            },{
                name:'新旅途汽车美容养护',
                id:'15205518392'
            }]
        };
    },
    props: {
        sessionlist:{
            type: Array,
            default () {
                return []
            }
        },
        currSessionId: {
            type: String,
            default: ''
        }
    },
    methods: {
        enterChat(session) {
            this.$emit('enterChat',session)
        },
        setHeight() {
            let demandBox = this.$refs.demandBox;
            let height = demandBox.clientHeight;
            this.collapseItemHeight = height-100-25+'px'
            console.log(height);
        }
    },
    mounted() {
        this.setHeight();
    }
};
</script>

<style lang="scss" scoped>
.left-siade {
    display: flex;
    width: 600px;
    justify-content: space-between;
    height: 100%;
    overflow: hidden;
    box-sizing: border-box;
    .collapse-title {
        font-size: 16px;
    }
    .message-box {
        width:240px;
        border-right: 1px solid #ddd;
        box-sizing: border-box;
        .title {
            margin: 0;
            line-height: 49px;
        }
        .message-list{
            .cell {
                box-sizing: border-box;
                padding: 0 20px;
                text-align: left;
                cursor: pointer;
                line-height: 48px;
                overflow: hidden;
                p {
                    margin: 0;
                    border-bottom: 1px solid #eee;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                &:first-child p{
                    border-top: 1px solid #eee;
                }
                &:hover {
                    background: #eee;
                }
            }
        }
    }
    .demand-box{
        width: 360px;
        padding: 0 12px;
        box-sizing: border-box;
        border-right: 1px solid #ddd;
        .demand-item {
            text-align: left;
            overflow: auto;
            padding-right: 10px;
            h4 {
                font-size: 14px;
                margin: 0;
                line-height: 34px;
                margin-top: 10px;
                &:first-child {
                    margin-top: 0;
                }
            }
            p {
                color: #666;
            }
            .tag {
                display: inline-block;
                padding: 0 10px;
                line-height: 22px;
                border: 1px solid #eee;
                border-radius: 22px;
                font-size: 12px;
                color:#666;
                margin: 0 5px;
            }
            .demand-table {
                border-left: 1px solid #eee;
                border-top: 1px solid #eee;
            }
            .demand-table td{
                border-right: 1px solid #eee;
                border-bottom: 1px solid #eee;
                padding: 5px;
                text-align: center;
            }
            .item-box {
                margin-bottom: 10px;
                border: 1px solid #ddd;
                padding: 4px 10px;
                border-radius: 5px;
                box-shadow: 1px 1px 2px #eee;
                .top {
                    display: flex;
                    line-height: 30px;
                    justify-content: space-between;
                    color: #666;
                    border-bottom: 1px solid #ccc;
                    .status {
                        color:#333;
                        font-weight: bold;
                    }
                }
                .describe {
                    margin: 10px 0;
                    line-height: 20px;
                }
                .goods {
                    p {
                        display: flex;
                        justify-content: space-between;
                    }
                }
            }
        }
        .el-collapse {
            height: 100%;
        }
    }


}
</style>

