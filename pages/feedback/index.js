// pages/feedback/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{
        id: 0,
        value: '体验问题',
        isActive: true
      },
      {
        id: 1,
        value: '商品/商家投诉',
        isActive: false
      },
    ],
    imgArr: [],
    textVal: ""
  },
  UpLoadImgs: [],
  handleTabsItemChange(e) {
    // 获取被点击的标题索引
    const {
      index
    } = e.detail;
    // 修改源数组
    let {
      tabs
    } = this.data;

    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    this.setData({
      tabs
    })
  },

  // 点击选择图片
  handleChooseImg() {
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (result) => {
        this.setData({
          imgArr: [...this.data.imgArr, ...result.tempFilePaths]
        })
      },
      fail: () => {},
      complete: () => {}
    });

  },

  // 点击取消选择的图片
  handleClear(e) {
    // 获取被点击的索引
    const {
      index
    } = e.currentTarget.dataset;

    // 获取data中的图片数组
    let {
      imgArr
    } = this.data;
    imgArr.splice(index, 1)
    this.setData({
      imgArr
    })
  },

  // 文本域的输入事件
  handleTextInput(e) {
    this.setData({
      textVal: e.detail.value
    })
  },
  // 点击提交
  handleFormSubmit() {
    const {
      textVal,
      imgArr
    } = this.data;
    if (!textVal.trim()) {
      wx.showToast({
        title: '输入不合法',
        icon: 'none',
        mask: false
      });
      return;
    }
    wx.showLoading({
      title: "正在提交中...",
      mask: true
    });
    if (imgArr.length !== 0) {
         imgArr.forEach((v, i) => {
      wx.uploadFile({
        url: 'https://images.ac.cn/Home/Index/UploadAction/',
        filePath: v,
        name: "file",
        formData: {},
        success: (result) => {
          console.log(result);
          let url = JSON.parse(result.data);
          this.UpLoadImgs.push(url);

          // 所有图片提交完成才触发
          if (i === imgArr.length-1) {
            wx.hideLoading();
            this.setData({
              textVal: "",
              imgArr: []
            })
            // 提交成功放回上一个页面
            wx.navigateBack({
              delta: 1
            });
          }
        }
      });

    })

    }else {
      wx.hideLoading();
      wx.navigateBack({
        delta: 1
      });
    }
 
  }
})