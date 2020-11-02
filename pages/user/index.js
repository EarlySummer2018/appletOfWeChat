import {
  showToast
} from "../../utils/asyncWx.js";
Page({

  data: {
    userinfo: {},
    collectNums: 0,
  },
  onShow() {
    const userinfo = wx.getStorageSync("userInfo");
    const collect = wx.getStorageSync("collect")||[];
    
    this.setData({
      userinfo,
      collectNums:collect.length
    })
  },
  handleLogin(e) {
    console.log(e);
    const {type} = e.currentTarget.dataset
    if (!this.data.userinfo.avatarUrl) {
      showToast({title:"您还没有登录无法查看，请先登录"});
      return;
    }else {
      wx.navigateTo({
        url: `/pages/order/index?type=${type}`
      });
    }
  }
})