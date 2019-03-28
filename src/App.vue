<template>
    <div class="nim" id="app">
        <div class="layout">
            <left-siade></left-siade>
            <router-view/>
        </div>
        <fullscreen-img></fullscreen-img>
    </div>
</template>

<script>
import FullscreenImg from "components/FullscreenImg";
import LeftSiade from "components/LeftSiade"

export default {
    data() {
        return {
            loading: null
        };
    },
    components: {
        FullscreenImg,
        LeftSiade
    }
};
</script>


<style lang="scss">
#app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    height: 100%;
    margin-right: 10px;
    margin-bottom: 10px;
    background: #fff;
    border: 1px solid #ddd;
}
#nav {
    padding: 30px;
    a {
        font-weight: bold;
        color: #2c3e50;
        &.router-link-exact-active {
            color: #42b983;
        }
    }
}
.nim {
    .layout {
        display: flex;
        justify-content: space-between;
    }
}
</style>
