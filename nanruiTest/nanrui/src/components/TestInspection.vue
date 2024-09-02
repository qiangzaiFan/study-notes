<template>
  <div>
    <a-button @click="handleAdd">新建</a-button>
    <a-modal
      :modal="showModalVisible"
      title="检修单"
      @onOK="handleOk"
      @onCancel="handleCancel"
    >
      <a-form :form="form" :modal="modalData">
        <a-form-item label="检修单名称"> </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
