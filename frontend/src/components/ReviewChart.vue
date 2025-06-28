<template>
  <div>
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps({
  ratings: {
    type: Object,
    required: true
  }
})

const chartData = {
  labels: Object.keys(props.ratings),
  datasets: [
    {
      label: 'Hizmet Puanı',
      data: Object.values(props.ratings),
      backgroundColor: '#3b82f6'
    }
  ]
}

const chartOptions = {
  responsive: true,
  scales: {
    y: {
      beginAtZero: true,
      max: 10
    }
  }
}
</script>
