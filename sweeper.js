/**
 *	扫雷 version1
 * 
 * 1、点击的时候判断当前元素周围8个位置雷的个数
 * 2、时间。雷的数量	
 * 
 */

let sweeper = {
	TIMER:null,//定时器
	TIME:null,//玩的时间
	TOTAL_MINE:null,//总的雷数,
	GAME_STATUS:0,//游戏状态 0表示结束  1表示暂停 2表示正在玩  
	COL_NUM:16,//扫雷中水平方向雷的个数
	ROW_NUM:16,//扫雷中垂直方向雷的个数
	REMAINING_NUM:0,//剩余的雷的数量
	boxContainer:'',
	MineArr:'',
	timeEle:"",
	mineEle:"",
	init(){//初始化方法
		this.timeEle = $("#time");
		this.mineEle = $("#mineEle");
		this.boxContainer = $(".box-container");

		this.TIME = 0;
		this.TOTAL_MINE = 40;
		this.REMAINING_NUM = 40;


		this.MineArr = [];

        for(let i = 0;i<this.COL_NUM;i++){
        	this.MineArr[i] = [];
            for(let j = 0;j<this.ROW_NUM;j++){
                this.MineArr[i][j] = 0;
            }
        }


        this.initMine();

        this.drawPage();

        // this.initNum();
		this.initTime();

		this.mineEle.html("总雷数 "+this.REMAINING_NUM+" 个");


		$("#begin").on("click",function(){
			this.GAME_STATUS = 2;
            this.TIME = 0;
            clearInterval(this.TIMER);
			this.init();
		}.bind(this));

		//TODO
		$("#pause").on("click",function(){

			if(this.GAME_STATUS == 1){
                clearInterval(this.TIMER);
            }else{
                this.GAME_STATUS = 2;
			}
		}.bind(this));


		$(".box-col").on("click",function(e){
			let ele = e.target;
			let i = Number(ele.dataset.col);
			let j = Number(ele.dataset.row);

			this.initNum(i,j)

		}.bind(this));
	},
	//生成雷
	initMine(){
        let index = 0;
        while(index<this.TOTAL_MINE){
        	let i = this.randomNum(this.COL_NUM);
        	let j = this.randomNum(this.ROW_NUM);
            if(this.MineArr[i][j]==0){

				this.MineArr[i][j] = 1;
                index++;
            }

        }
    },
	randomNum(num){
		return Math.floor(Math.random()*num);
	},
	//画页面
	drawPage(){
		let html = '';

		for(let i = 0;i<this.COL_NUM;i++){
			html+='<li class="box-row">';
			html+='<ul class="box-col-parent clearfix">';
			for(let j = 0;j<this.ROW_NUM;j++){
                html+=`<li class="box-col" data-col="${i}" data-row="${j}" data-clicked="false" data-result="${this.MineArr[i][j]}"><img src="images/mine.png" /></li>`;

               /* if(this.MineArr[i][j]==0){
                    html+=`<li class="box-col" data-col="${i}" data-row="${j}" data-clicked="false" data-result="${this.MineArr[i][j]}"><img src="images/mine.png" /></li>`;
				}
				else{
                    html+=`<li class="box-col mime" data-col="${i}" data-row="${j}" data-clicked="false"><img src="images/mine.png" /></li>`;
				}*/
			}
			html+='</ul>';
			html+='</li>';
		}
        this.boxContainer.html(html);
	},
	//页面上生成数字
	initNum(i,j){
		if(this.MineArr[i][j]==0){
			let point1 = {x:i-1,y:j-1};  //左上
			let point2 = {x:i,y:j-1};	//左中
			let point3 = {x:i+1,y:j-1}; //左下
			let point4 = {x:i+1,y:j}; //中下
			let point5 = {x:i+1,y:j+1}; //右下
			let point6 = {x:i,y:j+1}; //右中
			let point7 = {x:i-1,y:j+1}; //右上
			let point8 = {x:i-1,y:j}; //中上

			let mineNum = 0;

			mineNum = this.getRoundMineNUm(this.MineArr,point1);
			mineNum += this.getRoundMineNUm(this.MineArr,point2);
			mineNum += this.getRoundMineNUm(this.MineArr,point3);
			mineNum += this.getRoundMineNUm(this.MineArr,point4);
			mineNum += this.getRoundMineNUm(this.MineArr,point5);
			mineNum += this.getRoundMineNUm(this.MineArr,point6);
			mineNum += this.getRoundMineNUm(this.MineArr,point7);
			mineNum += this.getRoundMineNUm(this.MineArr,point8);

			if(mineNum!=0){
                $($($(".box-row").get(i)).find(".box-col").get(j)).html(mineNum)
			}else{
                $($($(".box-row").get(i)).find(".box-col").get(j)).addClass("active");
                // this.mime(point1);
                // this.mime(point2);
                // this.mime(point3);
                // this.mime(point4);
                // this.mime(point5);
                // this.mime(point6);
                // this.mime(point7);
                // this.mime(point8);
			}
		}else{
            $($($(".box-row").get(i)).find(".box-col").get(j)).addClass("mime");
            alert("踩雷了");
			this.init();
		}

	},
	mime(obj){
		let i = obj.x;
		let j = obj.y;
		if(i<0 || j<0 || i == this.COL_NUM || j == this.ROW_NUM){
			return;
		}

		var ele = $($(".box-row").get(i)).find(".box-col").get(j);
        if(ele.dataset.result==0){
            if(this.MineArr[i][j]==1){
            	return;
			}
        	$($($(".box-row").get(i)).find(".box-col").get(j)).addClass("active");

            let point1 = {x:i-1,y:j-1};  //左上
            let point2 = {x:i,y:j-1};	//左中
            let point3 = {x:i+1,y:j-1}; //左下
            let point4 = {x:i+1,y:j}; //中下
            let point5 = {x:i+1,y:j+1}; //右下
            let point6 = {x:i,y:j+1}; //右中
            let point7 = {x:i-1,y:j+1}; //右上
            let point8 = {x:i-1,y:j}; //中上

            this.mime(point1);
            this.mime(point2);
            this.mime(point3);
            this.mime(point4);
            this.mime(point5);
            this.mime(point6);
            this.mime(point7);
            this.mime(point8);
		}else{
			this.initNum(i,j);

        	return;
		}


	},
	// 根据某个点获得周围雷的个数
	getRoundMineNUm(arr,obj){
		let x = obj.x;
		let y = obj.y;
		if(x<0
			|| x>=this.ROW_NUM
			|| y>=this.COL_NUM
			|| y<0
			|| arr[x][y]==0
		){
			return 0;
		}

		return 1;
	},
	//处理时间
	initTime(){
		this.TIMER = setInterval(function(){
			if(this.GAME_STATUS==2){
                this.timeEle.html("玩的时间"+ '<span style="color:red;"> '+ ++this.TIME+' </span>'+"S");
            }
		}.bind(this),1000)
	}
};


sweeper.init();