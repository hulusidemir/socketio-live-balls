const colors = ['blue','green','red'];

const randomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
};


Math.randomNumber=function(alt, ust){

    let sayi=Math.random();
    sayi=sayi*(ust-alt);
    sayi=Math.floor(sayi)+alt;

    return sayi;
};



module.exports = randomColor;

