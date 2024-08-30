<template>
  <div>
    <a-tree
      :treeData="treeData"
      :selectedKeys="selectedKeys"
      @select="onSelect"
      @contextmenu="onContextMenu"
      @expand="onExpand"
      style="width: 300px"
      :expandedKeys="expandedKeys"
    />
    <a-modal
      title="新增/修改机构"
      :visible="modalVisible"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form :form="form" :model="formData" ref="formRef">
        <a-form-item
          label="机构名称"
          :rules="[
            { required: true, message: '请输入机构名称!' },
            { validator: validateName }
          ]"
        >
          <a-input v-model="formData.name" placeholder="请输入机构名称" />
        </a-form-item>
        <a-form-item label="描述">
          <a-input v-model="formData.description" placeholder="请输入描述" />
        </a-form-item>
      </a-form>
    </a-modal>

    <a-menu
      v-if="contextMenuVisible"
      :style="{
        position: 'absolute',
        left: `${contextMenuPosition.x}px`,
        top: `${contextMenuPosition.y}px`
      }"
    >
      <a-menu-item @click="showModal('add')">新增</a-menu-item>
      <a-menu-item @click="showModal('edit')">修改</a-menu-item>
      <a-menu-item @click="handleDelete">删除</a-menu-item>
    </a-menu>
  </div>
</template>

<script>
import { Tree, Modal, Form, Input, Menu } from 'ant-design-vue'

export default {
  data() {
    return {
      treeData: [],
      selectedKeys: [],
      expandedKeys: [],
      modalVisible: false,
      formData: { name: '', description: '' },
      contextMenuVisible: false,
      contextMenuPosition: { x: 0, y: 0 },
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
          console.log('---res,', res)
          this.treeData = this.formatTreeData(res)
          this.selectedKeys = [this.treeData[0].key] // 默认南瑞集团为第一个节点
        })
      // this.treeData = this.formatTreeData(response.data)
      // 默认选中南瑞集团
      // this.selectedKeys = [this.treeData[0].key] // 假设南瑞集团为第一个节点
    },
    formatTreeData(data) {
      const formatData = data => ({
        title: data.name,
        key: data.name,
        children: data.children.map(formatData)
      })

      return [formatData(data)]
    },
    onSelect(selectedKeys) {
      this.selectedKeys = selectedKeys
    },
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys
    },
    onContextMenu(event) {
      event.preventDefault()
      this.contextMenuVisible = true
      this.contextMenuPosition = { x: event.clientX, y: event.clientY }
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
      this.$refs.form.validate().then(() => {
        if (this.editMode) {
          // 修改操作
          this.currentNode.title = this.formData.name
          // 这里可以添加其他数据处理逻辑，例如请求后端更新
        } else {
          // 新增操作
          const newNode = {
            title: this.formData.name,
            key: this.formData.name,
            children: []
          }
          const parentNode = this.findNode(this.treeData, this.selectedKeys[0])
          parentNode.children.push(newNode)
        }
        this.modalVisible = false
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
    },
    validateName(rule, value) {
      if (!value) return Promise.reject('名称为必填项！')
      if (/[^\w\s]/.test(value)) return Promise.reject('名称不能包含特殊字符！')
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
