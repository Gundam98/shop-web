<template>
  <div class="detail" ref="detailChart"></div>
</template>
<script>
import echarts from "echarts";

export default {
  name: "detailChart",
  props: {
    chartData: Array,
    regionName: String
  },
  data() {
    return {
      chart: null,
      data: [],
      xAxisData: [],
      commissionSumData: [],
      dealCountData: [],
      userCountData: []
    };
  },
  mounted() {
    this.processData();
    this.chinaConfigure();
  },
  watch: {
    regionName: function() {
      console.log("changed");
      this.processData();
      this.chinaConfigure();
    }
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
      this.chartData.forEach(data => {
        this.commissionSumData.push(data.commissionSum);
        this.dealCountData.push(data.dealCount);
        this.userCountData.push(data.userCount);
      });
    },
    chinaConfigure: function() {
      let _this = this;
      let myChart = echarts.init(this.$refs.detailChart); //这里是为了获得容器所在位置
      window.onresize = myChart.resize;
      myChart.setOption({
        title: {
          text: _this.regionName
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999"
            }
          }
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ["line", "bar"] },
            restore: { show: true }
          }
        },
        legend: {
          data: ["蒸发量", "降水量", "平均温度"]
        },
        xAxis: [
          {
            type: "category",
            data: _this.xAxisData,
            axisPointer: {
              type: "shadow"
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "成交量",
            min: 0,
            max: 200,
            interval: 25,
            axisLabel: {
              formatter: "{value}笔"
            }
          },
          {
            type: "value",
            name: "收益",
            min: 0,
            max: 2000,
            interval: 250,
            axisLabel: {
              formatter: "{value}元"
            }
          }
        ],
        series: [
          {
            name: "成交量",
            type: "line",
            yAxisIndex: 0,
            data: _this.dealCountData
          },
          {
            name: "收益",
            type: "line",
            yAxisIndex: 1,
            data: _this.commissionSumData
          },
          {
            name: "新增用户",
            type: "bar",
            data: _this.userCountData
          }
        ]
      });
    }
  }
};
</script>

<style scoped>
.detail {
  width: 100%;
  height: 100%;
}
</style>
