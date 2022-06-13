import './scss/main.scss'
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';


let iniData = [];

const componentFunc = () => {
  const section = document.querySelectorAll('.section');
         
  
  const sectionList = () => { // 초기 데이터 및 컨텐츠 생성.
    let sectionUrl1 = "http://localhost:4000/posts1",
        sectionUrl2 = "http://localhost:4000/posts2",
        sectionUrl3 = "http://localhost:4000/options";

    section.forEach((sectionE,sectionI) =>{ // section 별
      let _this = sectionE;
      
      if(sectionI == 0 ){ // 첫번째일 경우에만 
        jsonData(sectionUrl1).then((data) => {
          listPush(_this, dataMapTag(data));
          setTimeout (() =>{ 
            iniData.push(data); // 데이터 따로 저장
          },500)
        })
        .catch((error) => console.log(error));
      }else if(sectionI == 1 ){ // 첫번째일 경우에만 
        jsonData(sectionUrl2).then((data) => {
          listPush(_this, dataMapTag(data));
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


const dataMapTag = (getData) => { 
  let tagData = getData.map(createList);
  return tagData;
}

// slider 태그 구조 생성 및 데이터 입력
const createList = (e) => { 
  let optTemplate = '';
  optTemplate += `<a href="#" class="option-info__item" data-id="${e.postId}">
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
  let listWrap = thisEl.querySelector('.option-info__list'),
      listInner = createTag("div","option-info__list-inner");

  thisCont.forEach((thisInfo,idx) => {
    let lists = createTag("div","option-info__list-lists");  // , 
    lists.innerHTML = thisInfo; // list 담기
    listInner.appendChild(lists); 
  })
  listWrap.appendChild(listInner);


  if(listWrap.dataset.swiper == "on"){ // 슬라이드 사용 on/off 
    swiperFunc(listWrap);

    let slideItem = listInner.querySelectorAll('.option-info__item');
    
    
    slideItem.forEach((thisClick)=>{
      thisClick.addEventListener("click", () =>{
        modalOpen();
      });
    })
  }
  
}



const modalOpen = () => {
  let body = document.getElementsByTagName('body')[0];
  let dimmedTag = createTag("div","dimmed");
  let dimmedChk = body.querySelector('.dimmed');
  console.log("클릭")

  if(dimmedChk == null ) body.appendChild(dimmedTag);

  return false;
}

// swiper 생성
const swiperFunc = (thisSwiper) => {
  let swiperWrap = thisSwiper.children,
      slider1 = swiperWrap[0].childNodes,
      slidesView = 1,
      slideeBetween = 0,
      prevBtn = createTag("div","swiper-button-prev"),
      nextBtn = createTag("div","swiper-button-next"),
      pagination = createTag("div","swiper-pagination");

  thisSwiper.className = "swiper";
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

  const swiper = new Swiper(thisSwiper,{ // 여러개 swiper 생성 시 const 가 맞는지?
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
const createTag = (tagName, tagClass, tagAttr) => { 
  let returnTag = document.createElement(tagName);
  if(tagClass !== undefined) returnTag.className = tagClass;
  if(tagAttr !== undefined){
    console.log(tagAttr)
    tagAttr.map((attr,idx) => {
      returnTag.setAttribute(attr[0] , attr[1])
    });
  }
  return returnTag;
}


/*
  스와이퍼 클릭 시 모달창 띄우기
  모달창에서 슬라이드 생성.
  클릭 된 index 값 구해서 해당 슬라이드랑 싱크 맞추기

*/



window.addEventListener('DOMContentLoaded', () => componentFunc());

 


