window.onload = ()=>{
    var animate = document.querySelector('#animate');
    animate.classList.add('show');
    animate.onanimationend = ()=>{
        animate.classList.add('expand');
        var text = document.querySelector('#animate > h1');
        text.classList.add('show');
    };
};

//# sourceMappingURL=index.5201ac13.js.map
