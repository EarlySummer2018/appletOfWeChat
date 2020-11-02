// pages/cart/index.js

import {
  getSetting,
  chooseAddress,
  openSetting,
  showModal,
  showToast
} from "../../utils/asyncWx.js"
Page({

  data: {
    address: {},
    
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    // 获取缓存中的地址信息
    const address = wx.getStorageSync("address");
    
    // 获取缓存中的购物车数据
    const cart = wx.getStorageSync("cart") || [];
    // 全选功能
    this.setData({address})
    this.setCart(cart);
  },

  /*

  1.获取用户的收货地址
    1.1 绑定点击事件
    1.2 调用小程序内置 api 获取用户的收货地址 wx.chooseAddress

  2 获取用户对小程序所授予获取地址的权限状态 scope 
    2.1 假设用户点击获取收货地址的提示框 确定 authSetting scope.address
      scope 值 true 直接调用获取收货地址
    2.2 夹着用户重来都没调用获取收货地址的 api
      scope undefined 直接调用获取收货地址
    2.3 夹着用户 点击获取收货地址的提示框 取消
    scope 值 false
      2.3.1 诱导 用户自己打开 授权设置页面（wx.openSetting）当用户重新给予获取地址权限的时候
      2.3.2 获取收货地址
    2.4 把获取到的收货地址存入到本地存储
  3 页面加载完毕
    3.1 获取本地存储中的地址数据
    3.2 把数据设置给 data 中的一个变量

  */

  // 点击 收货地址
  async handleChooseAdd() {
    try {
      // 获取权限状态
      const res1 = await getSetting();
      const scopeAddress = res1.authSetting["scope.address"];
      // 判断 权限的状态
      if (scopeAddress === false) {
        await openSetting();
      }
      // 调用获取地址的 api
      let address = await chooseAddress();
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
      wx.setStorageSync("address", address);

    } catch (error) {
      console.log(error);
    }
  },

  // 商品的选中事件
  handleItemChange(e) {
    const {
      id
    } = e.currentTarget.dataset;
    let {
      cart
    } = this.data;
    let index = cart.findIndex(v => v.goods_id === id);
    cart[index].checked = !cart[index].checked;
    // this.setData({
    //   cart
    // })
    this.setCart(cart);
  },

  // 设置购物车状态的同时，重新计算数据
  setCart(cart) {

    let allChecked = true;
    // 总价格、总数量
    let totalPrice = 0;
    let totalNum = 0;
    // 循环 cart 数组
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      } else {
        allChecked = false;
      }
    });
    allChecked = cart.length !== 0 ? allChecked : false;
    this.setData({
      cart,
      totalPrice,
      totalNum,
      allChecked
    });
    wx.setStorageSync("cart", cart);
  },

  // 商品的全选功能
  handleItemAllChecked() {

    // 获取打他中的数据
    let {cart, allChecked} = this.data;
    
    // 修改值
    allChecked = !allChecked;

    // 循环修改 cart 数组中的商品选中状态；
    cart.forEach(v => v.checked = allChecked);
    this.setCart(cart);
  },

  // 商品数量加减操作
  async handleItemNumEdit(e) {
    
    // 获取传过来的参数
    const {operation, id} = e.currentTarget.dataset;
    
    // 获取购物车数组
    let {cart} = this.data;

    // 找到需要修改的商品的索引
    const index = cart.findIndex(v=>v.goods_id===id);

    // 判断数量是否小于 1，如果小于 1，则弹窗提示用户是否删除
    if (cart[index].num === 1&&operation===-1) {
      const res = await showModal({content:'当前商品数量为1，您点击了减号，是否删除该商品'})
      if (res.confirm) {
        cart.splice(index, 1);
        this.setCart(cart);
      }
    }else {
      // 进行修改数量
      cart[index].num += operation;
      // 设置会缓存和data中
      this.setCart(cart);
    }
    
  },

  // 结算功能
  async handlePay() {
    // 1.判断是否添加收货地址
    const {address,totalNum} = this.data;
    if (totalNum === 0) {
      await showToast({title: '您还没有选购商品'});
      return;
    }
    if (!address.userName) {
      await showToast({title: '您还没有添加收货地址'});
      return;
    }
    wx.navigateTo({
      url: '/pages/pay/index'
    });
  }
})