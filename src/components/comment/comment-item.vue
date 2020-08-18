<template>
  <div class="comment-wrapper">
    <div class="comment-content">
      <h2 class="comment-title l-tags">全部评论</h2>
    </div>
    <div class="comment-list">
      <ul class="reply-wrapper">
        <li class="comment-item" v-for="(item,index) in list" :key="item.commentId">
          <Avatar class="comment-member-ava" :src="item.commonAvatar" />
          <div>
            <div class="comment-user-info">
              <span class="comment-user__name">{{item.commonName}}</span>
              <span class="comment-user__time">{{item.createTime}}</span>
              <Button
                type="error"
                icon="md-trash"
                :disabled="!hasDeleteCommentOperation"
                class="delete-btn"
                @click="deleteCommentHandle(index,item.commentId)"
              >删除评论</Button>
            </div>
            <p class="comment-content__list" v-html="item.content"></p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<style lang="less" scoped>
.delete-btn{
  margin-left: 10px;
  padding: 0 5px;
}
li {
  list-style: none;
}
.comment-wrapper {
  margin-top: 15px;
  margin-left: 10px;
}

.reply-wrapper {
  max-height: 250px;
  overflow: auto;
}
.comment-list {
  margin-top: 10px;
}
.comment-title {
  font-size: 16px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  line-height: 22px;
  display: flex;
  align-items: center;
}
.comment-item {
  display: flex;
  margin-bottom: 30px;
  .comment-member-ava {
    align-self: flex-start;
    margin-right: 10px;
  }
  .comment-user__name {
    margin-right: 5px;
  }
  .comment-content__list {
    margin-top: 10px;
    font-size: 14px;
    color: #333333;
  }
}
</style>
<script>
import * as qAapi from '@/api/cms/qa.js';
export default {
  name: 'commentItem',
  props: {
    comment: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      operators: [],
      list: []
    };
  },
  created() {},
  mounted() {
    this.operators = this.$store.state.user.activeMenuOperators;
  },
  computed: {
    // 查看权限
    hasDeleteCommentOperation() {
      return this.$hasOneOf(this.operators, ['qa$delete_comment_qa_consult']);
    }
  },
  watch: {
    comment(val) {
      this.list = val;
    }
  },
  methods: {
    deleteCommentHandle(idx, id) {
      let vm = this;
      this.$Modal.confirm({
        content: '确认删除这条评论吗?',
        onOk: () => {
          qAapi.deleteCommentHandle(id).then(res => {
            if (res.data.success) {
              vm.list.splice(idx, 1);
              vm.$Message.success('删除成功');
            } else {
              vm.$Message.error(res.data.message);
            }
          });
        }
      });
    }
  }
};
</script>
