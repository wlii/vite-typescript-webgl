# TypeScript WebGL

///////////////////////////////////////////////////////////

# 安装环境

npm init

启动项目

npm run dev

///////////////////////////////////////////////////////////

# 搭建vite环境

1、npm init -y

#package.json

scripts改为:"dev": "vite"

2、安装vite：npm i vite -D

（建议node版本V14以上）

若无ts环境，安装：npm install -g typescript

////////////////////////////////////////////

# 合并ts为js

tsc --out main.js ***.ts ***.ts ***.ts


////////////////////////////////////////////

#index.html

<!DOCTYPE html>

<html lang="en">
    
<head>
    
    <meta charset="UTF-8">
    
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <title>Document</title>
    
    <script type="text/javascript" src="./main.js"></script>
    
    <style>
        
        html, body {padding: 0;margin: 0;overflow: hidden; }
        
        canvas {width: 100%;height: 100%;} 
        
    </style>
    
</head>
    
<body>
    
</body>
    
</html>

//----------------------------章节摘要---------------------------------//

# ts1

///////ts1 编译命令/////////////////////////////////////

tsc --out ./src/main.js ./src/app.ts


# ts2

///////ts2 编译命令/////////////////////////////////////

tsc --out ./src/main.js ./src/engine.ts ./src/gl.ts ./src/app.ts


# ts3

///////ts3 编译命令/////////////////////////////////////

tsc --out main.js ./src/app.ts ./src/engine.ts ./src/core/gl.ts ./src/core/shader.ts

显示：

<div align="center">
  <img src="https://github.com/wlii/vite-typescript-webgl-plugin/blob/main/assets/ts3.png">
</div>

# ts4

///////ts4 编译命令/////////////////////////////////////

抽象出了:glBuffer.ts

编译命令：tsc --out main.js ./src/app.ts ./src/engine.ts ./src/core/gl.ts ./src/core/shader.ts ./src/core/glBuffer.ts

<div align="center">
  <img src="https://github.com/wlii/vite-typescript-webgl-plugin/blob/main/assets/ts4.png">
</div>


# ts4 各个模块引入改写为import引入

///////ts4 改写为import引入////////////////////////////


将namespace改为import引入类，index.html直接引入ts文件，免执行编译命令，自动监听保存后自动刷新页面。
