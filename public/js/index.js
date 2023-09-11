
document.addEventListener('DOMContentLoaded', function() {
    (function ($) {
      $(".header-carousel").owlCarousel({
        autoplay: false,
        smartSpeed: 1500,
        items: 1,
        dots: false,
        loop: true,
        nav : true,
        navText : [
          '<i class="fa fa-caret-left"></i>',
          '<i class="fa fa-caret-right"></i>'
        ]
      });
    })(jQuery);
  });


  
var dropdowns = document.querySelectorAll('.navbar-nav .dropdown');
dropdowns.forEach(function(dropdown) {
    dropdown.addEventListener('mouseover', function() {
        var dropdownMenu = this.querySelector('.dropdown-menu');
        if (dropdownMenu) {
            dropdownMenu.classList.add('show');
        }
    });

    dropdown.addEventListener('mouseout', function() {
        var dropdownMenu = this.querySelector('.dropdown-menu');
        if (dropdownMenu) {
            dropdownMenu.classList.remove('show');
        }
    });
});


//sticky navbar
const stickyTop = document.querySelector('.sticky-top');

if (stickyTop) {
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
      stickyTop.style.top = '0px';
    } else {
      stickyTop.style.top = '-100px';
    }
  });
}

//faqs

const faqs=document.querySelectorAll('.faq');
faqs.forEach(faq=>{
    faq.addEventListener('click',()=>{
        faq.classList.toggle('open');
        const icon=faq.querySelector('.faq_icon i');
        if(icon.className==='fa fa-plus'){
            icon.className='fa fa-minus';
        }
        else{
            icon.className='fa fa-plus';
        }
    })
});


function playVideo(event, lessonId,studentId) {
  console.log(lessonId);
  event.preventDefault();
  var videoUrl = event.target.getAttribute('data-video');
  var videoPlayer = document.getElementById('video-player');
  var checkbox = document.getElementById('lesson-' + lessonId + '-checkbox');
  

  checkbox.checked = false; 

  videoPlayer.src = videoUrl;
  videoPlayer.play();

  videoPlayer.addEventListener('ended', function() {
    checkbox.checked=true;
    updateLessonChecked(lessonId,studentId);
  });
}

// function updateLessonChecked(lessonId) {
//   fetch('/lessons/' + lessonId, {
//     method: 'PUT',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({ checked: 1 })
//   })
//   .then(response => response.json())
//   .then(data => console.log(data))
//   .catch(error => console.error(error));

// }

function updateLessonChecked(lessonId) {
  const xhr = new XMLHttpRequest();
  xhr.open('PUT', '/lessons/' + lessonId, true);
  xhr.setRequestHeader('Content-Type', 'application/json');

  xhr.onload = function () {
    if (xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);
      console.log(data);
    } else {
      console.error('An error occurred while updating the lesson');
    }
  };

  xhr.onerror = function () {
    console.error('Network error occurred');
  };

  xhr.send(JSON.stringify({ checked: 1 }));
}





//Course Preview video function
function coursePreviewVideo(){
    const coursePreviewModal=document.querySelector(".js-course-preview-modal");
    if(coursePreviewModal){
        coursePreviewModal.addEventListener('shown.bs.modal',function(){
             this.querySelector(".js-course-preview-video").play();
             this.querySelector(".js-course-preview-video").currentTime=0;
        });
        coursePreviewModal.addEventListener('hide.bs.modal',function(){
            this.querySelector(".js-course-preview-video").pause();
        });
    }
}
coursePreviewVideo();

window.addEventListener('load', () => {
  const loaderContainer = document.querySelector('.loader-container');
  loaderContainer.style.display = 'none';
});













  

  
  
  