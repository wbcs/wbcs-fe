毕设前端

# get start
```sh
npm install
npm run dev
```

![image](https://user-images.githubusercontent.com/33517328/79063011-97805300-7cd1-11ea-9b67-2b2a5dbd5120.png)

![image](https://user-images.githubusercontent.com/33517328/79065325-0d8cb600-7ce2-11ea-99f1-cc30c7305c77.png)

# TODO
## bug
+ [ ] `Notification` 重复
+ [ ] `Router` 有时不跳转
+ [x] 组件引用报错
+ [x] 打包后图片加载失败

## feature
+ [x] sidebar resize
+ [ ] 粘贴板图片问题
+ [ ] 聊天记录懒加载
+ [ ] 表情、语音、文件发送
+ [ ] 视频(打算单独整成一个组件，发布出去)
+ [ ] 消息加密解密
+ [ ] 更新：思路是 `app.asar`


# 坑
+ BrowserWindow在loadURL的时候，url如果是hash模式会报错
+ 需要请求权限的操作，在vscode的zsh里没权限导致失败
+ sideEffects为false时，会将css、less忽略，shaking掉，解决：`sideEffects: ["*.css", "*.less"]`
+ `<img />` 来引用图片打包后总是有问题，目前采用css引入，绕开这一错误