<template>
  <div>
    <a-cascader
      :options="options"
      v-model="selectedValue"
      @change="onChange"
      placeholder="请选择省/市/区"
    />
    <a-button @click="toggleModal" style="margin-top: 16px"
      >新增/修改数据</a-button
    >

    <a-modal
      v-model="isModalVisible"
      title="新增数据"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <div>
        <h4>省</h4>
        <a-input v-model="newProvince" placeholder="输入省名" />
        <h4>市</h4>
        <a-input v-model="newCity" placeholder="输入市名" />
        <h4>区</h4>
        <a-input v-model="newDistrict" placeholder="输入区名" />
      </div>
    </a-modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      options: [],
      selectedValue: [],
      isModalVisible: false,
      newProvince: '',
      newCity: '',
      newDistrict: '',
      selectedProvince: null,
      selectedCity: null,
      selectedDistrict: null
    }
  },
  created() {
    fetch('http://localhost:3000/data')
      .then(response => {
        return response.json()
      })
      .then(res => {
        this.options = res
      })
  },
  methods: {
    //province  city  district

    onChange(value) {
      this.selectedValue = value
      this.getSelectedData(value)
    },
    getSelectedData(value) {
      this.selectedProvince = this.options.find(p => p.value === value[0])
      this.selectedCity = this.selectedProvince.children.find(
        c => c.value === value[1]
      )
      this.selectedDistrict = this.selectedCity.children.find(
        c => c.value === value[2]
      )
    },
    toggleModal() {
      this.resetInputs()
      if (this.selectedValue.length === 0) {
        this.$message.info('请选择省市区级联选择器！')
        return
      }
      this.newProvince = this.selectedProvince.label
      this.newCity = this.selectedCity.label
      this.newDistrict = this.selectedDistrict.label

      this.isModalVisible = true
    },
    handleOk() {
      if (!this.newProvince || !this.newCity || !this.newDistrict) {
        this.$message.info = '省市区不能为空！'
        return
      }

      const provinceIndex = this.options.findIndex(
        p => p.label === this.newProvince
      )
      if (provinceIndex === -1) {
        // 添加新省
        let newProvinceData = {
          value: `00${this.options.length + 1}`,
          label: this.newProvince,
          children: []
        }
        this.options.push(newProvinceData)
        this.selectedProvince = newProvinceData
      } else {
        // 修改省
        this.selectedProvince = this.options[provinceIndex]
      }

      const cityIndex = this.selectedProvince.children.findIndex(
        p => p.label === this.newCity
      )

      if (cityIndex === -1) {
        // 添加新市
        let newCityData = {
          value: `00${this.selectedProvince.children.length + 1}`,
          label: this.newCity,
          children: []
        }

        this.selectedProvince.children.push(newCityData)
        this.selectedCity = newCityData
      } else {
        // 修改市
        this.selectedCity = this.selectedProvince[cityIndex]
      }
      const districtIndex = this.selectedCity.children.findIndex(
        p => p.label === this.newDistrict
      )
      if (districtIndex === -1) {
        //添加区
        let newDistrictData = {
          value: `00${this.selectedCity.children.length + 1}`,
          label: this.newDistrict,
          children: null
        }
        this.selectedCity.children.push(newDistrictData)
      } else {
        //修改区
        this.selectedDistrict = this.selectedCity.children[districtIndex]
      }

      this.handleCancel()
    },
    handleCancel() {
      this.resetInputs()
      this.isModalVisible = false
    },
    resetInputs() {
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
