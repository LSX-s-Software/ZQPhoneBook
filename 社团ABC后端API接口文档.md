# 社团ABC后端API接口文档

> ## 版本1.0.2

> 所有的数据传输均使用**POST**方法，所有发送和返回均使用**JSON**格式。Token是用于识别登录状态的一串字符，把用户ID、IP、登录时间通过特定算法算出。
>
> 本文档格式说明：字段名: [类型] 描述。若类型为Object或[Object]，则二级目录为Object的各字段名；若类型不为Object或[Object]，则二级目录为该字段接受的的取值。[[类型]]表示该类型的数组。
>
> **在调试阶段服务器程序输出的错误信息可直接作为结果返回。**
>
> 考虑到项目开发效率和工作量均衡，把部分可以在前端完成的功能转移到后端。后端辛苦了～

## 登录

### 路径

/login

### 发送

- username: [String] 邮箱地址
- password: [String]

### 返回

- result: [String]
  - 成功("success")
  - 用户不存在("username")
  - 密码错误("password")
  - 内部错误
- 【成功】Token: [String]

## 注册

### 路径

/register

### 发送

- username: [String] 邮箱地址
- password: [String]

### 返回

- result: [String]
  - 成功("success")
  - 内部错误
- 【成功】Token: [String]

## 注册-检查用户是否存在

### 路径

/register/check

### 发送

- username: [String] 邮箱地址

### 返回

- result: [String]
  - 用户不存在("userNotExist")
  - 邮箱地址已被占用("userExisted")
  - 内部错误

## 忘记密码

*暂不提供此功能*

## 获取本人信息

### 路径

/userInfo/getMyInfo

### 发送

- Token: [String]
- detail: [Bool]
  - false: 简略
  - true: 详细

### 返回

- result: [String]
  - 成功("success")
  - 内部错误
- 【成功】 myInfo: [Object]
  - id: [String] 用户唯一标识符
  - name: [String] 真实姓名
  - 【详细】nickName: [String] 昵称
  - avatarURL: [String] 头像图片URL
  - 【详细】gender: [Int] 性别(0: 男,1: 女)
  - 【详细】birthday: [String] 生日（yyyy年M月d日)
  - 【详细】hometown: [String] 家乡
  - 【详细】university: [String] 学校
  - 【详细】school: [String] 学院
  - 【详细】grade: [String] 年级
  - 【详细】schoolNumber: [String] 学号
  - phone: [String] 手机号
  - 【详细】email: [String] 邮箱地址
  - 【详细】qq: [String] QQ号
  - 【详细】wechat: [String] 微信号
  - 【详细】dormBuilding: [String] 宿舍楼
  - 【详细】marrige: [Boolean] 是否单身

## 修改本人信息

### 路径

/userInfo/setMyInfo

### 发送

- Token: [String]
- avatar: [File-Image] 头像图片
- myInfo: [Object]
  - name: [String] 真实姓名
  - nickName: [String] 昵称
  - gender: [Int] 性别(0: 男,1: 女)
  - birthday: [String] 生日（yyyy年M月d日)
  - hometown: [String] 家乡
  - university: [String] 学校
  - school: [String] 学院
  - grade: [String] 年级
  - schoolNumber: [String] 学号
  - phone: [String] 手机号
  - email: [String] 邮箱地址
  - qq: [String] QQ号
  - wechat: [String] 微信号
  - dormBuilding: [String] 宿舍楼
  - marrige: [Bool] 是否单身

*暂不提供的功能：设置权限*

### 返回

- 成功("success")
  - 成功
  - 内部错误

## 获取加入的社团

### 路径

/userInfo/myClubs

### 发送

- Token

### 返回

- result: [String]
  - 成功("success")
  - 内部错误
- myClubs: [[Object]]
  - index: [Int] 序号（指明这是该用户加入的第几个社团）
  - id: [Int] 社团ID
  - name: [String] 社团名称
  - bgURL: [String] 背景图URL
  - size: [Int] 社团人数
  - isManager: [Bool] 是否是该社团的管理员
  - hqs: [[Object]] 一级部门
    - id: [String] 社团部门ID，用“社团ID-一级部门ID”的格式，例如："0-0"
    - text: [String] 一级部门名称
    - tags: [[Int]] 一级部门人数，这里的Int数组只有一个元素，就是人数
    - nodes: [[Object]] 二级部门，结构与一级部门一致，id为“社团ID-一级部门ID-...-n级部门ID”

## 获取社团指定部门的信息

### 路径

/clubs/getHQInfo

### 发送

- Token
- id: [String] 要获取信息的部门ID

### 返回

- result: [String]
  - 成功("success")
  - 内部错误
- subHQList: [[Object]] 子部门列表
  - id: [String] 子部门
  - name: [String] 子部门的名称
- members: [[Object]] 人员信息 *暂不提供的功能：如果用户不允许公开某字段则不传该字段*
  - id: [String] 用户的唯一标识符
  - name: [String] 真实姓名
  - nickName: [String] 昵称
  - avatarURL: [String] 头像图片URL
  - gender: [Int] 性别(0: 男,1: 女)
  - birthday: [String] 生日（yyyy年M月d日)
  - hometown: [String] 家乡
  - university: [String] 学校
  - school: [String] 学院
  - grade: [String] 年级
  - schoolNumber: [String] 学号
  - phone: [String] 手机号
  - email: [String] 邮箱地址
  - qq: [String] QQ号
  - wechat: [String] 微信号
  - dormBuilding: [String] 宿舍楼
  - marrige: [Bool] 是否单身
  - membership: [[String]] 社团-一级部门-二级部门-n级部门-职称

## 添加部门

### 路径

/clubs/addHQ

### 发送

- Token
- name: [String] 部门名称
- id: [String] 父部门ID

### 返回

- result: [String]
  - 成功("success")
  - 内部错误

## 修改部门信息

### 路径

/clubs/editHQ

### 发送

- Token
- id: [String] 部门ID
- name: [String] 新的部门名称

### 返回

- result: [String]
  - 成功("success")
  - 内部错误

## 删除部门

### 路径

/clubs/deleteHQ

### 发送

- Token
- id: [String] 部门ID

### 返回

- result: [String]
  - 成功("success")
  - 内部错误

## 编辑成员

*暂不提供此功能*

## 更新成员列表

*下一版API文档中添加*

## 删除成员

### 路径

/clubs/deleteMember

### 发送

- Token
- id: [String] 部门ID
- memberId: [String] 成员的ID

### 返回

- result: [String]
  - 成功("success")
  - 内部错误

## 创建社团

### 路径

/clubs/addClub

### 发送

- Token
- name: [String] 部门名称
- description: [String] 社团简介
- img: [File-Image] 社团背景图

### 返回

- result: [String]
  - 成功("success")
  - 内部错误
- 【成功】id: 社团ID

## 创建社团-导入成员信息

### 路径

/clubs/importMember

### 发送

- Token
- id: [String] 社团ID
- memberListFile: [File-Excel] 导入成员的Excel表

### 返回

- result: [String]
  - 成功("success")
  - Excel解析错误(返回具体错误原因)
  - 其他内部错误
- 【成功】memberList [[Object]] 解析后的成员列表
  - index: 序号
  - name: [String] 真实姓名

## 获取成员邀请码

### 路径

/clubs/getInviteCode

### 发送

- Token
- id: [String] 社团ID

### 返回

- result: [String]
  - 成功("success")
  - 其他内部错误
- 【成功】inviteCode: [String] 邀请码（由字母和数字组成，长度7位）
- *暂不提供的功能：邀请码自动过期时间*

## 加入社团

### 路径

/clubs/join

### 发送

- Token
- inviteCode: [String] 邀请码
- phone: [String] 手机号

### 返回

- result: [String]
  - 成功("success")
  - 无效邀请码("invalidCode")
  - 该用户不属于该社团("accessDenied")
  - 其他内部错误
- 【成功】返回“获取加入的社团”的数据，但只需最新一项

------

暂时先写这么多，缺漏（肯定有的）和待添加的功能将会在后续版本中补充。