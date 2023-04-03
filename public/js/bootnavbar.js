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
