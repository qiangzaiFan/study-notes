<template>
  <div>
    <a-tree
      :expandedKeys.sync="expandedKeys"
      :treeData="treeData"
      :selectedKeys="selectedKeys"
      @select="onSelect"
      @rightClick="onRightClick"
      style="width: 300px"
    />
    <a-dropdown
      v-if="contextMenuVisible"
      :trigger="['contextmenu']"
      :visible="true"
    >
      <div
        :style="{ position: 'absolute', left: menuX + 'px', top: menuY + 'px' }"
      />
      <template slot="overlay">
        <a-menu>
          <a-menu-item @click="showModal('add')">新增</a-menu-item>
          <a-menu-item @click="showModal('edit')">修改</a-menu-item>
          <a-menu-item @click="handleDelete">删除</a-menu-item>
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
export default {
  data() {
    return {
      treeData: [],
      selectedKeys: [],
      expandedKeys: [],
      modalVisible: false,
      formData: { name: '', description: '' },
      contextMenuVisible: false,
      menuX: 0,
      menuY: 0,
      editMode: false,
      currentNode: null,
      form: this.$form.createForm(this)
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    async loadData() {
      await fetch('http://localhost:3000/data')
        .then(res => {
          return res.json()
        })
        .then(res => {
          // console.log('---res,', res)
          this.treeData = [res]
          this.selectedKeys = ['1-0'] // 默认南瑞集团为第一个节点
          this.expandedKeys = ['1']
        })
    },

    onRightClick({ event, node }) {
      console.log('---event,node,', event, node)

      this.menuX = event.clientX
      this.menuY = event.clientY
      this.contextMenuVisible = true
      this.currentNode = node
    },
    onSelect(selectedKeys) {
      this.selectedKeys = selectedKeys
    },

    showModal(mode) {
      this.modalVisible = true
      this.editMode = mode === 'edit'
      if (this.editMode) {
        const selectedNode = this.findNode(this.treeData, this.selectedKeys[0])
        this.formData = {
          name: selectedNode.title,
          description: selectedNode.description || ''
        }
        this.currentNode = selectedNode
      } else {
        this.formData = { name: '', description: '' }
        this.currentNode = null
      }
      this.contextMenuVisible = false // 关闭右键菜单
    },
    handleOk() {
      // 表单验证
      this.form.validateFields((err, values) => {
        console.log('---err,', err)

        if (!err) {
          if (this.editMode) {
            // 修改操作
            this.currentNode.title = this.formData.name
          } else {
            // 新增操作
            const newNode = {
              title: this.formData.name,
              key: Date.now().toString(),
              children: []
            }
            const parentNode = this.findNode(
              this.treeData,
              this.selectedKeys[0]
            )
            parentNode.children.push(newNode)
          }
          this.modalVisible = false
        }
      })
    },
    handleCancel() {
      this.modalVisible = false
    },
    handleDelete() {
      const parentNode = this.findParentNode(
        this.treeData,
        this.selectedKeys[0]
      )
      if (parentNode) {
        parentNode.children = parentNode.children.filter(
          node => node.key !== this.selectedKeys[0]
        )
        this.selectedKeys = []
      }
      this.contextMenuVisible = false
    },
    validateName(rule, value) {
      if (!value) return Promise.reject('名称为必填项！')
      if (/[$;%*!~&\/]/.test(value))
        return Promise.reject('名称不能包含特殊字符！')
      return Promise.resolve()
    },
    findNode(nodes, key) {
      for (const node of nodes) {
        if (node.key === key) return node
        const found = this.findNode(node.children, key)
        if (found) return found
      }
      return null
    },
    findParentNode(nodes, key) {
      for (const node of nodes) {
        for (const child of node.children) {
          if (child.key === key) return node
        }
        const found = this.findParentNode(node.children, key)
        if (found) return found
      }
      return null
    }
  }
}
</script>

<style scoped>
/* 你可以在这里添加样式 */
</style>
