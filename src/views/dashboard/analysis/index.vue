<template>
  <div class="analysis-container">
    <div class="grid-layout">
      <NotamTrends class="grid-item" />
      <NotamDistribution class="grid-item" />
      <NotamTypeAnalysis class="grid-item" />
      <ProcessingEfficiency class="grid-item" />
      <ValidityPeriod class="grid-item" />
      <AirportNotamStats class="grid-item" />
      <RegionalDistribution class="grid-item span-2" />
      <SystemPerformance class="grid-item span-2" />
    </div>
  </div>
</template>

<script setup lang="ts">
import NotamTrends from './widget/NotamTrends.vue'
import NotamDistribution from './widget/NotamDistribution.vue'
import NotamTypeAnalysis from './widget/NotamTypeAnalysis.vue'
import ProcessingEfficiency from './widget/ProcessingEfficiency.vue'
import ValidityPeriod from './widget/ValidityPeriod.vue'
import AirportNotamStats from './widget/AirportNotamStats.vue'
import RegionalDistribution from './widget/RegionalDistribution.vue'
import SystemPerformance from './widget/SystemPerformance.vue'
</script>

<style lang="scss">
@import './widget/styles/card.scss';

.analysis-container {
  height: 100%;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  overflow-x: hidden;
  
  .grid-layout {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;
    width: 100%;
    max-width: 100%;
    
    .grid-item {
      width: 100%;
      min-height: 400px;
      max-width: 100%;
      
      &.span-2 {
        grid-column: span 2;
      }
    }
  }
}

@media screen and (max-width: 1200px) {
  .analysis-container .grid-layout {
    grid-template-columns: 1fr;
    
    .grid-item.span-2 {
      grid-column: auto;
    }
  }
}
</style>
