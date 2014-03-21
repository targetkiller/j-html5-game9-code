/*
* @author:谭照强
* @project:SnailBait Game
* @content:游戏总处理
*/

// 定义SnailBait命名空间，封装游戏所有操作，防止污染全局环境。
var SnailBait =  function () {
   this.canvas = document.getElementById('game-canvas'),
   this.context = this.canvas.getContext('2d'),

   //fps和提示
   this.fpsElement = document.getElementById('fps'),
   this.toast = document.getElementById('toast'),
   this.score = document.getElementById('score'),
   this.totalValue = score.innerHTML,

   // －－－－－－－－－－－－－－－－常量列表－－－－－－－－－－－－－－－－

   this.LEFT = 1,
   this.RIGHT = 2,

   // 精灵得分常量..........................................................
   this.BUTTON_VALUE = 50,
   this.COIN_VALUE = 10,
   this.RUBY_VALUE = 100,
   this.SAPPHIRE_VALUE = 80,
   this.BOMB_VALUE = -100,
   this.SNAIL_VALUE = -80,
   this.BAT_VALUE = -50,
   this.BEE_VALUE = -10,

   // 时间常量..........................................................
   this.BACKGROUND_VELOCITY = 35,    // pixels/second 背景移动速度
   this.RUN_ANIMATION_RATE = 35,     // frames/second 动画运行速率
   this.RUNNER_JUMP_DURATION = 1000, // milliseconds 跳跃持续时间
   this.BUTTON_PACE_VELOCITY = 80,   // pixels/second 按钮位移速度
   this.SNAIL_PACE_VELOCITY = 50,    // pixels/second 蜗牛位移速度
   this.SNAIL_BOMB_VELOCITY = 550,   // pixels/second 蜗牛子弹位移速度

   this.RUBY_SPARKLE_DURATION = 200,     // milliseconds 红宝石闪烁持续时间
   this.RUBY_SPARKLE_INTERVAL = 500,     // milliseconds 红宝石闪烁间隔时间
   this.SAPPHIRE_SPARKLE_DURATION = 100, // milliseconds 蓝宝石闪烁持续时间
   this.SAPPHIRE_SPARKLE_INTERVAL = 300, // milliseconds 蓝宝石闪烁间隔时间
   this.SAPPHIRE_BOUNCE_RISE_DURATION = 80, // milliseconds 蓝宝石上跳持续时间

   this.GRAVITY_FORCE = 9.81, //重力加速度
   this.PIXELS_PER_METER = this.canvas.width / 10; // 每米多少像素，假设canvas相同画幅为10米

   this.PAUSED_CHECK_INTERVAL = 200,//暂停检测间隔时间，避免不断检测浪费性能
   this.DEFAULT_TOAST_TIME = 3000,//默认提示时间

   this.EXPLOSION_CELLS_HEIGHT = 62,//爆炸精灵高度
   this.EXPLOSION_DURATION = 500,//爆炸动画持续时间

   this.NUM_TRACKS = 3,//平台级数

   this.PLATFORM_HEIGHT = 8,//平台高度
   this.PLATFORM_STROKE_WIDTH = 2,//平台厚度
   this.PLATFORM_STROKE_STYLE = 'rgb(0,0,0)',//平台默认颜色

   this.PLATFORM_VELOCITY_MULTIPLIER = 4.35,//游戏层/背景层的位移倍数，以实现时差效果
   
   // 各音效大小..........................................................

   this.COIN_VOLUME = 1.0,
   this.SOUNDTRACK_VOLUME = 0.12,
   this.JUMP_WHISTLE_VOLUME = 0.05,
   this.PLOP_VOLUME = 0.20,
   this.THUD_VOLUME = 0.20,
   this.FALLING_WHISTLE_VOLUME = 0.10,
   this.EXPLOSION_VOLUME = 0.25,
   this.CHIMES_VOLUME = 1.0,

   // 精灵的固定宽高值................................................

   this.RUNNER_CELLS_WIDTH = 40,
   this.RUNNER_CELLS_HEIGHT = 52,

   this.RUNNER_HEIGHT = 43,
   this.RUNNER_JUMP_HEIGHT = 120,

   this.RUN_ANIMATION_INITIAL_RATE = 0,

   // 蝙蝠的宽度是变化值
   this.BAT_CELLS_HEIGHT = 34,

   this.BEE_CELLS_HEIGHT = 50,
   this.BEE_CELLS_WIDTH  = 50,

   this.BUTTON_CELLS_HEIGHT  = 20,
   this.BUTTON_CELLS_WIDTH   = 30,

   this.COIN_CELLS_HEIGHT = 28,
   this.COIN_CELLS_WIDTH  = 25,

   this.RUBY_CELLS_HEIGHT = 27,
   this.RUBY_CELLS_WIDTH = 27,

   this.SAPPHIRE_CELLS_HEIGHT = 27,
   this.SAPPHIRE_CELLS_WIDTH  = 27,

   this.SNAIL_BOMB_CELLS_HEIGHT = 20,
   this.SNAIL_BOMB_CELLS_WIDTH  = 20,

   this.SNAIL_CELLS_HEIGHT = 34,
   this.SNAIL_CELLS_WIDTH  = 64,

   this.INITIAL_BACKGROUND_VELOCITY = 0,
   this.INITIAL_BACKGROUND_OFFSET = 0,
   this.INITIAL_RUNNER_LEFT = 50,
   this.INITIAL_RUNNER_TRACK = 1,
   this.INITIAL_RUNNER_VELOCITY = 0,

   // 平台高度...................................................

   this.TRACK_1_BASELINE = 323,
   this.TRACK_2_BASELINE = 223,
   this.TRACK_3_BASELINE = 123,

   // －－－－－－－－－－－－－－－－常量列表结束－－－－－－－－－－－－－－－－


   // 暂停变量............................................................
   
   this.paused = false,
   this.pauseStartTime = 0,
   this.totalTimePaused = 0,

   this.windowHasFocus = true,

   // 图像变量............................................................
   
   this.background  = new Image(),
   this.spritesheet = new Image(),

   // 声音处理............................................................

   this.soundCheckbox = document.getElementById('sound-checkbox');//音效选择器
   this.musicCheckbox = document.getElementById('music-checkbox');//音乐选择器

   this.soundOn = this.soundCheckbox.checked;
   this.musicOn = this.musicCheckbox.checked;

   this.audioTracks = [ // 开启8个音轨
      new Audio(), new Audio(), new Audio(), new Audio(), 
      new Audio(), new Audio(), new Audio(), new Audio()
   ],

   // 定义所有声音资源
   this.soundtrack = document.getElementById('soundtrack'),
   this.chimesSound = document.getElementById('chimes-sound'),
   this.plopSound = document.getElementById('plop-sound'),
   this.explosionSound = document.getElementById('explosion-sound'),
   this.fallingWhistleSound = document.getElementById('whistle-down-sound'),
   this.coinSound = document.getElementById('coin-sound'),
   this.jumpWhistleSound = document.getElementById('jump-sound'),
   this.thudSound = document.getElementById('thud-sound'),

   // 动画帧率变量..............................................................
   
   this.lastAnimationFrameTime = 0,
   this.lastFpsUpdateTime = 0,
   this.fps = 60,

   // 背景与雪碧图位移变量...............................................
   
   this.backgroundOffset = this.INITIAL_BACKGROUND_OFFSET,
   this.spriteOffset = this.INITIAL_BACKGROUND_OFFSET,

   // 背景与平台位移速度........................................................

   this.bgVelocity = this.INITIAL_BACKGROUND_VELOCITY,
   this.platformVelocity,

   // 平台初始化元数据.........................................................
   this.platformData = [],//平台对象数组
   this.platformNum = 80,//平台数目
   this.platformRanWidth = 200,//平台随机长度
   this.platformBaseWidth = 80,//平台基础长度
   this.platformInitLeft = 10,//平台初始左边距
   this.platformTrackNum = 3,//平台总级数
   this.platformLastTrack = 1,//上一级平台级数
   this.platformRanOverLapping = 80,//平台错位的随机长度
   this.platformBaseOverLapping = this.platformRanOverLapping/2,//平台错位的基础长度
   this.platformColors = [//平台颜色数组
      "#1dd2af",
      "#d35400",
      "#2c3e50",
      "#e67e22",
      "#bdc3c7",
      "#8e44ad"
   ],
   this.initPlatform = {
      execute:function(){
         for(var i = 0; i < snailBait.platformNum; i++){
            this.addNewPlatform();
         }
      },

      // 生成新平台
      addNewPlatform:function(){
         var _left = snailBait.platformInitLeft;
         var _width = Math.floor(Math.random()*snailBait.platformRanWidth+snailBait.platformBaseWidth);
         var _height = snailBait.PLATFORM_HEIGHT;
         var _fillStyle = snailBait.platformColors[Math.floor(Math.random()*snailBait.platformColors.length)];
         var _opacity = 1.0;
         var _track = snailBait.platformLastTrack;
         var _pulsate = Math.floor(Math.random()*2+1)>1?false:true;

         snailBait.platformInitLeft = snailBait.platformInitLeft + _width + Math.floor(Math.random()*snailBait.platformRanOverLapping-snailBait.platformBaseOverLapping);//记录前一级长度

         // 记录上一级高度
         if(snailBait.platformLastTrack<snailBait.platformTrackNum){
            snailBait.platformLastTrack++;
         }
         else{
            var tmpTrack = Math.floor(Math.random()*2+1);
            snailBait.platformLastTrack -= tmpTrack;
         }

         snailBait.platformData.push({
            left:_left,
            width:_width,
            height:_height,
            fillStyle:_fillStyle,
            opacity:_opacity,
            track:_track,
            pulsate:_pulsate
         });
      }
   },

   // 初始化各精灵的位置
   this.initSpritesPos = {
      execute:function(){

      }
   }

   // this.platformData = [
   //    // 第一幕.......................................................
   //    {
   //       left:      10,
   //       width:     230,
   //       height:    this.PLATFORM_HEIGHT,
   //       fillStyle: 'rgb(150,190,255)',
   //       opacity:   1.0,
   //       track:     1,
   //       pulsate:   false,//是否闪烁脉动
   //    },

   //    {  left:      250,
   //       width:     300,
   //       height:    this.PLATFORM_HEIGHT,
   //       fillStyle: 'rgb(150,190,255)',
   //       opacity:   1.0,
   //       track:     2,
   //       pulsate:   false,
   //    },

   //    {  left:      400,
   //       width:     125,
   //       height:    this.PLATFORM_HEIGHT,
   //       fillStyle: 'rgb(250,0,0)',
   //       opacity:   1.0,
   //       track:     3,
   //       pulsate:   true
   //    },

   //    {  left:      633,
   //       width:     100,
   //       height:    this.PLATFORM_HEIGHT,
   //       fillStyle: 'rgb(80,140,230)',
   //       opacity:   1.0,
   //       track:     1,
   //       pulsate:   false,
   //    },

   //    // 第二幕.......................................................
               
   //    {  left:      810,
   //       width:     100,
   //       height:    this.PLATFORM_HEIGHT,
   //       fillStyle: 'rgb(200,200,0)',
   //       opacity:   1.0,
   //       track:     2,
   //       pulsate:   false
   //    },

   //    {  left:      1025,
   //       width:     100,
   //       height:    this.PLATFORM_HEIGHT,
   //       fillStyle: 'rgb(80,140,230)',
   //       opacity:   1.0,
   //       track:     2,
   //       pulsate:   false
   //    },

   //    {  left:      1200,
   //       width:     125,
   //       height:    this.PLATFORM_HEIGHT,
   //       fillStyle: 'aqua',
   //       opacity:   1.0,
   //       track:     3,
   //       pulsate:   false
   //    },

   //    {  left:      1400,
   //       width:     180,
   //       height:    this.PLATFORM_HEIGHT,
   //       fillStyle: 'rgb(80,140,230)',
   //       opacity:   1.0,
   //       track:     1,
   //       pulsate:   false,
   //    },

   //    // 第三幕.......................................................
               
   //    {  left:      1625,
   //       width:     100,
   //       height:    this.PLATFORM_HEIGHT,
   //       fillStyle: 'rgb(200,200,0)',
   //       opacity:   1.0,
   //       track:     2,
   //       pulsate:   false
   //    },

   //    {  left:      1800,
   //       width:     250,
   //       height:    this.PLATFORM_HEIGHT,
   //       fillStyle: 'rgb(80,140,230)',
   //       opacity:   1.0,
   //       track:     1,
   //       pulsate:   false
   //    },

   //    {  left:      2000,
   //       width:     100,
   //       height:    this.PLATFORM_HEIGHT,
   //       fillStyle: 'rgb(200,200,80)',
   //       opacity:   1.0,
   //       track:     2,
   //       pulsate:   false
   //    },

   //    {  left:      2100,
   //       width:     100,
   //       height:    this.PLATFORM_HEIGHT,
   //       fillStyle: 'aqua',
   //       opacity:   1.0,
   //       track:     3,
   //    },


   //    // 第四幕.......................................................

   //    {  left:      2269,
   //       width:     200,
   //       height:    this.PLATFORM_HEIGHT,
   //       fillStyle: 'gold',
   //       opacity:   1.0,
   //       track:     1,
   //    },

   //    {  left:      2500,
   //       width:     200,
   //       height:    this.PLATFORM_HEIGHT,
   //       fillStyle: '#2b950a',
   //       opacity:   1.0,
   //       track:     2,
   //       snail:     true
   //    },
   // ],

   // 各个蝙蝠位置数据..............................................................
   
   this.batData = [
      { platformIndex: 1 },
      { platformIndex: 5 },
      { platformIndex: 3 },
      { platformIndex: 11 }
      // { left: 1150, top: this.TRACK_2_BASELINE - this.BAT_CELLS_HEIGHT },
      // { left: 1720, top: this.TRACK_2_BASELINE - 2*this.BAT_CELLS_HEIGHT },
      // { left: 2000, top: this.TRACK_3_BASELINE }, 
      // { left: 2200, top: this.TRACK_3_BASELINE - this.BAT_CELLS_HEIGHT },
      // { left: 2400, top: this.TRACK_3_BASELINE - 2*this.BAT_CELLS_HEIGHT },
   ],
   
   // 各个蜜蜂位置数据..............................................................

   this.beeData = [
      { platformIndex: 2 },
      { platformIndex: 7 },
      { platformIndex: 9 },
      { platformIndex: 13 },
      { platformIndex: 22 }
      // { left: 190,  top: 250 },
      // { left: 350,  top: 150 },
      // { left: 944,  top: this.TRACK_2_BASELINE - 1.25*this.BEE_CELLS_HEIGHT },
      // { left: 1600, top: 125 },
      // { left: 2225, top: 125 },
      // { left: 2295, top: 275 },
      // { left: 2450, top: 275 },
   ],
   
   // 按钮依附的平台位置...........................................................

   this.buttonData = [
      { platformIndex: 2 },
      { platformIndex: 5 },
      { platformIndex: 9 },
      { platformIndex: 13 },
      { platformIndex: 5 },
      { platformIndex: 22 }
   ],

   // 各个金币位置数据.............................................................

   this.coinData = [
      { platformIndex: 1 },
      { platformIndex: 3 },
      { platformIndex: 5 },
      { platformIndex: 8 },
      { platformIndex: 10 },
      { platformIndex: 15 },
      { platformIndex: 20 },
      { platformIndex: 23 },
      { platformIndex: 25 },
      { platformIndex: 30 },
      { platformIndex: 31 }

      // { left: 303,  top: this.TRACK_3_BASELINE - this.COIN_CELLS_HEIGHT }, 
      // { left: 469,  top: this.TRACK_3_BASELINE - 2*this.COIN_CELLS_HEIGHT }, 
      // { left: 600,  top: this.TRACK_1_BASELINE - this.COIN_CELLS_HEIGHT }, 
      // { left: 833,  top: this.TRACK_2_BASELINE - 2*this.COIN_CELLS_HEIGHT }, 
      // { left: 1050, top: this.TRACK_2_BASELINE - 2*this.COIN_CELLS_HEIGHT }, 
      // { left: 1500, top: this.TRACK_1_BASELINE - 2*this.COIN_CELLS_HEIGHT }, 
      // { left: 1670, top: this.TRACK_2_BASELINE - 2*this.COIN_CELLS_HEIGHT }, 
      // { left: 1870, top: this.TRACK_1_BASELINE - 2*this.COIN_CELLS_HEIGHT }, 
      // { left: 1930, top: this.TRACK_1_BASELINE - 2*this.COIN_CELLS_HEIGHT }, 
      // { left: 2200, top: this.TRACK_3_BASELINE - 3*this.COIN_CELLS_HEIGHT }, 
   ],

   // 各个红宝石位置数据............................................................

   this.rubyData = [
      { platformIndex: 1 },
      { platformIndex: 3 },
      { platformIndex: 5 },
      { platformIndex: 8 },
      { platformIndex: 10 },
      { platformIndex: 15 },
      { platformIndex: 20 },
      { platformIndex: 23 },
      { platformIndex: 25 },
      { platformIndex: 30 },
      // { left: 120,  top: this.TRACK_1_BASELINE - this.RUBY_CELLS_HEIGHT },
      // { left: 880,  top: this.TRACK_2_BASELINE - this.RUBY_CELLS_HEIGHT },
      // { left: 1100, top: this.TRACK_2_BASELINE - 2*this.SAPPHIRE_CELLS_HEIGHT }, 
      // { left: 1475, top: this.TRACK_1_BASELINE - this.RUBY_CELLS_HEIGHT },
   ],

   // 各个蓝宝石位置数据.........................................................

   this.sapphireData = [
      { platformIndex: 1 },
      { platformIndex: 3 },
      { platformIndex: 5 },
      { platformIndex: 8 },
      { platformIndex: 10 },
      { platformIndex: 15 },
      { platformIndex: 20 },
      { platformIndex: 23 },
      { platformIndex: 25 },
      { platformIndex: 30 },
      // { left: 680,  top: this.TRACK_1_BASELINE - this.SAPPHIRE_CELLS_HEIGHT },
      // { left: 1700, top: this.TRACK_2_BASELINE - this.SAPPHIRE_CELLS_HEIGHT },
      // { left: 2056, top: this.TRACK_2_BASELINE - 3*this.SAPPHIRE_CELLS_HEIGHT/2 },
      // { left: 2333, top: this.TRACK_2_BASELINE - this.SAPPHIRE_CELLS_HEIGHT },
   ],

   // 蜗牛依附的平台位置............................................................

   this.snailData = [
      { platformIndex: 7 },
      { platformIndex: 15 },
      { platformIndex: 22 },
      { platformIndex: 30 },
      { platformIndex: 45 },
   ],

   // 跑步者元数据...........................................................

   // 向右跑步动画帧
   this.runnerCellsRight = [
      { left: 414, top: 385, width: 47, height: this.RUNNER_CELLS_HEIGHT },
      { left: 362, top: 385, width: 44, height: this.RUNNER_CELLS_HEIGHT },
      { left: 314, top: 385, width: 39, height: this.RUNNER_CELLS_HEIGHT },
      { left: 265, top: 385, width: 46, height: this.RUNNER_CELLS_HEIGHT },
      { left: 205, top: 385, width: 49, height: this.RUNNER_CELLS_HEIGHT },
      { left: 150, top: 385, width: 46, height: this.RUNNER_CELLS_HEIGHT },
      { left: 96,  top: 385, width: 42, height: this.RUNNER_CELLS_HEIGHT },
      { left: 45,  top: 385, width: 35, height: this.RUNNER_CELLS_HEIGHT },
      { left: 0,   top: 385, width: 35, height: this.RUNNER_CELLS_HEIGHT }
   ],

   // 向左跑步动画帧
   this.runnerCellsLeft = [
      { left: 0,   top: 305, width: 47, height: this.RUNNER_CELLS_HEIGHT },
      { left: 55,  top: 305, width: 44, height: this.RUNNER_CELLS_HEIGHT },
      { left: 107, top: 305, width: 39, height: this.RUNNER_CELLS_HEIGHT },
      { left: 152, top: 305, width: 46, height: this.RUNNER_CELLS_HEIGHT },
      { left: 208, top: 305, width: 49, height: this.RUNNER_CELLS_HEIGHT },
      { left: 265, top: 305, width: 46, height: this.RUNNER_CELLS_HEIGHT },
      { left: 320, top: 305, width: 42, height: this.RUNNER_CELLS_HEIGHT },
      { left: 380, top: 305, width: 35, height: this.RUNNER_CELLS_HEIGHT },
      { left: 425, top: 305, width: 35, height: this.RUNNER_CELLS_HEIGHT },
   ],

   
   // 精灵表各个精灵动画帧元数据................................................

   this.batCells = [
      { left: 1,   top: 0, width: 32, height: this.BAT_CELLS_HEIGHT },
      { left: 38,  top: 0, width: 46, height: this.BAT_CELLS_HEIGHT },
      { left: 90,  top: 0, width: 32, height: this.BAT_CELLS_HEIGHT },
      { left: 129, top: 0, width: 46, height: this.BAT_CELLS_HEIGHT },
   ],

   this.batRedEyeCells = [
      { left: 185, top: 0, width: 32, height: this.BAT_CELLS_HEIGHT },
      { left: 222, top: 0, width: 46, height: this.BAT_CELLS_HEIGHT },
      { left: 273, top: 0, width: 32, height: this.BAT_CELLS_HEIGHT },
      { left: 313, top: 0, width: 46, height: this.BAT_CELLS_HEIGHT },
   ],
   
   this.beeCells = [
      { left: 5,   top: 234, width: this.BEE_CELLS_WIDTH,
                            height: this.BEE_CELLS_HEIGHT },

      { left: 75,  top: 234, width: this.BEE_CELLS_WIDTH, 
                            height: this.BEE_CELLS_HEIGHT },

      { left: 145, top: 234, width: this.BEE_CELLS_WIDTH, 
                            height: this.BEE_CELLS_HEIGHT }
   ],
   
   this.buttonCells = [
      { left: 2,   top: 192, width: this.BUTTON_CELLS_WIDTH,
                            height: this.BUTTON_CELLS_HEIGHT },

      { left: 45,  top: 192, width: this.BUTTON_CELLS_WIDTH, 
                            height: this.BUTTON_CELLS_HEIGHT }
   ],

   this.coinCells = [
      { left: 2, top: 540, width: this.COIN_CELLS_WIDTH, height: this.COIN_CELLS_HEIGHT }
   ],

   this.explosionCells = [
      { left: 1,   top: 48, width: 50, height: this.EXPLOSION_CELLS_HEIGHT },
      { left: 60,  top: 48, width: 68, height: this.EXPLOSION_CELLS_HEIGHT },
      { left: 143, top: 48, width: 68, height: this.EXPLOSION_CELLS_HEIGHT },
      { left: 230, top: 48, width: 68, height: this.EXPLOSION_CELLS_HEIGHT },
      { left: 305, top: 48, width: 68, height: this.EXPLOSION_CELLS_HEIGHT },
      { left: 389, top: 48, width: 68, height: this.EXPLOSION_CELLS_HEIGHT },
      { left: 470, top: 48, width: 68, height: this.EXPLOSION_CELLS_HEIGHT }
   ],

   this.goldButtonCells = [
      { left: 88,   top: 190, width: this.BUTTON_CELLS_WIDTH,
                              height: this.BUTTON_CELLS_HEIGHT },

      { left: 130,  top: 190, width: this.BUTTON_CELLS_WIDTH,
                              height: this.BUTTON_CELLS_HEIGHT }
   ],

   this.rubyCells = [
      { left: 3,   top: 138, width: this.RUBY_CELLS_WIDTH,
                             height: this.RUBY_CELLS_HEIGHT },

      { left: 39,  top: 138, width: this.RUBY_CELLS_WIDTH, 
                             height: this.RUBY_CELLS_HEIGHT },

      { left: 76,  top: 138, width: this.RUBY_CELLS_WIDTH, 
                             height: this.RUBY_CELLS_HEIGHT },

      { left: 112, top: 138, width: this.RUBY_CELLS_WIDTH, 
                             height: this.RUBY_CELLS_HEIGHT },

      { left: 148, top: 138, width: this.RUBY_CELLS_WIDTH, 
                             height: this.RUBY_CELLS_HEIGHT }
   ],

   this.sapphireCells = [
      { left: 185,   top: 138, width: this.SAPPHIRE_CELLS_WIDTH,
                               height: this.SAPPHIRE_CELLS_HEIGHT },

      { left: 220,  top: 138, width: this.SAPPHIRE_CELLS_WIDTH, 
                               height: this.SAPPHIRE_CELLS_HEIGHT },

      { left: 258,  top: 138, width: this.SAPPHIRE_CELLS_WIDTH, 
                               height: this.SAPPHIRE_CELLS_HEIGHT },

      { left: 294, top: 138, width: this.SAPPHIRE_CELLS_WIDTH, 
                               height: this.SAPPHIRE_CELLS_HEIGHT },

      { left: 331, top: 138, width: this.SAPPHIRE_CELLS_WIDTH, 
                               height: this.SAPPHIRE_CELLS_HEIGHT }
   ],

   this.snailBombCells = [
      { left: 2, top: 512, width: 30, height: 20 }
   ],

   this.snailCells = [
      { left: 142, top: 466, width: this.SNAIL_CELLS_WIDTH,
                             height: this.SNAIL_CELLS_HEIGHT },

      { left: 75,  top: 466, width: this.SNAIL_CELLS_WIDTH, 
                             height: this.SNAIL_CELLS_HEIGHT },

      { left: 2,   top: 466, width: this.SNAIL_CELLS_WIDTH, 
                             height: this.SNAIL_CELLS_HEIGHT },
   ],

   // 精灵数组初始化...........................................................
  
   this.bats         = [],
   this.bees         = [], 
   this.buttons      = [],
   this.coins        = [],
   this.platforms    = [],
   this.rubies       = [],
   this.sapphires    = [],
   this.snails       = [],
   
   // 精灵实现方法 Artist...................................................

   this.runnerArtist = new SpriteSheetArtist(this.spritesheet,this.runnerCellsRight),

   // 接sprites.js的第三种实现精灵方法，直接描边填充法，适用于平台。
   this.platformArtist = {
      draw: function (sprite, context) {
         var top;
         
         context.save();

         top = snailBait.calculatePlatformTop(sprite.track);

         context.lineWidth = snailBait.PLATFORM_STROKE_WIDTH;
         context.strokeStyle = snailBait.PLATFORM_STROKE_STYLE;
         context.fillStyle = sprite.fillStyle;

         context.strokeRect(sprite.left, top, sprite.width, sprite.height);
         context.fillRect  (sprite.left, top, sprite.width, sprite.height);

         context.restore();
      }
   },

   // 精灵行为........................................................

   // 小人跑步行为...................................................

   // 大于动画运行速率，则调用advance()改变动画跑步帧      
   this.runBehavior = {
      lastAdvanceTime: 0,
      execute: function(sprite, time, fps) {
         if (sprite.runAnimationRate === 0) {
            return;
         }
         
         if (this.lastAdvanceTime === 0) {
            this.lastAdvanceTime = time;
         }
         else if (time - this.lastAdvanceTime > 1000 / sprite.runAnimationRate) {
            sprite.artist.advance();
            this.lastAdvanceTime = time;
         }
      }
   },

   // 小人跳跃行为..................................................

   this.jumpBehavior = {
      // 暂停跳跃
      pause: function (sprite) {
         if (sprite.ascendAnimationTimer.isRunning()) {
            sprite.ascendAnimationTimer.pause();
         }
         else if (!sprite.descendAnimationTimer.isRunning()) {
            sprite.descendAnimationTimer.pause();
         }
      },
      // 接触暂停
      unpause: function (sprite) {
         if (sprite.ascendAnimationTimer.isRunning()) {
            sprite.ascendAnimationTimer.unpause();
         }
         else if (sprite.descendAnimationTimer.isRunning()) {
            sprite.descendAnimationTimer.unpause();
         }
      },
      // 跳跃结束
      jumpIsOver: function (sprite) {
         return ! sprite.ascendAnimationTimer.isRunning() &&
                ! sprite.descendAnimationTimer.isRunning();
      },

      // 跳跃上升阶段...............................................................

      isAscending: function (sprite) {
         return sprite.ascendAnimationTimer.isRunning();
      },
      
      ascend: function (sprite) {
         var elapsed = sprite.ascendAnimationTimer.getElapsedTime(),
             deltaH  = elapsed / (sprite.JUMP_DURATION/2) * sprite.JUMP_HEIGHT;
         sprite.top = sprite.verticalLaunchPosition - deltaH;
      },

      isDoneAscending: function (sprite) {
         return sprite.ascendAnimationTimer.getElapsedTime() > sprite.JUMP_DURATION/2;
      },
      
      finishAscent: function (sprite) {
         sprite.jumpApex = sprite.top;
         sprite.ascendAnimationTimer.stop();
         sprite.descendAnimationTimer.start();
      },
      
      // 跳跃下降阶段.............................................................

      isDescending: function (sprite) {
         return sprite.descendAnimationTimer.isRunning();
      },

      descend: function (sprite, verticalVelocity, fps) {
         var elapsed = sprite.descendAnimationTimer.getElapsedTime(),
             deltaH  = elapsed / (sprite.JUMP_DURATION/2) * sprite.JUMP_HEIGHT;

         sprite.top = sprite.jumpApex + deltaH;
      },
      
      isDoneDescending: function (sprite) {
         return sprite.descendAnimationTimer.getElapsedTime() > sprite.JUMP_DURATION/2;
      },

      finishDescent: function (sprite) {
         sprite.stopJumping();

         if (snailBait.isOverPlatform(sprite) !== -1) {
            sprite.top = sprite.verticalLaunchPosition;
         }
         else {
            sprite.fall(snailBait.GRAVITY_FORCE *
                        (sprite.descendAnimationTimer.getElapsedTime()/1000) *
                        snailBait.PIXELS_PER_METER);
         }
      },
      
      // 控制函数..............................................................

      execute: function(sprite, time, fps) {
         if ( ! sprite.jumping || sprite.exploding) {
            return;
         }

         if (this.jumpIsOver(sprite)) {
            sprite.jumping = false;
            return;
         }

         if (this.isAscending(sprite)) {
            if ( ! this.isDoneAscending(sprite)) { this.ascend(sprite); }
            else                                 { this.finishAscent(sprite); }
         }
         else if (this.isDescending(sprite)) {
            if ( ! this.isDoneDescending(sprite)) { this.descend(sprite); }
            else                                  { this.finishDescent(sprite); }
         }
      } 
   },

   // 小人下坠行为..................................................

   this.fallBehavior = {
      // 是否已经跳出游戏（下坠到没有平台的位置）
      isOutOfPlay: function (sprite) {
         return sprite.top > snailBait.TRACK_1_BASELINE;
      },
      // 是否会下降到下一层平台（若跳跃高度已超过原所属平台高度）
      willFallBelowCurrentTrack: function (sprite, deltaY) {
         return sprite.top + sprite.height + deltaY >
                snailBait.calculatePlatformTop(sprite.track);
      },
      // 跌回所属平台
      fallOnPlatform: function (sprite) {
         sprite.top = snailBait.calculatePlatformTop(sprite.track) - sprite.height;
         sprite.stopFalling();
         snailBait.playSound(snailBait.thudSound);
      },
      // 设置精灵当前垂直速度
      setSpriteVelocity: function (sprite) {
         var fallingElapsedTime;

         sprite.velocityY = sprite.initialVelocityY + snailBait.GRAVITY_FORCE *
                            (sprite.fallAnimationTimer.getElapsedTime()/1000) *
                            snailBait.PIXELS_PER_METER;
      },
      // 计算垂直下降的实际速度
      calculateVerticalDrop: function (sprite, fps) {
         return sprite.velocityY / fps;
      },
      // 是否在平台上
      isPlatformUnderneath: function (sprite) {
         return snailBait.isOverPlatform(sprite) !== -1;
      },
      
      execute: function (sprite, time, fps) {
         var deltaY;

         if (sprite.jumping) {
            return;
         }

         if (this.isOutOfPlay(sprite) || sprite.exploding) {
            if (sprite.falling) {
               sprite.stopFalling();
            }
            return;
         }
         
         if (!sprite.falling) {
            if (!sprite.exploding && !this.isPlatformUnderneath(sprite)) {
               sprite.fall();
            }
            return;
         }
         // 设置垂直速度，并计算转化过来的垂直位移
         this.setSpriteVelocity(sprite);
         deltaY = this.calculateVerticalDrop(sprite, fps);
               
         // 不会掉到下一级
         if (!this.willFallBelowCurrentTrack(sprite, deltaY)) {
            sprite.top += deltaY;
         }
         // 会调到下一级
         else { 
            // 跳回所属平台
            if (this.isPlatformUnderneath(sprite)) {
               this.fallOnPlatform(sprite);
               sprite.stopFalling();
            }
            // 跳到下一级平台
            else {
               sprite.track--;

               sprite.top += deltaY;

               if (sprite.track === 0) {
                  snailBait.playSound(snailBait.fallingWhistleSound);
               }
            }
         }
      }
   },

   // 小人碰撞检测...............................................

   this.collideBehavior = {
      execute: function (sprite, time, fps, context) {
         var otherSprite;

         for (var i=0; i < snailBait.sprites.length; ++i) { 
            otherSprite = snailBait.sprites[i];

            if (this.isCandidateForCollision(sprite, otherSprite)) {
               if (this.didCollide(sprite, otherSprite, context)) { 
                  this.processCollision(sprite, otherSprite);
                  this.updateScore();
               }
            }
         }
      },
      // 判断是否可能会发生碰撞
      isCandidateForCollision: function (sprite, otherSprite) {
         return sprite !== otherSprite &&
                sprite.visible && otherSprite.visible &&
                !sprite.exploding && !otherSprite.exploding &&
                otherSprite.left - otherSprite.offset < sprite.left + sprite.width;
      }, 
      // 碰撞情况1：与蜗牛子弹碰撞，以子弹为检测中心，检测是否会和小人重叠
      // 方式：先描路径rect()，再用isPointInPath()判断是否在路径中
      didSnailBombCollideWithRunner: function (left, top, right, bottom,
                                         snailBomb, context) {

         context.beginPath();
         context.rect(left, top, right - left, bottom - top);

         return context.isPointInPath(
                       snailBomb.left - snailBomb.offset + snailBomb.width/2,
                       snailBomb.top + snailBomb.height/2);
      },
      // 碰撞情况2：与其他精灵碰撞，以小人为检测中心，检测是否会和其他精灵重叠
      didRunnerCollideWithOtherSprite: function (left, top, right, bottom,
                                                 centerX, centerY,
                                                 otherSprite, context) {
         context.beginPath();
         context.rect(otherSprite.left - otherSprite.offset, otherSprite.top,
                      otherSprite.width, otherSprite.height);
         
         return context.isPointInPath(left,    top)     ||
                context.isPointInPath(right,   top)     ||

                context.isPointInPath(centerX, centerY) ||

                context.isPointInPath(left,    bottom)  ||
                context.isPointInPath(right,   bottom);
      },
      // 碰撞检测
      didCollide: function (sprite, otherSprite, context) {
         var MARGIN_TOP = 15,
             MARGIN_LEFT = 15,
             MARGIN_RIGHT = 15,
             MARGIN_BOTTOM = 0;
         if ('platform'  === otherSprite.type){
            MARGIN_TOP = 0;
            MARGIN_LEFT = 0;
            MARGIN_RIGHT = 0;
         }
         var left = sprite.left + sprite.offset + MARGIN_LEFT,
             right = sprite.left + sprite.offset + sprite.width - MARGIN_RIGHT,
             top = sprite.top + MARGIN_TOP,
             bottom = sprite.top + sprite.height - MARGIN_BOTTOM,
             centerX = left + sprite.width/2,
             centerY = sprite.top + sprite.height/2;

         if (otherSprite.type === 'snail bomb') {
            return this.didSnailBombCollideWithRunner(left, top, right, bottom,
                                                otherSprite, context);
         }
         else {
            return this.didRunnerCollideWithOtherSprite(left, top, right, bottom,
                                                  centerX, centerY,
                                                  otherSprite, context);
         }
      },
      // 碰撞的处理方法
      processCollision: function (sprite, otherSprite) {
         // 碰撞的得分处理
         if (otherSprite.value) {
            snailBait.totalValue = parseInt(snailBait.totalValue) + otherSprite.value;
         }
         // 碰撞到按钮
         if ('button' === otherSprite.type && (sprite.falling || sprite.jumping)) {
            otherSprite.visible = false;
            snailBait.playSound(snailBait.plopSound);
         }
         // 碰撞到金币、蓝宝石、红宝石、蜗牛炸弹
         if ('coin'  === otherSprite.type    ||
             'sapphire' === otherSprite.type ||
             'ruby' === otherSprite.type     || 
             'snail bomb' === otherSprite.type) {
            otherSprite.visible = false;

            if ('coin' === otherSprite.type) {
               snailBait.playSound(snailBait.coinSound);
            }
            if ('sapphire' === otherSprite.type || 'ruby' === otherSprite.type) {
               snailBait.playSound(snailBait.chimesSound);
            }
         }
         // 碰撞到蝙蝠、蜜蜂、蜗牛、炸弹
         if ('bat' === otherSprite.type   ||
             'bee' === otherSprite.type   ||
             'snail' === otherSprite.type || 
             'snail bomb' === otherSprite.type) {
            snailBait.explode(sprite);
         }
         // 碰撞到平台
         if (sprite.jumping && 'platform' === otherSprite.type) {
            this.processPlatformCollisionDuringJump(sprite, otherSprite);
         }
      },
      // 碰撞到平台，则下坠
      processPlatformCollisionDuringJump: function (sprite, platform) {
         var isDescending = sprite.descendAnimationTimer.isRunning();

         // 若下落时候碰撞到平台，则停在平台中
         if (isDescending) {
            sprite.stopJumping();
            sprite.track = platform.track; 
            sprite.top = snailBait.calculatePlatformTop(sprite.track) - sprite.height;
            snailBait.playSound(snailBait.plopSound);
         }
      },
      updateScore: function(){
         score.innerHTML = snailBait.totalValue;
      }
   };

   // 踱步行为...................................................

   this.paceBehavior = {
      execute: function (sprite, time, fps) {
         var sRight = sprite.left + sprite.width,
             pRight = sprite.platform.left + sprite.platform.width,
             pixelsToMove = sprite.velocityX / fps;

         if (sprite.direction === undefined) {
            sprite.direction = snailBait.RIGHT;
         }

         // 蜗牛或精灵的踱步
         if (sprite.velocityX === 0) {
            if (sprite.type === 'snail') {
               sprite.velocityX = snailBait.SNAIL_PACE_VELOCITY;
            }
            else {
               sprite.velocityX = snailBait.BUTTON_PACE_VELOCITY;
            }
         }

         if (sRight > pRight && sprite.direction === snailBait.RIGHT) {
            sprite.direction = snailBait.LEFT;
         }
         else if (sprite.left < sprite.platform.left &&
                  sprite.direction === snailBait.LEFT) {
            sprite.direction = snailBait.RIGHT;
         }

         if (sprite.direction === snailBait.RIGHT) {
            sprite.left += pixelsToMove;
         }
         else {
            sprite.left -= pixelsToMove;
         }
      }
   };

   // 蜗牛发射子弹行为....................................................

   this.snailShootBehavior = { // sprite is the snail
      execute: function (sprite, time, fps) {
         var bomb = sprite.bomb;

         if (!snailBait.spriteInView(sprite)) {
            return;
         }

         if (! bomb.visible && sprite.artist.cellIndex === 2) {
            bomb.left = sprite.left;
            bomb.visible = true;
         }
      }
   };
   // 蜗牛子弹移动行为
   this.snailBombMoveBehavior = {
      execute: function(sprite, time, fps) {
         if (sprite.visible && snailBait.spriteInView(sprite)) {
            sprite.left -= snailBait.SNAIL_BOMB_VELOCITY / fps;
         }

         if (!snailBait.spriteInView(sprite)) {
            sprite.visible = false;
         }
      }
   };

   // 精灵初始化...........................................................

   // 跑步小人定义
   this.runner = new Sprite('runner',           // type
                            this.runnerArtist,  // artist
                            [ this.runBehavior, // behaviors
                              this.jumpBehavior,
                              this.fallBehavior,
                              this.collideBehavior
                            ]); 

   this.runner.width = this.RUNNER_CELLS_WIDTH;
   this.runner.height = this.RUNNER_CELLS_HEIGHT;

   // 精灵数组
   this.sprites = [ this.runner ];  

   // 爆炸动画初始化
   this.explosionAnimator = new SpriteAnimator(
      this.explosionCells,
      this.EXPLOSION_DURATION,

      function (sprite, animator) {
         sprite.exploding = false; 

         if (sprite.jumping) {
            sprite.stopJumping();
         }
         else if (sprite.falling) {
            sprite.stopFalling();
         }

         sprite.visible = true;
         sprite.track = 1;
         sprite.top = snailBait.calculatePlatformTop(sprite.track) - sprite.height;
         sprite.artist.cellIndex = 0;
         sprite.runAnimationRate = snailBait.RUN_ANIMATION_RATE;
      }
   );
};

// SnailBait原型方法定义 --------------------------------------------------

SnailBait.prototype = {

   // 总动画描绘方法..............................................................
   draw: function (now) {
      // 设置平台速度
      this.setPlatformVelocity();
      // 设置位移
      this.setTranslationOffsets();
      // 描绘背景
      this.drawBackground();
      // 更新精灵（基于时间）
      this.updateSprites(now);
      // 描绘精灵
      this.drawSprites();
   },
   // 设置平台速度
   setPlatformVelocity: function () {
      this.platformVelocity = this.bgVelocity * this.PLATFORM_VELOCITY_MULTIPLIER; 
   },
   // 设置位移
   setTranslationOffsets: function () {
      this.setBackgroundTranslationOffset();
      this.setSpriteTranslationOffsets();
   },
   // 设置精灵位移
   setSpriteTranslationOffsets: function () {
      var i, sprite;
   
      this.spriteOffset += this.platformVelocity / this.fps; // In step with platforms

      for (i=0; i < this.sprites.length; ++i) {
         sprite = this.sprites[i];
      
         if ('runner' !== sprite.type) {
            sprite.offset = this.spriteOffset; 
         }
      }
   },
   // 设置背景位移
   setBackgroundTranslationOffset: function () {
      var offset = this.backgroundOffset + this.bgVelocity/this.fps;
   
      if (offset > 0 && offset < this.background.width) {
         this.backgroundOffset = offset;
      }
      else {
         this.backgroundOffset = 0;
      }
   },
   // 描绘背景
   drawBackground: function () {
      this.context.save();
   
      this.context.globalAlpha = 1.0;
      this.context.translate(-this.backgroundOffset, 0);
   
      // 主屏背景
      this.context.drawImage(this.background, 0, 0,
                        this.background.width, this.background.height);
   
      // 次屏背景
      this.context.drawImage(this.background, this.background.width, 0,
                        this.background.width+1, this.background.height);
   
      this.context.restore();
   },
   // 计算fps 帧速率
   calculateFps: function (now) {
      var fps = 1000 / (now - this.lastAnimationFrameTime);
      this.lastAnimationFrameTime = now;
   
      if (now - this.lastFpsUpdateTime > 1000) {
         this.lastFpsUpdateTime = now;
         this.fpsElement.innerHTML = fps.toFixed(0) + ' fps';
      }

      return fps; 
   },
   // 计算三级平台高度
   calculatePlatformTop: function (track) {
      var top;
   
      if      (track === 1) { top = this.TRACK_1_BASELINE; }
      else if (track === 2) { top = this.TRACK_2_BASELINE; }
      else if (track === 3) { top = this.TRACK_3_BASELINE; }

      return top;
   },
   // 小人转左
   turnLeft: function () {
      this.bgVelocity = -this.BACKGROUND_VELOCITY;
      this.runner.runAnimationRate = this.RUN_ANIMATION_RATE;
      this.runnerArtist.cells = this.runnerCellsLeft;
      this.runner.direction = this.LEFT;
   },
   // 小人转右   
   turnRight: function () {
      this.bgVelocity = this.BACKGROUND_VELOCITY;
      this.runner.runAnimationRate = this.RUN_ANIMATION_RATE;
      this.runnerArtist.cells = this.runnerCellsRight;
      this.runner.direction = this.RIGHT;
   },

   // 准备小人行为
   equipRunner: function () {
      
      this.runner.runAnimationRate = this.RUN_ANIMATION_INITIAL_RATE,
   
      this.runner.track = this.INITIAL_RUNNER_TRACK;
      this.runner.direction = this.LEFT;
      this.runner.velocityX = this.INITIAL_RUNNER_VELOCITY;
      this.runner.left = this.INITIAL_RUNNER_LEFT;
      this.runner.top = this.calculatePlatformTop(this.runner.track) -
                        this.RUNNER_CELLS_HEIGHT;

      this.runner.artist.cells = this.runnerCellsRight;
      this.runner.offset = 0;

      this.equipRunnerForJumping();
      this.equipRunnerForFalling();
   },
   // 准备下降行为
   equipRunnerForFalling: function () {
      this.runner.falling = false;
      this.runner.fallAnimationTimer = new AnimationTimer();

      this.runner.fall = function (initialVelocity) {
         this.velocityY = initialVelocity || 0;
         this.initialVelocityY = initialVelocity || 0;
         this.fallAnimationTimer.start();
         this.falling = true;
      }

      this.runner.stopFalling = function () {
         this.falling = false;
         this.velocityY = 0;
         this.fallAnimationTimer.stop();
      }
   },
   // 准备跳跃行为
   equipRunnerForJumping: function () {
      this.runner.JUMP_DURATION = this.RUNNER_JUMP_DURATION; // milliseconds
      this.runner.JUMP_HEIGHT = this.RUNNER_JUMP_HEIGHT;

      this.runner.jumping = false;

      this.runner.ascendAnimationTimer =
         new AnimationTimer(this.runner.JUMP_DURATION/2,
                            AnimationTimer.makeEaseOutTransducer(1.1));

      this.runner.descendAnimationTimer =
         new AnimationTimer(this.runner.JUMP_DURATION/2,
                            AnimationTimer.makeEaseInTransducer(1.1));

      this.runner.stopJumping = function () {
         this.jumping = false;
         this.ascendAnimationTimer.stop();
         this.descendAnimationTimer.stop();
         this.runAnimationRate = snailBait.RUN_ANIMATION_RATE;
      };
      
      this.runner.jump = function () {
         if (this.jumping) // 'this' is the runner
            return;

         this.runAnimationRate = 0;
         this.jumping = true;
         this.verticalLaunchPosition = this.top;
         this.ascendAnimationTimer.start();

         snailBait.playSound(snailBait.jumpWhistleSound);
      };
   },
   // 创建平台
   createPlatformSprites: function () {
      var sprite, pd
   
      for (var i=0; i < this.platformData.length; ++i) {
         pd = this.platformData[i];
         sprite  = new Sprite('platform', this.platformArtist);

         sprite.left      = pd.left;
         sprite.width     = pd.width;
         sprite.height    = pd.height;
         sprite.fillStyle = pd.fillStyle;
         sprite.opacity   = pd.opacity;
         sprite.track     = pd.track;
         sprite.button    = pd.button;
         sprite.pulsate   = pd.pulsate;

         sprite.top = this.calculatePlatformTop(pd.track);
   
         if (sprite.pulsate) {
            sprite.behaviors = [ new PulseBehavior(1000, 0.5) ];
         }

         this.platforms.push(sprite);
      }
   },
   // 爆炸
   explode: function (sprite, silent) {
      if (sprite.runAnimationRate === 0) {
         sprite.runAnimationRate = this.RUN_ANIMATION_RATE;
      }
               
      sprite.exploding = true;

      this.playSound(this.explosionSound);
      this.explosionAnimator.start(sprite, true);  // true means sprite reappears
   },

   // 动画............................................................
   // 动画开启
   animate: function (now) { 
      if (snailBait.paused) {
         setTimeout( function () {
            requestNextAnimationFrame(snailBait.animate);
         }, snailBait.PAUSED_CHECK_INTERVAL);
      }
      else {
         snailBait.fps = snailBait.calculateFps(now); 
         snailBait.draw(now);
         requestNextAnimationFrame(snailBait.animate);
      }
   },
   // 切换所有行为的暂停状态
   togglePausedStateOfAllBehaviors: function () {
      var behavior;
   
      for (var i=0; i < this.sprites.length; ++i) { 
         sprite = this.sprites[i];

         for (var j=0; j < sprite.behaviors.length; ++j) { 
            behavior = sprite.behaviors[j];

            if (this.paused) {
               if (behavior.pause) {
                  behavior.pause(sprite);
               }
            }
            else {
               if (behavior.unpause) {
                  behavior.unpause(sprite);
               }
            }
         }
      }
   },
   // 切换暂停状态
   togglePaused: function () {
      var now = +new Date();

      this.paused = !this.paused;
      this.togglePausedStateOfAllBehaviors();
   
      if (this.paused) {
         this.pauseStartTime = now;
      }
      else {
         this.lastAnimationFrameTime += (now - this.pauseStartTime);
      }

      if (this.paused && this.musicOn) {
         this.soundtrack.pause();
      }
      else if (!this.paused && this.musicOn) {
         this.soundtrack.play();
      }
   },

   // 音效控制.......................................................
   // 是否在播放音效
   soundIsPlaying: function (sound) {
      return !sound.ended && sound.currentTime > 0;
   },
   // 播放音效
   playSound: function (sound) {
      var track, index;

      if (this.soundOn) {
         if (!this.soundIsPlaying(sound)) {
            sound.play();
         }
         else {
            for (i=0; index < this.audioTracks.length; ++index) {
               track = this.audioTracks[index];
            
               if (!this.soundIsPlaying(track)) {
                  track.src = sound.currentSrc;
                  track.load();
                  track.volume = sound.volume;
                  track.play();

                  break;
               }
            }
         }              
      }
   },
   // 初始化音效的大小
   initializeSounds: function () {
      this.soundtrack.volume          = this.SOUNDTRACK_VOLUME;
      this.jumpWhistleSound.volume    = this.JUMP_WHISTLE_VOLUME;
      this.thudSound.volume           = this.THUD_VOLUME;
      this.fallingWhistleSound.volume = this.FALLING_WHISTLE_VOLUME;
      this.chimesSound.volume         = this.CHIMES_VOLUME;
      this.explosionSound.volume      = this.EXPLOSION_VOLUME;
      this.coinSound.volume           = this.COIN_VOLUME;
   },


   // ------------------------- 初始化 ----------------------------
   // 开始游戏
   start: function () {
      // 创建平台数据
      this.initPlatform.execute();
      // 创建精灵
      this.createSprites();
      // 初始化图像
      this.initializeImages();
      // 初始化声音
      this.initializeSounds();
      // 准备小人
      this.equipRunner();
      // 提示
      this.splashToast('Good Luck!');
      // 减弱指令提示
      document.getElementById('instructions').style.  opacity =
         snailBait.INSTRUCTIONS_OPACITY;
   },
   // 初始化图像
   initializeImages: function () {
      var self = this;

      this.background.src = 'images/background_level_one_dark_red.png';
      this.spritesheet.src = 'images/spritesheet.png';
   
      this.background.onload = function (e) {
         self.startGame();
      };
   },
   // 开启游戏
   startGame: function () {
      if (this.musicOn) {
         this.soundtrack.play();
      }
      requestNextAnimationFrame(this.animate);
   },
   // 精灵定位
   positionSprites: function (sprites, spriteData) {
      var sprite;

      for (var i = 0; i < sprites.length; ++i) {
         sprite = sprites[i];

         if (spriteData[i].platformIndex) { 
            this.putSpriteOnPlatform(sprite,
               this.platforms[spriteData[i].platformIndex]);
         }
         else {
            sprite.top  = spriteData[i].top;
            sprite.left = spriteData[i].left;
         }
      }
   },
   // 准备蜗牛和蜗牛子弹
   armSnails: function () {
      var snail,
          snailBombArtist = new SpriteSheetArtist(this.spritesheet, this.snailBombCells);

      for (var i=0; i < this.snails.length; ++i) {
         snail = this.snails[i];
         // 子弹减10分
         snail.bomb = new Sprite('snail bomb',
                                  snailBombArtist,
                                  [ this.snailBombMoveBehavior ],snailBait.BOMB_VALUE);

         snail.bomb.width  = snailBait.SNAIL_BOMB_CELLS_WIDTH;
         snail.bomb.height = snailBait.SNAIL_BOMB_CELLS_HEIGHT;

         snail.bomb.top = snail.top + snail.bomb.height/2;
         snail.bomb.left = snail.left + snail.bomb.width/2;
         snail.bomb.visible = false;

         snail.bomb.snail = snail;  // Snail bombs maintain a reference to their snail

         this.sprites.push(snail.bomb);
      }
   },
   
   // 把精灵放进精灵数组
   addSpritesToSpriteArray: function () {
      for (var i=0; i < this.platforms.length; ++i) {
         this.sprites.push(this.platforms[i]);
      }

      for (var i=0; i < this.bats.length; ++i) {
         this.sprites.push(this.bats[i]);
      }

      for (var i=0; i < this.bees.length; ++i) {
         this.sprites.push(this.bees[i]);
      }

      for (var i=0; i < this.buttons.length; ++i) {
         this.sprites.push(this.buttons[i]);
      }

      for (var i=0; i < this.coins.length; ++i) {
         this.sprites.push(this.coins[i]);
      }

      for (var i=0; i < this.rubies.length; ++i) {
         this.sprites.push(this.rubies[i]);
      }

      for (var i=0; i < this.sapphires.length; ++i) {
         this.sprites.push(this.sapphires[i]);
      }

     for (var i=0; i < this.snails.length; ++i) {
         this.sprites.push(this.snails[i]);
      }
   },
   // 创建蝙蝠精灵
   createBatSprites: function () {
      var bat,
          batArtist = new SpriteSheetArtist(this.spritesheet, this.batCells),
    redEyeBatArtist = new SpriteSheetArtist(this.spritesheet, this.batRedEyeCells);

      for (var i = 0; i < this.batData.length; ++i) {
         // 蝙蝠减5分
         if (i % 2 === 0) bat = new Sprite('bat', batArtist, [ new CycleBehavior(100) ], snailBait.BAT_VALUE);
         else             bat = new Sprite('bat', redEyeBatArtist, [ new CycleBehavior(100) ], snailBait.BAT_VALUE);

         bat.width = this.batCells[1].width;
         bat.height = this.BAT_CELLS_HEIGHT;

         this.bats.push(bat);
      }
   },
   // 创建蜜蜂精灵
   createBeeSprites: function () {
      var bee,
          beeArtist;

      for (var i = 0; i < this.beeData.length; ++i) {
         // 蜜蜂减5分
         bee = new Sprite('bee',
                          new SpriteSheetArtist(this.spritesheet, this.beeCells),
                          [ new CycleBehavior(100) ],
                          snailBait.BEE_VALUE);

         bee.width = this.BEE_CELLS_WIDTH;
         bee.height = this.BEE_CELLS_HEIGHT;

         this.bees.push(bee);
      }
   },
   // 创建按钮精灵
   createButtonSprites: function () {
      var button,
          buttonArtist = new SpriteSheetArtist(this.spritesheet,
                                               this.buttonCells),
      goldButtonArtist = new SpriteSheetArtist(this.spritesheet,
                                               this.goldButtonCells);

      for (var i = 0; i < this.buttonData.length; ++i) {
         if (i === this.buttonData.length - 1) {
            button = new Sprite('button',
                                 goldButtonArtist,
                                 [ this.paceBehavior ],
                                 snailBait.BUTTON_VALUE);
         }
         else {
            button = new Sprite('button',
                                 buttonArtist, 
                                 [ this.paceBehavior ],
                                 snailBait.BUTTON_VALUE);
         }

         button.width = this.BUTTON_CELLS_WIDTH;
         button.height = this.BUTTON_CELLS_HEIGHT;

         this.buttons.push(button);
      }
   },
   // 创建金币精灵
   createCoinSprites: function () {
      var coin,
          coinArtist = new SpriteSheetArtist(this.spritesheet, this.coinCells);
   
      for (var i = 0; i < this.coinData.length; ++i) {
         //金币得2分
         coin = new Sprite('coin', coinArtist, [], snailBait.COIN_VALUE);

         coin.width = this.COIN_CELLS_WIDTH;
         coin.height = this.COIN_CELLS_HEIGHT;

         this.coins.push(coin);
      }
   },
   // 创建蓝宝石精灵
   createSapphireSprites: function () {
      var sapphire,
          sapphireArtist = new SpriteSheetArtist(this.spritesheet, this.sapphireCells);
   
      for (var i = 0; i < this.sapphireData.length; ++i) {
         // 蓝宝石得5分
         sapphire = new Sprite('sapphire', sapphireArtist,
                               [ new CycleBehavior(this.SAPPHIRE_SPARKLE_DURATION,this.SAPPHIRE_SPARKLE_INTERVAL),
                                 new BounceBehavior()
                               ],snailBait.SAPPHIRE_VALUE);

         sapphire.width = this.SAPPHIRE_CELLS_WIDTH;
         sapphire.height = this.SAPPHIRE_CELLS_HEIGHT;

         this.sapphires.push(sapphire);
      }
   },
   // 创建红宝石精灵
   createRubySprites: function () {
      var ruby,
          rubyArtist = new SpriteSheetArtist(this.spritesheet, this.rubyCells);
   
      for (var i = 0; i < this.rubyData.length; ++i) {
         // 红宝石得10分
         ruby = new Sprite('ruby', rubyArtist, 
                           [ 
                           new CycleBehavior(this.RUBY_SPARKLE_DURATION,this.RUBY_SPARKLE_INTERVAL) 
                           ],snailBait.RUBY_VALUE);
         ruby.width = this.RUBY_CELLS_WIDTH;
         ruby.height = this.RUBY_CELLS_HEIGHT;
         
         this.rubies.push(ruby);
      }
   },
   // 创建蜗牛精灵
   createSnailSprites: function () {
      var snail,
          snailArtist = new SpriteSheetArtist(this.spritesheet, this.snailCells);
   
      for (var i = 0; i < this.snailData.length; ++i) {
         // 蜗牛减10分
         snail = new Sprite('snail',
                            snailArtist,
                            [ this.paceBehavior,
                              this.snailShootBehavior,
                              new CycleBehavior(300, 1500)
                            ],snailBait.SNAIL_VALUE);

         snail.width  = this.SNAIL_CELLS_WIDTH;
         snail.height = this.SNAIL_CELLS_HEIGHT;

         this.snails.push(snail);
      }
   },
   // 更新精灵状态
   updateSprites: function (now) {
      var sprite;
   
      for (var i=0; i < this.sprites.length; ++i) {
         sprite = this.sprites[i];

         if (sprite.visible && this.spriteInView(sprite)) {
            sprite.update(now, this.fps, this.context);
         }
      }
   },
   // 绘制精灵
   drawSprites: function() {
      var sprite;
   
      for (var i=0; i < this.sprites.length; ++i) {
         sprite = this.sprites[i];

         if (sprite.visible && this.spriteInView(sprite)) {
            this.context.translate(-sprite.offset, 0);

            sprite.draw(this.context);

            this.context.translate(sprite.offset, 0);
         }
      }
   },
   // 判断精灵是否在当前屏幕
   spriteInView: function(sprite) {
      return sprite === this.runner ||
         (sprite.left + sprite.width > this.spriteOffset &&
          sprite.left < this.spriteOffset + this.canvas.width);   
   },
   // 是否在任一平台上方
   isOverPlatform: function (sprite, track) {
      var p,
          index = -1,
          center = sprite.left + sprite.offset + sprite.width/2;

      if (track === undefined) { 
         track = sprite.track;
      }

      for (var i=0; i < snailBait.platforms.length; ++i) {
         p = snailBait.platforms[i];

         if (track === p.track) {
            if (center > p.left - p.offset && center < (p.left - p.offset + p.width)) {
               index = i;
               break;
            }
         }
      }
      return index;
   },
   // 把精灵放在平台上
   putSpriteOnPlatform: function(sprite, platformSprite) {
      var difTop = 0, difLeft = 0;
      if ('coin'  === sprite.type    ||
          'sapphire' === sprite.type ||
          'ruby' === sprite.type) 
      {
         difTop = Math.floor(Math.random()*30);
         difLeft = Math.floor(Math.random()*50);
      }
      if ('bee'  === sprite.type    ||
          'bat' === sprite.type)
      {
         // 若平台小于100，则不放置蝙蝠或蜜蜂
         if(platformSprite.width < 150){
            sprite.visible = !sprite.visible;
            return false;
         }
         difTop = Math.floor(Math.random()*15);
         difLeft = Math.floor(Math.random()*20+75);
      }

      if ('snail'  === sprite.type)
      {
         // 若平台小于100，则不放置蜗牛
         if(platformSprite.width < 150){
            sprite.visible = !sprite.visible;
            return false;
         }
      }

      sprite.top  = platformSprite.top - sprite.height-difTop;
      sprite.left = platformSprite.left + difLeft;
      sprite.platform = platformSprite;
   },
   // 创建精灵
   createSprites: function() {  
      // 需要先创建好平台
      this.createPlatformSprites();
      
      this.createBatSprites();
      this.createBeeSprites();
      this.createButtonSprites();
      this.createCoinSprites();
      this.createRubySprites();
      this.createSapphireSprites();
      this.createSnailSprites();

      this.initializeSprites();

      this.addSpritesToSpriteArray();
   },
   // 初始化精灵，包括定位和蜗牛上子弹
   initializeSprites: function() {  
      for (var i=0; i < snailBait.sprites.length; ++i) { 
         snailBait.sprites[i].offset = 0;
      }

      this.positionSprites(this.bats,       this.batData);
      this.positionSprites(this.bees,       this.beeData);
      this.positionSprites(this.buttons,    this.buttonData);
      this.positionSprites(this.coins,      this.coinData);
      this.positionSprites(this.rubies,     this.rubyData);
      this.positionSprites(this.sapphires,  this.sapphireData);
      this.positionSprites(this.snails,     this.snailData);

      this.armSnails();
   },

   // 提示................................................................
   // 输出提示
   splashToast: function (text, howLong) {
      howLong = howLong || this.DEFAULT_TOAST_TIME;

      toast.style.display = 'block';
      toast.innerHTML = text;

      setTimeout( function (e) {
         if (snailBait.windowHasFocus) {
            toast.style.opacity = 1.0; // After toast is displayed
         }
      }, 50);

      setTimeout( function (e) {
         if (snailBait.windowHasFocus) {
            toast.style.opacity = 0; // Starts CSS3 transition
         }

         setTimeout( function (e) { 
            if (snailBait.windowHasFocus) {
               toast.style.display = 'none'; 
            }
         }, 480);
      }, howLong);
   },
};
   
// 键盘控制响应.......................................................
   
window.onkeydown = function (e) {
   var key = e.keyCode;

   if (key === 80 || (snailBait.paused && key !== 80)) {  // 'p'
      snailBait.togglePaused();
   }
   
   if (key === 68 || key === 37) { // 'd' or left arrow
      snailBait.turnLeft();
   }
   else if (key === 75 || key === 39) { // 'k' or right arrow
      snailBait.turnRight();
   }
   else if (key === 74) { // 'j'
      if (!snailBait.runner.jumping && !snailBait.runner.falling) {
         snailBait.runner.jump();
      }
   }
};
// 丢失窗口焦点
window.onblur = function (e) {  // pause if unpaused
   snailBait.windowHasFocus = false;
   
   if (!snailBait.paused) {
      snailBait.togglePaused();
   }
};
// 聚焦窗口焦点
window.onfocus = function (e) {  // unpause if paused
   var originalFont = snailBait.toast.style.fontSize;

   snailBait.windowHasFocus = true;

   if (snailBait.paused) {
      snailBait.toast.style.font = '128px fantasy';

      snailBait.splashToast('3', 500); // Display 3 for one half second

      setTimeout(function (e) {
         snailBait.splashToast('2', 500); // Display 2 for one half second

         setTimeout(function (e) {
            snailBait.splashToast('1', 500); // Display 1 for one half second

            setTimeout(function (e) {
               if ( snailBait.windowHasFocus) {
                  snailBait.togglePaused();
               }

               setTimeout(function (e) { // Wait for '1' to disappear
                  snailBait.toast.style.fontSize = originalFont;
               }, 2000);
            }, 1000);
         }, 1000);
      }, 1000);
   }
};

// 启动游戏.........................................................

var snailBait = new SnailBait();
snailBait.start();

// 改编声音按钮............................................

snailBait.soundCheckbox.onchange = function (e) {
   snailBait.soundOn = snailBait.soundCheckbox.checked;
};

snailBait.musicCheckbox.onchange = function (e) {
   snailBait.musicOn = snailBait.musicCheckbox.checked;

   if (snailBait.musicOn) {
      snailBait.soundtrack.play();
   }
   else {
      snailBait.soundtrack.pause();
   }
};
