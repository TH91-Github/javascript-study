import './scss/main.scss'
import Swiper from 'swiper';
import 'swiper/css';

const swiperr = document.querySelectorAll('.swiper')[0];
console.log(swiperr)
const swiper = new Swiper(swiperr);

/*
  비동기 : 
  데이터 통신을 가장 최상단으로 위치 
  작업 동작 설명 및 이해 
*/


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
          slidePush(_this, dataFunc(data));
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

const jsonData = async (jsonUrl) => { 
  const res = await fetch(jsonUrl);
  const posts = await res.json();
  return posts
} // e: jsonData

const slidePush = (thisEl, thisCont) => {  // slider cont 입력
  let sliderWrap = thisEl.querySelector('.option-info__slider');
  sliderWrap.innerHTML = thisCont;
}

const dataFunc = (getData) => { 
  let tagData = getData.map(createTag);
  return tagData;
}

const createTag = (e) => { // slider 태그 구조 생성 및 데이터 입력
  let optTemplate = '';
  optTemplate += `<div class="option-info__item" data-id="${e.postId}">
      <div class="option-info__item-img">
        <div class="img"><img src="${e.img}" alt="" /></div>
      </div>
      <div class="option-info__item-desc">
        <p class="tit">${e.tit}</p>
        <p class="desc">${e.description}</p>
      </div>
    </div>`;
  return optTemplate;
}



window.addEventListener('DOMContentLoaded', () => componentFunc());

 


