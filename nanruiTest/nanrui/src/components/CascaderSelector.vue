<template>
  <div>
    <a-cascader :options="options" v-model="selectedValue" @change="onChange" placeholder="请选择省/市/区" />
    <a-button @click="toggleModal('add')" style="margin-top: 16px">新增数据</a-button>
    <a-button @click="toggleModal('edit')" style="margin-top: 16px">修改数据</a-button>
    <a-modal v-model="isModalVisible" :title="modalTitle" @ok="handleOk" @cancel="handleCancel">
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
      selectedDistrict: null,
      modalType: 'add',
      modalTitle: '新增数据'
    }
  },
  created() {
    fetch('http://localhost:3000/data')
      .then(response => {
        return response.json()
      })
      .then(res => {
        console.log('---res,', res)
        this.options = res
      })

    // this.initializeOptions()
  },
  methods: {
    //province  city  district
    // initializeOptions() {
    //   this.options = citiesData.map(province => ({
    //     value: province.value,
    //     label: province.label,
    //     children: province.children.map(city => ({
    //       value: city.value,
    //       label: city.label,
    //       children: city.districts.map(district => ({
    //         value: district.value,
    //         label: district.label
    //       }))
    //     }))
    //   }))
    // },
    onChange(value) {
      console.log('---onChange---value,', value)

      this.selectedValue = value
      this.getSelectedData(value)
    },
    getSelectedData(value) {
      this.selectedProvince = this.options.find(p => p.value === value[0])
      if (this.selectedProvince) {
        this.selectedCity = this.selectedProvince.children.find(c => c.value === value[1])
      }
    },
    toggleModal(type) {
      this.resetInputs()
      debugger
      if (type === 'edit' && this.selectedValue.length === 0) {
        this.$message.info('请选择省市区级联选择器！')
        return
      }
      // 如果已选择省市区，则填充输入框
      this.modalType = type
      this.modalTitle = type === 'add' ? '新增数据' : '修改数据'
      if (type === 'edit') {
        this.newProvince = this.selectedValue[0]
        this.newCity = this.selectedValue[1]
        this.newDistrict = this.selectedValue[2]
      }
      this.isModalVisible = true
    },
    handleOk() {
      if (this.newProvince) {
        const provinceIndex = this.options.findIndex(p => p.label === this.newProvince)
        if (provinceIndex === -1) {
          // 添加新省
          const newProvinceData = {
            label: this.newProvince,
            value: `00${this.options.length + 1}`,
            children: []
          }
          this.options.push(newProvinceData)
          this.selectedProvince = newProvinceData
        } else {
          // 修改省
          this.selectedProvince = this.options[provinceIndex]
        }
        if (this.newCity) {
          const cityIndex = this.selectedProvince.children.findIndex(c => c.label === this.newCity)
          if (cityIndex === -1) {
            // 添加新市
            const newCityData = {
              label: this.newCity,
              value: `00${this.selectedProvince.children.length + 1}`,
              districts: []
            }
            this.selectedProvince.children.push(newCityData)
            this.selectedCity = newCityData
          } else {
            // 修改市
            this.selectedCity = this.selectedProvince.children[cityIndex]
          }

          if (this.newDistrict) {
            const districtIndex = this.selectedCity.districts.findIndex(d => d.label === this.newDistrict)
            if (districtIndex === -1) {
              // 添加新区
              const newDistrictData = {
                label: this.newDistrict,
                value: `00${this.selectedCity.districts.length + 1}`
              }
              this.selectedCity.districts.push(newDistrictData)
            } else {
              // 修改区名
              this.selectedCity.districts[districtIndex].label = this.newDistrict
            }
          }
        }

        // this.initializeOptions()
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
      this.selectedProvince = null
      this.selectedCity = null
    }
  }
}
</script>

<style scoped>
h4 {
  margin-top: 16px;
}
</style>
