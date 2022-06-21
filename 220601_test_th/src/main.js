import './scss/main.scss'
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';


/*
  1. json url 받기
  2. 구조 생성
    - HTML commponent 생성
  3. 데이터를 통한 리스트 생성
    - slide 구조 생성
  4. 컴포넌트 구조 APP 삽입
  5. 생성된 리스트 구조에 new swiper   
  6. 슬라이드 개별로 이벤트
    - 클릭한 slide 가운데로 동작 후 모달 실행
    - 슬라이드 동작 완료 후 실행. 
  7. 모달 - 슬라이드 개별 이벤트 발동 시 
    -1 모달 html 구조 생성
    -2 모달 내 슬라이드 생성
    -3 딤드 생성 및 이벤트 추가
      - 모달 및 딤드 삭제 (4-1 동일 기능)
    -4 모달 닫기 버튼 이벤트 추가
      -1 닫기 클릭 시 모달 및 딤드 삭제
*/

// app 
const $app = document.getElementById('app');
const commponentName = "option"; // commponent name
// base url 
const serverDataArr = [
  "http://localhost:4000/posts1",
  "http://localhost:4000/posts2",
  "http://localhost:4000/options"
];

// 1 json - fetch - then - load
const loadData = (iniUrl) => { 
  return fetch(iniUrl) 
  .then((response) => response.json())
}
// 1-1 data를 통한 component
const getDataLoad = (getUrl, getNum) => {
  loadData(getUrl)
  .then((data) => {
    commponentPush();  // commponent 생성
    commponentContent(data, getNum);  // load Data 활용 및 cont 생성
  })
  .catch((error) => console.log(error));
}


// 2-1  component 기본 구조 생성
const componentCreate = (cmClass) => {
  let componentWrap = commonCreateTag("div", "cm-"+cmClass);
  componentWrap.innerHTML = `
    <div class="cm-${cmClass}__wrap">
    </div>
  `;
  return componentWrap;
}
// 2-2 #app에 commponent push
const commponentPush = () => {
  $app.appendChild(componentCreate(commponentName));
}

// 3 받은 데이터를 완성된 list를 cont로 생성 후 전달
const swiperList = (contName, listData) => {
  let listWrap = `
    <div class="cm-${contName}__list swiper">
      <div class="cm-${contName}__list-wrap swiper-wrapper">
        ${listForEach(contName, listData)}
      </div>
    </div>
  `;
  return listWrap;
}

// 3-1 전달 받은 데이터를 list 가공 후 중첩 시켜 하나의 데이터로 만들고 반환 ↑
const listForEach = (listmName, listData) => { 
  let listArr = listExtraction(listmName, listData).reduce((resultEl, currentEl) => resultEl+currentEl)
  return listArr;
}

// 3-2 중첩시킬 데이터를 순서대로 list 구조에 뿌린 후 재배열 후 반환 ↑
const listExtraction = (nameExtraction, dataExtraction) => { 
  let listPush = dataExtraction.map((mapData)=>{
    return createList(nameExtraction, mapData);
  });
  return listPush;
}

// 3-3 받은 데이터를 swiper slide 구조에 맞게 생성 후 반환 ↑
const createList = (itemClass, itemData, urlNum) => { 
  let optTemplate = '';
  optTemplate = `
      <a href="#" class="cm-${itemClass}__item swiper-slide" data-id="${itemData.postId}" data-url-num="${urlNum}">
        <div class="cm-${itemClass}__item-img">
          <div class="img"><img src="${itemData.img}" alt="" /></div>
        </div>
        <div class="cm-${itemClass}__item-desc">
          <p class="tit">${itemData.tit}</p>
          <p class="desc">${itemData.description}</p>
        </div>
      </a>`;
  return optTemplate;
}

// 4. list 구조 commponent wrap에 푸쉬
const commponentContent = (passData, passNum) => {
  let thisComponent = $app.querySelectorAll(`.cm-${commponentName}`)[passNum];
  let thisCommponentWrap = thisComponent.querySelector(`.cm-${commponentName}__wrap`); // commponent__wrap 선택
  thisCommponentWrap.innerHTML = swiperList(commponentName, passData);

  swiperFunc(thisComponent, listSwiperOpt(thisComponent,passData))// 기준이 되는 commponent , 슬라이드 옵션
}

// 5 swiper 
const swiperFunc = (swiperCm, newOpt) =>{
  const thisSwiper = swiperCm.querySelector('.swiper');

  if(newOpt.navigation !== false){
    let prevBtn = commonCreateTag("div","swiper-button-prev"),
        nextBtn = commonCreateTag("div","swiper-button-next");
    thisSwiper.appendChild(prevBtn);
    thisSwiper.appendChild(nextBtn);
  }
  if(newOpt.pagination !== false){
    let pagination = commonCreateTag("div","swiper-pagination");
    thisSwiper.appendChild(pagination);
  }
  // 기본 옵션
  let optionBase = {
    initialSlide : 0,
    slidesPerView : 1,
    spaceBetween : 0,
    loop : false,
    loopAdditionalSlides : 1,
    centeredSlides: false,
    navigation: {
        nextEl: swiperCm.querySelector('.swiper-button-next'),
        prevEl: swiperCm.querySelector('.swiper-button-prev'),
    },
    pagination: {
      el: swiperCm.querySelector(".swiper-pagination"),
      clickable: true,
    },
    watchOverflow : true, // 슬라이드 수가 충분하지 않을경우 비활성화
  }

  let swiperOpt = Object.assign({}, optionBase, newOpt)  // 기본 옵션 -> 변경된 옵션 합치기
  const newSwiper = new Swiper(thisSwiper,swiperOpt);
};

// 6. 슬라이드 개별로 이벤트
const listSwiperOpt = (listSwiperThis, listSwiperOptData) => {
  // 슬라이드 옵션 전달
  let changeOpt = {
    loop : true,
    breakpoints : {
      768 : {
      slidesPerView : 3,
      spaceBetween : 30,
      }
    },
    slideToClickedSlide: true, // 클릭한 슬라이드로 이동
    centeredSlides: true, // 센터
    on: {
      init: function (e) {
        let $iniEl = e.el; 
        let slides = e.slides;
        slides.forEach((thisSlide,index) =>{
          //7. 모달 - 슬라이드 개별 이벤트 발동 시
          thisSlide.addEventListener("click", () => {
            let classChk = thisSlide.getAttribute("class");
            $iniEl.classList.add("clickSwiper");
            console.log("초기")
            modalOpen(listSwiperThis,listSwiperOptData); // 활성된 슬라이드 클릭 시 모달 오픈
            
          })
        });
      },
      slideChange: function (e){ // init slide click 보다 먼저 발생. 
        console.log("???")
        
      },
      slideChangeTransitionEnd: function (e) {
        let $endChkEl = e.el;
        let $listClickChk = $endChkEl.getAttribute("class").indexOf("clickSwiper");
        $endChkEl.classList.remove("changeSwiper");
        if($listClickChk > 0) {
          console.log("ggg")
          //modalOpen(listSwiperThis,listSwiperOptData); // 활성되지 않은 슬라이드 클릭 시 센터로 이동 후 모달 오픈
        }
      },
    }
 }
 return changeOpt;
}

// 7. 모달 html 구조 생성, 모달 내 슬라이드 생성
// modal 생성 및 show
const modalOpen = (modalThisCm, modalData) => {
  let  modal = modalPush(modalData);
  modalThisCm.appendChild(modal)

  let closedBtn = modalThisCm.querySelector('.cm-'+commponentName+'-modal__closed');
  closedBtn.addEventListener("click", () => {
    modalOff(modalThisCm)
  })
}

// modal 기본 구조 생성 및 팝업 정보 리스트 생성
const modalPush = (modalPushData) => {
  let modalWrap = commonCreateTag("div", "cm-"+commponentName+"-modal");
  modalWrap.innerHTML = `
    <div class="cm-${commponentName}-modal__wrap swiper">
      <div class="cm-${commponentName}-modal__list swiper-wrapper">
        ${listForEach(commponentName+"-modal", modalPushData)}
      </div>
    </div>
    <div class="cm-${commponentName}-modal__closed">
      <button type="button" class="btn">닫기</button>
    </div>
  `;
  return modalWrap;
}


//
const modalOff = (cmCurrent) => {
  let swiperCurrent = cmCurrent.querySelector('.swiper');
  let modalCurrent = cmCurrent.querySelector('.cm-'+commponentName+'-modal');

  swiperCurrent.classList.remove("clickSwiper"); //
  modalCurrent.remove();
}

// result start
const init = (() => {  
  serverDataArr.forEach((dataUrl,dataIdx) => { // url에 맞게 컴포넌트 여러개 생성
    if(dataIdx == "2") return
    getDataLoad(dataUrl, dataIdx);
  });
})();




// common : 함수명 common 시작
// common - 간단한 class 가진 태그 생성
function commonCreateTag(tagName, tagClass){ 
  let returnTag = document.createElement(tagName);
  if(tagClass !== undefined) returnTag.className = tagClass;
  return returnTag;
}