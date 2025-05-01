<template>
  <div>
    <a-table
      :custom-row="customRow"
      :columns="columns"
      :data-source="dataSource"
      bordered
      size="middle"
      :scroll="{ x: 'max-content' }"
    >
      <template slot="operation" slot-scope="text, record, index">
        <div class="editable-row-operations">
          <span>
            <a @click="() => show(record, index)">查看</a>
            <a @click="() => add(record, index)">新增</a>
            <a @click="() => handleDelete(record, index)">删除</a>
            <a @click="() => edit(record, index)">修改</a>
          </span>
        </div>
      </template>
    </a-table>
    <a-dropdown v-if="contextMenuVisible" :visible="true">
      <div
        :style="{ position: 'absolute', left: menuX + 'px', top: menuY + 'px' }"
      />
      <template slot="overlay">
        <a-menu>
          <a-menu-item @click="handleDelete(currentRecord, currentRecordIndex)"
            >删除</a-menu-item
          >
        </a-menu>
      </template>
    </a-dropdown>
    <a-modal
      title="新增/修改机构"
      :visible="modalVisible"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form :form="form" :model="formData">
        <a-form-item label="机构名称">
          <a-input
            v-decorator="[
              'orgName',
              {
                rules: [
                  { required: true, message: '请输入机构名称' },
                  { validator: validateName }
                ]
              }
            ]"
            v-model="formData.name"
            placeholder="请输入机构名称"
          />
        </a-form-item>
        <a-form-item label="描述">
          <a-input v-model="formData.description" placeholder="请输入描述" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
const dataSource = []
for (let i = 0; i < 100; i++) {
  dataSource.push({
    key: i,
    name: 'John Brown',
    age: i + 1,
    street: 'Lake Park',
    building: 'C',
    number: 2035,
    companyAddress: 'Lake Street 42',
    companyName: 'SoftLake Co',
    gender: 'M',
    desc: '气冲牛斗',
    currentRecord: null,
    currentRecordIndex: 0
  })
}
export default {
  data() {
    return {
      dataSource: dataSource,
      modalVisible: false,
      contextMenuVisible: false,
      menuX: 0,
      menuY: 0,
      formData: { name: '', description: '' },
      form: this.$form.createForm(this),
      columns: [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          width: 100,
          fixed: 'left'
        },
        {
          title: 'Other',
          children: [
            {
              title: 'Age',
              dataIndex: 'age',
              key: 'age',
              width: 200
            },
            {
              title: 'Address',
              children: [
                {
                  title: 'Street',
                  dataIndex: 'street',
                  key: 'street',
                  width: 200
                },
                {
                  title: 'Block',
                  children: [
                    {
                      title: 'Building',
                      dataIndex: 'building',
                      key: 'building',
                      width: 100
                    },
                    {
                      title: 'Door No.',
                      dataIndex: 'number',
                      key: 'number',
                      width: 100
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Company',
          children: [
            {
              title: 'Company Address',
              dataIndex: 'companyAddress',
              key: 'companyAddress',
              width: 200
            },
            {
              title: 'Company Name',
              dataIndex: 'companyName',
              key: 'companyName'
            }
          ]
        },
        {
          title: '描述',
          dataIndex: 'desc',
          key: 'desc',
          width: 300
        },
        {
          title: 'Gender',
          dataIndex: 'gender',
          key: 'gender',
          width: 80,
          fixed: 'right'
        },
        {
          title: '工具栏',
          dataIndex: 'operation',
          width: 160,
          fixed: 'right',
          scopedSlots: { customRender: 'operation' }
        }
      ]
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
    customRow(record, index) {
      return {
        on: {
          contextmenu: e => {
            e.preventDefault()
            this.menuX = e.clientX
            this.menuY = e.clientY
            this.contextMenuVisible = true
            this.currentRecord = record
            this.currentRecordIndex = index
            document.body.addEventListener('click', this.cancelClick)
          }
        }
      }
    },
    cancelClick() {
      this.contextMenuVisible = false
      document.body.removeEventListener('click', this.cancelClick)
    },

    show(record, index) {
      this.modalType = 'show'
      this.modalVisible = true
    },
    add(record, index) {
      this.modalType = 'edit'
      this.modalVisible = true
    },
    edit(record, index) {
      this.modalType = 'edit'
      this.modalVisible = true
    },
    handleDelete(record, index) {
      this.modalType = 'delete'
    },

    handleOk() {
      // 表单验证
      this.form.validateFields((err, values) => {
        console.log('---err,', err)

        if (!err) {
          // if (this.editMode) {
          //   // 修改操作
          //   this.currentNode.title = this.formData.name
          // } else {
          //   // 新增操作
          //   const newNode = {
          //     title: this.formData.name,
          //     key: Date.now().toString(),
          //     children: []
          //   }
          //   const parentNode = this.findNode(this.treeData, this.selectedKeys[0])
          //   parentNode.children.push(newNode)
          // }
          this.modalVisible = false
        }
      })
    },
    handleCancel() {
      this.modalVisible = false
    },

    validateName(rule, value) {
      if (!value) return Promise.reject('名称为必填项！')
      if (/[$;%*!~&\/]/.test(value))
        return Promise.reject('名称不能包含特殊字符！')
      return Promise.resolve()
    }
  }
}
</script>

<style scoped>
.editable-row-operations a {
  margin-right: 4px;
}
</style>
