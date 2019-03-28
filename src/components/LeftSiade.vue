<template>
    <div class="left-siade">
        <div class="message-box">
            <h4>消息</h4>
            <div class="message-list">
                <p>鼎天修理厂</p>
                <p>车之行汽车维修</p>
                <p>新旅途汽车美容养护</p>
            </div>
        </div>
        <div class="demand-box">
            <el-collapse v-model="activeName" accordion>
                <el-collapse-item name="1">
                    <h4 class="collapse-title" slot="title">当前需求</h4>
                    <div class="demand-item">
                        <h4>车架号：</h4>
                        <p>LFV2A21K6A3092399</p>
                        <h4>车型车系：</h4>
                        <p>2013 大众（一汽大众） CC 1.8TSI 双离合 尊贵型</p>
                        <h4>需求品质：</h4>
                        <p>原厂件 品牌件</p>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="历史需求" name="2">
                    <h4 class="collapse-title" slot="title">历史需求</h4>
                    <div class="demand-item">
                        <h4>车架号：</h4>
                        <p>LFV2A21K6A3092399</p>
                        <h4>车型车系：</h4>
                        <p>2013 大众（一汽大众） CC 1.8TSI 双离合 尊贵型</p>
                        <h4>需求品质：</h4>
                        <p>原厂件 品牌件</p>
                    </div>
                </el-collapse-item>
            </el-collapse>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            activeName: "1"
        };
    }
};
</script>

<style lang="scss" scoped>
.left-siade {
    flex: auto;
    display: flex;
    justify-content: space-between;
    .collapse-title {
        font-size: 16px;
    }
    .message-box {
        width:240px;
    }
    .demand-box{
        flex: 1;
    }
}
</style>

