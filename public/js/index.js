
document.addEventListener('DOMContentLoaded', function() {
    (function ($) {
      // Header carousel
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


//Play Video Function in Course Content page
function playVideo(event) {
    event.preventDefault();
    var video = document.getElementById('video-player');
    var source = video.getElementsByTagName('source')[0];
    var videoFile = event.target.getAttribute('data-video');
    source.setAttribute('src', videoFile);
    video.load();
    video.play();
  }


  
  
  