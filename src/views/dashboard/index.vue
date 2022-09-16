<template>
  <div>
    <Top/>
    <CenterChart/>
    <FooterChart/>
  </div>
</template>

<script>
  import Top from './topFourCard'
  import CenterChart from './centerChart'
  import FooterChart from './footerChart'
  export default {
    name: 'Dashboard',
    components:{Top,CenterChart,FooterChart}
  }
</script>
