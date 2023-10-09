<template>
  <div
    class="canvas-container"
    :style="{ height: chartHeight, width: chartWidth }"
  >
    <canvas :id="chartId"></canvas>
  </div>
</template>

<script>
import { Chart } from "chart.js";
import { defineComponent, onMounted } from "vue";

export default defineComponent({
  props: {
    chartId: {
      type: String,
      required: true,
      default: "my-chart",
    },
    chartData: {
      type: Object,
      required: true,
    },
    chartHeight: {
      type: String,
      default: "300px",
    },
    chartWidth: {
      type: String,
      default: "100%",
    },
  },
  setup(props) {
    function createChart() {
      const chartEl = document.getElementById(props.chartId);
      new Chart(chartEl, props.chartData);
    }

    onMounted(() => {
      createChart();
    });
  },
});
</script>

<style scoped></style>
