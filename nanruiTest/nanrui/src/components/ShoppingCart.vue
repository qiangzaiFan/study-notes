<template>
  <div>
    <a-button type="primary" @click="showAddProductModal">添加商品</a-button>
    <a-modal
      title="添加商品"
      v-model="isAddProductModalVisible"
      @ok="addProduct"
      @cancel="handleCancel"
    >
      <a-form :form="form">
        <a-form-item label="商品名称">
          <a-input v-model="newProduct.name" />
        </a-form-item>
        <a-form-item label="价格">
          <a-input-number v-model="newProduct.price" :min="0" />
        </a-form-item>
        <a-form-item label="图片URL">
          <a-input v-model="newProduct.image" />
        </a-form-item>
      </a-form>
    </a-modal>
    <div v-if="cart.length > 0">
      <div class="cart-item" v-for="(item, index) in cart" :key="item.id">
        <a-checkbox
          v-modal:checked="item.selected"
          :disabled="item.invalid"
          @change="updateTotalPrice"
        />
        <img :src="item.image" alt="商品图片" class="item-image" />
        <div class="item-details">
          <p>{{ item.name }}</p>
          <p>价格: ¥{{ item.price }}</p>
          <a-input-number
            v-if="!item.invalid"
            v-model="item.quantity"
            :min="1"
            @change="updateTotalPrice"
          />
          <span v-else>失效商品</span>

          <a-button type="danger" @click="removeItem(index)">删除</a-button>
        </div>
      </div>
      <div class="cart-footer">
        <a-checkbox v-modal:checked="allSelected" @change="selectAll"
          >全选</a-checkbox
        >
        <p>总价: ¥{{ totalPrice }}</p>
        <a-button
          type="primary"
          @click="checkout"
          :disabled="!selectedItems.length"
          >结算</a-button
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cart: [],
      allSelected: false,
      totalPrice: 0,
      isAddProductModalVisible: false,
      newProduct: {
        name: '',
        price: 0,
        image: ''
      }
    }
  },
  created() {
    this.loadData()
  },
  computed: {
    selectedItems() {
      return this.cart.filter(item => item.selected && !item.invalid)
    }
  },
  methods: {
    async loadData() {
      await fetch('http://localhost:3000/data')
        .then(res => {
          return res.json()
        })
        .then(res => {
          this.cart = res.map(item => ({
            ...item,
            quantity: 1,
            selected: false,
            invalid: item.invalid || false
          }))
        })
    },
    // fetchProducts() {
    //   fetch('http://localhost:3000/data').then(response => {
    //     this.cart = response.data.map(item => ({
    //       ...item,
    //       quantity: 1,
    //       selected: false,
    //       invalid: item.invalid || false
    //     }))
    //   })
    // },
    showAddProductModal() {
      this.isAddProductModalVisible = true
    },
    handleCancel() {
      this.isAddProductModalVisible = false
    },
    addProduct() {
      const newProduct = {
        ...this.newProduct,
        id: this.cart.length + 1, // 简单生成一个唯一id，可以改进为更复杂的id生成方法
        quantity: 1,
        selected: false,
        invalid: false
      }
      this.cart.push(newProduct)
      this.isAddProductModalVisible = false
      this.updateTotalPrice()
    },
    removeItem(index) {
      this.cart.splice(index, 1)
      this.updateTotalPrice()
    },
    selectAll() {
      this.cart.forEach(item => {
        if (!item.invalid) {
          item.selected = this.allSelected
        }
      })
      this.updateTotalPrice()
    },
    updateTotalPrice() {
      this.totalPrice = this.cart.reduce((total, item) => {
        if (item.selected && !item.invalid) {
          return total + item.price * item.quantity
        }
        return total
      }, 0)
    },
    checkout() {
      alert('结算成功')
      // 这里可以添加模拟提交处理逻辑
    }
  }
}
</script>

<style scoped>
.cart-item {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e8e8e8;
  padding: 10px 10px;
}

.item-image {
  width: 80px;
  height: 80px;
  margin-right: 20px;
}

.item-details {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cart-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 10px;
}
/deep/ .ant-checkbox {
  margin-right: 20px;
}
</style>
