<template>
  <div>
    <a-button type="primary" @click="openForm">新建检修单</a-button>
    <a-button type="danger" @click="deleteSelected">删除选中</a-button>
    <a-table
      :row-selection="rowSelection"
      :custom-row="customRow"
      :columns="columns"
      :data-source="dataSource"
      bordered
      size="middle"
      :scroll="{ x: 'max-content'}"
    >
      <template slot="attachments" slot-scope="text, record, index">
        <div class="editable-row-operations">
          <div :v-for="imgItem in record.attachments">
            <img :src="imgItem" alt />
          </div>
        </div>
      </template>
    </a-table>

    <a-modal title="新增检修单" :visible="modalVisible" @ok="handleOk" @cancel="handleCancel">
      <a-form :form="form" :model="formData" :rules="rules">
        <a-form-item label="检修单名称">
          <a-input
            v-decorator="[
              'name',
              { rules: [{ required: true, message: '检修单名称' }] },
            ]"
            v-model="formData.name"
          />
        </a-form-item>
        <a-form-item label="提单人姓名" prop="reporter">
          <a-input
            v-decorator="[
              'reporter',
              {rules:[{
                required:true,message:'提单人姓名'
              }]}
            ]"
            v-model="formData.reporter"
          />
        </a-form-item>
        <a-form-item label="部门">
          <a-input
            v-decorator="[
            'department',
            {rules:[{required:true,message:'部门'}]}
            ]"
            v-model="formData.department"
          />
        </a-form-item>
        <a-form-item label="手机号码">
          <a-input
            v-decorator="[
              'mobile',
              {rules:[{
                required:true,message:'手机号码'
              }]}
            ]"
            v-model="formData.mobile"
          />
        </a-form-item>
        <a-form-item label="检修日期">
          <a-date-picker
            v-decorator="[
              'date',
              {rules:[{
                required:true,message:'检修日期'
              }]}
            ]"
            v-model="formData.date"
          />
        </a-form-item>
        <a-form-item label="检修内容">
          <a-textarea
            v-decorator="[
              'content',
              {rules:[{
                required:true,message:'检修内容'
              }]}
            ]"
            v-model="formData.content"
          />
        </a-form-item>
        <a-form-item label="检修附件">
          <a-upload
            name="file"
            :fileList="formData.attachments"
            :multiple="true"
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            @change="handleUploadChange"
            @remove="removeFile"
            @preview="handlePreview"
            v-decorator="[
              'attachments',
              {rules:[{
                required:true,message:'检修附件'
              }]}
            ]"
          >
            <a-button>
              <a-icon type="upload" />点击上传
            </a-button>
          </a-upload>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleImgCancel">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>

<script>
const dataSource = []
for (let i = 0; i < 100; i++) {
  dataSource.push({
    id: i,
    name: `检修单${i + 1}`,
    reporter: `王${i + 1}`,
    department: '研发部',
    mobile: '13800138000',
    date: '2024-08-01',
    content: '检修内容1',
    attachments: ['image1.jpg', 'image2.jpg']
  })
}

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

export default {
  data() {
    return {
      dataSource: dataSource,
      modalVisible: false,
      selectedRowKeys: [],
      formData: { name: '', reporter: '', department: '', mobile: '', date: null, content: '', attachments: [] },
      form: this.$form.createForm(this),
      columns: [
        {
          title: '检修单名称',
          dataIndex: 'name',
          width: 100,
          fixed: 'left'
        },

        {
          title: '提单人姓名',
          dataIndex: 'desc',
          width: 100
        },
        {
          title: '部门',
          dataIndex: 'department',
          width: 100
        },
        {
          title: '手机号码',
          dataIndex: 'mobile',
          width: 100
        },
        {
          title: '检修日期',
          dataIndex: 'date',
          width: 100
        },
        {
          title: '检修内容',
          dataIndex: 'content',
          width: 100
        },

        {
          title: '检修附件',
          dataIndex: 'attachments',
          width: 160,
          scopedSlots: { customRender: 'attachments' }
        }
      ],
      previewVisible: false,
      previewImage: ''
    }
  },
  created() {
    this.loadData()
  },
  computed: {
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
        }
      }
    }
  },
  methods: {
    async loadData() {
      await fetch('http://localhost:3000/data')
        .then(res => {
          return res.json()
        })
        .then(res => {})
    },
    handleImgCancel() {
      this.previewVisible = false
    },

    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    openForm() {
      this.modalVisible = true
    },
    deleteSelected() {
      this.dataSource = this.dataSource.filter(item => !this.selectedRowKeys.includes(item.id))
      this.selectedRowKeys = []
    },
    handleUploadChange(info) {
      this.formData.attachments = info.fileList
    },
    removeFile(file) {
      this.formData.attachments = this.formData.attachments.filter(item => item.uid !== file.uid)
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
      if (/[$;%*!~&\/]/.test(value)) return Promise.reject('名称不能包含特殊字符！')
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
