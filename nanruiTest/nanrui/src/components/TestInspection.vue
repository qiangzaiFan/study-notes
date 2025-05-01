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
        <a-form-item label="检修单名称">
          <a-input
            v-modal="modalData.title"
            v-decorator="[
              'title',
              {
                rules: [{ required: true, message: '检修单名称' }]
              }
            ]"
          ></a-input>
        </a-form-item>
        <a-form-item label="姓名">
          <a-input
            v-modal="modalData.title"
            v-decorator="[
              'name',
              {
                rules: [{ required: true, message: '姓名' }]
              }
            ]"
          ></a-input>
        </a-form-item>
        <a-form-item label="手机号码">
          <a-input
            v-modal="modalData.title"
            v-decorator="[
              'name',
              {
                rules: [
                  { required: true, message: '手机号码' },
                  {
                    validate: /1[3456789]\d{9}/
                  }
                ]
              }
            ]"
          ></a-input>
        </a-form-item>
        <a-form-item label="检修附件">
          <a-upload
            :fileList="modalData.fileList"
            name="file"
            action="http://localhost:8080/upload"
            :multiple="true"
            @onChange="changeFile"
            @remove="removeFile"
            @preview="handlePreview"
            v-decorator="[
              'fileList',
              {
                rules: [
                  {
                    required: true,
                    message: '请上传附件'
                  }
                ]
              }
            ]"
          >
            <a-button>上传附件</a-button>
          </a-upload>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-table :data-source="dataSource" :columns="columns">
      <template slot="fileList" slot-scope="text, record, index">
        <span v-for="(imgItem, imgIndex) in record.fileList" :key="imgIndex">
          <img src="{{imgItem}}" alt="" />
        </span>
      </template>
    </a-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dataSource: [],
      columns: [
        {
          title: '附件',
          dataIndex: 'fileList',
          scopedSlot: { customRender: 'file' }
        }
      ]
    }
  }
}
</script>
