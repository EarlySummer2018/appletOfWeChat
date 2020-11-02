// pages/collect/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: '收藏的店铺',
        isActive: true
      },
      {
        id: 1,
        value: '收藏的商品',
        isActive: false
      },
      {
        id: 2,
        value: '关注的商品',
        isActive: false
      },
      {
        id: 3,
        value: '我的足迹',
        isActive: false
      }
    ],
    collect: []
  },
  onShow() {
    const collect = wx.getStorageSync("collect")||[];
    this.setData({
      collect
    })
  },
  handleTabsItemChange(e) {
    // 获取被点击的标题索引
    const {index} = e.detail;
    // 修改源数组
    let {tabs} = this.data;
    
    tabs.forEach((v, i) => i===index?v.isActive=true:v.isActive=false);
    this.setData({
      tabs
    })
  },
})