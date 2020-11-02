import {request} from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods:[],
    isFocus: false,
    inpValue: ""
  },
  timeId: -1,
  // 输入框的值改变就触发 input事件
  handleInput(e) {
    const {value} = e.detail;
    if(!value.trim()) {
      this.setData({
        isFocus: false,
        goods:[]
      })
      return;
    }
    this.setData({
      isFocus:true
    })
    clearTimeout(this.timeId);
    this.timeId = setTimeout(()=> {
      this.qsearch(value)
    }, 1000)
    
  },
  // 发送请求
  async qsearch(query) {
    const res = await request({url:"/goods/qsearch", data:{query}});
    console.log(res);   
    this.setData({
      goods:res.data.message
    })
  },

  handleCancel() {
    this.setData({
      inpValue:"",
      isFocus:false,
      goods: []
    })
  }
})