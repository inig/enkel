<template>
  <div class="profile_item">
    <div class="profile_item_inner">
      <div class="profile_item_inner_top">
        <svg>
          <use :xlink:href="'#profile-item-' + icon"></use>
        </svg>
      </div>
      <div class="profile_item_inner_bottom">{{text}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProfileItemsIndex',
  props: {
    type: {
      type: String,
      default: 'single'
    },
    icon: {
      type: String,
      default: 'survey'
    },
    text: {
      type: String,
      default: '调查'
    }
  }
}
</script>

<style lang="less" scoped>
.profile_item {
  width: 100%;
  height: 70px;
  margin: 5px 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  &_inner {
    width: 60px;
    height: 70px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: transparent;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    &:hover {
      background-color: #eee;
    }
    &_top {
      width: 45px;
      height: 45px;
      background-color: #eee;
      border-radius: 4px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      svg {
        width: 32px;
        height: 32px;
        fill: #888;
      }
    }
    &_bottom {
      width: 60px;
      height: 20px;
      display: flex;
      /* line-height: 20px; */
      flex-direction: row;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      color: #333;
    }
  }
}
</style>