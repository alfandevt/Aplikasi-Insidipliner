<template>
  <table>
    <thead slot="fixed">
      <slot name="tHead"></slot>
    </thead>
    <tbody>
      <slot name="tBody"></slot>
    </tbody>
  </table>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  components: {},
  props: {},
  setup() {},
});
</script>

<style scoped>
/* 
	Generic Styling, for Desktops/Laptops 
	*/
table {
  width: 100%;
  border-collapse: collapse;
}
/* Zebra striping */
tr:nth-of-type(odd) {
  background: #eee;
}
th {
  background: var(--ion-color-primary, #333);
  color: var(--ion-color-primary-contrast, #ffffff);
  font-weight: bold;
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
}
td,
th {
  padding: 6px;
  border: 1px solid #ccc;
  text-align: left;
}

/*
	Max width before this PARTICULAR table gets nasty
	This query will take effect for any screen smaller than 760px
	and also iPads specifically.
	*/
@media only screen and (max-width: 760px),
  (min-device-width: 768px) and (max-device-width: 1024px) {
  /* Force table to not be like tables anymore */
  table,
  thead,
  tbody,
  th,
  td,
  tr {
    display: block;
  }

  /* Hide table headers (but not display: none;, for accessibility) */
  thead tr {
    position: absolute;
    top: -9999px;
    left: -9999px;
  }

  tr {
    border: 1px solid #ccc;
  }

  td {
    /* Behave  like a "row" */
    border: none;
    border-bottom: 1px solid #eee;
    position: relative;
    padding-left: 50%;
  }

  td:before {
    /* Now like a table header */
    position: relative;
    /* Top/left values mimic padding */
    top: 0px;
    left: 6px;
    width: 45%;
    padding-right: 10px;
    white-space: nowrap;
  }
}

/* Smartphones (portrait and landscape) ----------- */
@media only screen and (min-device-width: 320px) and (max-device-width: 480px) {
  body {
    padding: 0;
    margin: 0;
    width: 320px;
  }
}

/* iPads (portrait and landscape) ----------- */
@media only screen and (min-device-width: 768px) and (max-device-width: 1024px) {
  body {
    width: 495px;
  }
}
</style>
