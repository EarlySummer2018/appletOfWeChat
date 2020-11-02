
import {
  requestPayment, showToast
} from "../../utils/asyncWx.js";
import {request} from "../../request/index.js";
Page({

  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    // 获取缓存中的地址信息
    const address = wx.getStorageSync("address");
    
    // 获取缓存中的购物车数据
    let cart = wx.getStorageSync("cart") || [];

    // 过滤后的购物车数组
    cart = cart.filter(v=>v.checked);
    this.setData({address})

    let totalPrice = 0;
    let totalNum = 0;
    // 循环 cart 数组
    cart.forEach(v => {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
    });
    this.setData({
      cart,
      totalPrice,
      totalNum,
      address
    });
  },

  // 点击支付事件
  async handlePrderPay() {
    try {
      const token = wx.getStorageSync("token");
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/index'
      });
      return;
    }
    // 创建订单
    // 设置请求头参数
    // const header = {Authorization:token};
    
    // 设置请求体参数
    const oder_price = this.data.totalPrice;
    
    // 地址信息
    const consignee_addr = this.data.address.all;
    
    // 获取订单数组
    const cart = this.data.cart;
    let goods = [];
    cart.forEach(v=>goods.push({
      goods_id: v.goods_id,
      goods_number:v.num,
      goods_price: v.goods_price
    }));
    const orderParams = {order_price, consignee_addr,goods}
    // 发送请求
    const {order_number} = await request({url:"my/orders/create", method:"POST", data:orderParams})
    
    // 发起预支付接口
    const {pay} = await request({url:"my/orders/req_unifiedorder", method:"POST", data:{order_number}});
    
    // 发起微信支付
    await requestPayment(pay);

    // 查询订单
    const res = await request({url:"my/orders/chkOrder", method:"POST", data:{order_number}});
    
    await showToast({title:"支付成功"});
    // 支付成功删除缓存中的数据
    let newCart = wx.getStorageInfoSync("cart");
    newCart = newCart.filter(v=>!v.checked);
    wx.setStorageSync("cart", newCart);
      
    // 支付成功跳转到订单页面
    wx.navigateTo({
      url: '/pages/order/index'
    });
      
    } catch (error) {
      await showToast({title:"支付失败"})
      console.log(error);
      
    }
  }
})