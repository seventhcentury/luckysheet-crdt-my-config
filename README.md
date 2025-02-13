<p align="center">
  <img src='/public/logo.svg' />
</p>
<h1 align="center">Luckysheet CRDT</h1>


[简体中文](./README-zh.md) | English


<p style="border-bottom:solid rgba(85, 187, 138, 0.5) 1px"></p>

<p align="center">
  <img src='/public/result/result.gif' alt='result' />
</p>


## DESCRIPTION
1. The project is **Luckysheet Collaborative Enhanced Edition (fully functional implementation)**, aiming to provide collaborative implementation ideas, data storage services, collaborative demonstrations, etc. The project is based on [Luckysheet](https://github.com/mengshukeji/Luckysheet) Implemented, thank you to the original author for open-source.
2. This project mainly implements the collaborative function module, which has no impact on other content. The parts modified based on the source code are all reflected in the `Luckysheet source` folder.
3. The project supports **optional database services**. User data without a database cannot be persistently stored, and collaborative functionality is not affected.
4. Project Use **[Sequelize](https://www.sequelize.cn/)** As an ORM data service technology, it supports databases such as MySQL, SQLite, PostgreSQL, and MSSQL, making it easy for users to quickly migrate.
5. The project uses **Typescript** as the main development language, providing complete type prompts, standardizing code, and improving development efficiency.
6. **The project has a `master` branch and a `master-alpha` branch. The latest released features will be tested on alpha and will be merged into master after stabilization**



## Copyright Notice
1. This project is based on the [Luckysheet source code](https://github.com/mengshukeji/Luckysheet) modification. Please follow the original author's open source agreement, and do not delete or modify the source code header copyright statement。
2. This project is open sourced under the **Apache 2.0 protocol**, so please feel free to use it. At the same time, this project will also contribute to the Luksysheet community, enriching the community ecosystem. Thank you again to the @[Luckysheet](https://github.com/mengshukeji/Luckysheet) team ❤️
3. Please note that there is no Luckymeet source code available for the startup, operation, deployment, and other stages of this project, which does not affect the actual collaborative functionality。
4. In order to better drive open source, starting from the git head of `10b6a27c4bf001f519f1196054ca54a403da7ac9`, the source code modification part will no longer be provided. If necessary, please contact the author for a fee to obtain it。
5. **The lack of Luckysheet source code does not affect the actual functionality, and all collaborative features are open source**。
6. **The impact of no source code:**
   1. The source code is only used for functional expansion in binary scenarios;
   2. If there is no requirement for secondary opening, you do not need to use the source code. If there is a requirement for secondary opening, please contact the author for payment first；
7. **Please note that:**
   1.Luckysheet source will be retained, but will not be continuously updated. Subsequent feature upgrades will only provide lib plugin packages；
   2. Fee standard:**`￥ 99`**
   3. Provide services: Only provide source code packages (do not provide continuous feature upgrades, bug fixes, and not purchase products!)
8. **Contact Author**：
   1. V: 18276861941
   2. qq group: 522121825 (recommend)



## START
1. Clone project：
```bash
git clone https://gitee.com/wfeng0/luckysheet-crdt
```

1. Download dependencies: 
```bash
## "dep": "npm install --s && cd server && npm install --s"
npm run dep
```

**⛔️ Tips：**

```js
1. Project dependencies are divided into front-end dependencies and back-end dependencies (independent projects)；
2. We recommend using `npm install` to install dependencies and avoid version conflicts；
3. If the dependency download error occurs, you can try deleting the `package lock. json` file and re executing the dependency installation;
4. If executing the command 'npm run dep' reports an error，Please try executing the 'npm install -- s' command for front-end dependency installation，Execute the 'cd server && npm install -- s' command for background dependency installation。

**If the error persists, please confirm if the environment meets the operating conditions：**
`node -v ==> v20.x.x` // 请确保 node 版本大于 18
`npm -v ==> 10.x.x` // 请确保 npm 版本大于 7.x.x
```

3. 🚫<span style="color:red;font-weight:900">~~If there is no database service, please skip this step~~</span>🚫 Configure database parameters：
```ts
// server/src/Config/index.ts
export const SQL_CONFIG = {
  port: 3306,
  host: "127.0.0.1", // localhost or 127.0.0.1
  database: "luckysheet_crdt",
  user: "root",
  password: "root",
};
```
4. 🚫<span style="color:red;font-weight:900">~~If there is no database service, please skip this step~~</span>🚫 Synchronize database tables：
```bash
npm run db
```

**⛔️ Tips：**
```ts
1.  Please ensure that the database configuration is correct and available
2.  Please ensure that the project executes synchronized database commands `npm run db`
3.  The project cycle only needs to be executed once to ensure the existence of table structures in the database。
```
1. Start Service: 
    - Front-desk service：`npm run dev`
    - Back-up services：`npm run server`
2. Open the URL：`http://localhost:5000`, You can experience the collaborative function.


## Project Structure Description

```js
// srource code
- 🗂️Luckysheet-source 
- 🗂️Luckysheet-source-private // Unopened source portion

// back-up services
- 🗂️server 
    + 📂public // Static resources 
    + 📂src 
        + 📂Config // Project configuration file：Port、SQL、LOG etc.
        + 📂Controller // Controller
        + 📂Interface // Interface
        + 📂Meddleware // Meddleware
        + 📂Router // Routers
        + 📂Sequelize // Database service
            + 📂Models // Models
            + 🗒️index.ts // Database connection
            + 🗒️synchronization.ts // Database table synchronization script
        + 📂Service // Service
        + 📂Utils // Utils
        + 📂WebSocket // websocket
            + 🗒️broadcast.ts // broadcast
            + 🗒️database.ts // database
            + 🗒️index.ts // websocket server entry file.
        + 🗒️main.ts // Server entry file.

// Front desk service
- 🗂️src 
    + 📂axios // axios 
    + 📂config // Config
    + 📂style // Style
    + 🗒️main.ts // Entry file.
```

## Collaborative Function Plan Table
**Implemented  ✅️ Unrealized  ❌️**
- File operation
  - ✅️ import file
  - ✅️ export file(Not implemented)

- Cell operation
  - ✅️ Single cell operation
  - ✅️ Range cell operation

- Config operation
  - ✅️ Line hidden
  - ✅️ Column hidden
  - ✅️ Modify row height
  - ✅️ Modify column width

- Universal save
  - ❌️ Freeze rows and columns
  - ✅️ Change worksheet name
  - ✅️ Change worksheet color
  - ✅️ Merge cell
  - ❌️ Filter scope
  - ❌️ Specific settings for filtering
  - ❌️ Alternating colors
  - ❌️ Conditional formatting
  - ❌️ PivotTable
  - ❌️ Dynamic array

- Function chain operation
  - ❌️ Function chain operation

- Row and column operation
  - ❌️ Delete rows or columns
  - ❌️ Add rows or columns

- Filter operations
  - ❌️ Clear filter
  - ❌️ Restore filter

- Sheet operations
  - ✅️ Add sheet
  - ✅️ Copy sheet
  - ✅️ Delete sheet
  - ✅️ Restore sheet
  - ✅️ Adjust the position of the sheet
  - Switch to the specified sheet 

- Sheet attribute 
  - ✅️ Hidden or displayed

- Table information change
  - ✅️ Change workbook name

- Chart operation
  - ✅️ Add chart
  - ✅️ Move chart
  - ✅️ Zoom chart
  - ✅️ Update chart options


## Service Port Description
1. Front desk service port：`5000`
2. Back up service port：`9000`
3. Database service port：`3306`

```js
// 1️⃣ Backend service port configuration：server/src/Config/index.ts
export const SERVER_PORT = 9000;
```
```js
// 2️⃣ Database service port configuration：server/src/Config/index.ts
export const SQL_CONFIG = {
  port: 3306,
  // ... other config
};

```
```js
// 3️⃣ Front desk service port configuration：src/config/index.ts
// Export backend service address
export const SERVER_URL = "http://localhost:9000";

// Export collaborative service address
export const WS_SERVER_URL = "ws://127.0.0.1:9000";
```

## Source project optimization
#### 1️⃣ Page UI Refactoring
1. Source code UI refactoring, please refer to [Luckysheet-source-recover-style](/Luckysheet-source/src/css/recover.css)
<p align="center">
  <img src='/public/result/ui.gif' />
</p>

#### 2️⃣ Chart Collaboration
1. Implemented vchart, please refer to [Luckysheet-source-vchart](/Luckysheet-source/src/expendPlugins/vchart/plugin.js)
<span style="font-weight:900">On the left is' vchart 'rendering, and on the right is' chartmix' rendering</span>
<p align="center">
  <img src='/public/result/chartmix-vchart.png' />
</p>
<span style="font-weight:900">The vchart chart animation is smoother, and the page is concise and beautiful</span>
<p align="center">
  <img src='/public/result/vchart.gif' />
</p>
<span style="font-weight:900">vchart setting</span>
<p align="center">
  <img src='/public/result/vchart-setting.gif' />
</p>


2. Expand the implementation of chart data update linkage:
<span style="font-weight:900">chartmix </span>
<p align="center">
  <img src='/public/result/chartmix-update-data-crdt.gif' />
</p>

<span style="font-weight:900">vchart </span>
<p align="center">
  <img src='/public/result/vchart-update-data-crdt.gif' />
</p>

### 3️⃣ Optimization of image mobility performance
<span style="font-weight:900">Original effect:</span>
<p align="center">
  <img src='/public/result/picture-old.gif' />
</p>

<span style="font-weight:900">After optimization:</span>
<p align="center">
  <img src='/public/result/picture-new.gif' />
</p>


### 4️⃣ Document encryption and decryption
<span style="font-weight:900">encryption</span>
<p align="center">
  <img src='/public/result/file-encrypt.png' />
</p>
<span style="font-weight:900">decryption</span>
<p align="center">
  <img src='/public/result/file-decrypt.png' />
</p>

<span style="font-weight:900">Opening a document requires a password</span>
<p align="center">
  <img src='/public/result/encryption.gif' />
</p>

<span style="font-weight:900">Configuration method:</span>

```js
/**
 * There are three methods and their verification involved here, all of which are handled by the user themselves:
 *  1. encryption
 *  2. decryption
 *  3. Open file verification
 */
const options = {
  // ...other config
  menuHandler:{
      exit() {
      	console.log("==> exit handler");
      },
      shear() {
      	console.log("==> shear handler");
      },

      //  Return Boolean
      decrypt(password) {
      	// 执行后续 server 操作
      	console.log("==> 解密文档：", password);
      	// 解密过程需要校验密码，因此需要提供返回值
      	return password === "123456";
      },

      // 菜单加密
      encryption: (password) => {
      	// 拿到password可执行后续 server操作
      	console.log("==> 文档已加密:", password);
      },

      // 打开文档输入密码 标记文档是否加密 返回值为 Boolean
      openDocumentPassword: (password) => {
      	console.log("==> 用户输入密码:", password);
      	return password === "123456";
      },
  }
}
```

### 5️⃣ File Import
<span style="font-weight:900">Support collaboration~</span>
<p align="center">
  <img src='/public/result/file-import.gif' />
</p>
<span style="font-weight:900">Configuration method:</span>

```js
// 1. Configure import plugin
const options = {
  // ...other config
  plugins: ["fileImport"],
}

luckysheet.create(options)
```

<span style="font-weight:900">matters needing attention:</span>
1. File import depends on the `luckyuexcel` plugin；
2. Therefore, some functions are limited by plugins. If you need to expand them, please implement them yourself!
3. Please configure plugins correctly Use the import function after `fileImport`.


### 6️⃣ File Export
<p align="center">
  <img src='/public/result/file-export.gif' />
</p>
<span style="font-weight:900">Configuration method：</span>

```js
// 1. Configure export plugin
const options = {
  // ...other config
  plugins: ["fileExport"],
}

luckysheet.create(options)
```

<span style="font-weight:900">matters needing attention:</span>
1. File import depends on the `exceljs | file-saver` plugin；
2. Therefore, some functions are limited by plugins. If you need to expand them, please implement them yourself!
3. Please configure plugins correctly Use the import function after `fileExport`.


## frequently asked questions
1. **When importing files, prompt `file format error`：**
```ts
At present, only xlsx format is supported. 
Please check if the file format is correct.
```

2. **The page displays `Collaboration service unavailable, currently in normal mode`：**
```ts
try {
  const { data } = await fetch({
      url: "/api/getWorkerBook",
      method: "post",
      data: { gridKey },
   });
}
catch (error) {}

If and only if! When a fetch request fails, it will enter the catch block,
At this time, it will prompt 'Collaboration service unavailable, currently in normal mode';
Please check if the service is functioning properly. There are generally the following possibilities:
1. Service exception
2. Database exception
3. Abnormal database table structure
```
3. **Chaotic database data:**
```ts
The only possible reason for this is that the application does not have a relevant delete statement,
It's not that I don't write, but rather that everyone expands based on their actual business needs.
The following steps can restore:
1. Delete all data tables of luckyshev_crdt;
2. Execute npm run db to synchronize database tables;
3. Execute npm run server to start the service;
The appeal operation will create a database table by oneself and synchronize the latest model structure,
And create a gridkey demo worker books and worker sheets record;
If and only if there are recorded scenes in these two tables, the luckySheet can be rendered;
be careful! If there is no record in two tables, it may also cause the inability to collaborate (problem 2)
```

4. **Forefront resource reference exception**
```ts
Note: Currently, all plugin dependencies in the source code are derived from absolute paths
// Dynamically load dependent scripts and styles
const dependScripts = [
	"expendPlugins/libs/vue@2.6.11.min.js",
	"expendPlugins/libs/vuex.min.js",
	"expendPlugins/libs/elementui.min.js",
	"expendPlugins/libs/echarts.min.js",
	"expendPlugins/chart/chartmix.umd.min.js",
];

So, it will cause a problem that the actual project in the front-end is probably not the path of public/appendplugins/ * *. Please ensure that the expenndplugins directory is correctly placed and recognized.
```



## Open source contribution
1. Submit an [issue](https://gitee.com/wfeng0/luckysheet-crdt/issues/new)
2. Fork this project and submit a PR
3. Join the communication group:
<p align="center">
  <img src='/public/result/qq-group.png' />
  <img src='/public/result/wechat-group.jpg' />
</p>