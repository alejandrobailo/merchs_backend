/*!
    * Start Bootstrap - SB Admin v6.0.0 (https://startbootstrap.com/templates/sb-admin)
    * Copyright 2013-2020 Start Bootstrap
    * Licensed under MIT (https://github.com/BlackrockDigital/startbootstrap-sb-admin/blob/master/LICENSE)
    */
(function ($) {
    "use strict";

    // Add active state to sidbar nav links
    var path = window.location.href; // because the 'href' property of the DOM element is the absolute path
    $("#layoutSidenav_nav .sb-sidenav a.nav-link").each(function () {
        if (this.href === path) {
            $(this).addClass("active");
        }
    });

    // Toggle the side navigation
    $("#sidebarToggle").on("click", function (e) {
        e.preventDefault();
        $("body").toggleClass("sb-sidenav-toggled");
    });

    $('#myModal').on('shown.bs.modal', function () {
        $('#myInput').trigger('focus')
    })
})(jQuery);

/* Notes */
let arrAlerts = [];

function handleModal() {
    if (localStorage.getItem('alerts') != null) {
        arrAlerts = JSON.parse(localStorage.getItem('alerts'));
    }

    let text = document.getElementById('message-text').value;
    arrAlerts.push({
        id: arrAlerts.length,
        code: `<div id="${arrAlerts.length}" class="alert alert-warning alert-dismissible fade show" role="alert">${text}<button type="button" class="close closeAlert" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>`
    });

    localStorage.setItem('alerts', JSON.stringify(arrAlerts));
    let alertBox = document.getElementById('alertModal')

    alertBox.innerHTML = '';
    for (const item of JSON.parse(localStorage.getItem('alerts'))) {
        alertBox.innerHTML += item.code;
    }
    document.getElementById('message-text').value = ''
}

window.onload = function () {
    if (localStorage.getItem('alerts') != null) {
        arrAlerts = JSON.parse(localStorage.getItem('alerts'));
    }

    let alertBox = document.querySelector('#alertModal')

    for (const item of JSON.parse(localStorage.getItem('alerts'))) {
        alertBox.innerHTML += item.code;
    }

    let btnClose = document.querySelectorAll('.closeAlert');

    for (item of btnClose) {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            let toRemove = e.target.parentNode.parentNode.id;
            console.log(toRemove, 'toremove');
            let index = arrAlerts.findIndex((item) => item.id == toRemove)
            console.log(index, 'index');
            arrAlerts.splice(index, 1)
            localStorage.removeItem('alerts');
            localStorage.setItem('alerts', JSON.stringify(arrAlerts));
        })
    }
}
