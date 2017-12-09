class Cell{
    constructor(){
        this.isMine = false;    //是否是雷
        this.roundMine = 0; //周围有几个雷
        this.isClicked = false; //是否被点击
    }
}

class Minesweeper{
    constructor(x=4,y=4,z=2){
        this.COL_NUM = x;    //行数
        this.ROW_NUM = y;    //行数
        this.TOTAL_MINE = z; //总的雷数
        this.mineArr = [];
        this.checkArr = [];
    }


    init(){

        for(var i = 0;i<this.COL_NUM;i++){
            this.mineArr[i] = [];
            for(var j = 0;j<this.ROW_NUM;j++){
                this.mineArr[i][j] = new Cell();
            }
        }

        this.initMine();

        this.print();

        for(var i = 0;i<this.COL_NUM;i++){
            for(var j = 0;j<this.ROW_NUM;j++){
                if(!this.mineArr[i][j].isMine)
                this.initMineNum(i,j);
            }
        }
        var  that = this;

        $(".box-container").on("click",'li.box-col',function(){
            let i = Number(this.dataset.x);
            let j = Number(this.dataset.y);

            if(that.mineArr[i][j].isMine){
                for(var a = 0;a<that.COL_NUM;a++){
                    for(var b = 0;b<that.ROW_NUM;b++){
                        var result = that.mineArr[a][b];
                        if(result.isMine)
                            that.mineArr[a][b].isClicked = true;
                    }
                }
                setTimeout(function(){
                    if(window.confirm("是否继续")){
                        that.init();
                    }else{
                        alert("不玩了");
                    }
                },1000)

            }else{
                that.mineArr[i][j].isClicked = true;
                that.cleanMine({x:i,y:j});
                this.checkArr = [];

            }
            that.printPage();
        });

        this.printPage();

    }


    //扫雷
    cleanMine(point){
        var x = point.x,y = point.y;
        if(x<0
            || x>=this.ROW_NUM
            || y>=this.COL_NUM
            || y<0){
            return;
        }
        if(this.mineArr[x][y].roundMine==0 && !this.mineArr[x][y].isMine) {

            let point1 = {x:x-1,y:y-1};  //左上
            let point2 = {x:x,y:y-1};	//左中
            let point3 = {x:x+1,y:y-1}; //左下
            let point4 = {x:x+1,y:y}; //中下
            let point5 = {x:x+1,y:y+1}; //右下
            let point6 = {x:x,y:y+1}; //右中
            let point7 = {x:x-1,y:y+1}; //右上
            let point8 = {x:x-1,y:y}; //中上

            this.checkArr.push(point);
            this.mineArr[x][y].isClicked = true;

            this.judge(point1);
            this.judge(point2);
            this.judge(point3);
            this.judge(point4);
            this.judge(point5);
            this.judge(point6);
            this.judge(point7);
            this.judge(point8);
        }else{
            if(!this.mineArr[x][y].isMine)
                this.mineArr[x][y].isClicked = true;
            return;
        }
    }

    judge(point){
        if(point.x<0
            || point.x>=this.ROW_NUM
            || point.y>=this.COL_NUM
            || point.y<0){
            return;
        }
        if(!this.isInArray(this.checkArr,point)){
            this.cleanMine(point);
        }else{
            return;
        }
    }

    isInArray(arr,item){
        var flag = false;
        arr.forEach(function(value){
            if(value.x==item.x && value.y ==item.y){
                flag = true;
            }
        })
        return flag;
    }

    //生成雷
    initMine(){
        let index = 0;
        while(index<this.TOTAL_MINE){
            let i = randomNum(this.COL_NUM);
            let j = randomNum(this.ROW_NUM);

            if(!this.mineArr[i][j].isMine){

                this.mineArr[i][j].isMine = true;
                index++;
            }

        }
    }

    initMineNum(i,j){
        let point1 = {x:i-1,y:j-1};  //左上
        let point2 = {x:i,y:j-1};	//左中
        let point3 = {x:i+1,y:j-1}; //左下
        let point4 = {x:i+1,y:j}; //中下
        let point5 = {x:i+1,y:j+1}; //右下
        let point6 = {x:i,y:j+1}; //右中
        let point7 = {x:i-1,y:j+1}; //右上
        let point8 = {x:i-1,y:j}; //中上

        let mineNum = 0;

        mineNum = this.getRoundMineNUm(this.mineArr,point1);
        mineNum += this.getRoundMineNUm(this.mineArr,point2);
        mineNum += this.getRoundMineNUm(this.mineArr,point3);
        mineNum += this.getRoundMineNUm(this.mineArr,point4);
        mineNum += this.getRoundMineNUm(this.mineArr,point5);
        mineNum += this.getRoundMineNUm(this.mineArr,point6);
        mineNum += this.getRoundMineNUm(this.mineArr,point7);
        mineNum += this.getRoundMineNUm(this.mineArr,point8);

        this.mineArr[i][j].roundMine = mineNum;


    }

    // 根据某个点获得周围雷的个数
    getRoundMineNUm(arr,obj){
        let x = obj.x;
        let y = obj.y;
        if(x<0
            || x>=this.ROW_NUM
            || y>=this.COL_NUM
            || y<0
            || !arr[x][y].isMine
        ){
            return 0;
        }

        return 1;
    }

    printPage(){
        var  html = '';
        for(var i = 0;i<this.COL_NUM;i++){
            html += '<li class="box-row">';
            html += '<ul class="box-col-parent clearfix">';
            for(var j = 0;j<this.ROW_NUM;j++){
                var cell = this.mineArr[i][j];
                if(cell.isFlag){
                    html += `<li class="box-col" data-x = ${i} data-y="${j}"><img src="images/flag.png" /></li>`;
                }else{
                    if (!cell.isMine) {
                        if(cell.isClicked)
                            html += `<li class="box-col num${cell.roundMine} active" data-x = ${i} data-y="${j}"><img src="images/mine.png" /></li>`;
                        else
                            html += `<li class="box-col" data-x = ${i} data-y="${j}"><img src="images/mine.png" /></li>`;
                    }else {
                        if(cell.isClicked)
                            html += `<li class="box-col mime" data-x = ${i} data-y="${j}"><img src="images/mine.png" /></li>`;
                        else
                            html += `<li class="box-col" data-x = ${i} data-y="${j}"><img src="images/mine.png" /></li>`;;
                    }
                }

            }
            html +='</ul>';
            html +='</li>';
        }

        $(".box-container").html(html);
    }


    print(){
        console.log(this);
        let str = '';
        for(var i = 0;i<this.COL_NUM;i++){

            for(var j = 0;j<this.ROW_NUM;j++){
                if(this.mineArr[i][j].isMine){
                    str += ' 1';
                }else{
                    str += ' 0';
                }
            }
            str +='\n'
        }
        console.log(str);
    }
}


function randomNum(num){
    return Math.floor(Math.random()*num);
}