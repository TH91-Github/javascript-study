import './scss/main.scss'
import Swiper from 'swiper';
import 'swiper/css';


const componentFunc = () => {
  const section = document.querySelectorAll('.section'),
        iniData = []; 
  
  const sectionList = () => { // 초기 데이터 및 컨텐츠 생성.
    let sectionUrl1 = "http://localhost:4000/posts1",
        sectionUrl2 = "http://localhost:4000/posts2",
        sectionUrl3 = "http://localhost:4000/options";

    section.forEach((sectionE,sectionI) =>{ // section 별
      let _this = sectionE;
      
      if(sectionI == 0 ){ // 첫번째일 경우에만 - 임시 나중엔 1,2 같이 3번만 다르게
        jsonData(sectionUrl1).then((data) => {
          listPush(_this, dataMapTag(data));
          setTimeout (() =>{ 
            iniData.push(data); // 데이터 따로 저장
          },500)
        })
        .catch((error) => console.log(error));
      }
    })
    
  } // e: sectionList


  const init = (() => { 
    sectionList();
  })();

} // e: componentFunc

// swiper 생성

const swiperr = document.querySelectorAll('.swiper')[0];

const swiper = new Swiper(swiperr);

const swiperFunc = (thisSwiper) => {

}

const jsonData = async (jsonUrl) => {
  const res = await fetch(jsonUrl);
  const posts = await res.json();
  return posts
} // e: jsonData

const listPush = (thisEl, thisCont) => {  // list cont 입력
  let listWrap = thisEl.querySelector('.option-info__list'),
      listInner = createTag("div","option-info__list-inner");

  thisCont.forEach((thisInfo,idx) => {
    let lists = createTag("div","option-info__list-lists");  // , 
    lists.innerHTML = thisInfo; // list 담기
    listInner.appendChild(lists); 
  })
  listWrap.appendChild(listInner);


  if(listWrap.dataset.swiper == "on"){ // 슬라이드 or 리스트만 할지 체크
    let swiperWrap = listWrap.children,
        slider1 = swiperWrap[0].childNodes;
    listWrap.className = "swiper";
    swiperWrap[0].classList.add("swiper-wrapper");


    slider1.forEach((el, idx) => {
      el.classList.add("swiper-slide");
      console.log(el)
    })
  }
}
// 슬라이드 연결하기

const createTag = (tagName, tagClass, tagAttr) => { // 태그 생성 및 클래스, 속성 추가  : div, id, class, [[attr, attrName],[attr2,attrName2]]
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


const dataMapTag = (getData) => { 
  let tagData = getData.map(createList);
  return tagData;
}

const createList = (e) => { // slider 태그 구조 생성 및 데이터 입력
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



window.addEventListener('DOMContentLoaded', () => componentFunc());

 


