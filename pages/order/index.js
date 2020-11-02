import {request} from "../../request/index.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: '全部',
        isActive: true
      },
      {
        id: 1,
        value: '待付款',
        isActive: false
      },
      {
        id: 2,
        value: '待发货',
        isActive: false
      },
      {
        id: 2,
        value: '退款/退货',
        isActive: false
      }
    ],
    orders:[
      {
        order_number: 'HMDD20190812000000001104',
        order_price: '13655',
        create_time: '1566348985'
      },
      {
        order_number: 'HMDD20190812000000001304',
        order_price: '16521',
        create_time: '1565168985'
      },
      {
        order_number: 'HMDD20190812000000001254',
        order_price: '8654',
        create_time: '156516985'
      },
      {
        order_number: 'HMDD20190812000000001194',
        order_price: '3651',
        create_time: '1565163985'
      },
      {
        order_number: 'HMDD20190812000000001204',
        order_price: '6555',
        create_time: '1565216985'
      },
      {
        order_number: 'HMDD20190812000000001254',
        order_price: '3655',
        create_time: '1565716985'
      },
      {
        order_number: 'HMDD20190812000000001154',
        order_price: '19655',
        create_time: '1565163985'
      },
      {
        order_number: 'HMDD20190812000000001134',
        order_price: '16655',
        create_time: '1576516985'
      },
      {
        order_number: 'HMDD2019081200000001111',
        order_price: '8655',
        create_time: '1569516985'
      },
      {
        order_number: 'HMDD20190812000000001114',
        order_price: '9655',
        create_time: '1565169825'
      },
    ]
  },
  onShow(options) {
    const token = wx.getStorageInfoSync("token");
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/index'
      });
        return;
    }
    // 获取当前的小程序的页面栈-数组，长度最大是10页
    let pages =  getCurrentPages();

    // 数组中索引最大的页面就是当前页面
    let currentPage = pages[pages.length-1].options
    
    // 获取参数
    let {type} = currentPage;

    // 激活选中页面标题 当 type=1 时 index=0
    this.changeTitleByIndex(type-1)
    // 调用获取订单列表函数
    this.getOrders(type)
    
  },

  // 获取订单列表的方法
  async getOrders(type) {
    const res = await request({url:"/my/orders/all",data:{type}});
    const orders = this.data.orders.map(v=>({...v,create_time_cn:(new Date(v.create_time*1000).toLocaleString())}))
    this.setData({
      // orders:res.orders
      orders
    })
  },
  changeTitleByIndex(index) {
    let {tabs} = this.data;
    tabs.forEach((v, i) => i===index?v.isActive=true:v.isActive=false);
    this.setData({
      tabs
    })
  },
  handleTabsItemChange(e) {
    // 获取被点击的标题索引
    const {index} = e.detail;
    // 修改源数组
    this.changeTitleByIndex(index);
    
    // 重新发送请求
    this.getOrders(index+1)
  },
})