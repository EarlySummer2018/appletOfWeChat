// pages/goods_list/index.js
import {request} from "../../request/index.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: '综合',
        isActive: true
      },
      {
        id: 1,
        value: '销量',
        isActive: false
      },
      {
        id: 2,
        value: '价格',
        isActive: false
      },
    ],
    goodslist: []
  },

  // 接口要的参数
  QueryParams: {
    query: "",
    cid: "",
    pagenum: 1,
    pagesize: 10
  },

  // 总页数
  totalPages: 1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid = options.cid||"";
    this.QueryParams.query = options.query||"";
    this.getGoodsList();
  },

  // 获取商品列表数据
  getGoodsList(e) {
    request({url:"/goods/search", data:this.QueryParams})
    .then(result => {
      const total = result.data.message.total;
      this.totalPages = Math.ceil(total/this.QueryParams.pagesize)
      this.setData({
        goodslist:[...this.data.goodslist, ...result.data.message.goods]
      })
    })
    wx.stopPullDownRefresh();
  },

  // 标题的点击事件 从子组件传递过来的索引值
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
   onReachBottom() {
    // 判断有没有下一页
    if (this.QueryParams.pagenum >= this.totalPages) {
      wx.showToast({title: '没有下一页数据了'});
        
    }else {
      this.QueryParams.pagenum++
      this.getGoodsList();
    }
   },
  //  下拉刷新事件
  onPullDownRefresh() {
    this.setData({
      // 重置数组
      goodslist: []
    })

    // 重置页码
    this.QueryParams.pagenum = 1;

    // 重新发送请求
    this.getGoodsList();
  }
})