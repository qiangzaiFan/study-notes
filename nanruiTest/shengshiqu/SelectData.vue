<template>
  <div>
    <a-cascader :options="options" v-model="selectedValue" @change="onChange" placeholder="请选择省/市/区" />
    <a-button @click="toggleModal" style="margin-top: 16px">修改数据</a-button>
    <a-modal v-model="isModalVisible" title="修改数据" @ok="handleOk" @cancel="handleCancel">
      <div>
        <h4>新省</h4>
        <a-input v-model="newProvince" placeholder="输入省名" />
        <h4>新市</h4>
        <a-input v-model="newCity" placeholder="输入市名" />
        <h4>新区</h4>
        <a-input v-model="newDistrict" placeholder="输入区名" />
      </div>
    </a-modal>
  </div>
</template>

<script>
import { citiesData } from './data.js'

export default {
  data() {
    return {
      options: [],
      selectedValue: [],
      isModalVisible: false,
      newProvince: '',
      newCity: '',
      newDistrict: ''
    }
  },
  created() {
    this.initializeOptions()
  },
  methods: {
    initializeOptions() {
      this.options = citiesData.map(province => ({
        value: province.code,
        label: province.name,
        children: province.cities.map(city => ({
          value: city.code,
          label: city.name,
          children: city.districts.map(district => ({
            value: district.code,
            label: district.name
          }))
        }))
      }))
    },
    onChange(value) {
      console.log(value)
    },
    toggleModal() {
      this.isModalVisible = !this.isModalVisible
    },
    handleOk() {
      if (this.newProvince) {
        const province = citiesData.find(p => p.name === this.newProvince)
        if (!province) {
          // 如果省不存在，创建新的省
          const newProvinceData = {
            name: this.newProvince,
            code: `00${citiesData.length + 1}`,
            cities: []
          }
          citiesData.push(newProvinceData)
        }
        this.clearInputs()
        this.initializeOptions()
      }
      this.toggleModal()
    },
    handleCancel() {
      this.clearInputs()
      this.toggleModal()
    },
    clearInputs() {
      this.newProvince = ''
      this.newCity = ''
      this.newDistrict = ''
    }
  }
}
</script>

<style scoped>
h4 {
  margin-top: 16px;
}
</style>
