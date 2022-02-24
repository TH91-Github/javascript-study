(function () {
    let graphComponent = (function (_this) {
        function Component () {
            let opts = {
                obj : _this,
                cutLine : 5,
                figureArr : [], // 각 점수
                figureTop : 0,  // 각 점수 중 높은 값 
                figureMax : 0,  // 라인 최대 값
                barHeight : 20  // 바 높이 (두께)
            };
            this.opts = opts; 
            this.init();
        }
        Component.prototype ={
            init : function (){
                this.setElements();
                this.buildEvent();
            },
            setElements : function (e){ // 공통 선택자 지정
                this.graphWrap = childFind(_this, '.box_poll_graph')[0];
                this.graphBox = childFind(_this, '.list_poll_graph')[0];
                this.graphList =  this.graphBox.children;
                this.graphAverageTxt = childFind(_this, '.txt_total')[0];
            },
            buildEvent : function(){ // 이벤트 연결
               this.itemFunc(); // li 이벤트 
               this.cutLineDrawing(); // line 그리기
               this.graphBarDrawing(); // bar 그리기
               this.graphAverage(); // 평균 구하기
            },
            itemFunc : function(){ // 개별 막대 바 값 셋팅
                let numArr = [];
                for(let num = 0, item = this.graphList ; num < item.length; num++){
                    let thisItem = childFind(item[num], '.txt_num'),
                        itemNum = thisItem[0].innerText;
                    numArr.push(itemNum)
                }
                this.opts.figureArr = numArr; // 각 점수 입력
                this.opts.figureTop = this.maxNum(); // 각 점수 중 높은 값
                this.opts.figureMax = this.maxCut(); // 라인 최대 값
            },
            maxNum : function(){ // 점수 중 높은 값 반환
                let resultMax = 0;
                resultMax = Math.max.apply(null, this.opts.figureArr); // 최대 값 추출
                return resultMax;
            },
            maxCut : function(){ // 라인 최대 값 지정
                let remainder = this.opts.figureTop % this.opts.cutLine,
                    remainderAdd = Math.abs(remainder - this.opts.cutLine);
               return  this.opts.figureTop + remainderAdd;
            },
            cutLineDrawing : function(){ // 단위별 기준 점 생성 
                let lineTagBg = tagCreate("div",[["class","cut-line-bg"]]),
                    maxLine = this.opts.figureMax / this.opts.cutLine,
                    lineMargin = 100 / maxLine;
                this.graphWrap.appendChild(lineTagBg);
                let lingBg = childFind(this.graphWrap, '.cut-line-bg')[0];
                for(let lineNum = 0 ; lineNum <= maxLine ; lineNum++){
                    let lineTag = tagCreate("div",[["class","cut-line"]]),
                        lineText = tagCreate("span",[["class","line-text"]]);
                    lineTag.setAttribute("style","left: "+ lineNum*lineMargin+"%"); // 기준 값 간격 지정
                    lineText.innerText = lineNum*5; // 기준 값 입력 5..10..15...
                    lineTag.appendChild(lineText); // cut-line.append(line-text)
                    lingBg.appendChild(lineTag);   // cut-line-bg.append(cut-line)
                }
            },
            graphBarDrawing : function(e){ // 막대 바 생성
                var passDate = this; // this 새로 지정
                forFunc(this.graphList, eachBar); 
                function eachBar(e){ // 각 bar 설정을 위해 for문
                    let txtNum = childFind(e,'.txt_num')[0],
                        barNum = txtNum.innerText;
                        widthBar =  barNum / passDate.opts.figureMax * 100,
                        barNumTag = tagCreate("span",[["class","num"]]),
                        colorBg = passDate.barColorRandom();
                    txtNum.innerHTML =""; // 기존 숫자 지워준다.
                    barNumTag.innerText = barNum; // 숫자 새로운 태그에 재입력
                    txtNum.appendChild(barNumTag);
                    txtNum.setAttribute("style",`width: ${widthBar}%; height : ${passDate.opts.barHeight}px; background:${colorBg};`); 
                }
            },
            barColorRandom : function(e){ // 랜덤 컬러
                let colorRandom =  "#"+Math.round(Math.random()*0xffffff).toString(16);
                return colorRandom;
            },
            graphAverage : function(e){
                let sumNum = 0,   // 항목 점수 
                    division = 0, // 총 점수
                    resultNum = 0; // 평균 값
                for(let nextList = 0 ; nextList < this.graphList.length ; nextList++){
                    sumNum += parseInt((nextList+1) * this.opts.figureArr[nextList]);
                    division += parseInt(this.opts.figureArr[nextList]);
                }
                resultNum = (sumNum / division).toFixed(2);               
                let averageNum = childFind(this.graphAverageTxt,"span")[0];
                averageNum.innerText = resultNum;
            }
        }
        return new Component();
    });

    // find, for문, 태그 생성 - 도움 주는 기능 
    const select = (e) => { // 선택 $('.test')
        let selectEl;
        if(e.search("#") >= 0 ){ // ID
            selectEl = e.split("#").join("");
            selectEl = document.getElementById(selectEl);
        }else if(e.search(".") >= 0){ // class
            selectEl = e.split(".").join("");
            selectEl = document.getElementsByClassName(selectEl);
        }
        return selectEl;
    }
    const childFind = (parent,child) => { // .find() 부모 기준으로 찾기 
        let selectChild;

        if(child.charAt(0) == "#"){ // ID
            selectChild = child.split("#").join("");
            selectChild = parent.getElementById(selectChild);
        }else if(child.charAt(0) == "."){ // class
            selectChild = child.split(".").join("");
            selectChild = parent.getElementsByClassName(selectChild);
        }else{ // tag
            selectChild = parent.querySelectorAll(child);
        }
        return selectChild;
    }
    const forFunc = (e,func) => { // 해당 선택자를 기준으로 함수 실행
        for (let i = 0, max = e.length; i < max; i++) {
            func(e[i])
        }
    }
    const tagCreate = (tagName,afterList) => { // 생성 태그, 속성 및 값 : 
        // EX ( let test = tagCreate("div",[["class","cut-line-bg"],["id","test"]]) )
        let tag = document.createElement(tagName);
        if(afterList.length > 0){
            for(let aNum = 0 ; aNum < afterList.length; aNum++){
                tag.setAttribute(afterList[aNum][0], afterList[aNum][1])
            }
        }
        return tag;
    }

    // 막대 그래프 시작.
    let componentWrap = select('.box_poll');
    forFunc(componentWrap, graphComponent);

}())