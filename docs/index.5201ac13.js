var params = new URLSearchParams(window.location.search);
var code = params.get('code');
if (code !== null) fetch({
    method: "POST",
    destination: ""
});
window.onload = ()=>{
    var animate = document.querySelector('#animate');
    animate.classList.add('show');
    animate.onanimationend = ()=>{
        animate.classList.add('expand');
        var text = document.querySelector('#animate > h1');
        text.classList.add('show');
        text.onanimationend = ()=>setTimeout(()=>location.href = '/home/'
            , 500)
        ;
    };
};

//# sourceMappingURL=index.5201ac13.js.map
