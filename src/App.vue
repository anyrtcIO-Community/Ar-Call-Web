<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
html, body {
  margin: 0;
  width: 100%;
  height: 100%;
}
h1,h2,h3,h4,h5,h6,p,ul,ol { margin: 0; padding: 0;}
ul, li{ list-style: none;}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
}
.clearfix:after{content:".";display:block;height:0;clear:both;visibility:hidden}
.call-container {
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
}

.ar-container {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: row;
  box-sizing: border-box;
  flex-basis: auto;
  &.is-vertical {
    flex-direction: column;
  }
}
.ar-main {
  display: block;
  flex: 1 1 auto;
}
.ar-aside{
  width: 320px;
}
.ar-aside,
.ar-main {
  overflow: auto;
}
.ar-main,
.ar-aside,
.ar-header,
.ar-footer {  
  flex-shrink: 0;
  box-sizing: border-box;
}
.call-main{
  width: 900px;
  height: auto;
  margin: 40px auto 0;
}
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background-color: transparent;
}
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.2);
  background-color: #DDD;
}

</style>
