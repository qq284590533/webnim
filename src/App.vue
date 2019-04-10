<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
import store from './store'
export default {
    data() {
        return {
        };
    },
    components: {
    },
    methods: {

    },
    created() {
        // store.commit('updateSessions', sessions)
        console.log(window.innerWidth)
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
    box-sizing: border-box;
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
        height: 100%;
    }
    p {
        margin: 0;
    }
}
</style>
