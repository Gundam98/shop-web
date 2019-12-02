<template>
  <div class="map" ref="mapChart"></div>
</template>
<script>
import echarts from "echarts";
import "echarts/map/js/china"; // 引入中国地图数据

export default {
  name: "mapChart",
  props: {
    chartData: Array
  },
  data() {
    return {
      chart: null,
      data: []
    };
  },
  mounted() {
    this.processData();
    this.chinaConfigure();
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    processData: function() {
      this.chartData.forEach(region => {
        this.data.push({
          name: region.name,
          value: region.slides[0].commissionSum
        });
      });
      this.data.push({
        name: "台湾",
        value: "0"
      });
      this.data.push({
        name: "澳门",
        value: "0"
      });
      this.data.push({
        name: "香港",
        value: "0"
      });
      this.data.push({
        name: "海南诸岛",
        value: "0"
      });
    },
    chinaConfigure: function() {
      let _this = this;
      let myChart = echarts.init(this.$refs.mapChart); //这里是为了获得容器所在位置
      window.onresize = myChart.resize;
      myChart.setOption({
        // 进行相关配置
        backgroundColor: "#bedbf9",
        title: {
          text: "全国统计数据",
          subtext: "(点击地区查看详情)"
        },
        tooltip: {
          trigger: "item",
          showDelay: 0,
          transitionDuration: 0.2,
          formatter: function(params) {
            let name = params.name;
            let regionData = {};
            if (
              name !== "台湾" &&
              name !== "香港" &&
              name !== "海南诸岛" &&
              name !== "澳门"
            ) {
              _this.chartData.forEach(region => {
                if (region.name === name) {
                  regionData.userCount = region.slides[0].userCount;
                  regionData.dealCount = region.slides[0].dealCount;
                  regionData.commissionSum = region.slides[0].commissionSum;
                }
              });
            } else {
              regionData.userCount = "暂未提供服务";
              regionData.dealCount = "暂未提供服务";
              regionData.commissionSum = "暂未提供服务";
            }

            return `${name}<br/>平台用户: ${regionData.userCount}<br/>成交数: ${regionData.dealCount}<br/>收益: ${regionData.commissionSum}`;
          }
        },
        toolbox: {
          show: true,
          feature: {
            dataView: {
              show: true
            }
          }
        },
        geo: {
          // 这个是重点配置区
          map: "china", // 表示中国地图
          roam: true,
          label: {
            normal: {
              show: true, // 是否显示对应地名
              textStyle: {
                color: "rgba(0,0,0,1)"
              },
              formatter: param => {
                return param.name;
              }
            }
          },
          itemStyle: {
            normal: {
              borderColor: "rgba(0, 0, 0, 0.2)"
            },
            emphasis: {
              areaColor: null,
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              shadowBlur: 20,
              borderWidth: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)"
            }
          }
        },
        series: [
          {
            type: "scatter",
            coordinateSystem: "geo" // 对应上方配置
          },
          {
            name: "统计", // 浮动框的标题
            type: "map",
            geoIndex: 0,
            data: this.data
          }
        ]
      });

      myChart.on("click", function(params) {
        _this.$emit("detail", params.name);
      });
    }
  }
};
</script>

<style scoped>
.map {
  width: 100%;
  height: 100%;
}
</style>
