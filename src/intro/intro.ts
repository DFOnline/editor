window.onload = () => {
    var animate = document.querySelector('#animate') as HTMLDivElement;
    animate.classList.add('show');
    animate.onanimationend = () => {
        animate.classList.add('expand')
        var text = (document.querySelector('#animate > h1') as HTMLHeadingElement);
        text.classList.add('show')
    }
}