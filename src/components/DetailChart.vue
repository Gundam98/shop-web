<template>
  <div class="detail" ref="detailChart"></div>
</template>
<script>
import echarts from "echarts";
import formatTime from "@/utils/formatTime";

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
      this.data = [];
      this.xAxisData = [];
      this.commissionSumData = [];
      this.dealCountData = [];
      this.userCountData = [];
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
        this.xAxisData.push(formatTime(data.endTime, "M-D"));
        this.commissionSumData.push(data.commissionSum);
        this.dealCountData.push(data.dealCount);
        this.userCountData.push(data.userCount);
      });
      this.xAxisData.reverse();
      this.commissionSumData.reverse();
      this.dealCountData.reverse();
      this.userCountData.reverse();
    },
    chinaConfigure: function() {
      let _this = this;
      let colors = ["#5793f3", "#d14a61", "#675bba"];
      let myChart = echarts.init(this.$refs.detailChart); //这里是为了获得容器所在位置
      window.onresize = myChart.resize;
      myChart.setOption({
        color: colors,
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
        grid: {
          right: "20%"
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ["line", "bar"] },
            restore: { show: true }
          }
        },
        legend: {
          data: ["成交量", "收益", "新增用户"]
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
            position: "right",
            axisLabel: {
              formatter: "{value}笔"
            },
            axisLine: {
              lineStyle: {
                color: colors[0]
              }
            }
          },
          {
            type: "value",
            name: "收益",
            min: 0,
            max: 2000,
            interval: 250,
            position: "right",
            offset: 50,
            axisLabel: {
              formatter: "{value}元"
            },
            axisLine: {
              lineStyle: {
                color: colors[1]
              }
            }
          },
          {
            type: "value",
            name: "新增用户",
            min: 0,
            max: 200,
            interval: 25,
            position: "left",
            axisLabel: {
              formatter: "{value}人"
            },
            axisLine: {
              lineStyle: {
                color: colors[2]
              }
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
