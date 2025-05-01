<template>
  <div>
    <a-button type="primary" @click="addProduct">添加商品</a-button>
    <div class="productList">
      <div
        class="cardItem"
        v-for="(cardItem, cardIndex) in cartList"
        :key="cardItem.id"
      >
        <a-checkbox
          v-modal:checked="cardItem.checked"
          :disabled="!cardItem.valid"
          @onChange="updataTotalPrice"
        />
        <img :src="cardItem.imgUrl" alt="商品图片" />
        <span>{{ cardItem.name }}</span>
        <span>{{ '￥' + cardItem.price }}</span>
        <a-input-number
          :disabled="!cardItem.valid"
          v-modal="cardItem.amount"
          @change="updataTotalPrice"
          :min="1"
        />
        <a-button type="danger" @click="deleteProduct(cardItem, cardIndex)"
          >删除</a-button
        >
        <span class="validTip">失效商品</span>
      </div>
    </div>
    <div class="footer" v-show="selectedList.length > 0">
      <a-checkbox v-modal:checked="checkedAll" @onChange="selectAll"
        >全选</a-checkbox
      >
      <span>{{ totalPrice }}</span>
      <a-button type="primary" @click="checkout">结算</a-button>
    </div>
    <a-modal
      title="新增商品"
      v-modal="showModalVisible"
      @onOk="handleOk"
      @onCancel="handleCancel"
    >
      <a-form :form="form" :modal="formData">
        <a-form-item label="商品名字">
          <a-input
            v-decorator="[
              'product',
              {
                rules: [
                  {
                    required: true,
                    message: '请填写商品名字'
                  }
                ]
              }
            ]"
            v-modal="formData.product"
          />
          <a-form-item label="价格">
            <a-input
              v-decorator="[
                'price',
                {
                  rules: [{ required: true, message: '请填写价格' }]
                }
              ]"
              v-modal="formData.price"
            />
          </a-form-item>
          <a-form-item label="图片">
            <a-input
              v-decorator="[
                'imgUrl',
                {
                  rules: [{ required: true, message: '请填写图片地址' }]
                }
              ]"
              v-modal="formData.imgUrl"
            />
          </a-form-item>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      cartList: [],
      totalPrice: 0,
      checkedAll: false,
      showModalVisible: false,
      formData: {
        product: '',
        price: '',
        imgUrl: ''
      }
    }
  },
  created() {
    fetch('xx.json')
      .then(res => {
        return res.json()
      })
      .then(res => {
        this.cartList = res
      })
  },
  computed: {
    selectedList() {
      return this.cardList.filter(item => item.valid && item.checked)
    }
  },
  methods: {
    addProduct() {
      this.showModalVisible = true
    },
    updataTotalPrice() {
      this.totalPrice = this.cardList.reduce((sum, item) => {
        if (item.valid && item.checked) {
          sum = sum + item.price
        }
        return sum
      }, 0)
    },
    deleteProduct(item, index) {
      this.cardList.splice(index, 1)
      this.updateTotalPrice()
    },
    selectAll() {
      this.checkedAll = !this.checkedAll
      this.cardList.forEach(item => {
        item.checked = this.checkedAll
      })
      this.updataTotalPrice()
    },
    checkout() {
      alert('结算成功')
    },
    handleOk() {
      this.cardList.push({
        id: this.cardList.length + 1,
        product: this.formData.product,
        price: this.formData.price,
        imgUrl: this.formData.imgUrl
      })
      this.showModalVisible = false
    },
    handleCancel() {
      this.formData = {
        product: '',
        price: '',
        imgUrl: ''
      }
      this.showModalVisible = false
    }
  }
}
</script>
<style scoped>
.cardItem {
  position: relative;
}
</style>
