<template>
  <div class="wrapper">
    <div class="mapChart" v-if="mapData">
      <map-chart :chartData="mapData" @detail="checkDetailData"></map-chart>
    </div>
    <div class="detailChart" v-if="detailData && regionName">
      <detail-chart
        :chartData="detailData"
        :regionName="regionName"
      ></detail-chart>
    </div>
  </div>
</template>
<script>
import api from "@/utils/api";
import mapChart from "@/components/MapChart";
import detailChart from "@/components/DetailChart";

export default {
  components: {
    mapChart,
    detailChart
  },
  data() {
    return {
      mapData: null,
      detailData: null,
      regionName: null
    };
  },
  created() {
    let _this = this;
    api.getAllStatistics().then(res => {
      _this.mapData = res.data;
    });
    api.getDetailStatistics(6).then(res => {
      res.data.forEach(region => {
        if (region.name === "北京") {
          _this.detailData = region.slides;
          _this.regionName = region.name;
        }
      });
    });
  },
  methods: {
    checkDetailData: function(name) {
      let _this = this;
      if (name !== this.regionName) {
        api.getDetailStatistics(6).then(res => {
          res.data.forEach(region => {
            if (region.name === name) {
              _this.detailData = region.slides;
              _this.regionName = region.name;
            }
          });
        });
      }
    }
  }
};
</script>

<style scoped>
.wrapper {
  height: 100%;
  width: 100%;
  display: flex;
}

.mapChart {
  margin-right: 30px;
  padding: 10px;
  height: 95%;
  width: 55%;
  background-color: #bedbf9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}

.detailChart {
  padding: 10px;
  height: 95%;
  width: 40%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
</style>
