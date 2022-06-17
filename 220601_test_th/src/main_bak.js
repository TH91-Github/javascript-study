import './scss/main.scss'
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';

const sectionUrl1 = "http://localhost:4000/posts1";
const sectionUrl2 = "http://localhost:4000/posts2";
const sectionUrl3 = "http://localhost:4000/options";

let iniData = [];

const componentFunc = () => {
  const section = document.querySelectorAll('.section');
         
  
  const sectionList = () => { // 초기 데이터 및 컨텐츠 생성.
    

    section.forEach((sectionE,sectionI) =>{ // section 별
      let _this = sectionE;
      
      if(sectionI == 0 ){ // 첫번째일 경우에만 
        jsonData(sectionUrl1).then((data) => {
          listPush(_this, dataMapTag(data, sectionI));
          setTimeout (() =>{ 
            iniData.push(data); // 데이터 따로 저장
          },500)
        })
        .catch((error) => console.log(error));
      }else if(sectionI == 1 ){ // 두번째일 경우에만 
        jsonData(sectionUrl2).then((data) => {
          listPush(_this, dataMapTag(data, sectionI));
          setTimeout (() =>{ 
            iniData.push(data); // 데이터 따로 저장
          },500)
        })
        .catch((error) => console.log(error));
      }else{

      }
    })
    
  } // e: sectionList

  const init = (() => { 
    sectionList();
  })();

} // e: componentFunc

const jsonData = async (jsonUrl) => {
  const res = await fetch(jsonUrl);
  const posts = await res.json();
  return posts
} // e: jsonData


const dataMapTag = (getData, urlNum) => { 
  let tagData = getData.map((e)=>{
    let createListData = createList(e,urlNum);
    return createListData;
  });
  return tagData;
}

// slider 태그 구조 생성 및 데이터 입력
const createList = (e, urlNum) => { 
  let optTemplate = '';
  optTemplate += `<a href="#" class="option-info__item" data-id="${e.postId}" data-url-num="${urlNum}">
      <div class="option-info__item-img">
        <div class="img"><img src="${e.img}" alt="" /></div>
      </div>
      <div class="option-info__item-desc">
        <p class="tit">${e.tit}</p>
        <p class="desc">${e.description}</p>
      </div>
    </a>`;
  return optTemplate;
}

// list cont 입력
const listPush = (thisEl, thisCont) => {  
  let listWrap = thisEl.querySelector('.option-info__list');
  let listInner = createTag("div","option-info__list-inner");

  thisCont.forEach((thisInfo,idx) => {
    let lists = createTag("div","option-info__list-lists");  // , 
    lists.innerHTML = thisInfo; // list 담기
    listInner.appendChild(lists); 
  })
  listWrap.appendChild(listInner);


  if(listWrap.dataset.swiper == "on"){ // 슬라이드 사용 on/off 
    swiperFunc(listWrap);
    let slideItem = listInner.querySelectorAll('.option-info__item');
    slideItem.forEach((thisClick, idx)=>{ // 
      thisClick.addEventListener("click", () =>{   
        let urlInfo = thisClick.dataset.urlNum;
        modalOpen(urlInfo, idx);
      });
    })
  }
}

/* s: modalLayer */
const modalOpen = (urlInfo, slideNum) => {
  let app = document.getElementById('app');
  app.appendChild(modalCreate())  // 모달 구조 생성
  modalSwiper(urlInfo, slideNum); // 모달 swiper 생성
  dimmedFunc("open"); // dimmed 생성
  return false;
}

const modalCreate = () => { // 모달창 뼈대
  let modalLayer = createTag("div","modal-layer");
  let modalWrap = createTag("div","modal-layer__wrap");
  let modalInner = createTag("div","modal-layer__inner",[["data-navigation",["on"]],["data-pagination","on"]]);
  let modalList = createTag("div","modal-layer__list");
  let closedBox = createTag("div","modal-layer__closed");
  let closedBtn = createTag("button","btn",[["type","button"]], "닫기");

  closedBox.appendChild(closedBtn);
  modalInner.appendChild(modalList);
  modalWrap.appendChild(modalInner);
  modalWrap.appendChild(closedBox);
  modalLayer.appendChild(modalWrap);
  return modalLayer;
}

const modalSwiper = (urlInfo, slideNum) => { // 모달창 내 슬라이드
  let modalLayer = document.querySelector('.modal-layer');
  let loadUrl ="";

  if(urlInfo == 0) loadUrl = sectionUrl1
  else if(urlInfo == 1) loadUrl = sectionUrl2
  else console.log("null")
  
  jsonData(loadUrl).then((data) => {
    modalListPuh(modalLayer, modalMapTag(data));
  })

  const modalListPuh = (modalLayer, modalSlideData) => {
    let modalSwiperInner = modalLayer.querySelector('.modal-layer__inner');
    let modalSwiperList = modalLayer.querySelector('.modal-layer__list')
    modalSlideData.forEach((slideInfo,idx) => {
      let itmes = createTag("div","option-info__list-lists");  // , 
      itmes.innerHTML = slideInfo; // list 담기
      modalSwiperList.appendChild(itmes); 
    })
    swiperFunc(modalSwiperInner, slideNum); // slideNum 해당 슬라이드 순서 모달에 전달
  }
  const modalMapTag = (getData) => { 
    let tagData = getData.map((e)=>{
      let createListData = createList(e);
      return createListData;
    });
    return tagData;
  }
}

const dimmedFunc = (dimmedOnOff, offBtn) => { //
  let body = document.getElementsByTagName('body')[0];
  let dimmedTag = createTag("div","dimmed");
  let dimmedChk = body.querySelector('.dimmed');
  
  console.log(dimmedChk)

  if (dimmedOnOff == "open"){
    if(dimmedChk == null ) body.appendChild(dimmedTag); // dimme 생성
  }else{
    //console.log("닫기")
    //let test = document.querySelector('.modal-layer__closed button');
    //test.removeEventListener("click",dimmedFunc)
    // dimmedChk.remove();
  }
}
/* e: modalLayer */


// swiper 생성
const swiperFunc = (thisSwiper, slideToNum) => {
  let swiperWrap = thisSwiper.children,
      slider1 = swiperWrap[0].childNodes,
      initialNum = 0,
      slidesView = 1,
      slideeBetween = 0,
      prevBtn = createTag("div","swiper-button-prev"),
      nextBtn = createTag("div","swiper-button-next"),
      pagination = createTag("div","swiper-pagination");

  thisSwiper.classList.add("swiper");
  swiperWrap[0].classList.add("swiper-wrapper");
  slider1.forEach((el, idx) => {
    el.classList.add("swiper-slide");
  })

  if(thisSwiper.dataset.slidesperview !== undefined){  
    slidesView = Number(thisSwiper.dataset.slidesperview);
    slideeBetween = Number(thisSwiper.dataset.spacebetween);
  }
  if(thisSwiper.dataset.navigation == "on"){
    thisSwiper.appendChild(prevBtn);
    thisSwiper.appendChild(nextBtn);
  }
  if(thisSwiper.dataset.pagination == "on"){
    thisSwiper.appendChild(pagination);
  }
  if(slideToNum !== undefined) initialNum = slideToNum;
  const swiper = new Swiper(thisSwiper,{ 
    initialSlide : initialNum,
    slidesPerView: slidesView,
    spaceBetween : slideeBetween,
    navigation: {
      nextEl: thisSwiper.querySelector('.swiper-button-next'),
      prevEl: thisSwiper.querySelector('.swiper-button-prev'),
    },
    pagination: {
      el: thisSwiper.querySelector(".swiper-pagination"),
    },
  });
}


// 태그 생성 및 클래스, 속성 추가  : div, class, [[attr, attrName],[attr2,attrName2]]
const createTag = (tagName, tagClass, tagAttr, tagText) => { 
  let returnTag = document.createElement(tagName);
  if(tagClass !== undefined) returnTag.className = tagClass;
  if(tagAttr !== undefined){
    tagAttr.map((attr,idx) => {
      returnTag.setAttribute(attr[0] , attr[1])
    });
  }
  if(tagText !== undefined){
    returnTag.innerHTML = tagText;
  }
  return returnTag;
}

window.addEventListener('DOMContentLoaded', () => componentFunc());

 


