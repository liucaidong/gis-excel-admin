<template>
  <div>
    <div id="map-box" style="width:100%; height: 700px;"></div>
  </div>
</template>

<script>
import AMap from 'AMap'

export default {
  name: 'MyMap',
  mounted() {
    this.amapView()
  },
  methods: {
    amapView() {
      const map = new AMap.Map('map-box', {
        zoom: 11,
        center: ['116.537812', '40.02218045'],
        viewMode: '3D'
      })
      map.plugin(['AMap.ToolBar', 'AMap.MapType'], function(){
        map.addControl(new AMap.ToolBar())
        map.addControl(new AMap.MapType({
          showTraffic: false,
          showRoad: false
        }))
      })
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
