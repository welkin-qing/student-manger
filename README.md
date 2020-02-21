# login
1. 获取表单数据
2. 根据表单中不同身份查询对应数据表
  - 判断用户账号是否存在
  - 用户账号存在，密码是否正确
3. 发送响应数据，使用session记录用户身份

# admin
1. 使用bootstrapValidator
  - 动态处理表单输入是否为空
  - 动态处理新密码和确认密码输入是否相同
2. 判断原始密码和输入的当前密码是否一致，若不一致则返回错误提示
3. 更新数据库当前密码，并重新登录

# profile
1. 根据不同身份展示不同个人信息页面信息词条
2. 更新数据用户身份信息，并刷新页面

# new
1. 该页面上传文件时，使用七牛云处理文件上传
2. 点击上传文件时，使用弹出框进行提示
3. 设计file表，将发布数据保存在file表中

# index
1. 完成数据库到该页面的渲染
2. 对数据进行时间显示，内容显示
3. 对不同发布内容进行不同显示
4. 实现针对不同内容进行图片显示和文件下载

# delete --删除发起的课题
1. 首先根据用户身份进行判断，自己可删除自己发表的言论，对于其他人的不可操作
2. 点击删除时，弹出confirm框进行询问是否删除
3. 取消，则不删除
4. 确认，进入数据库删除该条数据，并刷新页面

# show
1. 针对不同身份页面进行不同显示
2. 完成评论回复，上传文件功能
3. 根据评论是否带文件、是否分组，进行不同评论显示
4. 控制上传文件时，针对不同数量评论导致的屏幕高度，设计tootip的弹出效果

# course
1. 根据不同身份显示不同的课程信息
  - 对于老师，显示自己所教的课程
  - 对于学生，显示自己所在学习的课程

# class
1. 根据不同的课程，显示这门课程所对应的成员信息

# group
1. 根据小组信息渲染所有组信息
2. 判断是否自己在小组内
  - 在组内，渲染自己的小组信息
  - 不在组内，进行提示
3. 点击退出该组，可以退出自己所在的组
4. 点击加入该组，可以加入组
  - 首先判断自己是否在组内，在组内不能加入其他的组，需要先退出自己所在的组
  - 其次判断该组是否成员已满，若满员，则不能加入该组
  - 如果该组没有成员，则成为队长
  - 如果该组有其他成员，则成为组员

# 其他
1. 处理进入页面，input标签自动focus
2. 提交非空数据，前端对数据进行处理